# Pepe Dome Component Library

Complete guide to using the Pepe Dome React component library.

## Overview

The Pepe Dome component library provides pre-built, accessible React components that follow the PEPE design system with warm golden theatre lighting aesthetics.

## Installation

Components are located in `src/components/ui/` and can be imported using:

```tsx
import { Button, Card, EventCard, NewsCard, Input } from '@/components/ui'
```

## Components

### Button

Flexible button component with multiple variants and sizes.

#### Props

```tsx
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}
```

#### Usage

```tsx
import { Button } from '@/components/ui'

// Primary button (default)
<Button variant="primary" size="md">
  Book Now
</Button>

// Secondary button
<Button variant="secondary" size="lg">
  Learn More
</Button>

// Ghost button
<Button variant="ghost" size="sm">
  Cancel
</Button>

// Extra small button
<Button variant="primary" size="xs">
  View
</Button>

// Extra large button
<Button variant="primary" size="xl">
  Get Started
</Button>
```

#### Variants

**Primary** - Golden/bronze accent for main CTAs
- Background: Bronze (#B8860B)
- Hover: Brighter gold with lift effect and glow
- Use: Primary actions, important CTAs

**Secondary** - Outlined style for secondary actions
- Border: Line color (#333333)
- Hover: White border with subtle background
- Use: Secondary actions, less emphasis

**Ghost** - Transparent background for tertiary actions
- Background: Transparent
- Hover: Subtle white background
- Use: Tertiary actions, cancel buttons

### Card

Basic card container with glass and interactive variants.

#### Props

```tsx
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'interactive'
}
```

#### Usage

```tsx
import { Card } from '@/components/ui'

// Default card
<Card>
  <p>Card content</p>
</Card>

// Glass morphism card
<Card variant="glass">
  <p>Glassmorphic content</p>
</Card>

// Interactive card with hover effects
<Card variant="interactive">
  <p>Hoverable content</p>
</Card>
```

### EventCard

Specialized card for displaying events with image, date, category, and description.

#### Props

```tsx
interface EventCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  date: string
  category?: string
  image?: string
  href?: string
}
```

#### Usage

```tsx
import { EventCard } from '@/components/ui'

<EventCard
  title="Comedy Night"
  description="An evening of laughter with top comedians"
  date="Nov 15, 2025"
  category="Show"
  image="/events/comedy-night.jpg"
  href="/events/comedy-night"
/>
```

#### Features

- Automatic link wrapper when `href` is provided
- Image with zoom effect on hover
- Category badge with gold accent
- Responsive layout
- Truncated description (3 lines max)

#### Grid Layout

Use the `.event-grid` class for responsive grid layouts:

```tsx
<div className="event-grid">
  <EventCard {...props1} />
  <EventCard {...props2} />
  <EventCard {...props3} />
</div>
```

- **Mobile**: 1 column
- **Tablet**: 2 columns
- **Desktop**: 3 columns

#### Featured Variant

Use `.event-card-featured` class for featured events:

```tsx
<div className="event-grid">
  <EventCard className="event-card-featured" {...featuredProps} />
  <EventCard {...props2} />
  <EventCard {...props3} />
</div>
```

Featured cards:
- Span 2 columns on tablet/desktop
- Larger title (36px)
- More description lines (4 lines)
- More padding

#### Compact Variant

Use `.event-card-compact` class for horizontal layout:

```tsx
<EventCard className="event-card-compact" {...props} />
```

Compact cards:
- Horizontal layout (image left, content right)
- Square image (160px)
- Smaller title
- No description shown

### NewsCard

Specialized card for displaying news articles with image, category, author, and date.

#### Props

```tsx
interface NewsCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  excerpt?: string
  date: string
  author?: string
  category?: string
  image?: string
  href?: string
}
```

#### Usage

```tsx
import { NewsCard } from '@/components/ui'

<NewsCard
  title="New Workshop Series Announced"
  excerpt="We're excited to launch a new series of workshops focusing on aerial arts and acrobatics"
  date="Nov 10, 2025"
  author="Sarah Schmidt"
  category="Announcement"
  image="/news/workshop-series.jpg"
  href="/news/workshop-series"
/>
```

#### Features

- Automatic link wrapper when `href` is provided
- Image with zoom effect on hover
- Category label with gold accent
- Author and date metadata with separator
- Responsive layout
- Truncated excerpt (3 lines max)

#### Grid Layout

Use the `.news-grid` class for responsive grid layouts:

```tsx
<div className="news-grid">
  <NewsCard {...props1} />
  <NewsCard {...props2} />
  <NewsCard {...props3} />
</div>
```

- **Mobile**: 1 column
- **Tablet**: 2 columns
- **Desktop**: 3 columns

#### Featured Variant

Use `.news-card-featured` class for featured articles:

```tsx
<div className="news-grid">
  <NewsCard className="news-card-featured" {...featuredProps} />
  <NewsCard {...props2} />
  <NewsCard {...props3} />
</div>
```

Featured cards:
- Span 2 columns on tablet/desktop
- Larger title (36px)
- More excerpt lines (4 lines)
- More padding

### Input

Form input component with consistent styling.

#### Props

```tsx
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}
```

#### Usage

```tsx
import { Input } from '@/components/ui'

<Input
  type="email"
  placeholder="your@email.com"
  className="w-full"
/>
```

The input automatically applies the `.input` class which provides:
- Consistent padding and sizing
- Border styling with gold focus state
- Typography matching the design system
- Dark theme compatible

## Layout Helpers

### Responsive Grids

Pre-built grid classes for common layouts:

```tsx
// Event grid (1/2/3 columns)
<div className="event-grid">
  {events.map(event => <EventCard key={event.id} {...event} />)}
</div>

// News grid (1/2/3 columns)
<div className="news-grid">
  {articles.map(article => <NewsCard key={article.id} {...article} />)}
</div>
```

### Container

Use `.stage-container` for content width constraints:

```tsx
<div className="stage-container">
  <h1>Page Title</h1>
  <p>Content...</p>
</div>
```

Features:
- Max width: 1280px
- Centered with auto margins
- Responsive horizontal padding
- Full width on mobile

### Sections

Use section classes for consistent vertical spacing:

```tsx
// Standard section (64px padding)
<section className="section">
  <div className="stage-container">
    {/* Content */}
  </div>
</section>

// Hero section (96px padding, min 70vh)
<section className="section-hero">
  <div className="stage-container">
    {/* Hero content */}
  </div>
</section>

// Compact section (48px padding)
<section className="section-compact">
  <div className="stage-container">
    {/* Compact content */}
  </div>
</section>
```

## Examples

### Event Listing Page

```tsx
import { EventCard } from '@/components/ui'

export default function EventsPage() {
  return (
    <section className="section">
      <div className="stage-container">
        <h1 className="h1 text-center mb-12">Upcoming Events</h1>

        <div className="event-grid">
          <EventCard
            className="event-card-featured"
            title="Opening Night Gala"
            description="Join us for the grand opening of our new season"
            date="Dec 1, 2025"
            category="Special Event"
            image="/events/gala.jpg"
            href="/events/gala"
          />

          <EventCard
            title="Comedy Night"
            description="An evening of laughter"
            date="Dec 8, 2025"
            category="Show"
            image="/events/comedy.jpg"
            href="/events/comedy"
          />

          <EventCard
            title="Jazz Evening"
            description="Live jazz performance"
            date="Dec 15, 2025"
            category="Concert"
            image="/events/jazz.jpg"
            href="/events/jazz"
          />
        </div>
      </div>
    </section>
  )
}
```

### News Section

```tsx
import { NewsCard } from '@/components/ui'

export default function NewsSection() {
  return (
    <section className="section">
      <div className="stage-container">
        <h2 className="h2 mb-8">Latest News</h2>

        <div className="news-grid">
          <NewsCard
            title="New Workshop Series"
            excerpt="We're launching exciting new workshops"
            date="Nov 10, 2025"
            author="Sarah Schmidt"
            category="Announcement"
            image="/news/workshops.jpg"
            href="/news/workshops"
          />

          <NewsCard
            title="Award Winner"
            excerpt="Pepe Dome wins cultural award"
            date="Nov 5, 2025"
            author="Michael Weber"
            category="News"
            image="/news/award.jpg"
            href="/news/award"
          />
        </div>
      </div>
    </section>
  )
}
```

### Newsletter Signup Form

```tsx
import { Input, Button } from '@/components/ui'
import { useState } from 'react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')

  return (
    <section className="section bg-pepe-ink">
      <div className="stage-container">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="h2 mb-4">Stay Updated</h2>
          <p className="body-lg text-pepe-t80 mb-8">
            Get monthly updates on events, news, and special offers
          </p>

          <form className="flex gap-4">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button variant="primary" size="lg" type="submit">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
```

## Styling Customization

All components accept a `className` prop for additional styling:

```tsx
<Button
  variant="primary"
  className="w-full md:w-auto"
>
  Responsive Button
</Button>

<EventCard
  {...props}
  className="hover:scale-105 transition-transform"
/>
```

## Accessibility

All components follow accessibility best practices:

- **Semantic HTML**: Uses appropriate HTML elements
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Focus Indicators**: Visible focus states with gold outline
- **ARIA Attributes**: Where appropriate (automatically handled by base HTML elements)
- **Motion Preferences**: Respects `prefers-reduced-motion` setting

## Performance

Components are optimized for performance:

- **Tree Shaking**: Import only what you need
- **CSS**: Uses CSS custom properties for theming
- **Animations**: GPU-accelerated transforms
- **Images**: Recommend using Next.js Image component for optimization

## Resources

- Design System: [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)
- Tokens: [src/styling/tokens.css](src/styling/tokens.css)
- Components: [src/components/ui/](src/components/ui/)
- Card Styles: [src/styling/card-components.css](src/styling/card-components.css)
