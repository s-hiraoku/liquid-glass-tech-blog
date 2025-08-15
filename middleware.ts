/**
 * Middleware for Authentication Protection
 * Phase 5.2: Authentication System Implementation
 * 
 * Features:
 * - Protects admin routes (/admin/editor/*)
 * - Redirects unauthorized users to login
 * - Preserves intended destination
 * - Handles API route protection
 */

import { withAuth } from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server'

export default withAuth(
  function middleware(request: NextRequest & { nextauth: { token: any } }) {
    const { pathname } = request.nextUrl
    const token = request.nextauth.token

    // Allow access to admin routes only for authenticated admin users
    if (pathname.startsWith('/admin/editor')) {
      if (!token || token.role !== 'admin') {
        // Redirect to login with callback URL
        const url = new URL('/admin/login', request.url)
        url.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(url)
      }
    }

    // Allow access to admin API routes only for authenticated admin users
    if (pathname.startsWith('/api/admin')) {
      if (!token || token.role !== 'admin') {
        return new NextResponse(
          JSON.stringify({
            error: 'Admin access required',
            message: 'You must be logged in as an admin to access this resource'
          }),
          {
            status: 401,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Always allow access to login page
        if (pathname === '/admin/login') {
          return true
        }

        // Allow access to public routes
        if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) {
          return true
        }

        // Require authentication for admin routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    // Protect admin routes
    '/admin/:path*',
    // Protect admin API routes
    '/api/admin/:path*',
  ],
}