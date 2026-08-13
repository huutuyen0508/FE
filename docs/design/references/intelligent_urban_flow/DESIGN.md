---
name: Intelligent Urban Flow
colors:
  surface: '#faf8ff'
  surface-dim: '#d9d9e5'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3fe'
  surface-container: '#ededf9'
  surface-container-high: '#e7e7f3'
  surface-container-highest: '#e1e2ed'
  on-surface: '#191b23'
  on-surface-variant: '#434655'
  inverse-surface: '#2e3039'
  inverse-on-surface: '#f0f0fb'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#943700'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#faf8ff'
  on-background: '#191b23'
  surface-variant: '#e1e2ed'
  status-available: '#10B981'
  status-reserved: '#F59E0B'
  status-occupied: '#EF4444'
  bg-main: '#F8FAFC'
  border-subtle: '#E2E8F0'
  ai-accent: '#8B5CF6'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is engineered for a premium, enterprise-grade AI Smart Parking platform. The aesthetic is defined by **High-Performance Minimalism**, drawing inspiration from industry leaders like Vercel and Linear. 

The brand personality is **Intelligent, Efficient, and Dependable**. It avoids unnecessary decorative elements, favoring clarity and utility. The UI should evoke a sense of calm control in potentially stressful environments (like finding parking), utilizing significant whitespace to reduce cognitive load.

**Key Stylistic Pillars:**
- **Refined Interactivity:** Interactions should feel snappy yet fluid, using subtle transitions that suggest "intelligence" behind the interface.
- **Data Clarity:** Complex parking data is distilled into clean, scannable visualizations.
- **AI-Centricity:** The AI Assistant is not a bolted-on feature but a pervasive, helpful presence represented by distinct, soft gradients and elevated surfaces.

## Colors

The palette is anchored by **Digital Blue (#2563EB)**, conveying trust and technological precision. 

- **Primary & Neutrals:** We use a Slate Gray scale for typography and borders to maintain a professional, high-contrast environment that isn't as harsh as pure black.
- **Semantic Status:** Color is used strictly for utility. Green, Yellow, and Red are reserved exclusively for parking availability status to ensure instant recognition.
- **AI Accent:** A subtle Indigo/Violet (#8B5CF6) is used sparingly to denote AI-generated insights or the Assistant's presence, distinguishing automated suggestions from standard system data.
- **Surface Strategy:** Backgrounds utilize very light grays (`#F8FAFC`) to allow white cards and containers to "pop" with depth.

## Typography

This design system relies exclusively on **Inter** to maintain a systematic, utilitarian aesthetic. 

- **Weight & Contrast:** Use `SemiBold` (600) for headers to create clear hierarchy against `Regular` (400) body text. 
- **Tightened Tracking:** For large display and headline sizes, a negative letter-spacing (`-0.02em`) is applied to create the "Linear/Vercel" look—feeling more cohesive and premium.
- **Monospacing:** For license plates and parking slot IDs (e.g., B2-18), use a monospaced font to ensure characters are distinguishable and horizontally aligned in tables.
- **Readability:** Maintain a generous line-height (1.5x) for body copy to support the high-whitespace philosophy.

## Layout & Spacing

The layout uses a **Hybrid Fluid Grid** system. While the dashboard containers expand to fill the screen, content within those containers is capped at a `container-max` of 1280px to maintain readability on ultra-wide monitors.

**Breakpoints & Reflow:**
- **Desktop (1024px+):** Standard 12-column grid. Permanent left sidebar (240px) and optional right-side AI Assistant panel (320px).
- **Tablet (768px - 1023px):** Sidebar collapses into a hamburger menu. Content transitions to an 8-column grid.
- **Mobile (<768px):** 4-column grid. Navigation moves to a persistent bottom bar for "thumb-friendly" access. AI Assistant becomes a floating action button (FAB).

**Rhythm:**
Use an 8px base unit for all spacing. Gutters should be consistently 24px on desktop to provide "breathing room" between complex data widgets.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Soft Ambient Shadows** rather than heavy borders.

- **Level 0 (Background):** Slate-50 (`#F8FAFC`). No shadow.
- **Level 1 (Cards/Sidebar):** White surface. Subtle 1px border (`#E2E8F0`). 
- **Level 2 (Dropdowns/Modals):** White surface. Medium soft shadow: `0px 10px 15px -3px rgba(0, 0, 0, 0.05)`.
- **Level 3 (AI Assistant/Overlays):** White surface. High-diffusion shadow with a slight indigo tint to signal the AI's "elevated" intelligence: `0px 20px 25px -5px rgba(139, 92, 246, 0.08)`.

Avoid inner shadows or heavy "neomorphic" extrusions. Depth should feel natural and light, like stacked sheets of premium paper.

## Shapes

The design system uses a **Rounded (0.5rem / 8px base)** shape language, with specific components scaling up to **12px (0.75rem)** for larger containers like dashboard cards and modals.

- **Standard Elements:** Buttons, inputs, and small chips use 8px.
- **Containers:** Dashboard widgets and main content cards use 12px to feel modern and approachable.
- **Status Indicators:** Parking slots in the map view should have a 4px radius—enough to feel soft but sharp enough to fit tightly in a grid.
- **AI Chat Bubbles:** Use 16px (xl) for the Assistant's messages and 16px with a bottom-right "sharp" corner for user messages to create a conversational feel.

## Components

**Buttons**
- **Primary:** Solid Blue (`#2563EB`) with white text. 8px radius.
- **Secondary:** Ghost style with Slate-200 border.
- **AI Action:** Subtle gradient border (Indigo to Blue).

**Inputs & Forms**
- Use a "Floating Label" or very clear top-aligned labels in `label-md`. 
- Focus state: 2px solid Blue ring with 0px offset.

**Parking Slot Cards (Map)**
- Rectangular blocks with a subtle inner glow when "Available."
- High-contrast status colors. Occupied slots should be slightly desaturated to push focus toward available ones.

**AI Assistant Chat**
- Persistent floating button in the bottom right.
- The chat interface should use a "glass" header (backdrop-blur) to feel integrated into the page.
- Suggested actions (chips) should appear at the bottom of the chat to guide the user.

**Data Tables**
- Clean, borderless rows with 1px Slate-100 dividers.
- Hover state: Light Slate-50 background tint.
- Use `mono-sm` for license plates and numeric IDs for vertical alignment.

**Status Chips**
- Pill-shaped with a light background tint (10% opacity) and dark foreground text of the same hue (e.g., Green-100 bg with Green-700 text).