import { v2 as cloudinary } from 'cloudinary'

// Types
export interface ImageOptimizationConfig {
  cloudName: string
  apiKey: string
  apiSecret: string
  folder: string
}

export interface ImageUploadResult {
  success: boolean
  publicId?: string
  secureUrl?: string
  width?: number
  height?: number
  format?: string
  bytes?: number
  error?: string
}

export interface ImageVariant {
  url: string
  width: number
  height: number
  format: 'webp' | 'avif'
  mimeType: string
}

export interface BlurDataURLResult {
  success: boolean
  blurDataURL?: string
  width?: number
  height?: number
  error?: string
}

export interface PerformanceMetrics {
  originalSize: number
  optimizedSize: number
  compressionRatio: number
  processingTime: number
}

export interface OptimizedImageResult {
  success: boolean
  uploadResult?: ImageUploadResult
  variants: ImageVariant[]
  blurDataURL?: BlurDataURLResult
  performanceMetrics?: PerformanceMetrics
  error?: string
}

// Constants
const SIZE_VARIANTS = [
  { width: 768, height: 432 },   // Mobile
  { width: 1024, height: 576 },  // Tablet
  { width: 1536, height: 864 },  // Desktop
  { width: 2048, height: 1152 }  // Large desktop
]

const FORMATS = ['webp', 'avif'] as const

// CloudinaryImageOptimizer class
export class CloudinaryImageOptimizer {
  constructor(private config: ImageOptimizationConfig) {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret
    })
  }
}

// Upload image to Cloudinary
export async function uploadToCloudinary(
  imageBuffer: ArrayBuffer,
  filename: string,
  config: ImageOptimizationConfig
): Promise<ImageUploadResult> {
  try {
    // Convert ArrayBuffer to base64
    const bytes = new Uint8Array(imageBuffer)
    const base64String = btoa(String.fromCharCode(...bytes))
    const dataURI = `data:image/jpeg;base64,${base64String}`

    // Generate public ID from filename
    const publicId = filename.replace(/\.[^/.]+$/, '') // Remove extension
    const fullPublicId = `${config.folder}/${publicId}`

    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      folder: config.folder,
      public_id: publicId,
      resource_type: 'image'
    })

    return {
      success: true,
      publicId: uploadResult.public_id,
      secureUrl: uploadResult.secure_url,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
      bytes: uploadResult.bytes
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return {
      success: false,
      error: errorMessage
    }
  }
}

// Generate image variants for different formats and sizes
export function generateImageVariants(
  publicId: string,
  config: ImageOptimizationConfig
): ImageVariant[] {
  const variants: ImageVariant[] = []

  for (const format of FORMATS) {
    for (const size of SIZE_VARIANTS) {
      const url = cloudinary.url(publicId, {
        width: size.width,
        height: size.height,
        crop: 'fill',
        gravity: 'auto',
        quality: 'auto',
        format: format
      })

      variants.push({
        url,
        width: size.width,
        height: size.height,
        format,
        mimeType: `image/${format}`
      })
    }
  }

  return variants
}

// Generate blur data URL for lazy loading
export async function generateBlurDataURL(
  publicId: string,
  config: ImageOptimizationConfig
): Promise<BlurDataURLResult> {
  try {
    // Generate very small, low-quality image for blur placeholder
    const blurUrl = cloudinary.url(publicId, {
      width: 10,
      height: 6,
      quality: 10,
      format: 'webp',
      crop: 'fill'
    })

    // Fetch the blur image
    const response = await fetch(blurUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch blur image: ${response.status}`)
    }

    const imageBuffer = await response.arrayBuffer()
    const bytes = new Uint8Array(imageBuffer)
    const base64String = btoa(String.fromCharCode(...bytes))
    const blurDataURL = `data:image/webp;base64,${base64String}`

    return {
      success: true,
      blurDataURL,
      width: 10,
      height: 6
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return {
      success: false,
      error: `Blur data URL generation failed: ${errorMessage}`
    }
  }
}

// Main optimization function
export async function optimizeImage(
  imageBuffer: ArrayBuffer,
  filename: string,
  config: ImageOptimizationConfig
): Promise<OptimizedImageResult> {
  const startTime = Date.now()

  try {
    // Validate input
    if (imageBuffer.byteLength === 0) {
      return {
        success: false,
        variants: [],
        error: 'Invalid image data: empty buffer'
      }
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(imageBuffer, filename, config)
    
    if (!uploadResult.success) {
      return {
        success: false,
        variants: [],
        error: uploadResult.error
      }
    }

    // Generate image variants
    const variants = generateImageVariants(uploadResult.publicId!, config)

    // Generate blur data URL
    const blurDataURL = await generateBlurDataURL(uploadResult.publicId!, config)

    // Calculate performance metrics
    const processingTime = Date.now() - startTime
    const originalSize = imageBuffer.byteLength
    const optimizedSize = uploadResult.bytes || originalSize
    const compressionRatio = optimizedSize / originalSize

    const performanceMetrics: PerformanceMetrics = {
      originalSize,
      optimizedSize,
      compressionRatio,
      processingTime
    }

    return {
      success: true,
      uploadResult,
      variants,
      blurDataURL,
      performanceMetrics
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return {
      success: false,
      variants: [],
      error: errorMessage
    }
  }
}