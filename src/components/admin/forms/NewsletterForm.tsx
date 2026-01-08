'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ImageDropzone from '@/components/admin/ui/ImageDropzone'

// Available pages for CTA link
const pageOptions = [
  { value: '', label: 'Keine Seite ausgewählt' },
  { value: '/', label: 'Startseite' },
  { value: '/events', label: 'Events' },
  { value: '/news', label: 'News' },
  { value: '/training', label: 'Training' },
  { value: '/business', label: 'Business' },
  { value: '/about', label: 'Über uns' },
  { value: '/contact', label: 'Kontakt' },
  { value: '/newsletter', label: 'Newsletter Archiv' },
]

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
  heroImageUrl: z.string().optional().or(z.literal('')),
  heroTitle: z.string().max(100, 'Hero-Titel zu lang (max 100 Zeichen)').optional(),
  heroSubtitle: z.string().max(200, 'Hero-Untertitel zu lang (max 200 Zeichen)').optional(),
  heroCTALabel: z.string().max(50, 'CTA-Label zu lang (max 50 Zeichen)').optional(),
  heroCTAUrl: z.string().optional().or(z.literal('')),
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
  /** Render only a specific section: 'basics', 'hero', or 'all' (default) */
  section?: 'basics' | 'hero' | 'all'
}

export default function NewsletterForm({
  newsletter,
  mode,
  initialContent = [],
  section = 'all',
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

  // Render basics section fields
  const renderBasics = () => (
    <div className="space-y-6">
      <div className="space-y-2.5">
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
          inputSize="lg"
        />
        <div className="flex justify-between mt-1.5">
          {errors.subject && (
            <p className="text-sm text-red-400">{errors.subject}</p>
          )}
          <p className="text-xs text-white/40 ml-auto">
            {formData.subject.length}/200
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="preheader">Preheader</Label>
        <Input
          id="preheader"
          value={formData.preheader}
          onChange={(e) => updateField('preheader', e.target.value)}
          hasError={!!errors.preheader}
          placeholder="Vorschau-Text für E-Mail-Clients..."
          maxLength={200}
          inputSize="lg"
        />
        <p className="text-xs text-white/40 mt-1.5">Wird in E-Mail-Vorschauen angezeigt</p>
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="introText">Intro-Text</Label>
        <Textarea
          id="introText"
          value={formData.introText}
          onChange={(e) => updateField('introText', e.target.value)}
          hasError={!!errors.introText}
          rows={4}
          placeholder="Einführungstext für den Newsletter..."
          className="min-h-[120px]"
        />
        {errors.introText && (
          <p className="text-sm text-red-400 mt-1.5">{errors.introText}</p>
        )}
      </div>
    </div>
  )

  // Render hero section fields
  const renderHero = () => (
    <div className="space-y-6">
      <ImageDropzone
        label="Hero-Bild"
        value={formData.heroImageUrl}
        onChange={(url) => updateField('heroImageUrl', url)}
        hasError={!!errors.heroImageUrl}
        error={errors.heroImageUrl}
        placeholder="Bild hier ablegen oder klicken"
      />

      <div className="grid grid-cols-1 gap-5">
        <div className="space-y-2.5">
          <Label htmlFor="heroTitle">Hero-Titel</Label>
          <Input
            id="heroTitle"
            value={formData.heroTitle}
            onChange={(e) => updateField('heroTitle', e.target.value)}
            hasError={!!errors.heroTitle}
            placeholder="Willkommen zu..."
            maxLength={100}
            inputSize="lg"
          />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="heroSubtitle">Hero-Untertitel</Label>
          <Input
            id="heroSubtitle"
            value={formData.heroSubtitle}
            onChange={(e) => updateField('heroSubtitle', e.target.value)}
            hasError={!!errors.heroSubtitle}
            placeholder="Ihre monatlichen Updates"
            maxLength={200}
            inputSize="lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2.5">
          <Label htmlFor="heroCTALabel">CTA-Button Text</Label>
          <Input
            id="heroCTALabel"
            value={formData.heroCTALabel}
            onChange={(e) => updateField('heroCTALabel', e.target.value)}
            hasError={!!errors.heroCTALabel}
            placeholder="Events ansehen"
            maxLength={50}
            inputSize="lg"
          />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="heroCTAUrl">CTA-Button Seite</Label>
          <Select
            value={formData.heroCTAUrl || 'none'}
            onValueChange={(value) => updateField('heroCTAUrl', value === 'none' ? '' : value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Seite auswählen" />
            </SelectTrigger>
            <SelectContent>
              {pageOptions.map((option) => (
                <SelectItem key={option.value || 'none'} value={option.value || 'none'}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  // Render form actions
  const renderActions = (compact = false) => (
    <div className={compact ? 'flex gap-4 mt-8 pt-5 border-t border-white/[0.08]' : 'flex gap-4'}>
      <Button type="submit" variant="primary" size="md" disabled={loading}>
        {loading ? 'Speichern...' : 'Speichern'}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="md"
        onClick={() => router.push('/admin/newsletters')}
      >
        Abbrechen
      </Button>
    </div>
  )

  // Sectioned rendering for split-view layouts
  if (section === 'basics') {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.form && (
          <div className="mb-5 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {errors.form}
          </div>
        )}
        {renderBasics()}
        {renderActions(true)}
      </form>
    )
  }

  if (section === 'hero') {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.form && (
          <div className="mb-5 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {errors.form}
          </div>
        )}
        {renderHero()}
        {renderActions(true)}
      </form>
    )
  }

  // Full form (for create mode or 'all' section)
  return (
    <form onSubmit={handleSubmit}>
      {/* Form-level error */}
      {errors.form && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {errors.form}
        </div>
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,380px] gap-6">
        {/* LEFT COLUMN - Main content */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-6">
              Basis-Informationen
            </h2>
            {renderBasics()}
          </div>

          {/* Hero Section */}
          <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-6">
              Hero-Bereich
            </h2>
            {renderHero()}
          </div>
        </div>

        {/* RIGHT COLUMN - Sidebar */}
        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          {/* Info */}
          <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-6">
              Hinweis
            </h2>
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-[#016dca] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-[13px] text-white/60 leading-relaxed">
                Der Newsletter wird als Entwurf gespeichert. Sie können ihn später bearbeiten,
                eine Vorschau ansehen und dann versenden oder zeitlich planen.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-6">
            <div className="space-y-3">
              <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full">
                {loading
                  ? 'Speichern...'
                  : mode === 'create'
                  ? 'Newsletter erstellen'
                  : 'Änderungen speichern'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => router.push('/admin/newsletters')}
                className="w-full"
              >
                Abbrechen
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
