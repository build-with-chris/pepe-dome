'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import ImageDropzone from '@/components/admin/ui/ImageDropzone'

/**
 * NewsletterForm component
 *
 * Reusable form for creating/editing newsletters.
 * Features:
 * - All newsletter fields (subject, preheader, introText, hero section)
 * - Content block selector for events and articles
 * - Validation with zod
 * - Loading/error states
 */

// Newsletter schema for validation
const newsletterSchema = z.object({
  subject: z.string().min(1, 'Betreff ist erforderlich').max(200, 'Betreff zu lang (max 200 Zeichen)'),
  preheader: z.string().max(200, 'Preheader zu lang (max 200 Zeichen)').optional(),
  introText: z.string().max(2000, 'Intro-Text zu lang (max 2000 Zeichen)').optional(),
  heroImageUrl: z.string().url('Ungultige URL').optional().or(z.literal('')),
  heroTitle: z.string().max(100, 'Hero-Titel zu lang (max 100 Zeichen)').optional(),
  heroSubtitle: z.string().max(200, 'Hero-Untertitel zu lang (max 200 Zeichen)').optional(),
  heroCTALabel: z.string().max(50, 'CTA-Label zu lang (max 50 Zeichen)').optional(),
  heroCTAUrl: z.string().url('Ungultige URL').optional().or(z.literal('')),
})

type NewsletterFormData = z.infer<typeof newsletterSchema>

interface Newsletter {
  id: string
  slug: string
  subject: string
  preheader: string | null
  introText: string | null
  heroImageUrl: string | null
  heroTitle: string | null
  heroSubtitle: string | null
  heroCTALabel: string | null
  heroCTAUrl: string | null
  status: string
  content?: ContentBlock[]
}

interface ContentBlock {
  id?: string
  contentType: string
  contentId: string | null
  sectionHeading?: string | null
  sectionDescription?: string | null
  orderPosition: number
  _metadata?: {
    title: string
    imageUrl?: string
    date?: string
  }
}

interface NewsletterFormProps {
  /** Existing newsletter data for editing */
  newsletter?: Newsletter
  /** Form mode */
  mode: 'create' | 'edit'
  /** Selected content blocks */
  initialContent?: ContentBlock[]
  /** Callback when content changes */
  onContentChange?: (content: ContentBlock[]) => void
}

export default function NewsletterForm({
  newsletter,
  mode,
  initialContent = [],
}: NewsletterFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Form state
  const [formData, setFormData] = useState<NewsletterFormData>({
    subject: newsletter?.subject || '',
    preheader: newsletter?.preheader || '',
    introText: newsletter?.introText || '',
    heroImageUrl: newsletter?.heroImageUrl || '',
    heroTitle: newsletter?.heroTitle || '',
    heroSubtitle: newsletter?.heroSubtitle || '',
    heroCTALabel: newsletter?.heroCTALabel || '',
    heroCTAUrl: newsletter?.heroCTAUrl || '',
  })

  function updateField(field: keyof NewsletterFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    // Clean up empty optional strings
    const cleanedData = {
      ...formData,
      preheader: formData.preheader || undefined,
      introText: formData.introText || undefined,
      heroImageUrl: formData.heroImageUrl || undefined,
      heroTitle: formData.heroTitle || undefined,
      heroSubtitle: formData.heroSubtitle || undefined,
      heroCTALabel: formData.heroCTALabel || undefined,
      heroCTAUrl: formData.heroCTAUrl || undefined,
    }

    // Validate
    const result = newsletterSchema.safeParse(cleanedData)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message
        }
      })
      setErrors(fieldErrors)
      setLoading(false)
      return
    }

    try {
      const url = mode === 'create' ? '/api/admin/newsletters' : `/api/admin/newsletters/${newsletter?.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error?.message || err.error || 'Fehler beim Speichern')
      }

      const responseData = await res.json()
      const newsletterId = responseData.data?.id || newsletter?.id

      // If creating new newsletter with content, save content associations
      if (mode === 'create' && initialContent.length > 0 && newsletterId) {
        for (const content of initialContent) {
          await fetch(`/api/admin/newsletters/${newsletterId}/content`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(content),
          })
        }
      }

      router.push('/admin/newsletters')
      router.refresh()
    } catch (err) {
      setErrors({
        form: err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Form-level error */}
      {errors.form && (
        <div className="p-4 bg-[var(--pepe-error)]/10 border border-[var(--pepe-error)]/20 rounded-lg text-[var(--pepe-error)]">
          {errors.form}
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-[var(--pepe-white)] mb-4">
          Basis-Informationen
        </h2>

        <div className="space-y-2">
          <Label htmlFor="subject" hasError={!!errors.subject} required>
            Betreff
          </Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => updateField('subject', e.target.value)}
            hasError={!!errors.subject}
            placeholder="Newsletter-Betreffzeile"
            maxLength={200}
          />
          <div className="flex justify-between">
            {errors.subject && (
              <p className="text-sm text-[var(--pepe-error)]">{errors.subject}</p>
            )}
            <p className="text-xs text-[var(--pepe-t48)] ml-auto">
              {formData.subject.length}/200 Zeichen
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="preheader">
            Preheader
          </Label>
          <Input
            id="preheader"
            value={formData.preheader}
            onChange={(e) => updateField('preheader', e.target.value)}
            hasError={!!errors.preheader}
            placeholder="Vorschau-Text fur E-Mail-Clients..."
            maxLength={200}
          />
          <div className="flex justify-between">
            {errors.preheader && (
              <p className="text-sm text-[var(--pepe-error)]">{errors.preheader}</p>
            )}
            <p className="text-xs text-[var(--pepe-t48)] ml-auto">
              {(formData.preheader || '').length}/200 Zeichen - Wird in E-Mail-Vorschauen angezeigt
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="introText">
            Intro-Text
          </Label>
          <Textarea
            id="introText"
            value={formData.introText}
            onChange={(e) => updateField('introText', e.target.value)}
            hasError={!!errors.introText}
            rows={4}
            placeholder="Einfuhrungstext fur den Newsletter..."
          />
          {errors.introText && (
            <p className="text-sm text-[var(--pepe-error)]">{errors.introText}</p>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-[var(--pepe-white)] mb-4">
          Hero-Bereich
        </h2>

        <div className="space-y-2">
          <Label htmlFor="heroImageUrl">Hero-Bild URL</Label>
          <Input
            id="heroImageUrl"
            type="url"
            value={formData.heroImageUrl}
            onChange={(e) => updateField('heroImageUrl', e.target.value)}
            hasError={!!errors.heroImageUrl}
            placeholder="https://..."
          />
          {errors.heroImageUrl && (
            <p className="text-sm text-[var(--pepe-error)]">{errors.heroImageUrl}</p>
          )}
          {formData.heroImageUrl && (
            <div className="mt-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={formData.heroImageUrl}
                alt="Hero preview"
                className="max-h-40 rounded border border-[var(--pepe-line)]"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="heroTitle">Hero-Titel</Label>
            <Input
              id="heroTitle"
              value={formData.heroTitle}
              onChange={(e) => updateField('heroTitle', e.target.value)}
              hasError={!!errors.heroTitle}
              placeholder="Willkommen zu..."
              maxLength={100}
            />
            {errors.heroTitle && (
              <p className="text-sm text-[var(--pepe-error)]">{errors.heroTitle}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroSubtitle">Hero-Untertitel</Label>
            <Input
              id="heroSubtitle"
              value={formData.heroSubtitle}
              onChange={(e) => updateField('heroSubtitle', e.target.value)}
              hasError={!!errors.heroSubtitle}
              placeholder="Ihre monatlichen Updates"
              maxLength={200}
            />
            {errors.heroSubtitle && (
              <p className="text-sm text-[var(--pepe-error)]">{errors.heroSubtitle}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="heroCTALabel">CTA-Button Label</Label>
            <Input
              id="heroCTALabel"
              value={formData.heroCTALabel}
              onChange={(e) => updateField('heroCTALabel', e.target.value)}
              hasError={!!errors.heroCTALabel}
              placeholder="Events ansehen"
              maxLength={50}
            />
            {errors.heroCTALabel && (
              <p className="text-sm text-[var(--pepe-error)]">{errors.heroCTALabel}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroCTAUrl">CTA-Button URL</Label>
            <Input
              id="heroCTAUrl"
              type="url"
              value={formData.heroCTAUrl}
              onChange={(e) => updateField('heroCTAUrl', e.target.value)}
              hasError={!!errors.heroCTAUrl}
              placeholder="https://..."
            />
            {errors.heroCTAUrl && (
              <p className="text-sm text-[var(--pepe-error)]">{errors.heroCTAUrl}</p>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading
            ? 'Speichern...'
            : mode === 'create'
            ? 'Newsletter erstellen'
            : 'Anderungen speichern'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/admin/newsletters')}
        >
          Abbrechen
        </Button>
      </div>
    </form>
  )
}
