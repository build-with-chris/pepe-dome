/**
 * Newsletter Signup Form Tests
 * Task 7.1.1: Write 2-8 focused tests for signup forms
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import SignupForm from '@/components/newsletter/SignupForm'

// Mock fetch
global.fetch = vi.fn()

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('SignupForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: { id: '123', email: 'test@example.com', status: 'PENDING' },
      }),
    })
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('renders simple variant with email input only', () => {
    render(<SignupForm variant="simple" />)

    expect(screen.getByPlaceholderText(/deine@email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /abonnieren/i })).toBeInTheDocument()
    expect(screen.queryByPlaceholderText(/max/i)).not.toBeInTheDocument()
  })

  it('renders extended variant with name and interests', () => {
    render(<SignupForm variant="extended" />)

    expect(screen.getByPlaceholderText(/deine@email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/max/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Shows & Events/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Workshops & Community/i)).toBeInTheDocument()
  })

  it('submits form and shows success message', async () => {
    render(<SignupForm variant="simple" />)

    const emailInput = screen.getByPlaceholderText(/deine@email/i)
    const submitButton = screen.getByRole('button', { name: /abonnieren/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/subscribers',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      )
    })
    // Auf den Inhalt prüfen, nicht auf die Reihenfolge der Schlüssel: das
    // Formular schickt inzwischen auch Herkunft und Einwilligung mit.
    expect(JSON.parse((global.fetch as any).mock.calls[0][1].body)).toMatchObject({
      email: 'test@example.com',
    })

    await waitFor(() => {
      expect(screen.getByText(/Schau in dein Postfach/i)).toBeInTheDocument()
    })
  })

  it('shows error message on API failure', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: { code: 'ALREADY_SUBSCRIBED', message: 'Email already subscribed' },
      }),
    })

    render(<SignupForm variant="simple" />)

    const emailInput = screen.getByPlaceholderText(/deine@email/i)
    const submitButton = screen.getByRole('button', { name: /abonnieren/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/already subscribed/i)).toBeInTheDocument()
    })
  })

  it('detects returning subscriber from localStorage', () => {
    localStorageMock.setItem('newsletter_subscribed', 'true')

    render(<SignupForm variant="simple" />)

    expect(screen.getByText(/du bist schon dabei/i)).toBeInTheDocument()
    expect(screen.queryByPlaceholderText(/deine@email/i)).not.toBeInTheDocument()
  })

  it('allows dismissing returning subscriber message', () => {
    localStorageMock.setItem('newsletter_subscribed', 'true')

    render(<SignupForm variant="simple" />)

    const dismissButton = screen.getByRole('button', { name: /trotzdem anmelden/i })
    fireEvent.click(dismissButton)

    expect(screen.getByPlaceholderText(/deine@email/i)).toBeInTheDocument()
    expect(screen.queryByText(/du bist schon dabei/i)).not.toBeInTheDocument()
  })

  it('submits extended form with interests', async () => {
    render(<SignupForm variant="extended" />)

    const emailInput = screen.getByPlaceholderText(/deine@email/i)
    const nameInput = screen.getByPlaceholderText(/max/i)
    const eventsCheckbox = screen.getByLabelText(/Shows & Events/i)
    const submitButton = screen.getByRole('button', { name: /abonnieren/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(nameInput, { target: { value: 'Max' } })
    fireEvent.click(eventsCheckbox)
    fireEvent.click(submitButton)

    await waitFor(() => expect(global.fetch).toHaveBeenCalled())
    expect(JSON.parse((global.fetch as any).mock.calls[0][1].body)).toMatchObject({
      email: 'test@example.com',
      firstName: 'Max',
      interests: ['shows-events'],
      source: 'newsletter-page',
    })
  })

  it('schickt die Marketing-Einwilligung und die Herkunft an den Server mit', async () => {
    // Ohne diesen Vermerk kann die Bestätigung später nicht gemeldet werden:
    // der Link in der Mail wird meist in einem anderen Browser geöffnet.
    localStorageMock.setItem(
      'pepe_consent',
      JSON.stringify({ analytics: false, marketing: true, version: 1, updatedAt: '2026-08-01' })
    )

    render(<SignupForm source="footer" />)
    const emailInput = screen.getByPlaceholderText(/deine@email.com/i)
    fireEvent.change(emailInput, { target: { value: 'anna@example.de' } })
    fireEvent.submit(emailInput.closest('form')!)

    await waitFor(() => expect(global.fetch).toHaveBeenCalled())
    const body = JSON.parse((global.fetch as any).mock.calls[0][1].body)
    expect(body).toMatchObject({
      email: 'anna@example.de',
      trackingConsent: true,
      source: 'footer',
    })
  })

  it('meldet ohne Einwilligung keine zu', async () => {
    render(<SignupForm />)
    const emailInput = screen.getByPlaceholderText(/deine@email.com/i)
    fireEvent.change(emailInput, { target: { value: 'anna@example.de' } })
    fireEvent.submit(emailInput.closest('form')!)

    await waitFor(() => expect(global.fetch).toHaveBeenCalled())
    const body = JSON.parse((global.fetch as any).mock.calls[0][1].body)
    expect(body.trackingConsent).toBe(false)
  })

  it('validates email format and shows error message', async () => {
    render(<SignupForm variant="simple" />)

    const emailInput = screen.getByPlaceholderText(/deine@email/i)
    const submitButton = screen.getByRole('button', { name: /abonnieren/i })

    // Submit with invalid email format
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.submit(emailInput.closest('form')!)

    // Wait for validation error to appear
    await waitFor(() => {
      const errorElement = screen.queryByText(/gültige E-Mail/i)
      expect(errorElement).toBeInTheDocument()
    }, { timeout: 2000 })

    // Ensure API was not called
    expect(global.fetch).not.toHaveBeenCalled()
  })
})
