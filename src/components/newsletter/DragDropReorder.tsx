/**
 * Drag and Drop Reorder Component
 * Sortable list for reordering newsletter content
 */

'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface ContentItem {
  id?: string
  contentId: string | null
  contentType: string
  sectionHeading?: string | null
  sectionDescription?: string | null
  orderPosition: number
  _metadata?: {
    title: string
    imageUrl?: string
    date?: string
  }
}

interface DragDropReorderProps {
  items: ContentItem[]
  onReorder: (items: ContentItem[]) => void
  onAddTextSnippet?: () => void
}

// Generate a unique sortable key for each item
function getSortableKey(item: ContentItem, index: number): string {
  if (item.contentId) return item.contentId
  if (item.id) return item.id
  return `item-${index}-${item.contentType}`
}

export default function DragDropReorder({
  items,
  onReorder,
  onAddTextSnippet,
}: DragDropReorderProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item, idx) => getSortableKey(item, idx) === active.id)
      const newIndex = items.findIndex((item, idx) => getSortableKey(item, idx) === over.id)

      const reorderedItems = arrayMove(items, oldIndex, newIndex).map(
        (item, index) => ({
          ...item,
          orderPosition: index,
        })
      )

      onReorder(reorderedItems)
    }
  }

  const handleUpdateHeading = (sortableKey: string, heading: string) => {
    const updatedItems = items.map((item, idx) =>
      getSortableKey(item, idx) === sortableKey
        ? { ...item, sectionHeading: heading }
        : item
    )
    onReorder(updatedItems)
  }

  const handleUpdateDescription = (sortableKey: string, description: string) => {
    const updatedItems = items.map((item, idx) =>
      getSortableKey(item, idx) === sortableKey
        ? { ...item, sectionDescription: description }
        : item
    )
    onReorder(updatedItems)
  }

  const handleRemove = (sortableKey: string) => {
    const updatedItems = items
      .filter((item, idx) => getSortableKey(item, idx) !== sortableKey)
      .map((item, index) => ({
        ...item,
        orderPosition: index,
      }))
    onReorder(updatedItems)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          Inhalte ({items.length})
        </h3>
        <div className="flex items-center gap-3">
          {onAddTextSnippet && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onAddTextSnippet}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Text hinzufügen
            </Button>
          )}
          <p className="text-sm text-pepe-t64">
            Ziehen zum Sortieren
          </p>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item, idx) => getSortableKey(item, idx))}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {items.map((item, index) => (
              <SortableItem
                key={getSortableKey(item, index)}
                item={item}
                index={index}
                sortableKey={getSortableKey(item, index)}
                onUpdateHeading={handleUpdateHeading}
                onUpdateDescription={handleUpdateDescription}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

function SortableItem({
  item,
  index,
  sortableKey,
  onUpdateHeading,
  onUpdateDescription,
  onRemove,
}: {
  item: ContentItem
  index: number
  sortableKey: string
  onUpdateHeading: (id: string, heading: string) => void
  onUpdateDescription: (id: string, description: string) => void
  onRemove: (id: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sortableKey })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const isTextSnippet = item.contentType === 'CUSTOM_SECTION'
  const [isEditingHeading, setIsEditingHeading] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [headingValue, setHeadingValue] = useState(
    item.sectionHeading || (isTextSnippet ? '' : `Abschnitt ${index + 1}`)
  )
  const [descriptionValue, setDescriptionValue] = useState(
    item.sectionDescription || ''
  )

  const saveHeading = () => {
    onUpdateHeading(sortableKey, headingValue)
    setIsEditingHeading(false)
  }

  const saveDescription = () => {
    onUpdateDescription(sortableKey, descriptionValue)
    setIsEditingDescription(false)
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      EVENT: 'Event',
      ARTICLE: 'Artikel',
      SHOW: 'Show',
      CUSTOM_SECTION: 'Text',
    }
    return labels[type] || type
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-pepe-surface rounded-lg p-4 border transition-colors ${
        isTextSnippet
          ? 'border-sky-500/30 hover:border-sky-500'
          : 'border-pepe-line hover:border-pepe-gold'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-2 cursor-grab active:cursor-grabbing text-pepe-t64 hover:text-pepe-gold"
          aria-label="Zum Sortieren ziehen"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7 2C7 1.44772 7.44772 1 8 1C8.55228 1 9 1.44772 9 2V18C9 18.5523 8.55228 19 8 19C7.44772 19 7 18.5523 7 18V2Z" />
            <path d="M11 2C11 1.44772 11.4477 1 12 1C12.5523 1 13 1.44772 13 2V18C13 18.5523 12.5523 19 12 19C11.4477 19 11 18.5523 11 18V2Z" />
          </svg>
        </button>

        {/* Position Badge */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
          isTextSnippet ? 'bg-sky-500 text-white' : 'bg-pepe-gold text-black'
        }`}>
          {index + 1}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          {/* Type Badge */}
          <span className={`inline-block text-xs px-2 py-0.5 rounded ${
            isTextSnippet ? 'bg-sky-500/20 text-sky-400' : 'bg-pepe-gold/20 text-pepe-gold'
          }`}>
            {getTypeLabel(item.contentType)}
          </span>

          {/* Section Heading */}
          {isEditingHeading ? (
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={headingValue}
                onChange={(e) => setHeadingValue(e.target.value)}
                onBlur={saveHeading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveHeading()
                  if (e.key === 'Escape') {
                    setHeadingValue(item.sectionHeading || '')
                    setIsEditingHeading(false)
                  }
                }}
                autoFocus
                maxLength={100}
                placeholder={isTextSnippet ? 'Überschrift eingeben...' : 'Abschnitt-Überschrift'}
              />
            </div>
          ) : (
            <button
              onClick={() => setIsEditingHeading(true)}
              className="text-left hover:text-pepe-gold transition-colors w-full"
            >
              <h4 className="text-lg font-semibold">
                {headingValue || (isTextSnippet ? '+ Überschrift hinzufügen...' : `Abschnitt ${index + 1}`)}
              </h4>
            </button>
          )}

          {/* Content Info (for events/articles) */}
          {item._metadata && !isTextSnippet && (
            <div className="flex items-center gap-3">
              {item._metadata.imageUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={item._metadata.imageUrl}
                  alt={item._metadata.title}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div>
                <p className="font-medium text-sm">{item._metadata.title}</p>
                {item._metadata.date && (
                  <span className="text-xs text-pepe-t64">
                    {new Date(item._metadata.date).toLocaleDateString('de-DE')}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Section Description / Text Content */}
          {isEditingDescription ? (
            <div className="flex items-center gap-2">
              <textarea
                value={descriptionValue}
                onChange={(e) => setDescriptionValue(e.target.value)}
                onBlur={saveDescription}
                className="input w-full"
                rows={isTextSnippet ? 4 : 2}
                maxLength={1000}
                placeholder={isTextSnippet ? 'Text eingeben...' : 'Optionale Beschreibung...'}
              />
            </div>
          ) : (
            <button
              onClick={() => setIsEditingDescription(true)}
              className="text-left text-sm text-pepe-t64 hover:text-pepe-t80 transition-colors w-full"
            >
              {descriptionValue || (isTextSnippet ? '+ Text hinzufügen...' : '+ Beschreibung hinzufügen...')}
            </button>
          )}
        </div>

        {/* Remove Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(sortableKey)}
          className="text-pepe-error hover:bg-pepe-error/10"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </Button>
      </div>
    </div>
  )
}
