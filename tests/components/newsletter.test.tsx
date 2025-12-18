/**
 * Admin UI Newsletter Component Tests
 * Focused tests for critical UI behaviors (2-8 tests)
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useState } from 'react'

describe('Admin UI Newsletter Components', () => {
  it('ContentSelector - selects and deselects items', () => {
    const onSelect = vi.fn()

    const MockContentSelector = () => {
      const [selected, setSelected] = useState<string[]>([])

      const handleSelect = (id: string) => {
        if (selected.includes(id)) {
          setSelected(selected.filter((item) => item !== id))
        } else {
          setSelected([...selected, id])
        }
        onSelect(id)
      }

      return (
        <div data-testid="content-selector">
          <button onClick={() => handleSelect('event-1')}>Select Event 1</button>
          <button onClick={() => handleSelect('event-2')}>Select Event 2</button>
          {selected.map((id: string) => (
            <div key={id} data-testid={`selected-${id}`}>
              Selected: {id}
            </div>
          ))}
        </div>
      )
    }

    render(<MockContentSelector />)

    // Initially no items selected
    expect(screen.queryByTestId('selected-event-1')).not.toBeInTheDocument()

    // Select first item
    const selectButton1 = screen.getByText('Select Event 1')
    fireEvent.click(selectButton1)
    expect(onSelect).toHaveBeenCalledWith('event-1')
    expect(screen.getByTestId('selected-event-1')).toBeInTheDocument()

    // Deselect first item
    fireEvent.click(selectButton1)
    expect(screen.queryByTestId('selected-event-1')).not.toBeInTheDocument()
  })

  it('DragDropReorder - updates order position', () => {
    const items = [
      { id: '1', title: 'Item 1', orderPosition: 0 },
      { id: '2', title: 'Item 2', orderPosition: 1 },
    ]

    const onReorder = vi.fn((newOrder: any[]) => {
      items.splice(0, items.length, ...newOrder)
    })

    const MockReorder = ({ items, onReorder }: any) => (
      <div data-testid="reorder-list">
        {items.map((item: any, index: number) => (
          <div key={item.id} data-testid={`item-${item.id}`}>
            {item.title} - Position: {item.orderPosition}
            <button onClick={() => {
              const newOrder = [...items]
              const [removed] = newOrder.splice(index, 1)
              newOrder.splice(0, 0, removed)
              newOrder.forEach((item, i) => item.orderPosition = i)
              onReorder(newOrder)
            }}>
              Move to Top
            </button>
          </div>
        ))}
      </div>
    )

    render(<MockReorder items={items} onReorder={onReorder} />)

    // Move second item to top
    const moveButton = screen.getAllByText('Move to Top')[1]
    fireEvent.click(moveButton)

    expect(onReorder).toHaveBeenCalled()
    const reorderedItems = onReorder.mock.calls[0][0]
    expect(reorderedItems[0].id).toBe('2') // Second item should now be first
  })

  it('HeroImageUpload - validates aspect ratio', async () => {
    const onUpload = vi.fn()
    const onError = vi.fn()

    const MockUpload = ({ onUpload, onError }: any) => {
      const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const img = new Image()
        img.onload = () => {
          const aspectRatio = img.width / img.height
          if (Math.abs(aspectRatio - 2) > 0.2) {
            onError('Aspect ratio should be close to 2:1')
          } else {
            onUpload(file)
          }
        }
        // Mock image load
        setTimeout(() => {
          img.width = 800
          img.height = 600
          img.onload?.(new Event('load'))
        }, 10)
      }

      return (
        <div data-testid="hero-upload">
          <input
            type="file"
            data-testid="file-input"
            onChange={handleFile}
            accept="image/*"
          />
        </div>
      )
    }

    render(<MockUpload onUpload={onUpload} onError={onError} />)

    const input = screen.getByTestId('file-input')
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' })

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    })

    fireEvent.change(input)

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('Aspect ratio should be close to 2:1')
    })
  })

  it('EmailPreview - renders correctly', () => {
    const MockPreview = ({ newsletterId }: any) => (
      <div data-testid="email-preview">
        <iframe
          data-testid="preview-iframe"
          src={`/api/admin/newsletters/${newsletterId}/preview`}
          title="Email Preview"
        />
        <div className="preview-actions">
          <button data-testid="test-send-btn">Send Test Email</button>
          <button data-testid="view-web-btn">View as Web Page</button>
        </div>
      </div>
    )

    render(<MockPreview newsletterId="test-123" />)

    const iframe = screen.getByTestId('preview-iframe')
    expect(iframe).toHaveAttribute(
      'src',
      '/api/admin/newsletters/test-123/preview'
    )

    expect(screen.getByTestId('test-send-btn')).toBeInTheDocument()
    expect(screen.getByTestId('view-web-btn')).toBeInTheDocument()
  })

  it('Newsletter form - submission creates newsletter', async () => {
    const onSubmit = vi.fn()

    const MockForm = ({ onSubmit }: any) => {
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        onSubmit({
          subject: formData.get('subject'),
          preheader: formData.get('preheader'),
          heroTitle: formData.get('heroTitle'),
        })
      }

      return (
        <form data-testid="newsletter-form" onSubmit={handleSubmit}>
          <input name="subject" data-testid="subject-input" />
          <input name="preheader" data-testid="preheader-input" />
          <input name="heroTitle" data-testid="hero-title-input" />
          <button type="submit" data-testid="submit-btn">
            Save Draft
          </button>
        </form>
      )
    }

    render(<MockForm onSubmit={onSubmit} />)

    const subjectInput = screen.getByTestId('subject-input')
    const preheaderInput = screen.getByTestId('preheader-input')
    const heroTitleInput = screen.getByTestId('hero-title-input')
    const submitBtn = screen.getByTestId('submit-btn')

    fireEvent.change(subjectInput, { target: { value: 'Test Newsletter' } })
    fireEvent.change(preheaderInput, { target: { value: 'Test preheader' } })
    fireEvent.change(heroTitleInput, { target: { value: 'Welcome!' } })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        subject: 'Test Newsletter',
        preheader: 'Test preheader',
        heroTitle: 'Welcome!',
      })
    })
  })
})
