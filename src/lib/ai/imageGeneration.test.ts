import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { 
  generateEyecatchImage, 
  generatePromptFromArticle, 
  optimizeImageSize,
  rateLimitManager,
  _setOpenAIClient,
  type ArticleInput,
  type ImageGenerationResult,
  type RateLimitStatus
} from './imageGeneration'

// Mock fetch for image optimization
global.fetch = vi.fn()
const mockedFetch = vi.mocked(fetch)

describe('AI Image Generation Client', () => {
  let mockOpenAIInstance: {
    images: {
      generate: ReturnType<typeof vi.fn>
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockOpenAIInstance = {
      images: {
        generate: vi.fn()
      }
    }
    // Inject the mock instance
    _setOpenAIClient(mockOpenAIInstance as any)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('generatePromptFromArticle', () => {
    it('should generate appropriate prompt from article title and content', () => {
      const article: ArticleInput = {
        title: 'Next.js 15の新機能',
        category: 'Frontend',
        summary: 'Next.js 15の新しい機能について解説します'
      }

      const prompt = generatePromptFromArticle(article)
      
      expect(prompt).toContain('Next.js 15')
      expect(prompt).toContain('Frontend')
      expect(prompt).toMatch(/professional.*blog.*image|eyecatch.*image/i)
    })

    it('should create different prompts for different categories', () => {
      const techArticle: ArticleInput = {
        title: 'React Best Practices',
        category: 'Frontend',
        summary: 'React development best practices'
      }

      const designArticle: ArticleInput = {
        title: 'UI/UX Design Trends',
        category: 'Design',
        summary: 'Latest design trends in 2024'
      }

      const techPrompt = generatePromptFromArticle(techArticle)
      const designPrompt = generatePromptFromArticle(designArticle)

      expect(techPrompt).not.toBe(designPrompt)
      expect(techPrompt).toContain('Frontend')
      expect(designPrompt).toContain('Design')
    })
  })

  describe('generateEyecatchImage', () => {
    const mockArticle: ArticleInput = {
      title: 'Test Article',
      category: 'Tech',
      summary: 'Test summary'
    }

    it('should successfully generate image with DALL-E 3', async () => {
      const mockResponse = {
        data: [{
          url: 'https://example.com/generated-image.png'
        }]
      }

      mockOpenAIInstance.images.generate.mockResolvedValue(mockResponse)
      
      // Mock fetch for image optimization
      mockedFetch.mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(8))
      } as Response)

      const result = await generateEyecatchImage(mockArticle)

      expect(result.success).toBe(true)
      expect(result.imageUrl).toBe('https://example.com/generated-image.png')
      expect(result.optimizedBuffer).toBeInstanceOf(ArrayBuffer)
      expect(mockOpenAIInstance.images.generate).toHaveBeenCalledWith({
        model: 'dall-e-3',
        prompt: expect.stringContaining('Test Article'),
        n: 1,
        size: '1792x1024',
        quality: 'standard',
        response_format: 'url'
      })
    })

    it('should handle API errors gracefully', async () => {
      mockOpenAIInstance.images.generate.mockRejectedValue(new Error('API Error'))

      const result = await generateEyecatchImage(mockArticle)

      expect(result.success).toBe(false)
      expect(result.error).toBe('API Error')
      expect(result.imageUrl).toBeUndefined()
    })

    it('should return fallback image when generation fails', async () => {
      mockOpenAIInstance.images.generate.mockRejectedValue(new Error('Rate limit exceeded'))

      const result = await generateEyecatchImage(mockArticle)

      expect(result.success).toBe(false)
      expect(result.fallbackCategory).toBe('Tech')
      expect(result.error).toBe('Rate limit exceeded')
    })
  })

  describe('optimizeImageSize', () => {
    it('should optimize image to 768x432px WebP format', async () => {
      const mockImageBuffer = new ArrayBuffer(1000)
      
      // Mock successful fetch
      mockedFetch.mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(mockImageBuffer)
      } as Response)

      const result = await optimizeImageSize('https://example.com/image.png')

      expect(result.success).toBe(true)
      expect(result.optimizedBuffer).toBeInstanceOf(ArrayBuffer)
      expect(result.format).toBe('webp')
      expect(result.dimensions).toEqual({ width: 768, height: 432 })
    })

    it('should handle image fetch errors', async () => {
      mockedFetch.mockResolvedValue({
        ok: false,
        status: 404
      } as Response)

      const result = await optimizeImageSize('https://example.com/invalid.png')

      expect(result.success).toBe(false)
      expect(result.error).toContain('Failed to fetch image')
    })

    it('should handle unknown errors during optimization', async () => {
      // Mock fetch to throw a non-Error object
      mockedFetch.mockRejectedValue('Network timeout')

      const result = await optimizeImageSize('https://example.com/image.png')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Image optimization failed: Unknown error')
    })
  })

  describe('Rate Limit Management', () => {
    beforeEach(() => {
      // Reset rate limit state
      rateLimitManager.reset()
    })

    it('should track API call count correctly', () => {
      expect(rateLimitManager.getStatus().remaining).toBe(5)
      expect(rateLimitManager.canMakeRequest()).toBe(true)
      
      rateLimitManager.recordRequest()
      expect(rateLimitManager.getStatus().remaining).toBe(4)
      
      rateLimitManager.recordRequest()
      expect(rateLimitManager.getStatus().remaining).toBe(3)
    })

    it('should prevent requests when limit exceeded', () => {
      // Exhaust rate limit
      for (let i = 0; i < 5; i++) {
        rateLimitManager.recordRequest()
      }

      expect(rateLimitManager.canMakeRequest()).toBe(false)
      expect(rateLimitManager.getStatus().remaining).toBe(0)
    })

    it('should reset after 1 hour', () => {
      // Exhaust rate limit
      for (let i = 0; i < 5; i++) {
        rateLimitManager.recordRequest()
      }
      
      expect(rateLimitManager.canMakeRequest()).toBe(false)
      
      // Fast-forward time by 1 hour
      vi.useFakeTimers()
      vi.advanceTimersByTime(60 * 60 * 1000)
      
      expect(rateLimitManager.canMakeRequest()).toBe(true)
      expect(rateLimitManager.getStatus().remaining).toBe(5)
      
      vi.useRealTimers()
    })

    it('should provide accurate time until reset', () => {
      rateLimitManager.recordRequest()
      const status = rateLimitManager.getStatus()
      
      expect(status.resetTime).toBeInstanceOf(Date)
      expect(status.resetTime.getTime()).toBeGreaterThan(Date.now())
    })
  })

  describe('Error Handling', () => {
    it('should handle rate limit errors specifically', async () => {
      const rateLimitError = new Error('Rate limit exceeded')
      rateLimitError.name = 'RateLimitError'
      
      mockOpenAIInstance.images.generate.mockRejectedValue(rateLimitError)

      const result = await generateEyecatchImage({
        title: 'Test',
        category: 'Tech',
        summary: 'Test'
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Rate limit exceeded')
      expect(result.fallbackCategory).toBe('Tech')
    })

    it('should handle network errors', async () => {
      const networkError = new Error('Network error')
      networkError.name = 'NetworkError'
      
      mockOpenAIInstance.images.generate.mockRejectedValue(networkError)

      const result = await generateEyecatchImage({
        title: 'Test',
        category: 'Tech', 
        summary: 'Test'
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Network error')
    })

    it('should handle invalid API responses', async () => {
      mockOpenAIInstance.images.generate.mockResolvedValue({
        data: [] // Empty response
      })

      const result = await generateEyecatchImage({
        title: 'Test',
        category: 'Tech',
        summary: 'Test'
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('No image generated')
    })

    it('should handle API response with null image URL', async () => {
      mockOpenAIInstance.images.generate.mockResolvedValue({
        data: [{
          url: null // null URL
        }]
      })

      const result = await generateEyecatchImage({
        title: 'Test',
        category: 'Tech',
        summary: 'Test'
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('No image URL received from API')
      expect(result.fallbackCategory).toBe('Tech')
    })
  })

  describe('Image Quality and Format Requirements', () => {
    it('should generate images with correct specifications', async () => {
      // Reset rate limit for this test
      rateLimitManager.reset()
      
      mockOpenAIInstance.images.generate.mockResolvedValue({
        data: [{
          url: 'https://example.com/test.png'
        }]
      })

      mockedFetch.mockResolvedValue({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(8))
      } as Response)

      const result = await generateEyecatchImage({
        title: 'Test Article',
        category: 'Tech',
        summary: 'Test summary'
      })

      expect(result.success).toBe(true)
      expect(mockOpenAIInstance.images.generate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'dall-e-3',
          size: '1792x1024', // DALL-E 3 size, will be resized to 768x432
          quality: 'standard',
          n: 1,
          response_format: 'url'
        })
      )
    })
  })
})