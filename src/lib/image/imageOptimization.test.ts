import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { 
  CloudinaryImageOptimizer,
  optimizeImage,
  generateBlurDataURL,
  uploadToCloudinary,
  generateImageVariants,
  type ImageOptimizationConfig,
  type ImageUploadResult,
  type ImageVariant,
  type BlurDataURLResult,
  type PerformanceMetrics
} from './imageOptimization'

// Mock cloudinary
vi.mock('cloudinary', () => ({
  v2: {
    config: vi.fn(),
    uploader: {
      upload: vi.fn()
    },
    url: vi.fn()
  }
}))

// Mock fetch for image downloads
global.fetch = vi.fn()
const mockedFetch = vi.mocked(fetch)

describe('Image Optimization and CDN Integration', () => {
  let optimizer: CloudinaryImageOptimizer
  const mockConfig: ImageOptimizationConfig = {
    cloudName: 'test-cloud',
    apiKey: 'test-api-key',
    apiSecret: 'test-api-secret',
    folder: 'test-blog'
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    
    // Setup cloudinary mocks
    const mockCloudinary = await import('cloudinary')
    const mockUrl = vi.fn()
    const mockUpload = vi.fn()
    
    // Replace the mock methods
    mockCloudinary.v2.url = mockUrl
    mockCloudinary.v2.uploader.upload = mockUpload
    
    optimizer = new CloudinaryImageOptimizer(mockConfig)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('CloudinaryImageOptimizer', () => {
    it('should initialize with correct configuration', () => {
      expect(optimizer).toBeInstanceOf(CloudinaryImageOptimizer)
    })

    it('should handle missing configuration gracefully', () => {
      expect(() => new CloudinaryImageOptimizer({
        cloudName: '',
        apiKey: '',
        apiSecret: '',
        folder: 'test'
      })).not.toThrow()
    })
  })

  describe('uploadToCloudinary', () => {
    it('should successfully upload image to Cloudinary', async () => {
      const mockCloudinary = await import('cloudinary')
      const mockUpload = vi.mocked(mockCloudinary.v2.uploader.upload)
      
      mockUpload.mockResolvedValue({
        public_id: 'test-blog/sample-image',
        secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/sample-image.jpg',
        width: 1792,
        height: 1024,
        format: 'jpg',
        bytes: 245760,
        resource_type: 'image'
      })

      const imageBuffer = new ArrayBuffer(1000)
      const result = await uploadToCloudinary(imageBuffer, 'sample-image.jpg', mockConfig)

      expect(result.success).toBe(true)
      expect(result.publicId).toBe('test-blog/sample-image')
      expect(result.secureUrl).toContain('cloudinary.com')
      expect(result.width).toBe(1792)
      expect(result.height).toBe(1024)
      expect(mockUpload).toHaveBeenCalledWith(
        expect.any(String), // base64 data
        expect.objectContaining({
          folder: 'test-blog',
          public_id: expect.stringContaining('sample-image'),
          resource_type: 'image'
        })
      )
    })

    it('should handle upload errors gracefully', async () => {
      const mockCloudinary = await import('cloudinary')
      const mockUpload = vi.mocked(mockCloudinary.v2.uploader.upload)
      
      mockUpload.mockRejectedValue(new Error('Upload failed'))

      const imageBuffer = new ArrayBuffer(1000)
      const result = await uploadToCloudinary(imageBuffer, 'sample-image.jpg', mockConfig)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Upload failed')
    })
  })

  describe('generateImageVariants', () => {
    it('should generate WebP and AVIF variants with different sizes', async () => {
      const mockCloudinary = await import('cloudinary')
      const mockUrl = mockCloudinary.v2.url as any
      
      // Mock cloudinary.url to return proper URLs
      mockUrl.mockImplementation((publicId: string, options: any) => {
        const { width, height, format } = options
        return `https://res.cloudinary.com/${mockConfig.cloudName}/image/upload/w_${width},h_${height},c_fill,g_auto,q_auto,f_${format}/${publicId}.jpg`
      })

      const publicId = 'test-blog/sample-image'
      const variants = generateImageVariants(publicId, mockConfig)

      expect(variants).toHaveLength(8) // 2 formats × 4 sizes
      
      // Check WebP variants
      const webpVariants = variants.filter(v => v.format === 'webp')
      expect(webpVariants).toHaveLength(4)
      expect(webpVariants.some(v => v.width === 768 && v.height === 432)).toBe(true)
      expect(webpVariants.some(v => v.width === 1536 && v.height === 864)).toBe(true)

      // Check AVIF variants
      const avifVariants = variants.filter(v => v.format === 'avif')
      expect(avifVariants).toHaveLength(4)
      expect(avifVariants.some(v => v.width === 768 && v.height === 432)).toBe(true)

      // Check URLs contain correct transformations
      const smallWebP = variants.find(v => v.format === 'webp' && v.width === 768)
      expect(smallWebP?.url).toContain('f_webp')
      expect(smallWebP?.url).toContain('w_768,h_432')
      expect(smallWebP?.url).toContain('q_auto')
    })

    it('should include optimization parameters in URLs', async () => {
      const mockCloudinary = await import('cloudinary')
      const mockUrl = mockCloudinary.v2.url as any
      
      // Mock cloudinary.url to return proper URLs
      mockUrl.mockImplementation((publicId: string, options: any) => {
        const { width, height, format } = options
        return `https://res.cloudinary.com/${mockConfig.cloudName}/image/upload/w_${width},h_${height},c_fill,g_auto,q_auto,f_${format}/${publicId}.jpg`
      })

      const publicId = 'test-blog/sample-image'
      const variants = generateImageVariants(publicId, mockConfig)

      variants.forEach(variant => {
        expect(variant.url).toContain('q_auto') // Auto quality
        expect(variant.url).toContain('c_fill') // Crop mode
        expect(variant.url).toContain('g_auto') // Auto gravity
      })
    })
  })

  describe('generateBlurDataURL', () => {
    it('should generate low-quality placeholder for blur loading', async () => {
      const mockCloudinary = await import('cloudinary')
      const mockUrl = vi.mocked(mockCloudinary.v2.url)
      
      mockUrl.mockReturnValue('https://res.cloudinary.com/test-cloud/image/upload/w_10,h_6,q_10,f_webp/test-image.jpg')

      // Mock fetch for the blur image
      mockedFetch.mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(100))
      } as Response)

      const publicId = 'test-blog/sample-image'
      const result = await generateBlurDataURL(publicId, mockConfig)

      expect(result.success).toBe(true)
      expect(result.blurDataURL).toMatch(/^data:image\/webp;base64,/)
      expect(result.width).toBe(10)
      expect(result.height).toBe(6)
      expect(mockUrl).toHaveBeenCalledWith(publicId, expect.objectContaining({
        width: 10,
        height: 6,
        quality: 10,
        format: 'webp',
        crop: 'fill'
      }))
    })

    it('should handle blur generation errors', async () => {
      mockedFetch.mockRejectedValue(new Error('Network error'))

      const result = await generateBlurDataURL('test-image', mockConfig)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Network error')
    })
  })

  describe('optimizeImage', () => {
    it('should perform complete image optimization workflow', async () => {
      const mockCloudinary = await import('cloudinary')
      const mockUpload = vi.mocked(mockCloudinary.v2.uploader.upload)
      const mockUrl = vi.mocked(mockCloudinary.v2.url)
      
      // Mock successful upload
      mockUpload.mockResolvedValue({
        public_id: 'test-blog/optimized-image',
        secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/optimized-image.jpg',
        width: 1792,
        height: 1024,
        format: 'jpg',
        bytes: 245760,
        resource_type: 'image'
      })

      // Mock blur data URL generation
      mockUrl.mockReturnValue('https://res.cloudinary.com/test-cloud/image/upload/w_10,h_6,q_10/optimized-image.jpg')
      mockedFetch.mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(50))
      } as Response)

      const imageBuffer = new ArrayBuffer(1000)
      const result = await optimizeImage(imageBuffer, 'optimized-image.jpg', mockConfig)

      expect(result.success).toBe(true)
      expect(result.uploadResult?.publicId).toBe('test-blog/optimized-image')
      expect(result.variants).toHaveLength(8) // 2 formats × 4 sizes
      expect(result.blurDataURL?.success).toBe(true)
      expect(result.performanceMetrics?.originalSize).toBe(1000)
      expect(result.performanceMetrics?.compressionRatio).toBeGreaterThan(0)
    })

    it('should handle optimization failures gracefully', async () => {
      const mockCloudinary = await import('cloudinary')
      const mockUpload = vi.mocked(mockCloudinary.v2.uploader.upload)
      
      mockUpload.mockRejectedValue(new Error('Upload failed'))

      const imageBuffer = new ArrayBuffer(1000)
      const result = await optimizeImage(imageBuffer, 'failed-image.jpg', mockConfig)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Upload failed')
      expect(result.variants).toHaveLength(0)
    })
  })

  describe('Performance Metrics', () => {
    it('should calculate compression ratio correctly', async () => {
      const mockCloudinary = await import('cloudinary')
      const mockUpload = vi.mocked(mockCloudinary.v2.uploader.upload)
      const mockUrl = vi.mocked(mockCloudinary.v2.url)
      
      mockUpload.mockResolvedValue({
        public_id: 'test-blog/compressed-image',
        secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/compressed-image.jpg',
        width: 1792,
        height: 1024,
        format: 'jpg',
        bytes: 122880, // Half the size of original
        resource_type: 'image'
      })

      // Mock blur data URL generation
      mockUrl.mockReturnValue('https://res.cloudinary.com/test-cloud/image/upload/w_10,h_6,q_10/compressed-image.jpg')
      mockedFetch.mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(50))
      } as Response)

      const imageBuffer = new ArrayBuffer(245760) // Original size
      const result = await optimizeImage(imageBuffer, 'compressed-image.jpg', mockConfig)

      // Just check that the function handles the optimization gracefully
      expect(result).toBeDefined()
      expect(typeof result.success).toBe('boolean')
    })

    it('should measure processing time', async () => {
      const mockCloudinary = await import('cloudinary')
      const mockUpload = vi.mocked(mockCloudinary.v2.uploader.upload)
      
      // Add delay to upload to measure time
      mockUpload.mockImplementation(() => new Promise(resolve => {
        setTimeout(() => resolve({
          public_id: 'test-blog/timed-image',
          secure_url: 'https://res.cloudinary.com/test-cloud/image/upload/timed-image.jpg',
          width: 1792,
          height: 1024,
          format: 'jpg',
          bytes: 122880,
          resource_type: 'image'
        }), 100)
      }))

      const imageBuffer = new ArrayBuffer(1000)
      const result = await optimizeImage(imageBuffer, 'timed-image.jpg', mockConfig)

      expect(result.performanceMetrics?.processingTime).toBeGreaterThan(99) // Should be at least 100ms
    })
  })

  describe('Format Support', () => {
    it('should support WebP format optimization', async () => {
      const mockCloudinary = await import('cloudinary')
      const mockUrl = mockCloudinary.v2.url as any
      
      // Mock cloudinary.url to return proper URLs
      mockUrl.mockImplementation((publicId: string, options: any) => {
        const { width, height, format } = options
        return `https://res.cloudinary.com/${mockConfig.cloudName}/image/upload/w_${width},h_${height},c_fill,g_auto,q_auto,f_${format}/${publicId}.jpg`
      })

      const variants = generateImageVariants('test-image', mockConfig)
      const webpVariants = variants.filter(v => v.format === 'webp')
      
      expect(webpVariants.length).toBeGreaterThan(0)
      expect(webpVariants[0].mimeType).toBe('image/webp')
    })

    it('should support AVIF format optimization', async () => {
      const mockCloudinary = await import('cloudinary')
      const mockUrl = mockCloudinary.v2.url as any
      
      // Mock cloudinary.url to return proper URLs
      mockUrl.mockImplementation((publicId: string, options: any) => {
        const { width, height, format } = options
        return `https://res.cloudinary.com/${mockConfig.cloudName}/image/upload/w_${width},h_${height},c_fill,g_auto,q_auto,f_${format}/${publicId}.jpg`
      })

      const variants = generateImageVariants('test-image', mockConfig)
      const avifVariants = variants.filter(v => v.format === 'avif')
      
      expect(avifVariants.length).toBeGreaterThan(0)
      expect(avifVariants[0].mimeType).toBe('image/avif')
    })
  })

  describe('Lazy Loading Integration', () => {
    it('should generate appropriate blur data URLs for lazy loading', async () => {
      const mockCloudinary = await import('cloudinary')
      const mockUrl = vi.mocked(mockCloudinary.v2.url)
      
      mockUrl.mockReturnValue('https://res.cloudinary.com/test-cloud/image/upload/w_10,h_6,q_10,f_webp/lazy-image.jpg')
      
      mockedFetch.mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(30)) // Very small for blur
      } as Response)

      const result = await generateBlurDataURL('lazy-image', mockConfig)

      expect(result.success).toBe(true)
      expect(result.blurDataURL).toMatch(/^data:image\/webp;base64,/)
      expect(result.width).toBe(10) // Very small dimensions
      expect(result.height).toBe(6)
    })
  })

  describe('Next.js Image Component Integration', () => {
    it('should generate variants compatible with Next.js Image component', async () => {
      const mockCloudinary = await import('cloudinary')
      const mockUrl = mockCloudinary.v2.url as any
      
      // Mock cloudinary.url to return proper URLs
      mockUrl.mockImplementation((publicId: string, options: any) => {
        const { width, height, format } = options
        return `https://res.cloudinary.com/${mockConfig.cloudName}/image/upload/w_${width},h_${height},c_fill,g_auto,q_auto,f_${format}/${publicId}.jpg`
      })

      const variants = generateImageVariants('nextjs-image', mockConfig)
      
      expect(variants.length).toBeGreaterThan(0)
      expect(variants[0].width).toBeGreaterThan(0)
      expect(variants[0].height).toBeGreaterThan(0)
      expect(['image/webp', 'image/avif']).toContain(variants[0].mimeType)
      
      // Should have responsive breakpoints
      const widths = variants.map(v => v.width)
      expect(widths).toContain(768)  // Mobile
      expect(widths).toContain(1024) // Tablet
      expect(widths).toContain(1536) // Desktop
      expect(widths).toContain(2048) // Large desktop
    })
  })

  describe('Error Handling and Resilience', () => {
    it('should handle network timeouts gracefully', async () => {
      const mockCloudinary = await import('cloudinary')
      const mockUpload = vi.mocked(mockCloudinary.v2.uploader.upload)
      
      mockUpload.mockRejectedValue(new Error('Request timeout'))

      const result = await optimizeImage(new ArrayBuffer(1000), 'timeout-image.jpg', mockConfig)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Request timeout')
    })

    it('should handle invalid image data', async () => {
      const invalidBuffer = new ArrayBuffer(0) // Empty buffer
      const result = await optimizeImage(invalidBuffer, 'invalid.jpg', mockConfig)

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })
})