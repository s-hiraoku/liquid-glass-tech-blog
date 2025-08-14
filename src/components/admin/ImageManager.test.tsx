import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { 
  ImageManager,
  type ImageManagerProps,
  type ManagedImage,
  type ImageFilter,
  type ImageOperationResult
} from './ImageManager'

// Mock the image optimization module
vi.mock('../../lib/image/imageOptimization', () => ({
  optimizeImage: vi.fn(),
  uploadToCloudinary: vi.fn(),
  generateImageVariants: vi.fn(),
  generateBlurDataURL: vi.fn()
}))

// Mock the AI image generation module  
vi.mock('../../lib/ai/imageGeneration', () => ({
  generateEyecatchImage: vi.fn(),
  generatePromptFromArticle: vi.fn()
}))

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />
}))

// Sample test data
const mockImages: ManagedImage[] = [
  {
    id: '1',
    publicId: 'blog/sample-1',
    url: 'https://res.cloudinary.com/test/image/upload/blog/sample-1.jpg',
    title: 'React Best Practices',
    category: 'Frontend',
    generatedAt: new Date('2024-01-01T10:00:00Z'),
    prompt: 'Professional blog image about React development',
    usedInArticles: ['article-1'],
    metadata: {
      width: 768,
      height: 432,
      format: 'jpg',
      size: 125000
    },
    variants: [
      {
        url: 'https://res.cloudinary.com/test/image/upload/w_768,h_432,f_webp/blog/sample-1.jpg',
        width: 768,
        height: 432,
        format: 'webp' as const,
        mimeType: 'image/webp'
      }
    ]
  },
  {
    id: '2',
    publicId: 'blog/sample-2',
    url: 'https://res.cloudinary.com/test/image/upload/blog/sample-2.jpg',
    title: 'Next.js 15 Features',
    category: 'Framework',
    generatedAt: new Date('2024-01-02T14:30:00Z'),
    prompt: 'Modern tech blog image about Next.js features',
    usedInArticles: [],
    metadata: {
      width: 1536,
      height: 864,
      format: 'jpg',
      size: 245000
    },
    variants: []
  }
]

describe('ImageManager Component', () => {
  const mockProps: ImageManagerProps = {
    images: mockImages,
    onImageSelect: vi.fn(),
    onImageDelete: vi.fn(),
    onImageRegenerate: vi.fn(),
    onImageUpload: vi.fn(),
    onMetadataEdit: vi.fn(),
    isLoading: false,
    selectedImageId: null
  }

  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Component Rendering', () => {
    it('should render image gallery with all images', () => {
      render(<ImageManager {...mockProps} />)
      
      expect(screen.getByRole('heading', { name: /image manager/i })).toBeInTheDocument()
      expect(screen.getByText('React Best Practices')).toBeInTheDocument()
      expect(screen.getByText('Next.js 15 Features')).toBeInTheDocument()
      expect(screen.getByText('Frontend')).toBeInTheDocument()
      expect(screen.getByText('Framework')).toBeInTheDocument()
    })

    it('should display loading state when isLoading is true', () => {
      render(<ImageManager {...mockProps} isLoading={true} />)
      
      expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument()
    })

    it('should show empty state when no images are provided', () => {
      render(<ImageManager {...mockProps} images={[]} />)
      
      expect(screen.getByText(/no images found/i)).toBeInTheDocument()
      expect(screen.getByText(/upload or generate your first image/i)).toBeInTheDocument()
    })
  })

  describe('Image Display and Preview', () => {
    it('should display image thumbnails with correct metadata', () => {
      render(<ImageManager {...mockProps} />)
      
      const image1 = screen.getByAltText('React Best Practices')
      const image2 = screen.getByAltText('Next.js 15 Features')
      
      expect(image1).toBeInTheDocument()
      expect(image2).toBeInTheDocument()
      
      // Check metadata display
      expect(screen.getByText('768 × 432')).toBeInTheDocument()
      expect(screen.getByText('1536 × 864')).toBeInTheDocument()
      expect(screen.getByText('122 KB')).toBeInTheDocument() // 125000 bytes formatted
      expect(screen.getByText('239 KB')).toBeInTheDocument() // 245000 bytes formatted
    })

    it('should highlight selected image', () => {
      render(<ImageManager {...mockProps} selectedImageId="1" />)
      
      const selectedImage = screen.getByTestId('image-card-1')
      expect(selectedImage).toHaveClass('selected')
    })

    it('should show image preview modal when image is clicked', async () => {
      render(<ImageManager {...mockProps} />)
      
      const image = screen.getByAltText('React Best Practices')
      await user.click(image)
      
      expect(screen.getByRole('dialog', { name: /image preview/i })).toBeInTheDocument()
      expect(screen.getByText('Professional blog image about React development')).toBeInTheDocument()
    })
  })

  describe('Image Selection', () => {
    it('should call onImageSelect when an image is clicked', async () => {
      render(<ImageManager {...mockProps} />)
      
      const image = screen.getByTestId('image-card-1')
      await user.click(image)
      
      expect(mockProps.onImageSelect).toHaveBeenCalledWith(mockImages[0])
    })

    it('should support drag and drop image selection', async () => {
      render(<ImageManager {...mockProps} />)
      
      const dropzone = screen.getByTestId('image-dropzone')
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      
      fireEvent.drop(dropzone, { dataTransfer: { files: [file] } })
      
      await waitFor(() => {
        expect(mockProps.onImageUpload).toHaveBeenCalledWith(file)
      })
    })
  })

  describe('Image Operations', () => {
    it('should show delete confirmation modal when delete button is clicked', async () => {
      render(<ImageManager {...mockProps} />)
      
      const deleteButton = screen.getByTestId('delete-button-1')
      await user.click(deleteButton)
      
      expect(screen.getByRole('dialog', { name: /confirm deletion/i })).toBeInTheDocument()
      expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument()
    })

    it('should call onImageDelete when deletion is confirmed', async () => {
      render(<ImageManager {...mockProps} />)
      
      const deleteButton = screen.getByTestId('delete-button-1')
      await user.click(deleteButton)
      
      const confirmButton = screen.getByRole('button', { name: /confirm delete/i })
      await user.click(confirmButton)
      
      expect(mockProps.onImageDelete).toHaveBeenCalledWith('1')
    })

    it('should show regenerate modal when regenerate button is clicked', async () => {
      render(<ImageManager {...mockProps} />)
      
      const regenerateButton = screen.getByTestId('regenerate-button-1')
      await user.click(regenerateButton)
      
      expect(screen.getByRole('dialog', { name: /regenerate image/i })).toBeInTheDocument()
      expect(screen.getByLabelText(/new prompt/i)).toBeInTheDocument()
    })

    it('should call onImageRegenerate with new prompt', async () => {
      render(<ImageManager {...mockProps} />)
      
      const regenerateButton = screen.getByTestId('regenerate-button-1')
      await user.click(regenerateButton)
      
      const promptInput = screen.getByLabelText(/new prompt/i)
      await user.type(promptInput, 'Updated prompt for React image')
      
      const submitButton = screen.getByRole('button', { name: /regenerate/i })
      await user.click(submitButton)
      
      expect(mockProps.onImageRegenerate).toHaveBeenCalledWith('1', 'Updated prompt for React image')
    })
  })

  describe('Metadata Editing', () => {
    it('should show edit metadata modal when edit button is clicked', async () => {
      render(<ImageManager {...mockProps} />)
      
      const editButton = screen.getByTestId('edit-button-1')
      await user.click(editButton)
      
      expect(screen.getByRole('dialog', { name: /edit metadata/i })).toBeInTheDocument()
      expect(screen.getByDisplayValue('React Best Practices')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Frontend')).toBeInTheDocument()
    })

    it('should call onMetadataEdit when metadata is saved', async () => {
      render(<ImageManager {...mockProps} />)
      
      const editButton = screen.getByTestId('edit-button-1')
      await user.click(editButton)
      
      const titleInput = screen.getByLabelText(/title/i)
      await user.clear(titleInput)
      await user.type(titleInput, 'Updated React Guide')
      
      const saveButton = screen.getByRole('button', { name: /save changes/i })
      await user.click(saveButton)
      
      expect(mockProps.onMetadataEdit).toHaveBeenCalledWith('1', {
        title: 'Updated React Guide',
        category: 'Frontend'
      })
    })
  })

  describe('Filtering and Search', () => {
    it('should filter images by category', async () => {
      render(<ImageManager {...mockProps} />)
      
      const categoryFilter = screen.getByLabelText(/filter by category/i)
      await user.selectOptions(categoryFilter, 'Frontend')
      
      expect(screen.getByText('React Best Practices')).toBeInTheDocument()
      expect(screen.queryByText('Next.js 15 Features')).not.toBeInTheDocument()
    })

    it('should search images by title', async () => {
      render(<ImageManager {...mockProps} />)
      
      const searchInput = screen.getByPlaceholderText(/search images/i)
      await user.type(searchInput, 'React')
      
      expect(screen.getByText('React Best Practices')).toBeInTheDocument()
      expect(screen.queryByText('Next.js 15 Features')).not.toBeInTheDocument()
    })

    it('should filter images by usage status', async () => {
      render(<ImageManager {...mockProps} />)
      
      const usageFilter = screen.getByLabelText(/filter by usage/i)
      await user.selectOptions(usageFilter, 'unused')
      
      expect(screen.queryByText('React Best Practices')).not.toBeInTheDocument()
      expect(screen.getByText('Next.js 15 Features')).toBeInTheDocument()
    })

    it('should show generation history with dates', () => {
      render(<ImageManager {...mockProps} />)
      
      expect(screen.getByText('Jan 1, 2024')).toBeInTheDocument()
      expect(screen.getByText('Jan 2, 2024')).toBeInTheDocument()
    })
  })

  describe('Image Upload', () => {
    it('should show upload progress when uploading', async () => {
      const propsWithLoading = { ...mockProps, isLoading: true }
      render(<ImageManager {...propsWithLoading} />)
      
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
      expect(screen.getByText(/uploading/i)).toBeInTheDocument()
    })

    it('should validate file types on upload', async () => {
      render(<ImageManager {...mockProps} />)
      
      const fileInput = screen.getByLabelText(/upload image/i)
      const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' })
      
      await user.upload(fileInput, invalidFile)
      
      expect(screen.getByText(/please select a valid image file/i)).toBeInTheDocument()
    })

    it('should validate file size on upload', async () => {
      render(<ImageManager {...mockProps} />)
      
      const fileInput = screen.getByLabelText(/upload image/i)
      const largeFile = new File(['x'.repeat(10 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })
      Object.defineProperty(largeFile, 'size', { value: 10 * 1024 * 1024 })
      
      await user.upload(fileInput, largeFile)
      
      expect(screen.getByText(/file size must be less than/i)).toBeInTheDocument()
    })
  })

  describe('Keyboard Navigation and Accessibility', () => {
    it('should support keyboard navigation', async () => {
      render(<ImageManager {...mockProps} />)
      
      const firstImage = screen.getByTestId('image-card-1')
      firstImage.focus()
      
      expect(firstImage).toHaveFocus()
      
      await user.keyboard('{Enter}')
      expect(mockProps.onImageSelect).toHaveBeenCalledWith(mockImages[0])
    })

    it('should have proper ARIA labels', () => {
      render(<ImageManager {...mockProps} />)
      
      expect(screen.getByRole('grid', { name: /image gallery/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /upload new image/i })).toBeInTheDocument()
      expect(screen.getByLabelText(/search images/i)).toBeInTheDocument()
    })

    it('should announce loading state to screen readers', () => {
      render(<ImageManager {...mockProps} isLoading={true} />)
      
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
      expect(screen.getByRole('status')).toHaveTextContent(/loading images/i)
    })
  })

  describe('Error Handling', () => {
    it('should display error message when operation fails', async () => {
      const mockOnImageDelete = vi.fn().mockRejectedValue(new Error('Delete failed'))
      render(<ImageManager {...mockProps} onImageDelete={mockOnImageDelete} />)
      
      const deleteButton = screen.getByTestId('delete-button-1')
      await user.click(deleteButton)
      
      const confirmButton = screen.getByRole('button', { name: /confirm delete/i })
      await user.click(confirmButton)
      
      await waitFor(() => {
        expect(screen.getByText(/failed to delete image/i)).toBeInTheDocument()
      })
    })

    it('should show retry option for failed operations', async () => {
      const mockOnImageUpload = vi.fn()
        .mockRejectedValueOnce(new Error('Upload failed'))
        .mockResolvedValue({ success: true })
      
      render(<ImageManager {...mockProps} onImageUpload={mockOnImageUpload} />)
      
      const dropzone = screen.getByTestId('image-dropzone')
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      
      fireEvent.drop(dropzone, { dataTransfer: { files: [file] } })
      
      await waitFor(() => {
        expect(screen.getByText(/upload failed/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
      })
      
      const retryButton = screen.getByRole('button', { name: /retry/i })
      await user.click(retryButton)
      
      expect(mockOnImageUpload).toHaveBeenCalledTimes(2)
    })
  })

  describe('Performance', () => {
    it('should lazy load images off-screen', () => {
      render(<ImageManager {...mockProps} />)
      
      const images = screen.getAllByRole('img')
      images.forEach(img => {
        expect(img).toHaveAttribute('loading', 'lazy')
      })
    })

    it('should virtualize large image lists', () => {
      const manyImages = Array.from({ length: 100 }, (_, i) => ({
        ...mockImages[0],
        id: `${i}`,
        title: `Image ${i}`
      }))
      
      render(<ImageManager {...mockProps} images={manyImages} />)
      
      // Should only render visible items (virtualized)
      const renderedImages = screen.getAllByRole('img')
      expect(renderedImages.length).toBeLessThan(100)
    })
  })
})