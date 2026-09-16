---
inclusion: always
---

# AcadeMY Senior — Design System

## Vision

AcadeMY Senior should feel like a **premium, student-built study companion** — not a generic school portal or corporate SaaS dashboard. Every screen should feel motivating, focused, and visually coherent with the wider AcadeMY brand.

Design is not cosmetic. It directly affects whether a student opens the app again tomorrow.

---

## Visual Identity

### Brand Colour: Purple

Purple is the AcadeMY primary colour and must remain the dominant brand signal across Senior. It signals continuity with Junior and the broader AcadeMY family.

- Primary brand purple must be used for CTAs, navigation highlights, progress indicators, and key interactive elements
- Exact hex values and shade palette are **TBD** — to be aligned with the AcadeMY brand guide before first UI work begins
- Do not substitute purple with blue, teal, or other colours without explicit brand approval

### Supporting Palette (TBD)

A full token-based colour system will be defined, including:
- Surface / background colours
- Text colours (primary, secondary, disabled)
- Semantic colours (success, warning, error, info)
- XP / progress accent colours

Until the palette is formalised, use placeholders and document the intent — do not hardcode arbitrary hex values.

### Typography (TBD)

- Typeface selection is TBD, pending alignment with the AcadeMY brand
- Body text must be legible at small sizes on mobile screens
- Heading hierarchy must be clear and consistent across all content types

---

## Mobile First

All UI must be designed and implemented **starting from the smallest practical screen size** (360px–390px width is a safe base target for Malaysian student devices).

- Layout decisions begin on mobile; desktop layouts are **progressive enhancements**
- Touch targets must be large enough for comfortable use (minimum 44×44px per WCAG guidance)
- Bottom navigation patterns are preferred over sidebars on mobile
- Avoid horizontal scrolling on any core content surface

---

## Junior Is the Reference Implementation

AcadeMY Senior does not redesign the dashboard. The Junior application is the **reference implementation** for all shared platform features.

The following must match Junior in Senior — not approximate it, not improve it unilaterally:

- Dashboard layout and structure
- Bottom navigation patterns and mobile behaviour
- Ace / Cikgu AI chat interface and entry points
- XP display, level indicators, and rank visualisation
- Streak tracking UI
- Missions UI and flow
- Companion system visuals and interactions
- Profile screens and settings
- Student analytics visualisation language
- Subscription and plan UI
- AcadeMY branding, colours, spacing, and iconography

If a change to any of the above is needed for a legitimate Senior-specific reason, that deviation must be:
1. Documented with a reason in `docs/DECISIONS.md`
2. Explicitly approved before implementation

**When building any UI component:** check whether an equivalent component already exists and is proven in Junior. If it does, use it as the direct reference. Do not rebuild from scratch without first consulting the Junior version.

---

## Reusable Component Architecture

UI must be built from a library of **shared, documented components** rather than one-off per-page styles.

Key principles:
- Components are **composable** — combine small pieces to build larger surfaces
- Components are **self-contained** — styles, variants, and accessibility behaviours live with the component
- Components are **named consistently** — use the same names as the Junior equivalent where one exists
- Components are **variant-aware** — a Button has a primary variant, a secondary variant, a ghost variant; these are explicit, not ad-hoc overrides
- **Check Junior first** — before building a component, verify whether Junior has a proven equivalent

Components required for the first slice (at minimum):
- Button (primary, secondary, ghost)
- Card / content card
- Input and form fields
- Navigation bar (mobile) — matches Junior's pattern
- Progress bar / XP indicator — matches Junior's visual language
- Badge / tag
- Loading state / skeleton

---

## Anti-Patterns to Avoid

The following styling patterns are explicitly discouraged:

| Avoid | Prefer |
|---|---|
| Generic grey corporate dashboard look | Branded, warm, purple-forward design |
| Dense tables as primary content surfaces | Card-based, visual-first layouts |
| Desktop-centric layouts ported down | Mobile-first layouts extended up |
| Inconsistent spacing (arbitrary px values) | Spacing scale from a defined token set |
| Hardcoded colours per component | Design tokens / CSS variables |
| Walls of text | Chunked, visual content with clear hierarchy |

---

## Styling Stack

AcadeMY Senior uses **Tailwind CSS** — the same as Junior. This is confirmed.

- Use Tailwind utility classes as the primary styling mechanism, consistent with Junior
- Design tokens are expressed as Tailwind theme extensions (colours, spacing, typography)
- Do not introduce a separate CSS-in-JS library or CSS Modules system alongside Tailwind
- Custom CSS is acceptable only for cases that Tailwind genuinely cannot handle

---

## Accessibility Baseline

Senior must meet a baseline accessibility standard from the start:

- Sufficient colour contrast (WCAG AA minimum: 4.5:1 for normal text, 3:1 for large text and UI components)
- All interactive elements reachable and operable by keyboard
- Meaningful `alt` text on all images
- Semantic HTML — headings in logical order, buttons are `<button>`, links are `<a>`
- Focus indicators visible and never removed without replacement

Accessibility is not retrofitted. It is built in.

---

## Design Tokens

Design tokens are managed through the **Tailwind CSS theme configuration** (`tailwind.config`), consistent with Junior.

Token values for colour and typography need to be aligned with the AcadeMY brand guide — exact values are **TBD-008**. Until confirmed, use descriptive placeholder names and do not hardcode arbitrary hex values inline.

Reserved token names (to be defined in Tailwind config):

```
colors.brand.primary       — AcadeMY purple (primary brand)
colors.brand.secondary     — supporting brand colour
colors.surface.base        — page background
colors.surface.raised      — card / elevated surface
colors.text.primary
colors.text.secondary
colors.text.disabled
colors.semantic.success
colors.semantic.warning
colors.semantic.error
colors.xp.accent           — XP / progress highlight colour

spacing scale               — extend Tailwind default as needed
border-radius scale         — consistent rounding values
font-size scale             — consistent type scale
font-weight scale
```
