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
}

// Generate a unique sortable key for each item
function getSortableKey(item: ContentItem, index: number): string {
  if (item.contentId) return item.contentId
  if (item.id) return item.id
  return `item-${index}`
}

export default function DragDropReorder({
  items,
  onReorder,
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
          Content Order ({items.length} items)
        </h3>
        <p className="text-sm text-pepe-t64">
          Drag to reorder, edit headings inline
        </p>
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

  const [isEditingHeading, setIsEditingHeading] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [headingValue, setHeadingValue] = useState(
    item.sectionHeading || `Section ${index + 1}`
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-pepe-surface rounded-lg p-4 border border-pepe-line hover:border-pepe-gold transition-colors"
    >
      <div className="flex items-start gap-4">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-2 cursor-grab active:cursor-grabbing text-pepe-t64 hover:text-pepe-gold"
          aria-label="Drag to reorder"
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
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pepe-gold text-black flex items-center justify-center font-bold text-sm">
          {index + 1}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
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
              />
            </div>
          ) : (
            <button
              onClick={() => setIsEditingHeading(true)}
              className="text-left hover:text-pepe-gold transition-colors"
            >
              <h4 className="text-lg font-semibold">{headingValue}</h4>
            </button>
          )}

          {/* Content Info */}
          {item._metadata && (
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
                <div className="flex items-center gap-2 text-xs text-pepe-t64">
                  <span className="text-pepe-gold">{item.contentType}</span>
                  {item._metadata.date && (
                    <span>
                      {new Date(item._metadata.date).toLocaleDateString('de-DE')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Section Description */}
          {isEditingDescription ? (
            <div className="flex items-center gap-2">
              <textarea
                value={descriptionValue}
                onChange={(e) => setDescriptionValue(e.target.value)}
                onBlur={saveDescription}
                className="input w-full"
                rows={2}
                maxLength={500}
                placeholder="Optional section description..."
              />
            </div>
          ) : (
            <button
              onClick={() => setIsEditingDescription(true)}
              className="text-left text-sm text-pepe-t64 hover:text-pepe-t80 transition-colors w-full"
            >
              {descriptionValue || '+ Add section description...'}
            </button>
          )}
        </div>

        {/* Remove Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(sortableKey)}
          className="text-pepe-error hover:bg-pepe-error-bg"
        >
          Remove
        </Button>
      </div>
    </div>
  )
}
