'use client'

import { useState, useRef, useEffect } from 'react'

interface VideoItem {
  src: string
  title: string
  description?: string
  poster?: string
}

interface VideoCarouselProps {
  videos?: VideoItem[]
  autoPlay?: boolean
  showControls?: boolean
}

const defaultVideos: VideoItem[] = [
  { src: '/videos/showreel.mp4', title: 'TwoGether - lokale Künstler', poster: '/images/posters/showreel.jpg' },
  { src: '/videos/vertical-01.mp4', title: 'Einblicke Shows und Workshop', poster: '/images/posters/vertical-01.jpg' },
  { src: '/videos/vertical-02.mp4', title: 'Freeman Festival 2025', poster: '/images/posters/vertical-02.jpg' },
  { src: '/videos/vertical-03.mp4', title: 'Abendstimmung', poster: '/images/posters/vertical-03.jpg' },
]

const THUMBNAIL_TIME = 3

function shuffleArray<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export default function VideoCarousel({
  videos: videosProp,
  autoPlay = true,
  showControls = true,
}: VideoCarouselProps) {
  // Use stable initial order for SSR/hydration, then shuffle client-side
  const initialVideos = videosProp && videosProp.length > 0 ? videosProp : defaultVideos
  const [videos, setVideos] = useState(initialVideos)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setVideos(shuffleArray(initialVideos))
    setHydrated(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const mobileMainRef = useRef<HTMLVideoElement>(null)
  const mobileContainerRef = useRef<HTMLDivElement>(null)
  const desktopActiveContainerRef = useRef<HTMLDivElement>(null)

  // Desktop: only active video plays; others paused at thumbnail time
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return
      video.muted = isMuted
      if (index === activeIndex) {
        video.currentTime = 0
        if (isPlaying) video.play().catch(() => {})
      } else {
        video.pause()
        video.currentTime = THUMBNAIL_TIME
      }
    })
  }, [activeIndex, isPlaying, isMuted])

  // Mobile: when activeIndex or isPlaying changes, (re)load and play the single video
  useEffect(() => {
    const main = mobileMainRef.current
    if (!main || !videos[activeIndex]) return
    main.muted = isMuted
    main.currentTime = 0
    main.load()
    if (isPlaying) main.play().catch(() => {})
  }, [activeIndex, isPlaying, videos, isMuted])

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

  const toggleMute = () => {
    const newMuted = !isMuted
    setIsMuted(newMuted)
    // Update all video refs
    videoRefs.current.forEach((v) => { if (v) v.muted = newMuted })
    if (mobileMainRef.current) mobileMainRef.current.muted = newMuted
  }

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev)
  }

  // Close fullscreen on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])

  const MuteIcon = () => isMuted ? (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
    </svg>
  ) : (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728" />
    </svg>
  )

  const FullscreenIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
    </svg>
  )

  const controlBtnClass = "flex h-10 w-10 items-center justify-center rounded-full bg-[var(--pepe-black)]/60 text-[var(--pepe-white)] backdrop-blur-md transition-all hover:bg-[var(--pepe-gold)]/30 hover:text-[var(--pepe-gold)]"

  const CloseIcon = () => (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )

  return (
    <section className="relative w-full overflow-hidden bg-[var(--pepe-black)]">
      {/* ========== FULLSCREEN OVERLAY (Mobile + Desktop) ========== */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
          <video
            src={videos[activeIndex]?.src ?? ''}
            poster={videos[activeIndex]?.poster}
            className="h-full w-full object-contain"
            autoPlay
            playsInline
            muted={isMuted}
            loop={false}
            onEnded={handleVideoEnd}
          />
          {/* X-Button oben rechts */}
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md hover:bg-white/25 active:bg-white/30 transition-all"
            aria-label="Vollbild schliessen"
          >
            <CloseIcon />
          </button>
          {/* Mute-Button unten rechts */}
          <button
            type="button"
            onClick={toggleMute}
            className="absolute bottom-8 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md hover:bg-white/25 active:bg-white/30 transition-all"
            aria-label={isMuted ? 'Ton an' : 'Ton aus'}
          >
            <MuteIcon />
          </button>
        </div>
      )}

      <div className="stage-container py-6 md:py-10">
        {/* ========== MOBILE: ein großes Video + Auswahl-Strip ÜBER dem Video ========== */}
        <div className="video-carousel-mobile">
          <div className="relative mx-auto w-full max-w-[min(90vw,400px)] min-h-[75vh] flex flex-col items-center">
            {/* Hauptvideo */}
            <div ref={mobileContainerRef} className="relative aspect-[9/16] w-full min-h-[75vh] max-h-[85vh] overflow-hidden rounded-2xl bg-[var(--pepe-ink)] shadow-xl">
              <video
                ref={mobileMainRef}
                src={videos[activeIndex]?.src ?? ''}
                poster={videos[activeIndex]?.poster}
                className="h-full w-full object-contain"
                muted
                playsInline
                loop={false}
                onEnded={handleVideoEnd}
                preload="auto"
              />
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-[var(--pepe-gold)] ring-offset-2 ring-offset-[var(--pepe-black)]" />

              {/* Sound + Fullscreen Controls */}
              <div className="absolute top-3 right-3 z-20 flex gap-2">
                <button type="button" onClick={toggleMute} className={controlBtnClass} aria-label={isMuted ? 'Ton an' : 'Ton aus'}>
                  <MuteIcon />
                </button>
                <button type="button" onClick={toggleFullscreen} className={controlBtnClass} aria-label="Vollbild">
                  <FullscreenIcon />
                </button>
              </div>

              {/* Videoauswahl über dem unteren Bereich des Videos */}
              <div className="absolute bottom-0 left-0 right-0 z-10 pt-8 pb-3 px-2 bg-gradient-to-t from-[var(--pepe-black)]/95 via-[var(--pepe-black)]/70 to-transparent rounded-b-2xl">
                <p className="text-center text-xs font-medium text-[var(--pepe-t64)] mb-2">
                  Weitere Videos
                </p>
                <div className="flex justify-center gap-2 overflow-x-auto">
                  {videos.map((video, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => goToVideo(index)}
                      className={`relative flex shrink-0 flex-col items-center rounded-xl overflow-hidden border-2 transition-all ${
                        index === activeIndex
                          ? 'border-[var(--pepe-gold)] ring-2 ring-[var(--pepe-gold)]/30'
                          : 'border-white/30 opacity-80'
                      }`}
                    >
                      <div className="relative h-14 w-[2.625rem] overflow-hidden rounded-lg bg-[var(--pepe-ink)]">
                        {video.poster ? (
                          <img src={video.poster} alt={video.title} className="h-full w-full object-cover object-top" loading="lazy" />
                        ) : (
                          <video
                            src={video.src}
                            className="h-full w-full object-cover object-top"
                            muted
                            playsInline
                            preload="metadata"
                            onLoadedData={(e) => {
                              const v = e.currentTarget
                              const t = Number.isFinite(v.duration) && v.duration >= THUMBNAIL_TIME
                                ? THUMBNAIL_TIME
                                : 0
                              v.currentTime = t
                            }}
                          />
                        )}
                      </div>
                      <span className="mt-1 max-w-[70px] truncate text-[9px] font-medium text-[var(--pepe-t80)]">
                        {video.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Titel unter dem Video – größer */}
            <h3 className="mt-4 text-2xl font-bold text-[var(--pepe-white)] text-center px-2">
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
        </div>

        {/* ========== DESKTOP: 4 nebeneinander, Portrait ========== */}
        <div className="video-carousel-desktop">
          <div className="flex items-center justify-center gap-6">
            {videos.map((video, index) => (
              <div
                key={index}
                role="button"
                tabIndex={0}
                onClick={() => goToVideo(index)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') goToVideo(index) }}
                className={`relative flex shrink-0 cursor-pointer flex-col items-center transition-all duration-300 ${
                  index === activeIndex
                    ? 'z-10 scale-[1.02] opacity-100'
                    : 'z-0 opacity-70 hover:opacity-90'
                }`}
              >
                <div
                  ref={index === activeIndex ? desktopActiveContainerRef : undefined}
                  className="relative aspect-[9/16] h-[36vw] max-h-[52vh] w-auto overflow-hidden rounded-2xl bg-[var(--pepe-ink)] shadow-xl"
                >
                  <video
                    ref={(el) => { videoRefs.current[index] = el }}
                    src={video.src}
                    poster={video.poster}
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
                    <>
                      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-[var(--pepe-gold)] ring-offset-2 ring-offset-[var(--pepe-black)]" />
                      {/* Sound + Fullscreen Controls */}
                      <div className="absolute top-3 right-3 z-20 flex gap-2">
                        <button type="button" onClick={(e) => { e.stopPropagation(); toggleMute() }} className={controlBtnClass} aria-label={isMuted ? 'Ton an' : 'Ton aus'}>
                          <MuteIcon />
                        </button>
                        <button type="button" onClick={(e) => { e.stopPropagation(); toggleFullscreen() }} className={controlBtnClass} aria-label="Vollbild">
                          <FullscreenIcon />
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <span className="mt-2 text-center text-base font-semibold text-[var(--pepe-t80)]">
                  {video.title}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <h3 className="text-3xl font-bold text-[var(--pepe-white)] md:text-4xl">
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
