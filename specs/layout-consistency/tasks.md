# Task Breakdown: Layout Consistency

## Overview
Total Completed Tasks: 28
Maintenance Tasks: 6

All implementation work has been completed. The standardized spacing patterns documented in `spec.md` are now applied across all public-facing pages. This file tracks what was done and provides maintenance tasks for ongoing consistency verification.

## Task List

### Section Spacing

#### Task Group 1: Section Vertical Padding Standardization
**Dependencies:** None
**Status:** Complete

- [x] 1.1 Standardize Home page section padding to `py-16 md:py-24`
- [x] 1.2 Standardize Training page section padding to `py-16 md:py-24`
- [x] 1.3 Standardize Business page section padding to `py-16 md:py-24`
- [x] 1.4 Standardize About page section padding to `py-16 md:py-24`
- [x] 1.5 Standardize Events page section padding to `py-16 md:py-24`
- [x] 1.6 Standardize News page section padding to `py-16 md:py-24`

**Acceptance Criteria:**
- All page sections use `py-16 md:py-24` (64px mobile, 96px desktop)
- Consistent vertical rhythm between all major sections

---

### Section Headers

#### Task Group 2: Section Header Spacing
**Dependencies:** Task Group 1
**Status:** Complete

- [x] 2.1 Standardize centered section headers with `mb-12` gap to content grid
- [x] 2.2 Standardize h2-to-subtitle spacing at `mb-5` (20px) in centered headers
- [x] 2.3 Standardize Home page Features section header (`mb-4` -> `mb-5`)
- [x] 2.4 Standardize flex-row headers (with action buttons) using `mb-12` and `mb-3` for title-to-subtitle
- [x] 2.5 Apply `gap-4` between title block and action button in flex-row headers

**Acceptance Criteria:**
- All centered headers use `mb-12` before content, `mb-5` between title and subtitle
- Flex-row headers use `mb-12` before content, `mb-3` between title and subtitle
- Typography uses `text-3xl md:text-4xl font-bold` for h2 elements
- Subtitles use `text-lg text-[var(--pepe-t64)]`

---

### Card Components

#### Task Group 3: Card Padding and Internal Spacing
**Dependencies:** Task Group 1
**Status:** Complete

- [x] 3.1 Standardize card padding to `p-6 md:p-8` (24px mobile, 32px desktop)
  - Training page discipline cards: `p-6` -> `p-6 md:p-8`
  - About page value cards: `p-6` -> `p-6 md:p-8`
- [x] 3.2 Standardize Home page feature cards icon-to-title spacing (`mb-4` -> `mb-5`)
- [x] 3.3 Standardize Home page feature cards title-to-description spacing (`mb-3` -> `mb-4`)
- [x] 3.4 Add `leading-none` to all emoji/icon spans for proper vertical centering
- [x] 3.5 Standardize EventCard component spacing patterns
- [x] 3.6 Standardize NewsCard component spacing patterns

**Acceptance Criteria:**
- All cards use `p-6 md:p-8` padding
- Icon-to-title gap is `mb-5` (20px) in vertical card layouts
- Title-to-description gap is `mb-4` (16px) in vertical card layouts
- Emoji/icon spans use `leading-none` for centering

---

### Feature Lists

#### Task Group 4: Feature List Item Spacing
**Dependencies:** Task Group 3
**Status:** Complete

- [x] 4.1 Fix feature list heading-to-description gap on Training page (`mb-2` -> `mb-3`)
- [x] 4.2 Fix feature list heading-to-description gap on Business page (`mb-2` -> `mb-3`)
- [x] 4.3 Standardize feature list items to use `space-y-8` between items
- [x] 4.4 Standardize icon-to-text gap at `gap-5` (20px) in feature list rows

**Acceptance Criteria:**
- Feature list items use `space-y-8` (32px) vertical spacing
- Icon-to-text gap is `gap-5` (20px)
- Heading-to-description gap is `mb-3` (12px) within feature items

---

### CTA Sections

#### Task Group 5: CTA Section Spacing
**Dependencies:** Task Group 2
**Status:** Complete

- [x] 5.1 Fix Home page CTA icon spacing (`mb-6` -> `mb-8`, add `leading-none`, `mb-4` -> `mb-5`)
- [x] 5.2 Fix Training page CTA icon spacing (`mb-6` -> `mb-8`, add `leading-none`, `mb-4` -> `mb-5`)
- [x] 5.3 Fix Business page CTA icon spacing (`mb-6` -> `mb-8`, add `leading-none`, `mb-4` -> `mb-5`)
- [x] 5.4 Standardize CTA subtitle-to-buttons gap at `mb-10` (40px)
- [x] 5.5 Standardize CTA button group gap at `gap-4` (16px)

**Acceptance Criteria:**
- CTA decorative icon uses `mb-8` (32px) before heading
- CTA heading uses `mb-5` (20px) before subtitle
- CTA subtitle uses `mb-10` (40px) before button group
- Button groups use `gap-4` (16px) between items
- All CTA icons use `leading-none` on spans

---

### Pricing and Stat Components

#### Task Group 6: Pricing Rows and Stat Cards
**Dependencies:** Task Group 3
**Status:** Complete

- [x] 6.1 Fix Training page pricing row spacing (`py-4` -> `py-5`, `mt-1` -> `mt-2`)
- [x] 6.2 Fix Business page stat cards (`p-5` -> `p-6`, `mb-2` -> `mb-3`, add `text-lg` to value)
- [x] 6.3 Fix About page address sublabel gap (`mt-1` -> `mt-2`)
- [x] 6.4 Standardize Business page service card lists (`space-y-3` -> `space-y-4`)

**Acceptance Criteria:**
- Pricing rows use `py-5` (20px) vertical padding and `mt-2` (8px) for sublabels
- Stat cards use `p-6` (24px) padding, `mb-3` (12px) label-to-value, `text-lg` on values
- Service card feature lists use `space-y-4` (16px) between items

---

### Grid Layouts

#### Task Group 7: Content Grid and Two-Column Standardization
**Dependencies:** Task Group 1
**Status:** Complete

- [x] 7.1 Standardize content grids to `gap-6` (24px) between cards
- [x] 7.2 Standardize two-column layouts to `gap-12 lg:gap-20` (48px mobile, 80px desktop)

**Acceptance Criteria:**
- All card grids use `gap-6` (24px) consistently
- Two-column layouts use `gap-12 lg:gap-20` for proper breathing room

---

### Documentation

#### Task Group 8: Spec Documentation
**Dependencies:** Task Groups 1-7
**Status:** Complete

- [x] 8.1 Create layout consistency spec documentation (`spec.md`)
  - Document all 12 standardized patterns
  - Include spacing scale reference table
  - Include summary table of all standardized values
  - List all affected files

**Acceptance Criteria:**
- Spec documents all patterns with code examples
- Spacing scale table matches Tailwind 4px base unit system
- All affected files are listed

---

### Maintenance

#### Task Group 9: Ongoing Consistency Verification
**Dependencies:** Task Groups 1-8
**Status:** Pending

- [ ] 9.1 Audit new pages/sections for spacing pattern compliance
  - Verify any new pages follow `py-16 md:py-24` section padding
  - Verify new section headers use `mb-12` gap to content
  - Verify new cards use `p-6 md:p-8` padding
- [ ] 9.2 Verify HeroSection component follows spacing patterns
  - Check `src/components/custom/HeroSection.tsx` alignment with spec
  - Ensure hero-to-first-section transition uses consistent spacing
- [ ] 9.3 Validate responsive breakpoint consistency across all pages
  - Confirm mobile-first approach (base values for mobile, `md:` for desktop)
  - Test all pages at 320px, 768px, and 1024px+ viewports
- [ ] 9.4 Create reusable spacing utility components or Tailwind classes
  - Consider extracting repeated patterns (e.g., SectionHeader, CardWrapper) into shared components
  - Reduce reliance on developers memorizing exact spacing values
- [ ] 9.5 Add visual regression tests for spacing consistency
  - Capture baseline screenshots of all affected pages
  - Detect unintended spacing changes in future PRs
- [ ] 9.6 Update spec when new patterns are introduced
  - Document any new spacing patterns added to the project
  - Keep the summary table in `spec.md` current with actual usage

**Acceptance Criteria:**
- New pages and components follow documented spacing patterns
- No spacing drift occurs across future development
- Spec remains a living document reflecting current state

---

## Execution Summary

### Completed Implementation Sequence:
1. Section Spacing (Task Group 1) - Foundation of vertical rhythm
2. Section Headers (Task Group 2) - Consistent header-to-content gaps
3. Card Components (Task Group 3) - Internal card padding and element spacing
4. Feature Lists (Task Group 4) - Icon+text row consistency
5. CTA Sections (Task Group 5) - Call-to-action vertical flow
6. Pricing and Stat Components (Task Group 6) - Data display elements
7. Grid Layouts (Task Group 7) - Inter-card and column spacing
8. Documentation (Task Group 8) - Spec creation

### Files Modified:
- `src/app/page.tsx` - Home page
- `src/app/training/page.tsx` - Training page
- `src/app/business/page.tsx` - Business page
- `src/app/about/page.tsx` - About page
- `src/app/events/page.tsx` - Events page
- `src/app/news/page.tsx` - News page
- `src/components/custom/EventCard.tsx` - Event card component
- `src/components/custom/NewsCard.tsx` - News card component
- `src/components/custom/HeroSection.tsx` - Hero section component
