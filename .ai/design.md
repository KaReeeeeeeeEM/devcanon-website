# Product Design

## Purpose
Create a recognizable, calm, high-quality interface across products without redesigning each feature.

## Philosophy
Clarity precedes decoration. Use restrained surfaces, strong hierarchy, deliberate whitespace, and one clear primary action. Derive the product’s visual language from existing screens and tokens; this handbook does not impose a brand palette.

## Best Practices
- Every user-facing web application supports light and dark themes through semantic CSS variables; default to the operating-system preference and provide a persistent, accessible theme toggle.
- Start from user task, content hierarchy, and states before visual polish.
- Reuse semantic tokens for color, type, radius, spacing, elevation, and motion.
- Prefer a neutral canvas, subtle borders, limited elevation, and brand color for meaning and emphasis.
- Use an 8-point spacing rhythm with 4px for fine alignment unless the repository defines another scale.
- Design default, hover, focus, active, disabled, loading, empty, error, and success states together.

## Rules
- Theme changes use a click-origin circular reveal when the View Transition API is available: capture trigger coordinates, calculate the farthest-corner radius, and animate `::view-transition-new(root)` with a circular `clip-path`. Fall back immediately and disable the reveal for `prefers-reduced-motion`.
- Theme changes must update the root theme class without a flash of incorrect theme; components use semantic tokens rather than theme-specific hard-coded colors.
- Never hard-code a new color, shadow, font, or radius when a suitable token exists.
- A view has one dominant heading and normally one primary CTA.
- Dense tools may optimize scan speed; marketing pages may use more expressive composition, but both use shared foundations.
- Preserve recognizable brand and layout patterns from existing products.
- Documentation surfaces follow the article hierarchy and reference-review workflow in `documentation.md`; do not style them as marketing landing pages.

## Examples
```css
::view-transition-new(root) { animation: theme-ripple .7s ease-out; }
@keyframes theme-ripple { from { clip-path: circle(0 at var(--theme-x) var(--theme-y)); } to { clip-path: circle(var(--theme-radius) at var(--theme-x) var(--theme-y)); } }
```
```css
.card { background: var(--surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); }
```

## Anti-patterns
- Gratuitous gradients, glass effects, oversized headings, or animation.
- Every card having equal visual weight.
- Placeholder-only labels or icon-only critical actions.

## Checklist
- [ ] Hierarchy communicates the main task immediately.
- [ ] Tokens and shared patterns are reused.
- [ ] All interaction states are designed.
- [ ] Light, dark, and system themes preserve contrast, hierarchy, charts, code blocks, and brand character.
- [ ] Theme transitions originate from the toggle, fall back safely, and honor reduced motion.
- [ ] Mobile, keyboard, contrast, and long-content behavior are sound.

Related: `ui-components.md`, `accessibility.md`, `responsiveness.md`, `animations.md`.
