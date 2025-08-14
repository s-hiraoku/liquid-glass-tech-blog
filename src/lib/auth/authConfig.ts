/**
 * Next Auth.js Configuration with shadcn/ui Integration
 * Phase 5.2: Authentication System Implementation
 * 
 * Features:
 * - Next Auth.js setup for admin authentication
 * - Credentials provider for admin login
 * - Session management with secure cookies
 * - TypeScript types for enhanced security
 */

import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { JWT } from 'next-auth/jwt'

// Admin credentials - In production, use environment variables
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

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
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
          return null
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

        return null
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
  secret: process.env.NEXTAUTH_SECRET || 'liquid-glass-secret-key-2024',
}

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