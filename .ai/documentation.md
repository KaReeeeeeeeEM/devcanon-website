# Documentation
## Purpose
Preserve the context needed to use, operate, and evolve the system.
## Philosophy
Document decisions and contracts near their owners. Prefer concise, tested, maintained guidance over exhaustive prose.
## Best Practices
- Maintain setup, architecture map, API contracts, runbooks, and ADRs.
- Include rationale, alternatives, consequences, owner, and review date for durable decisions.
- Keep examples executable or verified where practical.

### Documentation Page Standard

- When the Reelma Pay documentation project or page is available, inspect it before designing documentation. Record its reusable layout, navigation, typography, code-example, spacing, and responsive patterns; preserve those patterns unless accessibility or this handbook requires improvement. Never invent details about an inaccessible reference.
- Use a stable three-region shell on desktop: product/docs navigation, a readable article column, and an on-this-page table of contents for long articles. Collapse secondary navigation into accessible drawers on small screens.
- Start every page with breadcrumb context, one precise H1, a short outcome-oriented summary, and optional metadata such as product area, version, or last update.
- Structure task documentation as prerequisites, numbered procedure, expected result, verification, troubleshooting, and next steps. Concept pages should move from mental model to examples and edge cases.
- Keep prose measure near 65–80 characters. Use generous vertical rhythm, visible heading anchors, restrained dividers, and distinct surfaces for notes, warnings, success states, and dangerous operations.
- Code blocks identify language, support copy, wrap or scroll safely, and show realistic complete examples. Pair requests with responses and explain placeholders.
- Navigation, headings, search, table of contents, copy actions, and code examples must work with keyboard and screen readers. Meet `accessibility.md` and `responsiveness.md`.
- Documentation search prioritizes exact titles, commands, error codes, and headings; the empty state suggests navigation and support paths.
- Show version applicability and last-reviewed date where behavior can drift. Broken links, unowned pages, and stale examples fail CI or scheduled review.
## Rules
- Behavioral/configuration changes update docs in the same change.
- Never duplicate an authoritative rule; link to it.
- Remove stale guidance rather than adding contradictory notes.
- A documentation page is not complete without mobile navigation, deep-linkable headings, designed code/callout states, SEO metadata, and a clear next action.
## Examples
```text
docs/adr/0023-use-outbox.md: Context → Decision → Consequences → Status
```

```text
Getting started: Goal → Prerequisites → Install → Configure → Verify → Troubleshoot → Next step
```
## Anti-patterns
Undated diagrams, setup steps that skip prerequisites, comments narrating code, giant unstructured articles, floating table-of-contents widgets that obscure content, and screenshots used instead of copyable instructions.
## Checklist
- [ ] Audience, owner, and source of truth are clear.
- [ ] Commands, links, and examples work.
- [ ] Decisions and operational recovery are documented.
- [ ] Documentation pages match the approved reference language, including Reelma Pay when accessible.
- [ ] Navigation, anchors, search, callouts, code blocks, mobile layout, and next steps are complete.

Related: `AGENTS.md`, `api.md`, `monitoring.md`.
