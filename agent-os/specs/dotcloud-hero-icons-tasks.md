# Task Breakdown: DotCloud Hero Icons

## Overview
Total Tasks: 27
Port the DotCloud particle icon system from pepe-shows into pepe-dome and integrate it as a decorative element in every page's hero section.

## Task List

### Foundation Layer

#### Task Group 1: Library & Styles Setup
**Dependencies:** None

- [x] 1.0 Complete foundation layer
  - [x] 1.1 Port `imageToDots.ts` library from pepe-shows
    - Source: `/Users/densen/Dropbox/sen_dev/pepe-shows/frontend/src/lib/imageToDots.ts`
    - Target: `/Users/densen/Dropbox/sen_dev/pepe-dome/src/lib/imageToDots.ts`
    - Direct port with no modifications needed
    - Exports: `Particle` interface, `ImageToDotsOptions` interface, `imageToParticles()` async function
  - [x] 1.2 Create `dotcloud.css` stylesheet
    - Target: `/Users/densen/Dropbox/sen_dev/pepe-dome/src/styling/dotcloud.css`
    - Classes: `.dot-cloud-hero`, `.dot-cloud-container`, `.dot-particle`
    - Include CSS transitions for dot movement (cubic-bezier easing)
    - Include `will-change: transform` and `backface-visibility: hidden` for GPU compositing
    - Include `@media (prefers-reduced-motion: reduce)` rule to disable transitions
    - Include `@media (max-width: 768px)` rule to reduce opacity to 0.7
  - [x] 1.3 Create `public/doticons/` directory with placeholder structure
    - Target: `/Users/densen/Dropbox/sen_dev/pepe-dome/public/doticons/`
    - Create directory (actual JPG icon assets will be created separately by user)
    - Required icons: `home.jpg`, `about.jpg`, `business.jpg`, `events.jpg`, `news.jpg`, `training.jpg`
    - Icon spec: 128x128 or 256x256 grayscale JPG, white background = no dots, dark = dots
  - [x] 1.4 Import `dotcloud.css` in global styles or layout
    - Add import in the appropriate location (layout.tsx or global CSS imports)

**Acceptance Criteria:**
- `imageToDots.ts` is at `src/lib/imageToDots.ts` with correct TypeScript types
- `dotcloud.css` is at `src/styling/dotcloud.css` with all specified rules
- `public/doticons/` directory exists
- CSS is imported and available globally

---

### Component Layer

#### Task Group 2: DotCloudIcon Component
**Dependencies:** Task Group 1

- [x] 2.0 Complete DotCloudIcon component
  - [ ] 2.1 Write 4 focused tests for DotCloudIcon
    - Test: component renders without errors when iconName is provided
    - Test: component renders nothing (no errors) when icon JPG is missing
    - Test: `prefers-reduced-motion` disables CSS transitions
    - Test: mobile viewport reduces dot size by 50%
  - [x] 2.2 Create `DotCloudIcon.tsx` component
    - Target: `/Users/densen/Dropbox/sen_dev/pepe-dome/src/components/ui/DotCloudIcon.tsx`
    - Simplified version (~200 lines) of pepe-shows DotCloudImage.tsx (570 lines)
    - Props interface: `iconName`, `size` (default 300), `color` (default var(--pepe-gold)), `density` (default 0.4), `opacity` (default 0.35), `sampleGap` (default 2), `minDotSize` (default 0.5), `maxDotSize` (default 4.0), `noGlow` (default true), `className`
    - Must be a client component (`'use client'`)
    - Must use `React.memo` for memoization
  - [x] 2.3 Implement IntersectionObserver for lazy initialization
    - Only load particles when component is near viewport (rootMargin: 200px)
    - Use `useLayoutEffect` for observer setup
    - Disconnect observer once visible
  - [x] 2.4 Implement scroll-triggered convergence (normal mode only)
    - Element in lower 40% of viewport (topPosition >= 0.6): fully formed (progress = 1.0)
    - Between 10-60% from top: progressive dissolution with smoothstep easing
    - Top 10% or out of viewport: fully dissolved (progress = 0)
    - Use passive scroll listener: `{ passive: true }`
  - [x] 2.5 Implement particle rendering with inline styles
    - Scale from 128px canvas to display size
    - Interpolate between idle (spread) and formed positions based on scroll progress
    - Apply contrast boost for darker particles when formed
    - Mobile: reduce dot size by 50% when `window.innerWidth < 768`
    - Render as `<span>` elements with `.dot-particle` class
  - [x] 2.6 Implement error handling and silent fallback
    - If image load fails: render nothing (no error UI, no console errors visible to user)
    - Graceful cleanup with mounted flag pattern
  - [ ] 2.7 Ensure DotCloudIcon tests pass
    - Run ONLY the 4 tests written in 2.1

**Removed from pepe-shows (NOT to implement):**
- `reverseScroll`, `dynamicDensity`, `manualAnimationPosition`, `aspectRatio`
- Explosion effects (Phase 4-5), color tweening, glitter/glow phases
- Debug indicators, loader spinner, hover interactions

**Acceptance Criteria:**
- The 4 tests from 2.1 pass
- Component loads particles from `/doticons/{name}.jpg` via canvas sampling
- Scroll convergence animation works smoothly
- No SSR errors (component is client-only)
- `noGlow: true` by default prevents expensive box-shadow/filter
- `React.memo` wraps the export

---

### Integration Layer

#### Task Group 3: HeroSection Integration
**Dependencies:** Task Group 2

- [x] 3.0 Complete HeroSection integration
  - [ ] 3.1 Write 3 focused tests for HeroSection dotCloudIcon prop
    - Test: HeroSection renders without DotCloudIcon when `dotCloudIcon` prop is not provided
    - Test: HeroSection renders DotCloudIcon layer when `dotCloudIcon="about"` is provided
    - Test: DotCloudIcon layer has correct z-index positioning (z-1, below content at z-10)
  - [x] 3.2 Add `dotCloudIcon` and `dotCloudSize` props to HeroSectionProps
    - File: `/Users/densen/Dropbox/sen_dev/pepe-dome/src/components/custom/HeroSection.tsx`
    - Add `dotCloudIcon?: string` - optional icon name mapping to `/doticons/{name}.jpg`
    - Add `dotCloudSize?: number` - size override (default: 300)
  - [x] 3.3 Import DotCloudIcon via `next/dynamic` with `ssr: false`
    - Prevents canvas/Image API errors during server-side rendering
    - Pattern: `const DotCloudIcon = dynamic(() => import('@/components/ui/DotCloudIcon'), { ssr: false })`
  - [x] 3.4 Render DotCloudIcon layer between background and content
    - Position: absolute, centered, `pointer-events-none`
    - Z-index stacking: z-index 1 (between background at z-0 and content at z-10)
    - Only render when `dotCloudIcon` prop is truthy
    - Pass `noGlow={true}` and `opacity={0.35}` as defaults
  - [ ] 3.5 Ensure HeroSection tests pass
    - Run ONLY the 3 tests written in 3.1

**Acceptance Criteria:**
- The 3 tests from 3.1 pass
- Existing HeroSection behavior unchanged when `dotCloudIcon` not provided
- DotCloudIcon renders in correct layer when prop is provided
- No SSR errors from dynamic import

---

### Home Page Layer

#### Task Group 4: Home Page DotCloud Integration
**Dependencies:** Task Group 2

- [x] 4.0 Complete home page DotCloud integration
  - [x] 4.1 Create `HomeDotCloud.tsx` client wrapper component
    - Target: `/Users/densen/Dropbox/sen_dev/pepe-dome/src/components/custom/HomeDotCloud.tsx`
    - Must be `'use client'` (home page is a server component)
    - Import DotCloudIcon via `next/dynamic` with `ssr: false`
    - Render wrapper div: `absolute inset-0 flex items-center justify-center pointer-events-none` with `z-index: 2`
    - DotCloudIcon props: `iconName="home"`, `size={450}`, `opacity={0.25}`, `noGlow={true}`
  - [x] 4.2 Integrate HomeDotCloud in home page hero section
    - File: `/Users/densen/Dropbox/sen_dev/pepe-dome/src/app/page.tsx`
    - Import `HomeDotCloud` component
    - Place inside the hero section `<section>` tag, after background elements and before content
    - Position between background image gradients and the `stage-container` div

**Acceptance Criteria:**
- HomeDotCloud renders within the home page hero without breaking server component
- DotCloud icon appears at 450px size with 0.25 opacity
- No hydration errors from client/server component boundary

---

### Page Integration Layer

#### Task Group 5: Add DotCloud Icons to All Pages
**Dependencies:** Task Groups 3, 4

- [x] 5.0 Complete page-level DotCloud integration
  - [x] 5.1 Add `dotCloudIcon="about"` to About page HeroSection
    - File: `/Users/densen/Dropbox/sen_dev/pepe-dome/src/app/about/page.tsx`
    - Add prop: `dotCloudIcon="about"` (default size 300px)
  - [x] 5.2 Add `dotCloudIcon="business"` to Business page HeroSection
    - File: `/Users/densen/Dropbox/sen_dev/pepe-dome/src/app/business/page.tsx`
    - Add prop: `dotCloudIcon="business"` (default size 300px)
  - [x] 5.3 Add `dotCloudIcon="events"` to Events page HeroSection
    - File: `/Users/densen/Dropbox/sen_dev/pepe-dome/src/app/events/page.tsx`
    - Add prop: `dotCloudIcon="events"` (default size 300px)
  - [x] 5.4 Add `dotCloudIcon="news"` to News page HeroSection
    - File: `/Users/densen/Dropbox/sen_dev/pepe-dome/src/app/news/page.tsx`
    - Add prop: `dotCloudIcon="news"` (default size 300px)
  - [x] 5.5 Add `dotCloudIcon="training"` to Training page HeroSection
    - File: `/Users/densen/Dropbox/sen_dev/pepe-dome/src/app/training/page.tsx`
    - Add prop: `dotCloudIcon="training"` (default size 300px)

**Acceptance Criteria:**
- All 5 subpages pass `dotCloudIcon` prop to HeroSection
- Home page uses HomeDotCloud wrapper (from Task Group 4)
- Each page uses its unique icon name matching `public/doticons/{name}.jpg`

---

### Verification Layer

#### Task Group 6: Build Verification & Testing
**Dependencies:** Task Groups 1-5

- [ ] 6.0 Complete verification
  - [x] 6.1 Run `npm run build` - verify no SSR errors
    - Canvas/Image APIs must only execute client-side
    - No hydration mismatches from dynamic imports
    - All TypeScript types resolve correctly
  - [ ] 6.2 Visual verification on each page
    - Each page shows its unique DotCloud icon behind hero text
    - Icon is visible but subtle (opacity 0.35 for subpages, 0.25 for home)
    - Z-index stacking correct: background < DotCloudIcon < content
  - [ ] 6.3 Scroll behavior verification
    - Dots converge into icon shape as hero enters viewport
    - Dots dissolve when scrolled past top 10% of viewport
    - Smoothstep easing provides natural feel
  - [ ] 6.4 Mobile/responsive verification
    - Reduced dot size (50%) on viewports < 768px
    - Reduced container opacity (0.7) via CSS media query
    - No performance degradation on mobile
  - [ ] 6.5 Accessibility verification
    - `prefers-reduced-motion: reduce` shows static formed state without transitions
    - All DotCloud elements have `pointer-events: none`
    - No interference with keyboard navigation or screen readers
  - [ ] 6.6 Performance verification
    - Both particle systems (ParticleBackground + DotCloudIcon) run at 60fps
    - Chrome DevTools Performance tab shows no jank
    - Particle count stays within 150-250 range per icon
    - `noGlow: true` eliminates expensive box-shadow/filter operations
  - [ ] 6.7 Fallback verification
    - Missing icon JPG renders nothing (no errors in console)
    - Component gracefully handles canvas context unavailable scenario
  - [ ] 6.8 Run all feature-specific tests
    - Run tests from 2.1 (4 tests) + 3.1 (3 tests) = 7 tests total
    - All tests pass

**Acceptance Criteria:**
- `npm run build` passes cleanly
- All 7 feature-specific tests pass
- Visual, scroll, mobile, accessibility, and performance checks verified
- No console errors with missing icon files

---

## File Manifest

| File | Action | Task |
|------|--------|------|
| `src/lib/imageToDots.ts` | CREATE (port) | 1.1 |
| `src/styling/dotcloud.css` | CREATE | 1.2 |
| `public/doticons/` | CREATE (directory) | 1.3 |
| `src/components/ui/DotCloudIcon.tsx` | CREATE | 2.2-2.6 |
| `src/components/custom/HeroSection.tsx` | MODIFY | 3.2-3.4 |
| `src/components/custom/HomeDotCloud.tsx` | CREATE | 4.1 |
| `src/app/page.tsx` | MODIFY | 4.2 |
| `src/app/about/page.tsx` | MODIFY | 5.1 |
| `src/app/business/page.tsx` | MODIFY | 5.2 |
| `src/app/events/page.tsx` | MODIFY | 5.3 |
| `src/app/news/page.tsx` | MODIFY | 5.4 |
| `src/app/training/page.tsx` | MODIFY | 5.5 |

## Execution Order

Recommended implementation sequence:
1. **Foundation** (Task Group 1) - Port library, create CSS, set up directory
2. **Component** (Task Group 2) - Build DotCloudIcon with tests
3. **HeroSection Integration** (Task Group 3) - Add prop-based API to HeroSection
4. **Home Page** (Task Group 4) - Create client wrapper for server-rendered home page
5. **Page Integration** (Task Group 5) - Wire up all 5 subpages
6. **Verification** (Task Group 6) - Build check, visual testing, performance, accessibility

## Performance Budget

| System | Particles | Rendering | Animation |
|--------|-----------|-----------|-----------|
| ParticleBackground (global) | 25 DOM elements | CSS `@keyframes` | Continuous float |
| DotCloudIcon (per hero) | 150-250 DOM elements | Inline styles + CSS transitions | Scroll-triggered |

## Z-Index Reference

```
z-index: -1  -> Stage background gradient
z-index:  0  -> ParticleBackground (global dots)
z-index:  1  -> DotCloudIcon (hero icon) [z-2 for home page]
z-index: 10  -> Hero content (text, buttons)
```
