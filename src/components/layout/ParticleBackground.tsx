'use client'

import { useEffect, useRef } from 'react'

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create particles
    const particleCount = 25
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')

      const sizeClass = Math.random() > 0.7 ? 'large' : Math.random() > 0.4 ? '' : 'small'
      const colorClass = Math.random() > 0.7 ? 'bronze' : Math.random() > 0.5 ? 'amber' : Math.random() > 0.3 ? 'copper' : ''

      particle.className = `particle ${sizeClass} ${colorClass}`.trim()
      particle.style.left = Math.random() * 100 + '%'
      particle.style.animationDelay = Math.random() * 20 + 's'
      particle.style.animationDuration = (15 + Math.random() * 10) + 's'

      container.appendChild(particle)
      particlesRef.current.push(particle)
    }

    // Throttled mouse tracking (runs max ~15fps instead of every mousemove)
    let ticking = false
    const handleMouseMove = (e: MouseEvent) => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const mx = e.clientX
        const my = e.clientY
        particlesRef.current.forEach(particle => {
          const rect = particle.getBoundingClientRect()
          const dx = rect.left + rect.width / 2 - mx
          const dy = rect.top + rect.height / 2 - my
          const distance = dx * dx + dy * dy // skip sqrt, compare squared

          if (distance < 22500) { // 150^2
            particle.classList.add('repelled')
            if (distance < 5625) { // 75^2
              particle.classList.add('dispersed')
            }
          } else {
            particle.classList.remove('repelled', 'dispersed')
          }
        })
        ticking = false
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      particlesRef.current.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle)
        }
      })
      particlesRef.current = []
    }
  }, [])

  return (
    <>
      <div className="stage-background" />
      <div ref={containerRef} className="particle-canvas" />
    </>
  )
}
