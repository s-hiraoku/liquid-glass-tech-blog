/**
 * Next.js Auth.js v5 Configuration 
 * Phase 5.2: Authentication System Implementation with shadcn/ui Integration
 * 
 * Modern Auth.js v5 setup with:
 * - Credentials provider for admin authentication
 * - Session management with JWT strategy
 * - TypeScript integration for type safety
 * - Custom pages with shadcn/ui styling
 * 
 * Requirements: REQ-5.9, Security
 */

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

// Admin credentials - In production, use environment variables and proper password hashing
const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || 'admin@liquid-glass-tech.com',
  password: process.env.ADMIN_PASSWORD || 'liquid-glass-2024!',
  id: 'admin-1',
  name: 'Admin User',
  role: 'admin'
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: 'admin' | 'user'
    }
  }

  interface User {
    id: string
    name: string
    email: string
    role: 'admin' | 'user'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'admin' | 'user'
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      id: 'credentials',
      name: 'Admin Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'admin@liquid-glass-tech.com'
        },
        password: {
          label: 'Password',
          type: 'password'
        }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        // In production, hash passwords with bcrypt and store in database
        if (
          credentials.email === ADMIN_CREDENTIALS.email &&
          credentials.password === ADMIN_CREDENTIALS.password
        ) {
          return {
            id: ADMIN_CREDENTIALS.id,
            name: ADMIN_CREDENTIALS.name,
            email: ADMIN_CREDENTIALS.email,
            role: ADMIN_CREDENTIALS.role as 'admin'
          }
        }

        // Return null if authentication fails
        throw new Error('Invalid credentials')
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'liquid-glass-secret-key-2024',
})

/**
 * Authentication utilities for server-side checks
 */
export const isAdminUser = (user: any): boolean => {
  return user?.role === 'admin'
}

export const requireAdmin = (user: any) => {
  if (!isAdminUser(user)) {
    throw new Error('Admin access required')
  }
}