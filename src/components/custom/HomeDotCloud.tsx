'use client'

import dynamic from 'next/dynamic'

const DotCloudIcon = dynamic(() => import('@/components/ui/DotCloudIcon'), { ssr: false })

/**
 * HomeDotCloud - Client wrapper for the home page hero DotCloud icon
 *
 * The home page is a server component, so this client wrapper allows
 * the DotCloudIcon to render without hydration issues.
 */
export default function HomeDotCloud() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ zIndex: 2 }}
    >
      <DotCloudIcon
        // "placeholder" ist das Motiv, das hier schon immer zu sehen war: Eine
        // Datei /doticons/home.jpg gab es nie. Die Komponente fragte sie bei
        // jedem Aufruf der Startseite an, bekam eine 404 und nahm dann den
        // Platzhalter. Jetzt ohne den vergeblichen Abruf.
        iconName="placeholder"
        size={450}
        opacity={0.25}
        noGlow={true}
      />
    </div>
  )
}
