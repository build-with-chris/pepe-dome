# Spec: DotCloud Hero Icons

**Status**: Ready
**Priority**: High
**Target**: Visual Enhancement - Hero Sections
**Owner**: Development Team

## Overview

Port the DotCloud particle icon system from pepe-shows into pepe-dome and integrate it as a decorative element within every page's hero section. Each page receives a unique grayscale JPG icon that renders as scattered dots converging into the icon shape on scroll. The existing global `ParticleBackground` remains unchanged.

## Goals

1. Port `imageToDots.ts` library from pepe-shows (canvas-based image-to-particle converter)
2. Create a simplified `DotCloudIcon` component adapted for Next.js App Router
3. Integrate DotCloud icons into the `HeroSection` component via prop-based API
4. Handle the home page's custom hero separately via a client wrapper
5. Provide smooth scroll-triggered convergence animation with accessibility support
6. Maintain performance with two concurrent particle systems (global dots + hero icons)

## User Stories

### Visitors
- As a visitor, I want to see a unique decorative icon in each page's hero that reveals itself as I scroll, adding visual depth
- As a visitor on mobile, I want the decorative icon to be subtle and not impact performance
- As a visitor with reduced-motion preferences, I want the icon visible in a static formed state without animation

### Content Creators
- As a developer, I want to add a DotCloud icon to any hero section with a single prop (`dotCloudIcon="name"`)
- As a designer, I want to create new icons by simply adding grayscale JPG files to `public/doticons/`

## Scope

### In Scope
- Port `imageToDots.ts` library (no modifications needed)
- Create simplified `DotCloudIcon.tsx` component (remove pepe-shows-specific effects)
- Integrate into `HeroSection.tsx` via `dotCloudIcon` prop
- Create `HomeDotCloud.tsx` client wrapper for the server-rendered home page
- Add `dotcloud.css` styles
- Integrate on all 6 pages (home, about, business, events, news, training)
- Create `public/doticons/` directory with placeholder paths
- Performance optimization (noGlow default, IntersectionObserver, CSS transitions)
- Accessibility (`prefers-reduced-motion` support)

### Out of Scope
- Creating the actual icon JPG assets (user will create these separately)
- Modifying the existing `ParticleBackground` system
- Advanced effects from pepe-shows (reverseScroll, dynamicDensity, explosion, color tweening, glitter)
- Hover interactions on the hero DotCloud icons

## Technical Architecture

### Reference Implementation (pepe-shows)

**Library**: `/Users/densen/Dropbox/sen_dev/pepe-shows/frontend/src/lib/imageToDots.ts`
- Exports `Particle` interface: `{ x, y, targetX, targetY, offsetX, offsetY, size, brightness, floatDelay, floatSpeed }`
- Exports `ImageToDotsOptions` interface: `{ imagePath, sampleGap, densityMultiplier, canvasSize, minDotSize, maxDotSize }`
- Exports `imageToParticles(options)` async function - loads grayscale JPG, samples pixels, returns particle array

**Component**: `/Users/densen/Dropbox/sen_dev/pepe-shows/frontend/src/components/ui/DotCloudImage.tsx`
- 570 lines, full-featured with advanced effects
- Core behavior needed: IntersectionObserver, scroll-triggered convergence, idle floating, memoization

### New File Structure

```
src/
  lib/
    imageToDots.ts              # Direct port from pepe-shows (no changes)
  components/
    ui/
      DotCloudIcon.tsx          # Simplified component (~200 lines)
    custom/
      HeroSection.tsx           # MODIFY: add dotCloudIcon prop
      HomeDotCloud.tsx          # Client wrapper for home page
  styling/
    dotcloud.css                # DotCloud-specific styles

public/
  doticons/                     # User-created grayscale JPG icons
    home.jpg                    # Dome/building silhouette
    about.jpg                   # People/community
    business.jpg                # Handshake/corporate
    events.jpg                  # Stage/spotlight
    news.jpg                    # Megaphone/media
    training.jpg                # Acrobat figure
```

### DotCloudIcon Component API

```typescript
export interface DotCloudIconProps {
  /** Icon name - maps to /doticons/{name}.jpg */
  iconName: string;
  /** Display size in px (default: 300) */
  size?: number;
  /** Particle color (default: var(--pepe-gold)) */
  color?: string;
  /** Density multiplier 0.1-2.0 (default: 0.4) */
  density?: number;
  /** Container opacity (default: 0.35) */
  opacity?: number;
  /** Sample gap for image parsing (default: 2) */
  sampleGap?: number;
  /** Min dot size (default: 0.5) */
  minDotSize?: number;
  /** Max dot size (default: 4.0) */
  maxDotSize?: number;
  /** Disable glow behind dots (default: true) */
  noGlow?: boolean;
  /** Additional CSS classes */
  className?: string;
}
```

### Simplifications from pepe-shows

The following features are **removed** from the DOME version:

| Feature | Reason |
|---------|--------|
| `reverseScroll` | Only needed for full-page hero (pepeshows home) |
| `dynamicDensity` | Complex, only relevant with reverseScroll |
| `manualAnimationPosition` | Demo/configurator feature |
| `aspectRatio` | Icons are square in hero context |
| Explosion effects (Phase 4-5) | Too dramatic for subtle hero background |
| Color tweening (white→bronze) | DOME uses single color (blue) |
| Glitter/glow phases | Conflicts with existing ParticleBackground |
| Debug indicators | Development-only feature |
| `dot-cloud-loader` spinner | Silent loading for background element |

### Scroll Behavior (Normal Mode)

Uses the "normal scroll mode" from pepe-shows (lines 193-214):

```
- Element in lower 40% of viewport (topPosition >= 0.6): Fully formed (progress = 1.0)
- Between 10-60% from top: Progressive dissolution with smoothstep easing
- Top 10% or out of viewport: Fully dissolved (progress = 0)
```

This creates a natural "reveal" effect: the icon is formed when first visible, then dissolves as the user scrolls past.

### HeroSection Integration

Add optional props to existing `HeroSectionProps`:

```typescript
export interface HeroSectionProps extends HTMLAttributes<HTMLElement> {
  // ...existing props...
  /** Optional DotCloud icon name for decorative background */
  dotCloudIcon?: string;
  /** DotCloud size override (default: 300) */
  dotCloudSize?: number;
}
```

Import via `next/dynamic` with `ssr: false` to avoid canvas/Image API issues during SSR:

```typescript
import dynamic from 'next/dynamic'
const DotCloudIcon = dynamic(() => import('@/components/ui/DotCloudIcon'), { ssr: false })
```

Render position: absolute, centered, between background and content layers (z-index: 1, below content at z-10).

### Home Page Integration

The home page (`src/app/page.tsx`) is a server component with a custom hero. Solution:

Create `src/components/custom/HomeDotCloud.tsx`:
```typescript
'use client'
import dynamic from 'next/dynamic'
const DotCloudIcon = dynamic(() => import('@/components/ui/DotCloudIcon'), { ssr: false })

export default function HomeDotCloud() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 2 }}>
      <DotCloudIcon iconName="home" size={450} opacity={0.25} noGlow />
    </div>
  )
}
```

Import this client component in the home page and place within the hero section.

### Page Icon Mapping

| Page | Icon File | Concept | DotCloud Size |
|------|-----------|---------|---------------|
| Home | `home.jpg` | Dome/building silhouette | 450px |
| About | `about.jpg` | People/community | 300px |
| Business | `business.jpg` | Handshake/corporate | 300px |
| Events | `events.jpg` | Stage/spotlight | 300px |
| News | `news.jpg` | Megaphone/media | 300px |
| Training | `training.jpg` | Acrobat figure | 300px |

### Icon Requirements (for user to create)

- Format: Grayscale JPG
- Size: 128x128px or 256x256px
- Style: White background (= no dots), dark areas generate dots
- Content: Simple, recognizable silhouettes
- Contrast: Strong black-white contrast for clear particle definition

### Performance Strategy

Two particle systems running concurrently:

| System | Particles | Rendering | Animation |
|--------|-----------|-----------|-----------|
| ParticleBackground (global) | 25 DOM elements | CSS `@keyframes` | Continuous float |
| DotCloudIcon (per hero) | 150-250 DOM elements | Inline styles + CSS transitions | Scroll-triggered |

Mitigation measures:
- `noGlow: true` by default (no expensive box-shadow/filter)
- IntersectionObserver: only initialize when near viewport
- `sampleGap: 2` + `density: 0.4` limits particle count to ~150-250
- CSS transitions for dot movement (GPU-composited via `will-change`)
- `React.memo` prevents re-renders from parent state
- Passive scroll listener: `{ passive: true }`
- Mobile: `window.innerWidth < 768` reduces dot size by 50%
- Responsive CSS: reduced opacity on smaller screens

### Z-Index Stacking

```
z-index: -1  → Stage background gradient
z-index:  0  → ParticleBackground (global dots)
z-index:  1  → DotCloudIcon (hero icon)
z-index: 10  → Hero content (text, buttons)
```

### CSS (dotcloud.css)

```css
.dot-cloud-hero {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.dot-cloud-hero .dot-cloud-container {
  position: relative;
}

.dot-cloud-hero .dot-particle {
  position: absolute;
  border-radius: 50%;
  will-change: transform;
  backface-visibility: hidden;
  transition: left 0.8s cubic-bezier(0.2, 0.8, 0.2, 1),
              top 0.8s cubic-bezier(0.2, 0.8, 0.2, 1),
              transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@media (prefers-reduced-motion: reduce) {
  .dot-cloud-hero .dot-particle {
    transition: none !important;
  }
}

@media (max-width: 768px) {
  .dot-cloud-hero {
    opacity: 0.7;
  }
}
```

## Verification

1. **Build**: `npm run build` passes without SSR errors (canvas/Image APIs only run client-side)
2. **Visual**: Each page shows its unique DotCloud icon behind hero text
3. **Scroll**: Dots converge into icon shape as hero enters viewport, dissolve when scrolled past
4. **Mobile**: Reduced particle count and opacity, no performance issues
5. **Accessibility**: `prefers-reduced-motion` shows static formed state without transitions
6. **Performance**: No jank with both particle systems running (Chrome DevTools Performance tab, target 60fps)
7. **Fallback**: If icon JPG is missing, component renders nothing (no errors in console)
