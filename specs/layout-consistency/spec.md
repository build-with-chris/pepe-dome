# Layout Consistency Spec

## Overview

This spec defines the standardized vertical spacing system for the Pepe Dome website. All public-facing pages must follow these patterns to ensure visual consistency and rhythm across the platform.

## Spacing Scale

The project uses a 4px base unit system via CSS custom properties (`--space-*`). The Tailwind equivalents are used inline:

| Token | Value | Tailwind |
|-------|-------|----------|
| --space-2 | 8px | `2` |
| --space-3 | 12px | `3` |
| --space-4 | 16px | `4` |
| --space-5 | 20px | `5` |
| --space-6 | 24px | `6` |
| --space-8 | 32px | `8` |
| --space-10 | 40px | `10` |
| --space-12 | 48px | `12` |
| --space-16 | 64px | `16` |
| --space-20 | 80px | `20` |
| --space-24 | 96px | `24` |

## Standardized Patterns

### 1. Section Vertical Padding

All page sections use consistent responsive padding:

```
py-16 md:py-24
```

This gives 64px on mobile and 96px on desktop between sections.

### 2. Section Header (Centered)

Used for introducing a section with title + subtitle above a grid/list:

```
<div className="text-center mb-12">
  <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-5">
    Section Title
  </h2>
  <p className="text-lg text-[var(--pepe-t64)] max-w-2xl mx-auto leading-relaxed">
    Section subtitle text
  </p>
</div>
```

Key values:
- `mb-12` (48px) between header block and content grid
- `mb-5` (20px) between h2 and subtitle paragraph

### 3. Section Header (Flex Row with Action)

Used for sections with a "View All" button:

```
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
  <div>
    <h2 className="text-3xl md:text-4xl font-bold text-[var(--pepe-white)] mb-3">
      Section Title
    </h2>
    <p className="text-[var(--pepe-t64)] text-lg">
      Subtitle
    </p>
  </div>
  <Button variant="ghost" size="sm">Action</Button>
</div>
```

Key values:
- `mb-12` (48px) between header and content
- `mb-3` (12px) between h2 and subtitle (tighter because of inline layout)
- `gap-4` (16px) between title block and action button

### 4. Card Padding

All cards use responsive padding:

```
p-6 md:p-8
```

This gives 24px on mobile and 32px on desktop.

### 5. Card Content: Icon -> Title -> Description

For cards with icon, title, and description in vertical stack (e.g., disciplines, values, features):

```
<div className="w-16 h-16 mx-auto mb-5 ... flex items-center justify-center">
  <span className="text-3xl leading-none">{icon}</span>
</div>
<h3 className="text-xl font-bold ... mb-4">Title</h3>
<p className="... leading-relaxed">Description</p>
```

Key values:
- `mb-5` (20px) between icon container and title
- `mb-4` (16px) between title and description
- `leading-none` on emoji/icon spans for proper vertical centering

### 6. Feature List Items (Icon + Text)

For icon+heading+description rows (e.g., venue features, facility features):

```
<div className="space-y-8">
  <div className="flex items-start gap-5">
    <div className="w-12 h-12 rounded-xl ... flex items-center justify-center flex-shrink-0">
      <span className="text-xl">{icon}</span>
    </div>
    <div>
      <h4 className="... font-semibold mb-3">Heading</h4>
      <p className="... leading-relaxed">Description</p>
    </div>
  </div>
</div>
```

Key values:
- `space-y-8` (32px) between list items
- `gap-5` (20px) between icon and text
- `mb-3` (12px) between heading and description

### 7. CTA Sections (Centered with Icon)

```
<div className="max-w-3xl mx-auto text-center">
  <div className="w-16 h-16 mx-auto mb-8 rounded-full ... flex items-center justify-center">
    <span className="text-3xl leading-none">{icon}</span>
  </div>
  <h2 className="text-3xl md:text-4xl font-bold ... mb-5">CTA Title</h2>
  <p className="text-lg mb-10">Subtitle</p>
  <div className="flex flex-wrap justify-center gap-4">
    {buttons}
  </div>
</div>
```

Key values:
- `mb-8` (32px) between decorative icon and heading
- `mb-5` (20px) between heading and subtitle
- `mb-10` (40px) between subtitle and buttons
- `gap-4` (16px) between buttons
- `leading-none` on emoji/icon for centering

### 8. Pricing List Items

```
<div className="space-y-5">
  <div className="flex items-center justify-between py-5 border-b ... last:border-0">
    <div>
      <p className="font-medium">{name}</p>
      <p className="text-sm mt-2">{description}</p>
    </div>
    <span className="font-bold text-lg ml-4">{price}</span>
  </div>
</div>
```

Key values:
- `space-y-5` (20px) between items
- `py-5` (20px) vertical padding per row
- `mt-2` (8px) between name and description

### 9. Stat/Info Cards (Label + Value)

```
<div className="... rounded-xl p-6">
  <p className="text-sm mb-3">{label}</p>
  <p className="font-semibold text-lg">{value}</p>
</div>
```

Key values:
- `p-6` (24px) internal padding
- `mb-3` (12px) between label and value
- `text-lg` on value for visual hierarchy

### 10. Service/Package Cards (Feature Lists)

```
<ul className="space-y-4">
  <li className="flex items-center gap-3">
    <span>✓</span>
    {feature}
  </li>
</ul>
```

Key values:
- `space-y-4` (16px) between list items
- `gap-3` (12px) between checkmark and text

### 11. Two-Column Layouts

```
<div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
  {content}
  {image}
</div>
```

Key values:
- `gap-12` (48px) on mobile between columns
- `lg:gap-20` (80px) on desktop between columns

### 12. Content Grids

```
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {cards}
</div>
```

Key values:
- `gap-6` (24px) between all grid items

## Summary of Standardized Values

| Pattern | Value | Purpose |
|---------|-------|---------|
| Section padding | `py-16 md:py-24` | Between page sections |
| Header → content | `mb-12` | Section header to grid/list |
| h2 → subtitle | `mb-5` | Title to description in headers |
| Icon → title (cards) | `mb-5` | Decorative icon to heading |
| Title → desc (cards) | `mb-4` | Card heading to body text |
| h4 → desc (features) | `mb-3` | Feature item heading to text |
| CTA icon → heading | `mb-8` | Decorative CTA icon to title |
| CTA heading → text | `mb-5` | CTA title to subtitle |
| CTA text → buttons | `mb-10` | CTA subtitle to actions |
| Label → value (stats) | `mb-3` | Stat card label to value |
| Name → sublabel | `mt-2` | Pricing name to description |
| List items (pricing) | `py-5` | Padding per pricing row |
| List items (features) | `space-y-8` | Between icon+text features |
| List items (services) | `space-y-4` | Between checkmark items |
| Card padding | `p-6 md:p-8` | Internal card padding |
| Grid gap | `gap-6` | Between grid cards |
| Two-col gap | `gap-12 lg:gap-20` | Two-column layout spacing |
| Button group gap | `gap-4` | Between CTA buttons |

## Files Affected

- `src/app/page.tsx` - Home page
- `src/app/training/page.tsx` - Training page
- `src/app/business/page.tsx` - Business page
- `src/app/about/page.tsx` - About page
- `src/app/events/page.tsx` - Events page
- `src/app/news/page.tsx` - News page
- `src/components/custom/EventCard.tsx` - Event card component
- `src/components/custom/NewsCard.tsx` - News card component
- `src/components/custom/HeroSection.tsx` - Hero section component
