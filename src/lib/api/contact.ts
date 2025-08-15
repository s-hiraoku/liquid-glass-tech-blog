import { ContactFormData } from '../schemas/contact'

export interface ContactSubmissionResponse {
  success: boolean
  message?: string
}

export async function submitContactForm(data: ContactFormData): Promise<ContactSubmissionResponse> {
  // Minimal implementation - in real app this would call an API endpoint
  // For now, simulate network delay and return success
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Simple validation - if all fields are provided, consider it successful
  if (data.name && data.email && data.subject && data.message) {
    return { success: true, message: 'Message sent successfully' }
  }
  
  throw new Error('Invalid form data')
}