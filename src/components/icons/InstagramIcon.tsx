import type { SVGProps } from 'react'

/**
 * Instagram-Icon im Strichstil von Lucide.
 *
 * lucide-react hat ab Version 1.0 alle Marken-Icons entfernt. Damit Footer und
 * Künstlerliste nicht an der Lucide-Version hängen, liegt das Icon hier selbst.
 * Größe und Farbe kommen wie bei Lucide über className/style und currentColor.
 */
export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}
