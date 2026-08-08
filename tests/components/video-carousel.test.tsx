/**
 * Das Videokarussell lädt erst, wenn es im Blick ist.
 *
 * Vorher standen zwei Videos mit preload="auto" im ausgelieferten HTML und die
 * mobile Fassung rief beim Mount load() und play(). Damit zog die Startseite bis
 * zu 4 MB, bevor jemand überhaupt gescrollt hatte. Auf dem Handy kostet das die
 * Ladezeit des ersten Bildschirms.
 */

import { render, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import VideoCarousel from '@/components/custom/VideoCarousel'

type Beobachter = (entries: { isIntersecting: boolean }[]) => void

let beobachter: Beobachter[] = []

class TestIntersectionObserver {
  constructor(cb: Beobachter) {
    beobachter.push(cb)
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

function inDenBlickScrollen() {
  act(() => {
    beobachter.forEach((cb) => cb([{ isIntersecting: true }]))
  })
}

function videosVon(container: HTMLElement) {
  return [...container.querySelectorAll('video')]
}

describe('VideoCarousel', () => {
  beforeEach(() => {
    beobachter = []
    vi.stubGlobal('IntersectionObserver', TestIntersectionObserver)
    HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined)
    HTMLMediaElement.prototype.pause = vi.fn()
    HTMLMediaElement.prototype.load = vi.fn()
  })

  it('lädt nichts vor, solange der Abschnitt nicht im Blick ist', () => {
    const { container } = render(<VideoCarousel />)

    const preloads = videosVon(container).map((v) => v.getAttribute('preload'))
    expect(preloads.every((p) => p === 'none')).toBe(true)
    expect(HTMLMediaElement.prototype.load).not.toHaveBeenCalled()
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled()
  })

  it('holt beim Hereinscrollen nur die Metadaten, nicht die ganze Datei', () => {
    const { container } = render(<VideoCarousel />)

    inDenBlickScrollen()

    const preloads = videosVon(container).map((v) => v.getAttribute('preload'))
    expect(preloads).toContain('metadata')
    expect(preloads).not.toContain('auto')
  })

  it('startet die Wiedergabe erst beim Hereinscrollen', () => {
    render(<VideoCarousel />)
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled()

    inDenBlickScrollen()

    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled()
  })

  it('startet nichts, wenn autoPlay abgeschaltet ist', () => {
    render(<VideoCarousel autoPlay={false} />)

    inDenBlickScrollen()

    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled()
  })
})
