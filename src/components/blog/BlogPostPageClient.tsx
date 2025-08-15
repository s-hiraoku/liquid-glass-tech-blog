/**
 * Client-side Blog Post Page Component for Testing
 * 
 * This component handles the client-side rendering of blog posts
 * for testing purposes, while maintaining the same interface as
 * the server component version.
 */

'use client'

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, User, Tag, Share2, ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'

// shadcn/ui components
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

// Liquid glass components
import { LiquidGlassCard } from '@/components/liquid-glass/LiquidGlassCard'

// Content and blog components
import { MDXRenderer } from '@/components/content/MDXRenderer'
import { BlogPostCard } from '@/components/blog/BlogPostCard'

// MDX processing
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/mdx'

interface BlogPostPageClientProps {
  params: { slug: string }
}

export default function BlogPostPageClient({ params }: BlogPostPageClientProps) {
  const [post, setPost] = useState<any>(null)
  const [relatedPosts, setRelatedPosts] = useState<any[]>([])
  const [previousPost, setPreviousPost] = useState<any>(null)
  const [nextPost, setNextPost] = useState<any>(null)
  const [tocItems, setTocItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPost() {
      try {
        const loadedPost = await getPostBySlug(params.slug)
        
        if (!loadedPost) {
          notFound()
          return
        }

        setPost(loadedPost)

        const related = await getRelatedPosts(loadedPost.slug, 3)
        setRelatedPosts(related)

        const allPosts = await getAllPosts()
        const currentIndex = allPosts.findIndex(p => p.slug === loadedPost.slug)
        setPreviousPost(currentIndex > 0 ? allPosts[currentIndex - 1] : null)
        setNextPost(currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null)

        // Generate table of contents from content
        const toc = generateTableOfContents(loadedPost.content)
        setTocItems(toc)

        setLoading(false)
      } catch (error) {
        console.error('Error loading post:', error)
        setLoading(false)
      }
    }

    loadPost()
  }, [params.slug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1>Post Not Found</h1>
        <p>The requested blog post could not be found.</p>
        <Link href="/posts" className="text-blue-600 hover:underline">
          Back to Posts
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Skip to content
      </a>

      {/* Reading progress indicator */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <div
          role="progressbar"
          aria-label="Reading progress"
          aria-valuenow={0}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-1 bg-blue-600 transition-all duration-150 ease-out"
          style={{ width: '0%' }}
          id="reading-progress"
        />
      </div>

      {/* Breadcrumb navigation */}
      <nav aria-label="breadcrumb" className="container mx-auto px-4 py-4">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/posts" className="hover:text-foreground transition-colors">
              Posts
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground font-medium truncate">{post.title}</li>
        </ol>
      </nav>

      <main id="main-content" role="main" className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents (Desktop) */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <LiquidGlassCard variant="glass-subtle" className="sticky top-24">
              <div className="p-4">
                <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">
                  Table of Contents
                </h2>
                <nav role="navigation" aria-label="table of contents">
                  <ul className="space-y-2 text-sm">
                    {tocItems.map((item, index) => (
                      <li key={index} className={`ml-${(item.level - 1) * 4}`}>
                        <Link
                          href={`#${item.id}`}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {item.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </LiquidGlassCard>
          </aside>

          {/* Main content */}
          <div className="lg:col-span-3">
            <article role="article" className="space-y-8">
              {/* Post header */}
              <LiquidGlassCard variant="glass-medium" className="overflow-hidden">
                <div className="relative h-64 md:h-80">
                  <Image
                    src={post.eyecatch || '/images/default-article.jpg'}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center space-x-4 text-sm mb-2">
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        {post.category}
                      </Badge>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                      {post.readingTime && (
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {post.readingTime} min read
                        </span>
                      )}
                    </div>
                    <h1 className="text-2xl md:text-4xl font-bold mb-2">{post.title}</h1>
                    <p className="text-lg text-gray-200">{post.excerpt}</p>
                    {post.author && (
                      <div className="flex items-center mt-4">
                        <User className="w-4 h-4 mr-2" />
                        <span>{post.author}</span>
                      </div>
                    )}
                  </div>
                </div>
              </LiquidGlassCard>

              {/* Post tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="flex items-center">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* MDX Content */}
              <LiquidGlassCard variant="glass-subtle" className="prose prose-lg max-w-none">
                <div className="p-8" data-testid="mdx-content">
                  <div className="prose prose-lg max-w-none">
                    {/* For now, render as plain text until MDXRenderer is properly configured */}
                    <pre className="whitespace-pre-wrap">{post.content}</pre>
                  </div>
                </div>
              </LiquidGlassCard>

              {/* Social sharing */}
              <LiquidGlassCard variant="glass-subtle">
                <div className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Share2 className="w-5 h-5 mr-2" />
                    Share this post
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => shareOnTwitter(post.title, window.location.href)}
                      aria-label="Share on Twitter"
                    >
                      Share on Twitter
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => shareOnFacebook(window.location.href)}
                      aria-label="Share on Facebook"
                    >
                      Share on Facebook
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => shareOnLinkedIn(post.title, post.excerpt, window.location.href)}
                      aria-label="Share on LinkedIn"
                    >
                      Share on LinkedIn
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(window.location.href)}
                      aria-label="Copy link"
                    >
                      Copy Link
                    </Button>
                  </div>
                </div>
              </LiquidGlassCard>

              {/* Post navigation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {previousPost && (
                  <Link href={`/posts/${previousPost.slug}`} className="group">
                    <Card className="h-full hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                      <CardContent className="p-4">
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <ArrowLeft className="w-4 h-4 mr-1" />
                          Previous post
                        </div>
                        <h4 className="font-semibold group-hover:text-blue-600 transition-colors">
                          {previousPost.title}
                        </h4>
                      </CardContent>
                    </Card>
                  </Link>
                )}
                {nextPost && (
                  <Link href={`/posts/${nextPost.slug}`} className="group">
                    <Card className="h-full hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                      <CardContent className="p-4 text-right">
                        <div className="flex items-center justify-end text-sm text-muted-foreground mb-2">
                          Next post
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                        <h4 className="font-semibold group-hover:text-blue-600 transition-colors">
                          {nextPost.title}
                        </h4>
                      </CardContent>
                    </Card>
                  </Link>
                )}
              </div>
            </article>

            {/* Related posts */}
            {relatedPosts.length > 0 && (
              <section className="mt-16">
                <h2 className="text-2xl font-bold mb-8">Related Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <div key={relatedPost.slug} data-testid="related-post-card">
                      <BlogPostCard post={relatedPost} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

// Utility functions
function generateTableOfContents(content: string) {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const toc = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    
    toc.push({ level, text, id })
  }

  return toc
}

function shareOnTwitter(title: string, url: string) {
  const text = encodeURIComponent(`${title} ${url}`)
  window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'width=600,height=400')
}

function shareOnFacebook(url: string) {
  const shareUrl = encodeURIComponent(url)
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank', 'width=600,height=400')
}

function shareOnLinkedIn(title: string, summary: string, url: string) {
  const shareUrl = encodeURIComponent(url)
  const shareTitle = encodeURIComponent(title)
  const shareSummary = encodeURIComponent(summary)
  window.open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}&title=${shareTitle}&summary=${shareSummary}`,
    '_blank',
    'width=600,height=400'
  )
}

async function copyToClipboard(url: string) {
  try {
    await navigator.clipboard.writeText(url)
    alert('Link copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy link:', err)
  }
}