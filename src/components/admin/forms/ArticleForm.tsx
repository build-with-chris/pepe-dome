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
import { Switch } from '@/components/ui/switch'
import ImageDropzone from '@/components/admin/ui/ImageDropzone'

/**
 * ArticleForm component
 *
 * Reusable form for creating/editing articles.
 * Features:
 * - All article fields
 * - Auto-generate slug from title
 * - Markdown/rich text content area
 * - Tags management
 * - Validation with zod
 */

// Article schema for validation
const articleSchema = z.object({
  title: z.string().min(1, 'Titel ist erforderlich'),
  slug: z.string().optional(),
  excerpt: z.string().min(1, 'Kurzbeschreibung ist erforderlich'),
  content: z.string().min(1, 'Inhalt ist erforderlich'),
  category: z.string().min(1, 'Kategorie ist erforderlich'),
  author: z.string().min(1, 'Autor ist erforderlich'),
  imageUrl: z.string().optional().or(z.literal('')),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  status: z.string().default('DRAFT'),
})

type ArticleFormData = z.infer<typeof articleSchema>

interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  imageUrl: string | null
  tags: string[]
  featured: boolean
  status: string
}

interface ArticleFormProps {
  /** Existing article data for editing */
  article?: Article
  /** Form mode */
  mode: 'create' | 'edit'
}

const categories = [
  { value: 'Announcement', label: 'Announcement' },
  { value: 'News', label: 'News' },
  { value: 'Feature', label: 'Feature Story' },
  { value: 'Interview', label: 'Interview' },
  { value: 'Review', label: 'Review' },
  { value: 'Behind the Scenes', label: 'Behind the Scenes' },
  { value: 'Events', label: 'Events' },
  { value: 'Community', label: 'Community' },
]

const statusOptions = [
  { value: 'DRAFT', label: 'Entwurf' },
  { value: 'PUBLISHED', label: 'Veroffentlicht' },
  { value: 'ARCHIVED', label: 'Archiviert' },
]

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[aAe]/g, 'ae')
    .replace(/[oOe]/g, 'oe')
    .replace(/[uUe]/g, 'ue')
    .replace(/[ss]/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function ArticleForm({ article, mode }: ArticleFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [tagInput, setTagInput] = useState('')

  // Form state
  const [formData, setFormData] = useState<Partial<ArticleFormData>>({
    title: article?.title || '',
    slug: article?.slug || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    category: article?.category || 'News',
    author: article?.author || '',
    imageUrl: article?.imageUrl || '',
    tags: article?.tags || [],
    featured: article?.featured || false,
    status: article?.status || 'DRAFT',
  })

  function updateField(field: keyof ArticleFormData, value: unknown) {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }

      // Auto-generate slug when title changes in create mode
      if (field === 'title' && mode === 'create') {
        updated.slug = generateSlug(value as string)
      }

      return updated
    })

    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function addTag() {
    if (!tagInput.trim()) return
    const newTag = tagInput.trim()
    if (!formData.tags?.includes(newTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag],
      }))
    }
    setTagInput('')
  }

  function removeTag(tag: string) {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag) || [],
    }))
  }

  function handleTagKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    // Validate
    const result = articleSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message
        }
      })
      setErrors(fieldErrors)
      setLoading(false)
      return
    }

    try {
      const url = mode === 'create' ? '/api/admin/articles' : `/api/admin/articles/${article?.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      })

      if (!res.ok) {
        const text = await res.text()
        let err: { error?: string } = {}
        try {
          err = text ? JSON.parse(text) : {}
        } catch {
          setErrors({ form: `Fehler ${res.status}: ${text.slice(0, 100)}` })
          return
        }
        throw new Error(err.error || 'Fehler beim Speichern')
      }

      router.push('/admin/articles')
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

            <div className="space-y-5">
              <div className="space-y-2.5">
                <Label htmlFor="title" hasError={!!errors.title} required>
                  Titel
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  hasError={!!errors.title}
                  placeholder="Artikel-Titel"
                  inputSize="lg"
                />
                {errors.title && (
                  <p className="text-sm text-red-400">{errors.title}</p>
                )}
              </div>

              {mode === 'create' && (
                <div className="space-y-2.5">
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => updateField('slug', e.target.value)}
                    placeholder="artikel-url-slug"
                    className="font-mono text-sm"
                    inputSize="lg"
                  />
                  <p className="text-[11px] text-white/40">
                    Wird automatisch aus dem Titel generiert
                  </p>
                </div>
              )}

              <div className="space-y-2.5">
                <Label htmlFor="excerpt" hasError={!!errors.excerpt} required>
                  Kurzbeschreibung
                </Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => updateField('excerpt', e.target.value)}
                  hasError={!!errors.excerpt}
                  rows={3}
                  placeholder="Kurze Beschreibung fur Vorschauen..."
                  className="min-h-[100px]"
                />
                {errors.excerpt && (
                  <p className="text-sm text-red-400">{errors.excerpt}</p>
                )}
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="author" hasError={!!errors.author} required>
                  Autor
                </Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => updateField('author', e.target.value)}
                  hasError={!!errors.author}
                  placeholder="Autor Name"
                  inputSize="lg"
                />
                {errors.author && (
                  <p className="text-sm text-red-400">{errors.author}</p>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-6">
              Inhalt
            </h2>

            <div className="space-y-2.5">
              <Label htmlFor="content" hasError={!!errors.content} required>
                Artikel-Inhalt (Markdown)
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => updateField('content', e.target.value)}
                hasError={!!errors.content}
                rows={20}
                placeholder="Artikel-Inhalt in Markdown..."
                className="font-mono text-sm min-h-[400px]"
              />
              {errors.content && (
                <p className="text-sm text-red-400">{errors.content}</p>
              )}
              <p className="text-[11px] text-white/40">
                Markdown: **fett**, *kursiv*, # Uberschriften, - Listen
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-6">
              Tags
            </h2>

            <div className="space-y-4">
              <div className="flex gap-3">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Tag hinzufugen..."
                  className="flex-1"
                  inputSize="lg"
                />
                <Button type="button" variant="secondary" size="md" onClick={addTag}>
                  Hinzufugen
                </Button>
              </div>
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 text-white/80 text-sm rounded-lg border border-white/[0.08]"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-white/40 hover:text-red-400 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Sidebar */}
        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          {/* Image */}
          <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-6">
              Artikel-Bild
            </h2>

            <ImageDropzone
              value={formData.imageUrl}
              onChange={(url) => updateField('imageUrl', url)}
              hasError={!!errors.imageUrl}
              error={errors.imageUrl}
              placeholder="Bild hier ablegen"
            />
          </div>

          {/* Settings */}
          <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-6">
              Einstellungen
            </h2>

            <div className="space-y-5">
              <div className="space-y-2.5">
                <Label htmlFor="category" hasError={!!errors.category} required>
                  Kategorie
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => updateField('category', value)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Kategorie wahlen" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => updateField('status', value)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-3 border-t border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="featured" className="cursor-pointer text-white">
                      Featured Artikel
                    </Label>
                    <p className="text-[11px] text-white/40 mt-0.5">
                      Prominent auf der Startseite
                    </p>
                  </div>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => updateField('featured', checked)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-6">
            <div className="space-y-3">
              <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full">
                {loading
                  ? 'Speichern...'
                  : mode === 'create'
                  ? 'Artikel erstellen'
                  : 'Speichern'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => router.push('/admin/articles')}
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
