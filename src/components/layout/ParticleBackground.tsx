'use client'

import { useEffect, useRef } from 'react'

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create particles (doticons - using simple dots for now, will be replaced with actual icons)
    const particleCount = 25
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')

      // Random size class
      const sizeClass = Math.random() > 0.7 ? 'large' : Math.random() > 0.4 ? '' : 'small'

      // Random color class (gold/bronze/copper theme)
      const colorClass = Math.random() > 0.7 ? 'bronze' : Math.random() > 0.5 ? 'amber' : Math.random() > 0.3 ? 'copper' : ''

      particle.className = `particle ${sizeClass} ${colorClass}`.trim()

      // Random position
      particle.style.left = Math.random() * 100 + '%'
      particle.style.animationDelay = Math.random() * 20 + 's'
      particle.style.animationDuration = (15 + Math.random() * 10) + 's'

      container.appendChild(particle)
      particlesRef.current.push(particle)
    }

    // Mouse tracking for repulsion effect
    const handleMouseMove = (e: MouseEvent) => {
      particlesRef.current.forEach(particle => {
        const rect = particle.getBoundingClientRect()
        const dx = rect.left + rect.width / 2 - e.clientX
        const dy = rect.top + rect.height / 2 - e.clientY
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 150) {
          particle.classList.add('repelled')
          if (distance < 75) {
            particle.classList.add('dispersed')
          }
        } else {
          particle.classList.remove('repelled', 'dispersed')
        }
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      // Clean up particles
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
