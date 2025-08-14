/**
 * Admin Login Page
 * Phase 5.2: Authentication System Implementation
 * 
 * Features:
 * - shadcn/ui Form components integration
 * - Liquid glass effects styling
 * - Next Auth.js authentication
 * - Error handling and validation
 * - Responsive design
 */

'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// shadcn/ui components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Icons } from '@/components/ui/icons'

// Liquid glass effects
import { LiquidGlassCard } from '@/components/liquid-glass/LiquidGlassCard'
import { useToast } from '@/components/ui/use-toast'

// Form validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const callbackUrl = searchParams.get('callbackUrl') || '/admin/editor'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@liquid-glass-tech.com',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
        toast({
          title: 'Authentication Failed',
          description: 'Please check your credentials and try again.',
          variant: 'destructive',
        })
      } else {
        // Verify session was created
        const session = await getSession()
        if (session?.user?.role === 'admin') {
          toast({
            title: 'Welcome Back!',
            description: 'Successfully logged in as admin.',
          })
          router.push(callbackUrl)
        } else {
          setError('Authentication failed')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-transparent to-purple-50 p-4">
      <div className="w-full max-w-md">
        <LiquidGlassCard
          variant="medium"
          interactive
          className="overflow-hidden"
          blur={10}
          opacity={0.15}
        >
          <Card className="border-0 bg-transparent">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/10">
                <Icons.shield className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Admin Login
              </CardTitle>
              <CardDescription>
                Enter your credentials to access the effect editor
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@liquid-glass-tech.com"
                    className="glass-input"
                    {...register('email')}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    className="glass-input"
                    {...register('password')}
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                {error && (
                  <Alert variant="destructive" className="glass-alert">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full glass-button"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Sign In
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Demo credentials provided for testing
                </p>
              </div>
            </CardContent>
          </Card>
        </LiquidGlassCard>
      </div>
    </div>
  )
}

// Custom CSS classes for glass effects
const styles = `
  .glass-input {
    @apply backdrop-blur-sm bg-white/70 border-white/20 focus:bg-white/90 focus:border-blue-400/40;
  }
  
  .glass-button {
    @apply backdrop-blur-sm bg-blue-600/80 hover:bg-blue-600/90 border-0;
  }
  
  .glass-alert {
    @apply backdrop-blur-sm bg-red-50/80 border-red-200/40;
  }
`