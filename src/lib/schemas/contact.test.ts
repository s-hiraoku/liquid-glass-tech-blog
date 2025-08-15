import { describe, it, expect } from 'vitest'
import { contactFormSchema, type ContactFormData } from './contact'

describe('Contact Form Schema', () => {
  describe('Valid Data', () => {
    it('validates correct contact form data', () => {
      const validData: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a valid message with enough characters to meet the minimum requirement.'
      }

      const result = contactFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })

    it('validates minimum valid lengths', () => {
      const validData: ContactFormData = {
        name: 'Jo', // 2 characters (minimum)
        email: 'a@b.co', // valid email
        subject: 'Hello', // 5 characters (minimum)
        message: 'Valid msg.' // 10 characters (minimum)
      }

      const result = contactFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('trims whitespace from input fields', () => {
      const dataWithWhitespace: ContactFormData = {
        name: '  John Doe  ',
        email: '  john@example.com  ',
        subject: '  Test Subject  ',
        message: '  This is a valid message with enough characters.  '
      }

      const result = contactFormSchema.safeParse(dataWithWhitespace)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual({
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Test Subject',
          message: 'This is a valid message with enough characters.'
        })
      }
    })
  })

  describe('Invalid Data - Required Fields', () => {
    it('rejects empty name field', () => {
      const invalidData = {
        name: '',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a valid message.'
      }

      const result = contactFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['name'],
            message: 'Name is required'
          })
        )
      }
    })

    it('rejects empty email field', () => {
      const invalidData = {
        name: 'John Doe',
        email: '',
        subject: 'Test Subject',
        message: 'This is a valid message.'
      }

      const result = contactFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['email'],
            message: 'Email is required'
          })
        )
      }
    })

    it('rejects empty subject field', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: '',
        message: 'This is a valid message.'
      }

      const result = contactFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['subject'],
            message: 'Subject is required'
          })
        )
      }
    })

    it('rejects empty message field', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: ''
      }

      const result = contactFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['message'],
            message: 'Message is required'
          })
        )
      }
    })
  })

  describe('Invalid Data - Field Length Constraints', () => {
    it('rejects name shorter than 2 characters', () => {
      const invalidData = {
        name: 'J',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a valid message.'
      }

      const result = contactFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['name'],
            message: 'Name must be at least 2 characters'
          })
        )
      }
    })

    it('rejects name longer than 100 characters', () => {
      const invalidData = {
        name: 'A'.repeat(101),
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a valid message.'
      }

      const result = contactFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['name'],
            message: 'Name must be less than 100 characters'
          })
        )
      }
    })

    it('rejects subject shorter than 5 characters', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Hi',
        message: 'This is a valid message.'
      }

      const result = contactFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['subject'],
            message: 'Subject must be at least 5 characters'
          })
        )
      }
    })

    it('rejects subject longer than 200 characters', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'A'.repeat(201),
        message: 'This is a valid message.'
      }

      const result = contactFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['subject'],
            message: 'Subject must be less than 200 characters'
          })
        )
      }
    })

    it('rejects message shorter than 10 characters', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Hi there'
      }

      const result = contactFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['message'],
            message: 'Message must be at least 10 characters'
          })
        )
      }
    })

    it('rejects message longer than 1000 characters', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'A'.repeat(1001)
      }

      const result = contactFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toContainEqual(
          expect.objectContaining({
            path: ['message'],
            message: 'Message must be less than 1000 characters'
          })
        )
      }
    })
  })

  describe('Invalid Email Format', () => {
    it('rejects invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        'invalid@',
        '@invalid.com',
        'invalid..email@example.com',
        'invalid@.com',
        'invalid@com',
        'invalid email@example.com'
      ]

      invalidEmails.forEach(email => {
        const invalidData = {
          name: 'John Doe',
          email,
          subject: 'Test Subject',
          message: 'This is a valid message.'
        }

        const result = contactFormSchema.safeParse(invalidData)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues).toContainEqual(
            expect.objectContaining({
              path: ['email'],
              message: 'Please enter a valid email address'
            })
          )
        }
      })
    })

    it('accepts valid email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.com',
        'user+tag@example.com',
        'user123@example-site.co.uk',
        'a@b.co'
      ]

      validEmails.forEach(email => {
        const validData = {
          name: 'John Doe',
          email,
          subject: 'Test Subject',
          message: 'This is a valid message with enough characters.'
        }

        const result = contactFormSchema.safeParse(validData)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('Missing Fields', () => {
    it('rejects data with missing required fields', () => {
      const incompleteData = {
        name: 'John Doe',
        email: 'john@example.com'
        // missing subject and message
      }

      const result = contactFormSchema.safeParse(incompleteData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThanOrEqual(2)
      }
    })
  })

  describe('Type Safety', () => {
    it('provides proper TypeScript type for valid data', () => {
      const validData: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a valid message.'
      }

      // This test passes if the TypeScript compilation succeeds
      expect(validData.name).toBe('John Doe')
      expect(validData.email).toBe('john@example.com')
      expect(validData.subject).toBe('Test Subject')
      expect(validData.message).toBe('This is a valid message.')
    })
  })
})