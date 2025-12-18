'use client'

import { useState } from 'react'
import NewsletterForm from '@/components/admin/forms/NewsletterForm'
import ContentSelector from '@/components/newsletter/ContentSelector'
import DragDropReorder from '@/components/newsletter/DragDropReorder'
import { Button } from '@/components/ui/Button'

/**
 * Newsletter Create Form with Content Selection
 * Client component wrapper for the create newsletter page
 */

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

export default function NewsletterCreateForm() {
  const [selectedContent, setSelectedContent] = useState<ContentBlock[]>([])
  const [showContentSelector, setShowContentSelector] = useState(false)

  const handleContentReorder = (items: ContentBlock[]) => {
    setSelectedContent(items)
  }

  return (
    <div className="space-y-8">
      {/* Newsletter Form */}
      <NewsletterForm
        mode="create"
        initialContent={selectedContent}
      />

      {/* Content Selection Section */}
      <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-lg p-6">
        <h2 className="text-lg font-semibold text-[var(--pepe-white)] mb-4">
          Newsletter-Inhalte
        </h2>

        {selectedContent.length === 0 ? (
          <div className="space-y-4">
            <p className="text-[var(--pepe-t64)]">
              Wahlen Sie Events und Artikel aus, die in diesem Newsletter enthalten sein sollen.
            </p>

            {showContentSelector ? (
              <ContentSelector
                onContentSelected={handleContentReorder}
                selectedContent={selectedContent}
              />
            ) : (
              <Button
                variant="secondary"
                onClick={() => setShowContentSelector(true)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Inhalte auswahlen
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <DragDropReorder
              items={selectedContent}
              onReorder={handleContentReorder}
            />

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowContentSelector(true)}
              >
                Mehr Inhalte hinzufugen
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedContent([])}
                className="text-[var(--pepe-error)]"
              >
                Alle entfernen
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-[var(--pepe-surface)] border border-[var(--pepe-line)] rounded-lg p-4">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-[var(--pepe-info)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-[var(--pepe-t80)]">
            <p className="font-medium text-[var(--pepe-white)] mb-1">Hinweis</p>
            <p>
              Der Newsletter wird als Entwurf gespeichert. Sie konnen ihn spater bearbeiten,
              eine Vorschau ansehen und dann versenden oder zeitlich planen.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
