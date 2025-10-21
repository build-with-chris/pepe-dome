'use client'

import { useState, FormEvent } from 'react'
import { getContactContent, getSiteContent } from '@/lib/data'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function ContactPage() {
  const contact = getContactContent()
  const site = getSiteContent()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    privacy: false
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    // TODO: Implement actual form submission
    setTimeout(() => {
      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '', privacy: false })
      setTimeout(() => setStatus('idle'), 3000)
    }, 1000)
  }

  return (
    <div className="section">
      <div className="stage-container">
        <header className="mb-12 text-center">
          <h1 className="display-1 mb-4">{contact.title}</h1>
          <p className="lead text-pepe-t80">{contact.subtitle}</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            {Object.entries(contact.info).map(([key, info]) => (
              <div key={key} className="card p-6">
                <h3 className="h4 mb-3">{info.title}</h3>
                <p className="text-pepe-t80 whitespace-pre-line">{info.content}</p>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="card p-8">
            <h2 className="h3 mb-6">{contact.form.title}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-pepe-t80 mb-2">
                  {contact.form.fields.name}
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={status === 'loading'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-pepe-t80 mb-2">
                  {contact.form.fields.email}
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={status === 'loading'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-pepe-t80 mb-2">
                  {contact.form.fields.subject}
                </label>
                <Input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  disabled={status === 'loading'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-pepe-t80 mb-2">
                  {contact.form.fields.message}
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="input min-h-[150px]"
                  required
                  disabled={status === 'loading'}
                />
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="privacy"
                  checked={formData.privacy}
                  onChange={(e) => setFormData({ ...formData, privacy: e.target.checked })}
                  className="mt-1"
                  required
                  disabled={status === 'loading'}
                />
                <label htmlFor="privacy" className="text-sm text-pepe-t64">
                  {contact.form.fields.privacy}
                </label>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Wird gesendet...' : status === 'success' ? 'Gesendet!' : contact.form.submit}
              </Button>

              {status === 'success' && (
                <p className="text-sm text-pepe-success">
                  Vielen Dank! Wir melden uns bald bei Ihnen.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
