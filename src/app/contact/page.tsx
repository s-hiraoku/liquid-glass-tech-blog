'use client'

import { useState } from 'react'
import { ContactForm } from '@/components/forms/ContactForm'
import { submitContactForm } from '@/lib/api/contact'
import { ContactFormData } from '@/lib/schemas/contact'

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (data: ContactFormData) => {
    setIsLoading(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      await submitContactForm(data)
      setSubmitSuccess(true)
      setSubmitError(null)
    } catch (error) {
      setSubmitError('Failed to send message. Please try again.')
      setSubmitSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-12 md:px-6">
      <div className="mx-auto max-w-2xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Get in touch with us. We'd love to hear from you.
          </p>
        </div>

        {/* Contact Form */}
        <ContactForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitError={submitError}
          submitSuccess={submitSuccess}
        />

        {/* Additional Contact Information */}
        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            We typically respond within 24 hours. For urgent matters, please
            indicate so in your subject line.
          </p>
        </div>
      </div>
    </main>
  )
}