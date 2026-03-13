'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const IMAGES = [
  { src: '/images/Trainingsort/DSC_6555_batcheditor_fotor.webp', alt: 'Trainingsort Pepe Dome' },
  { src: '/images/Trainingsort/DSC_7519_batcheditor_fotor.webp', alt: 'Trainingsort Pepe Dome' },
]

const SWAP_INTERVAL_MS = 5000

export default function TrainingsortOverlapImages() {
  const [frontIndex, setFrontIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setFrontIndex((i) => (i === 0 ? 1 : 0))
    }, SWAP_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      {/* Bild 1: links ausgerichtet, überlappt in der Mitte */}
      <div
        className="absolute inset-y-0 left-0 w-[72%] transition-opacity duration-300"
        style={{ zIndex: frontIndex === 0 ? 20 : 10 }}
      >
        <div className="relative w-full h-full rounded-l-2xl overflow-hidden shadow-lg">
          <Image
            src={IMAGES[0].src}
            alt={IMAGES[0].alt}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 72vw, 36vw"
          />
        </div>
      </div>
      {/* Bild 2: rechts ausgerichtet, überlappt in der Mitte */}
      <div
        className="absolute inset-y-0 right-0 w-[72%] transition-opacity duration-300"
        style={{ zIndex: frontIndex === 1 ? 20 : 10 }}
      >
        <div className="relative w-full h-full rounded-r-2xl overflow-hidden shadow-lg ml-auto">
          <Image
            src={IMAGES[1].src}
            alt={IMAGES[1].alt}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 72vw, 36vw"
          />
        </div>
      </div>
    </div>
  )
}
