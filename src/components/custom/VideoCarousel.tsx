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

export default function VideoCarousel({
  videos = defaultVideos,
  autoPlay = true,
  showControls = true,
}: VideoCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  // Thumbnail: Frame bei 3s (Startbild ist bei manchen Clips weiß/schwarz)
  const THUMBNAIL_TIME = 3

  // Only the active video plays; others are paused and show frame at 3s as thumbnail.
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

  const handleVideoEnd = () => {
    setActiveIndex((prev) => (prev + 1) % videos.length)
  }

  const goToVideo = (index: number) => {
    setActiveIndex(index)
    setIsPlaying(true)
  }

  const togglePlay = () => {
    const video = videoRefs.current[activeIndex]
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
      {/* Row of videos: side by side, portrait format, one in focus */}
      <div className="stage-container py-6 md:py-10">
        <div className="flex items-center justify-center gap-3 overflow-x-auto overflow-y-visible pb-2 md:gap-6 md:overflow-visible">
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
              {/* Portrait frame: 9/16, Höhe an Video angepasst (kompakter) */}
              <div className="relative aspect-[9/16] h-[36vw] max-h-[48vh] w-auto overflow-hidden rounded-2xl bg-[var(--pepe-ink)] shadow-xl md:max-h-[52vh]">
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
                  preload="auto"
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

        {/* Active video title + description */}
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

        {/* Play/Pause for active video */}
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
    </section>
  )
}
