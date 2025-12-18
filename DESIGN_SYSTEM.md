# Pepe Dome Design System

Complete design system documentation for the Pepe Dome platform. This design system is based on the PEPE Shows brand with a warm golden theater lighting theme.

## Brand Identity

### Logo
The Pepe Dome logo features:
- White "PEPE" text in Outfit Bold font
- Golden "DOME" text (#D4A574) in Outfit Bold font
- Located at [/public/PEPE_logos_dome.svg](public/PEPE_logos_dome.svg)

### Brand Voice
Warm, welcoming, and theatrical - like stepping into a spotlight on stage. The gold accents evoke the warmth of stage lighting and the excitement of live performance.

## Color System

### Core Colors

#### Black Tones
```css
--pepe-black: #000000     /* Pure black - backgrounds */
--pepe-dark: #111111      /* Dark gray - surfaces */
--pepe-ink: #161616       /* Ink black - cards */
--pepe-coal: #0A0A0A      /* Coal black - deep backgrounds */
--pepe-surface: #1A1A1A   /* Surface gray - elevated elements */
```

#### Text Hierarchy
```css
--pepe-white: #FFFFFF                  /* Primary text - 100% */
--pepe-t80: rgba(255, 255, 255, 0.80) /* Body text - 80% */
--pepe-t64: rgba(255, 255, 255, 0.64) /* Secondary text - 64% */
--pepe-t48: rgba(255, 255, 255, 0.48) /* Tertiary text - 48% */
--pepe-t32: rgba(255, 255, 255, 0.32) /* Disabled text - 32% */
```

#### UI Elements
```css
--pepe-line: #333333           /* Border lines */
--pepe-line2: #292929          /* Subtle borders */
--pepe-line-light: #3A3A3A     /* Light borders */
```

### Accent Colors - Golden Theatre Lighting

#### Primary Gold
```css
--pepe-gold: #D4A574                    /* Primary golden accent */
--pepe-gold-hover: #E6B887              /* Hover state - brighter */
--pepe-gold-active: #C19A64             /* Active/pressed state */
--pepe-gold-glow: rgba(212, 165, 116, 0.25)  /* Glow effect */
--pepe-gold-glow-strong: rgba(212, 165, 116, 0.4)
```

#### Secondary Warm Tones
```css
--pepe-bronze: #B8860B         /* Bronze accent for depth */
--pepe-bronze-hover: #C69315   /* Hover state */
--pepe-bronze-active: #9C6F09  /* Active state */
--pepe-bronze-glow: rgba(184, 134, 11, 0.25)
--pepe-amber: #FFBF00          /* Bright amber highlights */
--pepe-copper: #B87333         /* Copper tone variation */
```

### Semantic Colors
```css
--pepe-success: #00DC82
--pepe-success-bg: rgba(0, 220, 130, 0.1)

--pepe-warning: #FFB800
--pepe-warning-bg: rgba(255, 184, 0, 0.1)

--pepe-error: #FF3B3B
--pepe-error-bg: rgba(255, 59, 59, 0.1)

--pepe-info: #0096FF
--pepe-info-bg: rgba(0, 150, 255, 0.1)
```

## Typography

### Font Families
- **Display**: Outfit (headings, logo, UI labels)
- **Body**: Inter (body text, paragraphs)
- **Mono**: JetBrains Mono (code, technical content)

### Font Scale
```css
--text-xs: 0.75rem      /* 12px */
--text-sm: 0.875rem     /* 14px */
--text-base: 1rem       /* 16px */
--text-lg: 1.125rem     /* 18px */
--text-xl: 1.25rem      /* 20px */
--text-2xl: 1.5-1.75rem /* 24-28px (fluid) */
--text-3xl: 1.75-2.25rem /* 28-36px (fluid) */
--text-4xl: 2-3rem      /* 32-48px (fluid) */
--text-5xl: 2.25-3.75rem /* 36-60px (fluid) */
--text-6xl: 2.5-4.5rem  /* 40-72px (fluid) */
--text-7xl: 4.5-6rem    /* 72-96px (fluid) */
```

### Font Weights
```css
--font-thin: 100
--font-light: 300
--font-regular: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
--font-extrabold: 800
--font-black: 900
```

### Heading Styles
- **H1**: Display font, 36-60px, extrabold, tight line height
- **H2**: Display font, 32-48px, bold, tight line height
- **H3**: Display font, 28-36px, semibold, snug line height
- **H4**: Display font, 24-28px, semibold, snug line height
- **H5**: Display font, 20px, medium, normal line height
- **H6**: Display font, 18px, medium, wide letter spacing

## Spacing System

### Scale
Based on a 4px (0.25rem) base unit:
```css
--space-1: 0.25rem    /* 4px */
--space-2: 0.5rem     /* 8px */
--space-3: 0.75rem    /* 12px */
--space-4: 1rem       /* 16px */
--space-5: 1.25rem    /* 20px */
--space-6: 1.5rem     /* 24px */
--space-8: 2rem       /* 32px */
--space-10: 2.5rem    /* 40px */
--space-12: 3rem      /* 48px */
--space-16: 4rem      /* 64px */
--space-20: 5rem      /* 80px */
--space-24: 6rem      /* 96px */
```

### Common Patterns
- **Card padding**: 24-32px (space-6 to space-8)
- **Section spacing**: 64-80px (space-16 to space-20)
- **Element gap**: 16-24px (space-4 to space-6)
- **Button padding**: 12px 20px (space-3 space-5)

## Border Radius

```css
--radius-sm: 0.25rem   /* 4px - small elements */
--radius-md: 0.5rem    /* 8px - cards */
--radius-lg: 0.75rem   /* 12px - buttons */
--radius-xl: 1rem      /* 16px - large buttons */
--radius-2xl: 1.25rem  /* 20px - featured cards */
--radius-3xl: 1.5rem   /* 24px - hero elements */
--radius-full: 9999px  /* pills, avatars */
```

## Shadows & Depth

### Standard Shadows
```css
--shadow-sm: 0 2px 4px 0 rgba(0, 0, 0, 0.1)
--shadow-md: 0 4px 8px 0 rgba(0, 0, 0, 0.15)
--shadow-lg: 0 8px 16px 0 rgba(0, 0, 0, 0.2)
--shadow-xl: 0 12px 28px 0 rgba(0, 0, 0, 0.35)
--shadow-2xl: 0 24px 48px 0 rgba(0, 0, 0, 0.4)
```

### Glow Effects
```css
--shadow-glow-sm: 0 0 8px var(--pepe-gold-glow)
--shadow-glow-md: 0 0 16px var(--pepe-gold-glow)
--shadow-glow-lg: 0 0 24px var(--pepe-gold-glow)
--shadow-glow-xl: 0 0 40px var(--pepe-gold-glow)
```

## Components

### Buttons

#### Variants

**Primary Button** (Gold/Bronze)
```tsx
<button className="btn btn-primary btn-md">
  Book Event
</button>
```
- Background: `--pepe-bronze`
- Hover: Lift effect, glow, brighter gold
- Use for: Primary CTAs, important actions

**Secondary Button** (Outlined)
```tsx
<button className="btn btn-secondary btn-md">
  Learn More
</button>
```
- Border: `--pepe-line`
- Hover: Border turns white, subtle background
- Use for: Secondary actions, less emphasis

**Ghost Button** (Transparent)
```tsx
<button className="btn btn-ghost btn-md">
  Cancel
</button>
```
- Background: transparent
- Hover: Subtle background
- Use for: Tertiary actions, cancel buttons

#### Sizes
- **xs**: Extra small (6px 12px) - compact UI
- **sm**: Small (8px 16px) - tight spaces
- **md**: Medium (12px 20px) - default
- **lg**: Large (16px 24px) - emphasis
- **xl**: Extra large (20px 32px) - hero CTAs

### Cards

#### Event Card
```tsx
<div className="event-card">
  <img src="..." alt="..." className="event-card-image" />
  <div className="event-card-content">
    <div className="event-card-meta">
      <span className="event-card-date">Nov 15, 2025</span>
      <span className="event-card-category">Workshop</span>
    </div>
    <h3 className="event-card-title">Event Title</h3>
    <p className="event-card-description">Description...</p>
  </div>
</div>
```

#### News Card
```tsx
<div className="news-card">
  <img src="..." alt="..." className="news-card-image" />
  <div className="news-card-content">
    <span className="news-card-category">Announcement</span>
    <h3 className="news-card-title">Article Title</h3>
    <p className="news-card-excerpt">Excerpt...</p>
    <div className="news-card-meta">
      <span className="news-card-author">Author Name</span>
      <span className="news-card-date">Nov 10, 2025</span>
    </div>
  </div>
</div>
```

### Forms

#### Input Field
```tsx
<div className="form-group">
  <label className="form-label">Email Address</label>
  <input
    type="email"
    className="form-input"
    placeholder="your@email.com"
  />
  <span className="form-hint">We'll never share your email</span>
</div>
```

#### Textarea
```tsx
<div className="form-group">
  <label className="form-label">Message</label>
  <textarea
    className="form-textarea"
    rows={4}
    placeholder="Your message..."
  />
</div>
```

### Navigation

#### Navbar
- Height: 80px (5rem)
- Background: `bg-black/90` with `backdrop-blur-lg`
- Border: Bottom border with `border-pepe-line`
- Logo: 64px height
- Links: 14px, medium weight, gold on active

#### Footer
- Background: `--pepe-ink`
- Padding: 48px vertical
- Links: Small text, secondary color
- Layout: Multi-column grid

## Animation & Transitions

### Timing Functions
```css
--ease-linear: linear
--ease-in: cubic-bezier(0.4, 0, 1, 1)
--ease-out: cubic-bezier(0, 0, 0.2, 1)
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
--ease-spring: cubic-bezier(0.2, 0.8, 0.2, 1)
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

### Durations
```css
--duration-fast: 150ms     /* Quick transitions */
--duration-normal: 300ms   /* Standard transitions */
--duration-slow: 500ms     /* Slower animations */
--duration-slowest: 1000ms /* Long animations */
```

### Common Animations

**Fade In**
```css
.animate-fadeIn {
  animation: fadeIn 300ms ease-out both;
}
```

**Hover Lift**
```css
.hover-lift:hover {
  transform: translateY(-4px);
  transition: transform 300ms var(--ease-spring);
}
```

**Glow Pulse**
```css
.animate-glowPulse {
  animation: glowPulse 2s ease-in-out infinite;
}
```

## Layout Patterns

### Container
```tsx
<div className="container">
  {/* Max width: 1280px, centered, responsive padding */}
</div>
```

### Grid Layouts
```tsx
{/* 3-column grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Items */}
</div>
```

### Section Spacing
```tsx
<section className="py-16 md:py-20 lg:py-24">
  {/* Content */}
</section>
```

## Breakpoints

```css
--screen-sm: 640px   /* Small tablets */
--screen-md: 768px   /* Tablets */
--screen-lg: 1024px  /* Laptops */
--screen-xl: 1280px  /* Desktops */
--screen-2xl: 1536px /* Large desktops */
```

### Media Query Usage
- **Mobile first**: Start with mobile styles, add `md:` and `lg:` prefixes
- **Tablet (768px)**: 2-column grids, larger text
- **Desktop (1024px)**: 3+ column grids, full navigation
- **Large (1280px)**: Max container width, optimal reading experience

## Accessibility

### Focus States
All interactive elements must have visible focus indicators:
```css
.btn:focus-visible {
  outline: 2px solid var(--pepe-gold);
  outline-offset: 2px;
}
```

### Color Contrast
- Primary text (#FFFFFF) on black: 21:1 ratio
- Secondary text (rgba(255,255,255,0.8)): 18:1 ratio
- Gold accent (#D4A574) on black: 4.8:1 ratio (meets AA)

### Motion Preferences
Respects `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Best Practices

### Component Hierarchy
1. Use semantic HTML (`<article>`, `<section>`, `<nav>`)
2. Apply utility classes for spacing and layout
3. Use component classes for complex patterns
4. Keep specificity low for maintainability

### Performance
- Use CSS custom properties for theme values
- Leverage hardware acceleration with `transform` and `opacity`
- Add `will-change` for frequently animated elements
- Lazy load images and heavy components

### Consistency
- Use design tokens from [tokens.css](src/styling/tokens.css)
- Follow spacing scale for all margins/padding
- Use typography scale for all text sizes
- Apply standard border radius values

## Resources

### Files
- Design tokens: [src/styling/tokens.css](src/styling/tokens.css)
- Typography: [src/styling/typography.css](src/styling/typography.css)
- Animations: [src/styling/animations.css](src/styling/animations.css)
- Components: [src/styling/components.css](src/styling/components.css)

### Logo
- SVG Logo: [public/PEPE_logos_dome.svg](public/PEPE_logos_dome.svg)

### Fonts
- Outfit: Google Fonts (Display, headings)
- Inter: Google Fonts (Body text)
- JetBrains Mono: Google Fonts (Code, monospace)
