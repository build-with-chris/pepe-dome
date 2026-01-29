'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface VideoItem {
  src: string
  title: string
  description?: string
  isVertical?: boolean
}

interface VideoCarouselProps {
  videos?: VideoItem[]
  autoPlay?: boolean
  showControls?: boolean
}

const defaultVideos: VideoItem[] = [
  {
    src: '/videos/showreel.mp4',
    title: 'PEPE Shows',
    description: 'Zeitgenossischer Zirkus auf hochstem Niveau',
    isVertical: false,
  },
  {
    src: '/videos/vertical-01.mp4',
    title: 'Aerial Arts',
    description: 'Luftakrobatik im Dome',
    isVertical: true,
  },
  {
    src: '/videos/vertical-02.mp4',
    title: 'Performance',
    description: 'Artistik die begeistert',
    isVertical: true,
  },
  {
    src: '/videos/vertical-03.mp4',
    title: 'Live Shows',
    description: 'Unvergessliche Momente',
    isVertical: true,
  },
]

export default function VideoCarousel({
  videos = defaultVideos,
  autoPlay = true,
  showControls = true,
}: VideoCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  // Handle video end - move to next video
  const handleVideoEnd = () => {
    const nextIndex = (activeIndex + 1) % videos.length
    setActiveIndex(nextIndex)
  }

  // Play active video when it changes
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === activeIndex && isPlaying) {
          video.currentTime = 0
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      }
    })
  }, [activeIndex, isPlaying])

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
      {/* Main Video Display */}
      <div className="relative aspect-video max-h-[70vh] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            {videos[activeIndex]?.isVertical ? (
              // Vertical video layout
              <div className="flex h-full items-center justify-center bg-gradient-to-r from-[var(--pepe-black)] via-[var(--pepe-ink)] to-[var(--pepe-black)]">
                <video
                  ref={(el) => { videoRefs.current[activeIndex] = el }}
                  src={videos[activeIndex].src}
                  className="h-full max-h-full w-auto rounded-2xl shadow-2xl"
                  muted
                  playsInline
                  loop={false}
                  onEnded={handleVideoEnd}
                />
              </div>
            ) : (
              // Landscape video layout
              <video
                ref={(el) => { videoRefs.current[activeIndex] = el }}
                src={videos[activeIndex].src}
                className="h-full w-full object-cover"
                muted
                playsInline
                loop={false}
                onEnded={handleVideoEnd}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Gradient Overlays */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--pepe-black)] via-transparent to-[var(--pepe-black)]/30" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--pepe-black)]/50 via-transparent to-[var(--pepe-black)]/50" />

        {/* Video Info */}
        <div className="absolute bottom-8 left-8 z-10 max-w-lg">
          <motion.h3
            key={`title-${activeIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-[var(--pepe-white)] md:text-4xl"
          >
            {videos[activeIndex]?.title}
          </motion.h3>
          {videos[activeIndex]?.description && (
            <motion.p
              key={`desc-${activeIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-2 text-lg text-[var(--pepe-t80)]"
            >
              {videos[activeIndex].description}
            </motion.p>
          )}
        </div>

        {/* Play/Pause Button */}
        {showControls && (
          <button
            onClick={togglePlay}
            className="absolute right-8 top-1/2 z-10 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--pepe-gold)]/20 text-[var(--pepe-gold)] backdrop-blur-md transition-all hover:bg-[var(--pepe-gold)]/30 hover:scale-110"
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
        )}
      </div>

      {/* Video Thumbnails */}
      <div className="stage-container py-8">
        <div className="flex items-center justify-center gap-4">
          {videos.map((video, index) => (
            <button
              key={index}
              onClick={() => goToVideo(index)}
              className={`group relative overflow-hidden rounded-xl transition-all duration-300 ${
                index === activeIndex
                  ? 'ring-2 ring-[var(--pepe-gold)] ring-offset-2 ring-offset-[var(--pepe-black)]'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <div
                className={`relative overflow-hidden ${
                  video.isVertical ? 'h-20 w-12' : 'h-16 w-28'
                } md:${video.isVertical ? 'h-24 w-14' : 'h-20 w-36'}`}
              >
                <video
                  src={video.src}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                  preload="metadata"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <span className="absolute bottom-1 left-1 right-1 text-center text-[10px] font-medium text-white truncate">
                {video.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
