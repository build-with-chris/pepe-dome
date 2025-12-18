/**
 * Content Selector Component
 * Filter and select content items for newsletter
 */

'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface ContentItem {
  id: string
  title: string
  type: 'EVENT' | 'ARTICLE' | 'SHOW'
  date?: string
  category?: string
  status?: string
  imageUrl?: string
}

interface ContentSelectorProps {
  onContentSelected: (content: any[]) => void
  selectedContent: any[]
}

export default function ContentSelector({
  onContentSelected,
  selectedContent,
}: ContentSelectorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [availableContent, setAvailableContent] = useState<ContentItem[]>([])
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  // Filter state
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: '',
    status: '',
    tags: '',
  })

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)
      if (filters.category) params.append('category', filters.category)
      if (filters.status) params.append('status', filters.status)
      if (filters.tags) params.append('tags', filters.tags)

      const response = await fetch(`/api/admin/content?${params}`)
      const result = await response.json()

      if (response.ok) {
        setAvailableContent(result.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleApplyFilters = () => {
    fetchContent()
  }

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedItems(newSelected)
  }

  const handleAddToNewsletter = () => {
    const selected = availableContent
      .filter((item) => selectedItems.has(item.id))
      .map((item, index) => ({
        contentType: item.type,
        contentId: item.id,
        sectionHeading: getCategoryLabel(item.type),
        sectionDescription: '',
        orderPosition: selectedContent.length + index,
        // Include metadata for rendering
        _metadata: {
          title: item.title,
          imageUrl: item.imageUrl,
          date: item.date,
        },
      }))

    onContentSelected([...selectedContent, ...selected])
  }

  const getCategoryLabel = (type: string) => {
    const labels: Record<string, string> = {
      EVENT: 'Upcoming Events',
      ARTICLE: 'Latest News',
      SHOW: 'Featured Shows',
    }
    return labels[type] || 'Content'
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="bg-pepe-surface rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Filter Content</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="startDate" className="form-label">
              Start Date
            </label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>

          <div>
            <label htmlFor="endDate" className="form-label">
              End Date
            </label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>

          <div>
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="">All Categories</option>
              <option value="shows">Shows</option>
              <option value="workshops">Workshops</option>
              <option value="corporate">Corporate</option>
              <option value="news">News</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="primary" size="sm" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFilters({
                startDate: '',
                endDate: '',
                category: '',
                status: '',
                tags: '',
              })
              fetchContent()
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Content List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Available Content ({availableContent.length})
          </h3>
          <span className="text-sm text-pepe-t64">
            {selectedItems.size} selected
          </span>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-pepe-t64">
            Loading content...
          </div>
        ) : availableContent.length === 0 ? (
          <div className="text-center py-12 text-pepe-t64">
            No content found matching your filters
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {availableContent.map((item) => (
              <label
                key={item.id}
                className="flex items-start gap-3 p-4 bg-pepe-surface rounded-lg hover:bg-pepe-line cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedItems.has(item.id)}
                  onChange={() => toggleSelection(item.id)}
                  className="mt-1"
                />

                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}

                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{item.title}</h4>
                  <div className="flex items-center gap-3 text-sm text-pepe-t64">
                    <span className="text-pepe-gold">{item.type}</span>
                    {item.date && (
                      <span>
                        {new Date(item.date).toLocaleDateString('de-DE', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                    {item.category && <span>{item.category}</span>}
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Selected Items Preview */}
      {selectedItems.size > 0 && (
        <div className="bg-pepe-gold-glow rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold">
              {selectedItems.size} item(s) selected
            </span>
            <Button
              variant="primary"
              size="md"
              onClick={handleAddToNewsletter}
            >
              Add to Newsletter
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
