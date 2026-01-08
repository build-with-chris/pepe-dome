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
        const err = await res.json()
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
          <Label htmlFor="title" hasError={!!errors.title} required>
            Titel
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            hasError={!!errors.title}
            placeholder="Artikel-Titel"
          />
          {errors.title && (
            <p className="text-sm text-[var(--pepe-error)]">{errors.title}</p>
          )}
        </div>

        {mode === 'create' && (
          <div className="space-y-2">
            <Label htmlFor="slug">
              Slug (URL)
            </Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => updateField('slug', e.target.value)}
              placeholder="artikel-url-slug"
              className="font-mono text-sm"
            />
            <p className="text-xs text-[var(--pepe-t48)]">
              Wird automatisch aus dem Titel generiert. Kann manuell angepasst werden.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="excerpt" hasError={!!errors.excerpt} required>
            Kurzbeschreibung
          </Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => updateField('excerpt', e.target.value)}
            hasError={!!errors.excerpt}
            rows={2}
            placeholder="Kurze Beschreibung fur Vorschauen..."
          />
          {errors.excerpt && (
            <p className="text-sm text-[var(--pepe-error)]">{errors.excerpt}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category" hasError={!!errors.category} required>
              Kategorie
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => updateField('category', value)}
            >
              <SelectTrigger>
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

          <div className="space-y-2">
            <Label htmlFor="author" hasError={!!errors.author} required>
              Autor
            </Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => updateField('author', e.target.value)}
              hasError={!!errors.author}
              placeholder="Autor Name"
            />
            {errors.author && (
              <p className="text-sm text-[var(--pepe-error)]">{errors.author}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => updateField('status', value)}
          >
            <SelectTrigger className="w-40">
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
      </div>

      {/* Content */}
      <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-[var(--pepe-white)] mb-4">
          Inhalt
        </h2>

        <div className="space-y-2">
          <Label htmlFor="content" hasError={!!errors.content} required>
            Artikel-Inhalt (Markdown)
          </Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => updateField('content', e.target.value)}
            hasError={!!errors.content}
            rows={15}
            placeholder="Artikel-Inhalt in Markdown..."
            className="font-mono text-sm"
          />
          {errors.content && (
            <p className="text-sm text-[var(--pepe-error)]">{errors.content}</p>
          )}
          <p className="text-xs text-[var(--pepe-t48)]">
            Sie konnen Markdown verwenden: **fett**, *kursiv*, # Uberschriften, - Listen, etc.
          </p>
        </div>
      </div>

      {/* Media & Tags */}
      <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-[var(--pepe-white)] mb-4">
          Medien & Tags
        </h2>

        <ImageDropzone
          label="Artikel-Bild"
          value={formData.imageUrl}
          onChange={(url) => updateField('imageUrl', url)}
          hasError={!!errors.imageUrl}
          error={errors.imageUrl}
          placeholder="Artikel-Bild hier ablegen oder klicken zum Hochladen"
        />

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <div className="flex gap-2">
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Tag hinzufugen..."
              className="flex-1"
            />
            <Button type="button" variant="secondary" size="sm" onClick={addTag}>
              Hinzufugen
            </Button>
          </div>
          {formData.tags && formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--pepe-surface)] text-[var(--pepe-t80)] text-sm rounded"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-[var(--pepe-t48)] hover:text-[var(--pepe-error)]"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => updateField('featured', checked)}
          />
          <Label htmlFor="featured" className="cursor-pointer">
            Featured Artikel (prominent auf der Startseite anzeigen)
          </Label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading
            ? 'Speichern...'
            : mode === 'create'
            ? 'Artikel erstellen'
            : 'Anderungen speichern'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/admin/articles')}
        >
          Abbrechen
        </Button>
      </div>
    </form>
  )
}
