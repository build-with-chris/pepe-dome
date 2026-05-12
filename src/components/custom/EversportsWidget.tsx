'use client'

import { useEffect, useRef } from 'react'

const LOADER_URL = 'https://widget-static.eversports.io/loader.js'
const SCRIPT_ID = 'eversports-widget-loader'

/**
 * Eversports Buchungs-Widget.
 *
 * Der Loader (loader.js) ist ein ES-Modul, das beim ersten Laden den DOM
 * nach `[data-eversports-widget-id]` scannt und die Widgets hydratisiert.
 * Bei Next.js-Client-Navigation (z. B. DE ↔ EN-Switch) wird das Modul
 * NICHT erneut ausgeführt — das Widget bleibt leer. Beim Mount injecten
 * wir den Loader daher mit einem Cache-Buster, damit das Modul jedes Mal
 * frisch ausgewertet wird und den neu eingehängten div findet.
 */
export default function EversportsWidget({ widgetId }: { widgetId: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    document.getElementById(SCRIPT_ID)?.remove()

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.type = 'module'
    script.src = `${LOADER_URL}?_=${Date.now()}`
    document.body.appendChild(script)

    const container = containerRef.current
    return () => {
      script.remove()
      if (container) container.innerHTML = ''
    }
  }, [widgetId])

  return <div ref={containerRef} data-eversports-widget-id={widgetId} />
}
