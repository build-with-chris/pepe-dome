'use client'

import { useState, useRef, useEffect } from 'react'

interface VideoItem {
  src: string
  title: string
  description?: string
}

interface VideoCarouselProps {
  videos?: VideoItem[]
  autoPlay?: boolean
  showControls?: boolean
}

const defaultVideos: VideoItem[] = [
  { src: '/videos/showreel.mp4', title: 'TwoGether - lokale Künstler' },
  { src: '/videos/vertical-01.mp4', title: 'Einblicke Shows und Workshop' },
  { src: '/videos/vertical-02.mp4', title: 'Freeman Festival 2025' },
  { src: '/videos/vertical-03.mp4', title: 'Abendstimmung' },
]

const THUMBNAIL_TIME = 3

export default function VideoCarousel({
  videos = defaultVideos,
  autoPlay = true,
  showControls = true,
}: VideoCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const mobileMainRef = useRef<HTMLVideoElement>(null)

  // Desktop: only active video plays; others paused at thumbnail time
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return
      if (index === activeIndex) {
        video.currentTime = 0
        if (isPlaying) video.play().catch(() => {})
      } else {
        video.pause()
        video.currentTime = THUMBNAIL_TIME
      }
    })
  }, [activeIndex, isPlaying])

  // Mobile: when activeIndex or isPlaying changes, (re)load and play the single video
  useEffect(() => {
    const main = mobileMainRef.current
    if (!main || !videos[activeIndex]) return
    main.currentTime = 0
    main.load()
    if (isPlaying) main.play().catch(() => {})
  }, [activeIndex, isPlaying, videos])

  const handleVideoEnd = () => {
    setActiveIndex((prev) => (prev + 1) % videos.length)
  }

  const goToVideo = (index: number) => {
    setActiveIndex(index)
    setIsPlaying(true)
  }

  const togglePlay = () => {
    const video = videoRefs.current[activeIndex] ?? mobileMainRef.current
    if (video) {
      if (isPlaying) {
        video.pause()
      } else {
        video.play().catch(() => {})
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <section className="relative w-full overflow-hidden bg-[var(--pepe-black)]">
      <div className="stage-container py-6 md:py-10">
        {/* ========== MOBILE: ein großes Video (≥75% Screen) + Strip „weitere Videos“ ========== */}
        <div className="md:hidden">
          {/* Hauptvideo: mind. 75vh, wirkt stark; Lazy: nur dieses eine geladen */}
          <div className="relative mx-auto w-full max-w-[min(90vw,400px)] min-h-[75vh] flex flex-col items-center">
            <div className="relative aspect-[9/16] w-full min-h-[75vh] max-h-[85vh] overflow-hidden rounded-2xl bg-[var(--pepe-ink)] shadow-xl">
              <video
                ref={mobileMainRef}
                src={videos[activeIndex]?.src ?? ''}
                className="h-full w-full object-contain"
                muted
                playsInline
                loop={false}
                onEnded={handleVideoEnd}
                preload="auto"
              />
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-[var(--pepe-gold)] ring-offset-2 ring-offset-[var(--pepe-black)]" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-[var(--pepe-white)] text-center">
              {videos[activeIndex]?.title}
            </h3>
            {showControls && (
              <button
                type="button"
                onClick={togglePlay}
                className="mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--pepe-gold)]/20 text-[var(--pepe-gold)]"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                )}
              </button>
            )}
          </div>

          {/* Strip: weitere Videos erkennbar, Lazy (nur Metadata für Thumbnail) */}
          <p className="mt-6 mb-3 text-center text-sm text-[var(--pepe-t64)]">
            Weitere Videos
          </p>
          <div className="flex justify-center gap-2 overflow-x-auto pb-2">
            {videos.map((video, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToVideo(index)}
                className={`relative flex shrink-0 flex-col items-center rounded-xl overflow-hidden border-2 transition-all ${
                  index === activeIndex
                    ? 'border-[var(--pepe-gold)] ring-2 ring-[var(--pepe-gold)]/30'
                    : 'border-transparent opacity-70'
                }`}
              >
                <div className="relative h-16 w-9 overflow-hidden rounded-lg bg-[var(--pepe-ink)]">
                  <video
                    src={video.src}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                    onLoadedMetadata={(e) => {
                      const v = e.currentTarget
                      v.currentTime = THUMBNAIL_TIME
                    }}
                  />
                </div>
                <span className="mt-1 max-w-[72px] truncate text-[10px] text-[var(--pepe-t80)]">
                  {video.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ========== DESKTOP: 4 nebeneinander, Portrait ========== */}
        <div className="hidden md:block">
          <div className="flex items-center justify-center gap-6">
            {videos.map((video, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToVideo(index)}
                className={`relative flex shrink-0 flex-col items-center transition-all duration-300 ${
                  index === activeIndex
                    ? 'z-10 scale-[1.02] opacity-100'
                    : 'z-0 opacity-70 hover:opacity-90'
                }`}
              >
                <div className="relative aspect-[9/16] h-[36vw] max-h-[52vh] w-auto overflow-hidden rounded-2xl bg-[var(--pepe-ink)] shadow-xl">
                  <video
                    ref={(el) => { videoRefs.current[index] = el }}
                    src={video.src}
                    className="h-full w-full object-contain"
                    muted
                    playsInline
                    loop={false}
                    onEnded={handleVideoEnd}
                    onLoadedMetadata={(e) => {
                      const v = e.currentTarget
                      if (index !== activeIndex) v.currentTime = THUMBNAIL_TIME
                    }}
                    preload={index === activeIndex ? 'auto' : 'none'}
                  />
                  {index === activeIndex && (
                    <div className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-[var(--pepe-gold)] ring-offset-2 ring-offset-[var(--pepe-black)]" />
                  )}
                </div>
                <span className="mt-2 text-center text-sm font-medium text-[var(--pepe-t80)]">
                  {video.title}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6 text-center">
            <h3 className="text-2xl font-bold text-[var(--pepe-white)] md:text-3xl">
              {videos[activeIndex]?.title}
            </h3>
            {videos[activeIndex]?.description && (
              <p className="mt-1 text-[var(--pepe-t80)]">
                {videos[activeIndex].description}
              </p>
            )}
          </div>

          {showControls && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={togglePlay}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--pepe-gold)]/20 text-[var(--pepe-gold)] backdrop-blur-md transition-all hover:bg-[var(--pepe-gold)]/30 hover:scale-110"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
