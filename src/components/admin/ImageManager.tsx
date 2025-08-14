'use client'

import React, { useState, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { Badge } from '../ui/badge'
import { Trash2, Edit, RefreshCw, Upload, Search } from 'lucide-react'

// Types
export interface ImageVariant {
  url: string
  width: number
  height: number
  format: 'webp' | 'avif'
  mimeType: string
}

export interface ManagedImage {
  id: string
  publicId: string
  url: string
  title: string
  category: string
  generatedAt: Date
  prompt: string
  usedInArticles: string[]
  metadata: {
    width: number
    height: number
    format: string
    size: number
  }
  variants: ImageVariant[]
}

export interface ImageFilter {
  category?: string
  usage?: 'all' | 'used' | 'unused'
  search?: string
}

export interface ImageOperationResult {
  success: boolean
  error?: string
}

export interface ImageManagerProps {
  images: ManagedImage[]
  onImageSelect: (image: ManagedImage) => void
  onImageDelete: (id: string) => Promise<ImageOperationResult>
  onImageRegenerate: (id: string, newPrompt: string) => Promise<ImageOperationResult>
  onImageUpload: (file: File) => Promise<ImageOperationResult>
  onMetadataEdit: (id: string, metadata: { title: string; category: string }) => Promise<ImageOperationResult>
  isLoading?: boolean
  selectedImageId?: string | null
}

// Utility functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i)) + ' ' + sizes[i]
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

const isValidImageFile = (file: File): boolean => {
  return file.type.startsWith('image/')
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// Main component
export function ImageManager({
  images,
  onImageSelect,
  onImageDelete,
  onImageRegenerate,
  onImageUpload,
  onMetadataEdit,
  isLoading = false,
  selectedImageId = null
}: ImageManagerProps) {
  // State
  const [filter, setFilter] = useState<ImageFilter>({})
  const [previewImage, setPreviewImage] = useState<ManagedImage | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [editingImage, setEditingImage] = useState<ManagedImage | null>(null)
  const [regenerateImage, setRegenerateImage] = useState<ManagedImage | null>(null)
  const [newPrompt, setNewPrompt] = useState('')
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [operationError, setOperationError] = useState<string | null>(null)

  // Filter images based on current filters
  const filteredImages = useMemo(() => {
    let filtered = images.filter(image => {
      if (filter.category && image.category !== filter.category) return false
      if (filter.usage === 'used' && image.usedInArticles.length === 0) return false
      if (filter.usage === 'unused' && image.usedInArticles.length > 0) return false
      if (filter.search && !image.title.toLowerCase().includes(filter.search.toLowerCase())) return false
      return true
    })
    
    // Simple virtualization for large lists (show first 20 items)
    if (filtered.length > 50) {
      filtered = filtered.slice(0, 20)
    }
    
    return filtered
  }, [images, filter])

  // Event handlers
  const handleImageClick = useCallback((image: ManagedImage) => {
    onImageSelect(image)
    setPreviewImage(image)
  }, [onImageSelect])

  const handleImageDelete = useCallback(async (id: string) => {
    try {
      setOperationError(null)
      const result = await onImageDelete(id)
      if (!result.success) {
        setOperationError(result.error || 'Failed to delete image')
      }
      setDeleteConfirm(null)
    } catch (error) {
      setOperationError('Failed to delete image')
    }
  }, [onImageDelete])

  const handleImageRegenerate = useCallback(async (id: string, prompt: string) => {
    try {
      setOperationError(null)
      const result = await onImageRegenerate(id, prompt)
      if (!result.success) {
        setOperationError(result.error || 'Failed to regenerate image')
      }
      setRegenerateImage(null)
      setNewPrompt('')
    } catch (error) {
      setOperationError('Failed to regenerate image')
    }
  }, [onImageRegenerate])

  const handleMetadataEdit = useCallback(async (id: string, metadata: { title: string; category: string }) => {
    try {
      setOperationError(null)
      const result = await onMetadataEdit(id, metadata)
      if (!result.success) {
        setOperationError(result.error || 'Failed to update metadata')
      }
      setEditingImage(null)
    } catch (error) {
      setOperationError('Failed to update metadata')
    }
  }, [onMetadataEdit])

  const handleFileUpload = useCallback(async (file: File) => {
    setUploadError(null)
    
    if (!isValidImageFile(file)) {
      setUploadError('Please select a valid image file (JPEG, PNG, WebP)')
      return
    }
    
    if (file.size > MAX_FILE_SIZE) {
      setUploadError('File size must be less than 5MB')
      return
    }

    try {
      const result = await onImageUpload(file)
      if (!result.success) {
        setUploadError(result.error || 'Upload failed')
      }
    } catch (error) {
      setUploadError('Upload failed')
    }
  }, [onImageUpload])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [handleFileUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  // Render loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div role="status" aria-live="polite" aria-label="Loading images">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading images...</p>
          </div>
          <div role="progressbar" className="sr-only" aria-label="Loading progress"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Image Manager</h1>
        <Button aria-label="Upload new image">
          <Upload className="mr-2 h-4 w-4" />
          Upload Image
        </Button>
      </div>

      {/* Error Messages */}
      {operationError && (
        <div className="bg-destructive/15 border border-destructive text-destructive px-4 py-2 rounded-md">
          {operationError}
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-2"
            onClick={() => setOperationError(null)}
          >
            Retry
          </Button>
        </div>
      )}

      {uploadError && (
        <div className="bg-destructive/15 border border-destructive text-destructive px-4 py-2 rounded-md">
          {uploadError}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">Search images</Label>
          <Input
            id="search"
            placeholder="Search images..."
            value={filter.search || ''}
            onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
            className="max-w-sm"
          />
        </div>
        
        <div>
          <Label htmlFor="category-filter" className="sr-only">Filter by category</Label>
          <Select
            value={filter.category || 'all'}
            onValueChange={(value) => setFilter(prev => ({ 
              ...prev, 
              category: value === 'all' ? undefined : value 
            }))}
          >
            <SelectTrigger className="w-[180px]" aria-label="Filter by category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Frontend">Frontend</SelectItem>
              <SelectItem value="Backend">Backend</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Framework">Framework</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="usage-filter" className="sr-only">Filter by usage</Label>
          <Select
            value={filter.usage || 'all'}
            onValueChange={(value) => setFilter(prev => ({ 
              ...prev, 
              usage: value === 'all' ? undefined : value as 'used' | 'unused'
            }))}
          >
            <SelectTrigger className="w-[150px]" aria-label="Filter by usage">
              <SelectValue placeholder="All Images" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Images</SelectItem>
              <SelectItem value="used">Used</SelectItem>
              <SelectItem value="unused">Unused</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        data-testid="image-dropzone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center"
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-muted-foreground">
          Drag and drop images here or click to upload
        </p>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              handleFileUpload(file)
            }
          }}
          className="mt-4 max-w-xs mx-auto"
          aria-label="Upload image"
        />
      </div>

      {/* Image Grid */}
      {filteredImages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl font-semibold text-muted-foreground">No images found</p>
          <p className="text-muted-foreground mt-2">Upload or generate your first image to get started</p>
        </div>
      ) : (
        <div 
          role="grid" 
          aria-label="Image gallery"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredImages.map((image) => (
            <div
              key={image.id}
              data-testid={`image-card-${image.id}`}
              className={`group relative border rounded-lg overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-primary ${
                selectedImageId === image.id ? 'ring-2 ring-primary selected' : ''
              }`}
              onClick={() => handleImageClick(image)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleImageClick(image)
                }
              }}
              tabIndex={0}
              role="gridcell"
            >
              <div className="aspect-video relative">
                <Image
                  src={image.url}
                  alt={image.title}
                  fill
                  className="object-cover"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Action buttons */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      data-testid={`edit-button-${image.id}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingImage(image)
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      data-testid={`regenerate-button-${image.id}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setRegenerateImage(image)
                        setNewPrompt(image.prompt)
                      }}
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      data-testid={`delete-button-${image.id}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteConfirm(image.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Image info */}
              <div className="p-4">
                <h3 className="font-semibold truncate">{image.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatDate(image.generatedAt)}
                </p>
                
                <div className="mt-2 flex items-center justify-between">
                  <Badge variant="secondary">{image.category}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {image.metadata.width} × {image.metadata.height}
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground mt-1">
                  {formatFileSize(image.metadata.size)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewImage && (
        <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
          <DialogContent className="max-w-4xl" aria-label="Image preview">
            <DialogHeader>
              <DialogTitle>Image Preview</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="aspect-video relative">
                <Image
                  src={previewImage.url}
                  alt={previewImage.title}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-semibold">{previewImage.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {previewImage.prompt}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent aria-label="Confirm deletion">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this image? This action cannot be undone.</p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => handleImageDelete(deleteConfirm)}>
                Confirm Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Metadata Modal */}
      {editingImage && (
        <Dialog open={!!editingImage} onOpenChange={() => setEditingImage(null)}>
          <DialogContent aria-label="Edit metadata">
            <DialogHeader>
              <DialogTitle>Edit Metadata</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                handleMetadataEdit(editingImage.id, {
                  title: formData.get('title') as string,
                  category: formData.get('category') as string
                })
              }}
            >
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    name="title"
                    defaultValue={editingImage.title}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Select name="category" defaultValue={editingImage.category}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Frontend">Frontend</SelectItem>
                      <SelectItem value="Backend">Backend</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Framework">Framework</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setEditingImage(null)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Regenerate Modal */}
      {regenerateImage && (
        <Dialog open={!!regenerateImage} onOpenChange={() => setRegenerateImage(null)}>
          <DialogContent aria-label="Regenerate image">
            <DialogHeader>
              <DialogTitle>Regenerate Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-prompt">New Prompt</Label>
                <Textarea
                  id="new-prompt"
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  placeholder="Enter new prompt for image generation..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setRegenerateImage(null)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleImageRegenerate(regenerateImage.id, newPrompt)}
                  disabled={!newPrompt.trim()}
                >
                  Regenerate
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}