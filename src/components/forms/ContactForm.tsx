'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactFormSchema, type ContactFormData } from '@/lib/schemas/contact'
import { cn, applyLiquidGlassTheme } from '@/lib/utils'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => void | Promise<void>
  isLoading?: boolean
  submitError?: string | null
  submitSuccess?: boolean
}

export function ContactForm({
  onSubmit,
  isLoading = false,
  submitError = null,
  submitSuccess = false
}: ContactFormProps) {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  })

  const handleSubmit = async (data: ContactFormData) => {
    try {
      await onSubmit(data)
    } catch (error) {
      // Error handling is managed by parent component
    }
  }

  // Reset form when submitSuccess changes to true
  useEffect(() => {
    if (submitSuccess) {
      form.reset()
    }
  }, [submitSuccess, form])

  const formContainerClasses = applyLiquidGlassTheme(
    'rounded-lg border p-6 md:p-8 space-y-6',
    'medium',
    'liquid-glass glass-medium'
  )

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn(formContainerClasses, 'space-y-6')}
        role="form"
        aria-label="Contact form"
      >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your full name"
                    {...field}
                    aria-invalid={!!form.formState.errors.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    {...field}
                    aria-invalid={!!form.formState.errors.email}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input
                    placeholder="What is this about?"
                    {...field}
                    aria-invalid={!!form.formState.errors.subject}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Your message..."
                    rows={5}
                    {...field}
                    aria-invalid={!!form.formState.errors.message}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {submitError && (
            <div
              role="alert"
              className="text-destructive text-sm bg-destructive/10 border border-destructive/20 rounded-md p-3"
            >
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div
              role="alert"
              className="text-green-600 text-sm bg-green-50 border border-green-200 rounded-md p-3"
            >
              Message sent successfully! We'll get back to you soon.
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            variant="glass-medium"
            className="w-full"
          >
            {isLoading ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </Form>
  )
}