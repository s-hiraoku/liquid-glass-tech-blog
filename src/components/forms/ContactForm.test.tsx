import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ContactForm } from './ContactForm'

describe('ContactForm Component', () => {
  const mockOnSubmit = vi.fn()
  const defaultProps = {
    onSubmit: mockOnSubmit,
    isLoading: false,
    submitError: null,
    submitSuccess: false
  }

  beforeEach(() => {
    mockOnSubmit.mockReset()
  })

  describe('Component Rendering', () => {
    it('renders all form fields with proper labels', () => {
      render(<ContactForm {...defaultProps} />)
      
      expect(screen.getByLabelText('Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
      expect(screen.getByLabelText('Subject')).toBeInTheDocument()
      expect(screen.getByLabelText('Message')).toBeInTheDocument()
    })

    it('renders submit button with correct text', () => {
      render(<ContactForm {...defaultProps} />)
      
      expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument()
    })

    it('applies liquid glass styling to form container', () => {
      render(<ContactForm {...defaultProps} />)
      
      const form = screen.getByRole('form')
      expect(form).toHaveClass('liquid-glass')
    })
  })

  describe('Form Validation Schema', () => {
    it('validates required fields', async () => {
      const user = userEvent.setup()
      render(<ContactForm {...defaultProps} />)
      
      const submitButton = screen.getByRole('button', { name: 'Send Message' })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument()
        expect(screen.getByText('Email is required')).toBeInTheDocument()
        expect(screen.getByText('Subject is required')).toBeInTheDocument()
        expect(screen.getByText('Message is required')).toBeInTheDocument()
      })
      
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('validates email format on form submission', async () => {
      const user = userEvent.setup()
      render(<ContactForm {...defaultProps} />)
      
      // Fill in other required fields
      await user.type(screen.getByLabelText('Name'), 'John Doe')
      await user.type(screen.getByLabelText('Subject'), 'Test Subject')
      await user.type(screen.getByLabelText('Message'), 'This is a test message with enough characters.')
      
      // Enter invalid email
      const emailInput = screen.getByLabelText('Email')
      await user.type(emailInput, 'invalid-email')
      
      const submitButton = screen.getByRole('button', { name: 'Send Message' })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
      })
      
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('validates name length constraints on form submission', async () => {
      const user = userEvent.setup()
      render(<ContactForm {...defaultProps} />)
      
      // Fill other required fields
      await user.type(screen.getByLabelText('Email'), 'test@example.com')
      await user.type(screen.getByLabelText('Subject'), 'Test Subject')  
      await user.type(screen.getByLabelText('Message'), 'This is a test message with enough characters.')
      
      const nameInput = screen.getByLabelText('Name')
      const submitButton = screen.getByRole('button', { name: 'Send Message' })
      
      // Test minimum length
      await user.type(nameInput, 'A')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument()
      })
      
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('validates subject length constraints on form submission', async () => {
      const user = userEvent.setup()
      render(<ContactForm {...defaultProps} />)
      
      const subjectInput = screen.getByLabelText('Subject')
      const submitButton = screen.getByRole('button', { name: 'Send Message' })
      
      // Test minimum length
      await user.type(subjectInput, 'Hi')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Subject must be at least 5 characters')).toBeInTheDocument()
      })
    })

    it('validates message length constraints on form submission', async () => {
      const user = userEvent.setup()
      render(<ContactForm {...defaultProps} />)
      
      const messageInput = screen.getByLabelText('Message')
      const submitButton = screen.getByRole('button', { name: 'Send Message' })
      
      // Test minimum length
      await user.type(messageInput, 'Short')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Message must be at least 10 characters')).toBeInTheDocument()
      })
    })
  })

  describe('Form Interaction', () => {
    it('calls onSubmit with form data when valid', async () => {
      const user = userEvent.setup()
      render(<ContactForm {...defaultProps} />)
      
      await user.type(screen.getByLabelText('Name'), 'John Doe')
      await user.type(screen.getByLabelText('Email'), 'john@example.com')
      await user.type(screen.getByLabelText('Subject'), 'Test Subject')
      await user.type(screen.getByLabelText('Message'), 'This is a test message with sufficient length.')
      
      const submitButton = screen.getByRole('button', { name: 'Send Message' })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Test Subject',
          message: 'This is a test message with sufficient length.'
        })
      })
    })

    it('shows loading state when isLoading prop is true', () => {
      render(<ContactForm {...defaultProps} isLoading={true} />)
      
      const submitButton = screen.getByRole('button')
      expect(submitButton).toBeDisabled()
      expect(screen.getByText('Sending...')).toBeInTheDocument()
    })

    it('displays submit error when provided', () => {
      render(<ContactForm {...defaultProps} submitError="Network error occurred" />)
      
      expect(screen.getByText('Network error occurred')).toBeInTheDocument()
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('displays success message when submitSuccess is true', () => {
      render(<ContactForm {...defaultProps} submitSuccess={true} />)
      
      expect(screen.getByText('Message sent successfully! We\'ll get back to you soon.')).toBeInTheDocument()
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  describe('Accessibility Features', () => {
    it('has proper ARIA attributes for form validation', async () => {
      const user = userEvent.setup()
      render(<ContactForm {...defaultProps} />)
      
      const nameInput = screen.getByLabelText('Name')
      const emailInput = screen.getByLabelText('Email')
      
      // Initially valid
      expect(nameInput).toHaveAttribute('aria-invalid', 'false')
      expect(emailInput).toHaveAttribute('aria-invalid', 'false')
      
      // Trigger validation errors
      const submitButton = screen.getByRole('button', { name: 'Send Message' })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(nameInput).toHaveAttribute('aria-invalid', 'true')
        expect(emailInput).toHaveAttribute('aria-invalid', 'true')
      })
    })

    it('has proper aria-describedby for form fields with errors', async () => {
      const user = userEvent.setup()
      render(<ContactForm {...defaultProps} />)
      
      const submitButton = screen.getByRole('button', { name: 'Send Message' })
      await user.click(submitButton)
      
      await waitFor(() => {
        const nameInput = screen.getByLabelText('Name')
        const nameErrorId = nameInput.getAttribute('aria-describedby')
        expect(nameErrorId).toBeTruthy()
        expect(document.getElementById(nameErrorId!)).toBeInTheDocument()
      })
    })

    it('has proper field labeling and structure', () => {
      render(<ContactForm {...defaultProps} />)
      
      // Check that all form fields have proper labels
      expect(screen.getByLabelText('Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
      expect(screen.getByLabelText('Subject')).toBeInTheDocument()
      expect(screen.getByLabelText('Message')).toBeInTheDocument()
      
      // Check for form landmark
      expect(screen.getByRole('form')).toBeInTheDocument()
    })

    it('provides helpful placeholder text', () => {
      render(<ContactForm {...defaultProps} />)
      
      expect(screen.getByPlaceholderText('Your full name')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('your.email@example.com')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('What is this about?')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Your message...')).toBeInTheDocument()
    })
  })

  describe('Liquid Glass Styling', () => {
    it('applies correct liquid glass classes to form container', () => {
      render(<ContactForm {...defaultProps} />)
      
      const form = screen.getByRole('form')
      expect(form).toHaveClass('liquid-glass', 'glass-medium')
    })

    it('applies glass variant styles to submit button', () => {
      render(<ContactForm {...defaultProps} />)
      
      const submitButton = screen.getByRole('button', { name: 'Send Message' })
      // Check for liquid glass styling rather than specific class name
      expect(submitButton).toHaveClass('bg-white/10', 'backdrop-blur-md', 'border-white/20')
    })

    it('has responsive padding and spacing', () => {
      render(<ContactForm {...defaultProps} />)
      
      const form = screen.getByRole('form')
      expect(form).toHaveClass('p-6', 'md:p-8')
    })
  })
})