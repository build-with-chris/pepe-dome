/**
 * Newsletter Form Component
 * Main form for creating and editing newsletters
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import HeroImageUpload from './HeroImageUpload'
import ContentSelector from './ContentSelector'
import DragDropReorder from './DragDropReorder'

interface NewsletterFormData {
  subject: string
  preheader: string
  heroTitle: string
  heroSubtitle: string
  heroCTALabel: string
  heroCTAUrl: string
  heroImageUrl?: string
}

interface NewsletterFormProps {
  newsletter?: any
  isEditing?: boolean
}

export default function NewsletterForm({
  newsletter,
  isEditing = false,
}: NewsletterFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<NewsletterFormData>({
    subject: newsletter?.subject || '',
    preheader: newsletter?.preheader || '',
    heroTitle: newsletter?.heroTitle || '',
    heroSubtitle: newsletter?.heroSubtitle || '',
    heroCTALabel: newsletter?.heroCTALabel || '',
    heroCTAUrl: newsletter?.heroCTAUrl || '',
    heroImageUrl: newsletter?.heroImageUrl || '',
  })

  const [selectedContent, setSelectedContent] = useState<any[]>(
    newsletter?.content || []
  )

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, heroImageUrl: url }))
  }

  const handleSaveDraft = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const endpoint = isEditing
        ? `/api/admin/newsletters/${newsletter.id}`
        : '/api/admin/newsletters'

      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to save newsletter')
      }

      // If creating new newsletter, save content associations
      if (!isEditing && selectedContent.length > 0) {
        await saveContentAssociations(result.data.id)
      }

      router.push(`/admin/newsletters/${result.data.id}/edit`)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const saveContentAssociations = async (newsletterId: string) => {
    for (const content of selectedContent) {
      await fetch(`/api/admin/newsletters/${newsletterId}/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Error Message */}
      {error && (
        <div className="card bg-pepe-error-bg border-pepe-error p-4">
          <p className="text-pepe-error">{error}</p>
        </div>
      )}

      {/* Basic Information */}
      <section className="card p-6">
        <h2 className="text-2xl font-semibold mb-6">Basic Information</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="subject" className="form-label">
              Subject Line *
            </label>
            <Input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Your newsletter subject..."
              required
              maxLength={200}
            />
            <p className="form-hint">
              {formData.subject.length}/200 characters
            </p>
          </div>

          <div>
            <label htmlFor="preheader" className="form-label">
              Preheader Text
            </label>
            <Input
              id="preheader"
              name="preheader"
              type="text"
              value={formData.preheader}
              onChange={handleInputChange}
              placeholder="Preview text shown in inbox..."
              maxLength={200}
            />
            <p className="form-hint">
              {formData.preheader.length}/200 characters - Shows up in email
              previews
            </p>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="card p-6">
        <h2 className="text-2xl font-semibold mb-6">Hero Section</h2>

        <div className="space-y-6">
          <HeroImageUpload
            currentImage={formData.heroImageUrl}
            onUpload={handleImageUpload}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="heroTitle" className="form-label">
                Hero Title
              </label>
              <Input
                id="heroTitle"
                name="heroTitle"
                type="text"
                value={formData.heroTitle}
                onChange={handleInputChange}
                placeholder="Welcome to..."
                maxLength={100}
              />
            </div>

            <div>
              <label htmlFor="heroSubtitle" className="form-label">
                Hero Subtitle
              </label>
              <Input
                id="heroSubtitle"
                name="heroSubtitle"
                type="text"
                value={formData.heroSubtitle}
                onChange={handleInputChange}
                placeholder="Your monthly update"
                maxLength={200}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="heroCTALabel" className="form-label">
                CTA Button Label
              </label>
              <Input
                id="heroCTALabel"
                name="heroCTALabel"
                type="text"
                value={formData.heroCTALabel}
                onChange={handleInputChange}
                placeholder="View Events"
                maxLength={50}
              />
            </div>

            <div>
              <label htmlFor="heroCTAUrl" className="form-label">
                CTA Button URL
              </label>
              <Input
                id="heroCTAUrl"
                name="heroCTAUrl"
                type="url"
                value={formData.heroCTAUrl}
                onChange={handleInputChange}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content Selection */}
      <section className="card p-6">
        <h2 className="text-2xl font-semibold mb-6">Newsletter Content</h2>

        {selectedContent.length === 0 ? (
          <ContentSelector
            onContentSelected={setSelectedContent}
            selectedContent={selectedContent}
          />
        ) : (
          <div className="space-y-4">
            <DragDropReorder
              items={selectedContent}
              onReorder={setSelectedContent}
            />

            <Button
              variant="secondary"
              onClick={() => setSelectedContent([])}
              size="sm"
            >
              Change Content Selection
            </Button>
          </div>
        )}
      </section>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>

        <div className="flex gap-3">
          <Button
            variant="primary"
            onClick={handleSaveDraft}
            disabled={isLoading || !formData.subject}
            size="lg"
          >
            {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Save Draft'}
          </Button>
        </div>
      </div>
    </div>
  )
}
