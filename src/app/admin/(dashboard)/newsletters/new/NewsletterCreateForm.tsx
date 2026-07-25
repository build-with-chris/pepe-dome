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
      <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-6">
        <h2 className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-5">
          Newsletter-Inhalte
        </h2>

        {selectedContent.length === 0 ? (
          <div className="space-y-4">
            <p className="text-white/50 text-[13px]">
              Wählen Sie Events und Artikel aus, die in diesem Newsletter enthalten sein sollen.
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
                Inhalte auswählen
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
                Mehr Inhalte hinzufügen
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedContent([])}
                className="text-red-400"
              >
                Alle entfernen
              </Button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
