---
name: Midnight Orbital Mastery
colors:
  surface: '#10131b'
  surface-dim: '#10131b'
  surface-bright: '#363941'
  surface-container-lowest: '#0b0e15'
  surface-container-low: '#181b23'
  surface-container: '#1d2027'
  surface-container-high: '#272a32'
  surface-container-highest: '#32353d'
  on-surface: '#e0e2ed'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#e0e2ed'
  inverse-on-surface: '#2d3038'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#ddb7ff'
  on-secondary: '#490080'
  secondary-container: '#6f00be'
  on-secondary-container: '#d6a9ff'
  tertiary: '#c0c1ff'
  on-tertiary: '#1000a9'
  tertiary-container: '#8083ff'
  on-tertiary-container: '#0d0096'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6900b3'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#10131b'
  on-background: '#e0e2ed'
  surface-variant: '#32353d'
  bg-elevated: '#0F1220'
  surface-card: '#151827'
  border-subtle: rgba(139, 92, 246, 0.18)
  status-mastered: '#10B981'
  status-review: '#F59E0B'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 1.5rem
  gutter-desktop: 2rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-lg: 1.5rem
  space-md: 1rem
  space-xl: 2rem
---

# AcadeMY Senior — DESIGN.md

Stitch source: Midnight Orbital Mastery. Visual decisions for the Senior marketing homepage follow this file and the Stitch layout screenshot.

## Product identity
**Audience:** Malaysian KSSM Form 4–5 students  
**Core promise:** **Remember. Master. Achieve.**

AcadeMY Senior is a mastery-first product. It is **not notes-first**.

Primary learning loop:
**Mind Map → Flashcards → Quiz → Weak Topic Detection → Targeted Revision → Mastery**

Long-form Notes are intentionally paused for now.

## Visual direction
A premium, intelligent study command centre for SPM preparation.
- Deep near-black navy background: `#080B12`
- Elevated background: `#0F1220`
- Card background: `#151827`
- Card border: `rgba(139, 92, 246, 0.18)`
- Primary purple: `#8B5CF6`
- Bright violet: `#A855F7`
- Indigo: `#6366F1`
- Strong/mastered: `#10B981` (soft emerald)
- Needs review: `#F59E0B` (warm amber)
- Restrained stars and subtle orbital trajectories, soft violet backglows.
- Rounded premium cards (16px to 24px border-radius), Apple-grade typography and whitespace.

## Homepage motion
Motion must not redesign the layout. Hierarchy: astronaut journey → environment depth → content reveal → ambient idle → micro interaction. Prefer transform and opacity. Honor `prefers-reduced-motion`. Native scrolling stays intact.
