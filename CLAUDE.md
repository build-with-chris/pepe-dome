# Pepe Dome - Project Documentation

## Overview
Pepe Dome ist eine moderne Next.js 15 Website für ein Artistik- und Kulturzentrum in München. Die Website präsentiert Events, Training und Business-Angebote mit einem eleganten, dunklen Design.

## Tech Stack
- **Framework**: Next.js 15 with App Router
- **Styling**: CSS with Custom Properties (CSS Variables)
- **TypeScript**: Full TypeScript support
- **Deployment**: Optimized for production deployment

## Design System

### Color Palette
- `--pepe-ink`: #161616 (Primary dark background)
- `--pepe-surface`: #1A1A1A (Secondary background)
- `--pepe-white`: #fff (Primary text)
- `--pepe-t80`: rgba(255,255,255,.8) (Secondary text)
- `--pepe-t64`: rgba(255,255,255,.64) (Muted text)
- `--pepe-line`: #333 (Borders)
- `--pepe-line2`: #292929 (Secondary borders)
- `--pepe-gold`: #D4A574 (Accent color)
- `--pepe-gold-hover`: #E6B887 (Accent hover)
- `--pepe-gold-active`: #C19A64 (Accent active)

### Typography
- `--font-display`: 'Outfit' (Headlines)
- `--font-body`: 'Inter' (Body text)

### Component Classes
- `.btn-primary`: Gold primary button with hover effects
- `.btn-ghost`: Transparent button with border
- `.btn-lg`, `.btn-sm`: Size variants
- `.display`: Display typography class
- `.muted`: Muted text color
- `.nav`: Sticky navigation with backdrop blur
- `.hero`: Full-screen hero section with gradient

## Mobile Navigation

### Features
- **Responsive Design**: Hamburger menu on mobile, full nav on desktop
- **Modern UI**: Glassmorphism effects with backdrop blur
- **Smooth Animations**: Custom CSS animations with cubic-bezier easing
- **Touch Optimized**: 52px+ touch targets for accessibility

### Implementation
- **State Management**: React useState for menu toggle
- **CSS Classes**: `.nav-mobile`, `.nav-mobile-links`, `.nav-mobile-link`
- **Animations**: `slideDown` and `fadeInUp` keyframe animations
- **Z-Index Strategy**: Navigation bar (100000), Mobile menu (99999)

### Mobile Menu Styling
- **Background**: Dark gradient with backdrop blur
- **Links**: Glassmorphism cards with hover shimmer effects
- **Freeman Button**: Premium gold gradient with enhanced hover
- **Responsive**: Hidden on desktop (768px+), visible on mobile

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and design system
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   ├── veranstaltungen/    # Events page
│   ├── freeman/            # Freeman Festival page
│   ├── training/           # Training page (placeholder)
│   ├── business/           # Business page (placeholder)
│   ├── ueber/              # About page (placeholder)
│   └── kontakt/            # Contact page (placeholder)
└── components/
    └── Navigation.tsx      # Main navigation component
```

## Key Components

### Navigation.tsx
- Responsive navigation with mobile menu
- Current page highlighting
- Hamburger animation
- Body scroll prevention when mobile menu is open

### Events Pages
- **Freeman Festival**: Dedicated festival page with program, artists, tickets
- **Veranstaltungen**: Main events overview with featured events
- Event cards with gradient backgrounds and CTAs

## Development

### Commands
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run start  # Start production server
npm run lint   # Run ESLint
```

### Development Server
- Runs on `http://localhost:3000` (or next available port)
- Hot reload enabled
- TypeScript checking in real-time

## Features Implemented

### ✅ Navigation
- Sticky navigation with blur effect
- Mobile hamburger menu with modern UI
- Active page highlighting
- Smooth animations and transitions

### ✅ Pages
- Homepage with hero section and feature cards
- Events overview page with chronological layout
- Freeman Festival dedicated page
- Responsive design for all screen sizes

### ✅ Mobile Optimization
- Touch-optimized interface
- Glassmorphism mobile menu
- Responsive typography and spacing
- Mobile-first CSS approach

### ✅ Performance
- Next.js 15 App Router for optimal performance
- CSS-only animations (no JavaScript libraries)
- Optimized asset loading
- SEO-friendly structure

## Design Philosophy
- **Premium Feel**: High-end cultural venue representation
- **Dark Theme**: Sophisticated, modern aesthetic
- **Gold Accents**: Elegant highlighting for key elements
- **Smooth Interactions**: Fluid animations and micro-interactions
- **Accessibility**: Proper contrast ratios and touch targets

## Deployment Notes
- Ensure all environment variables are configured
- Build process optimizes CSS and JavaScript
- Static assets are properly cached
- Mobile responsiveness tested across devices

## Future Enhancements
- Contact form implementation
- Event booking system integration
- Image optimization and gallery
- SEO metadata optimization
- Analytics integration