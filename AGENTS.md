# AGENTS.md — Noodlegear

Instructions for any coding agent (Claude Code, Copilot, Cursor, Codex, etc.) working on Noodlegear.
Read this file in full before writing or changing any user interface code.

## 1. What Noodlegear is

Noodlegear is a **Driving School Management System (DSMS)**: an internal, desktop-first business web
application used every working day by driving-school owners, administrators, receptionists, instructors
and operations staff. It manages learners, instructors, lesson scheduling, vehicles, payments and
invoices, driving tests, attendance, progress and reports.

It must look and behave like a mature Microsoft enterprise application (Fluent 2, in the spirit of
Dynamics 365, Entra admin center, Azure portal and Microsoft 365 admin center):
**professional, consistent, functional, accessible and predictable**. Not flashy, not experimental.

## 2. The design system is the source of truth

This repository's design system is authoritative. **Do not invent new visual patterns.**
If something you need is not covered, follow §8. Never improvise.

| Read | When |
| --- | --- |
| [`docs/design-principles.md`](docs/design-principles.md) | Before any UI work. Philosophy, visual rules, accessibility. |
| [`tokens/noodlegear.tokens.json`](tokens/noodlegear.tokens.json) | The single source of truth for every visual value. |
| [`docs/design-tokens.md`](docs/design-tokens.md) | How to consume tokens; reference tables. |
| [`docs/components.md`](docs/components.md) | Which component to use, when, when not, and how. |
| [`docs/patterns.md`](docs/patterns.md) | Page layouts, workflows, states, action placement. |
| [`docs/reference/index.html`](docs/reference/index.html) | Visual reference: open in a browser to see the intended look. |

Precedence when documents seem to disagree: **tokens JSON → patterns → components → principles →
reference page**. The reference page is an illustration; if it differs from the docs, the docs win.

## 3. Technology stack

| Concern | Use | Notes |
| --- | --- | --- |
| UI framework | React + TypeScript (strict) | No `any`. Function components and hooks only. |
| Build | Vite | |
| Components | `@fluentui/react-components` (Fluent UI React v9) | Use Fluent first, always. |
| Icons | `@fluentui/react-icons` | The only icon set. |
| Date picker | `@fluentui/react-datepicker-compat` | The only allowed extra Fluent package for date input. |
| Styling | Griffel `makeStyles` (ships with Fluent) + Fluent `tokens` + Noodlegear CSS variables | No Tailwind, no CSS-in-JS libraries, no styled-components, no CSS frameworks. |
| Tokens | `tokens/noodlegear.tokens.json` → Fluent theme + `--ng-*` CSS variables | See `docs/design-tokens.md`. |

Do not add UI, styling, icon, animation, table or date libraries. Any new dependency needs explicit
human approval and a reason why Fluent cannot do it.

## 4. Non-negotiable rules

1. **Use Fluent components.** If Fluent v9 has it, use it. Wrap it only to enforce Noodlegear behaviour
   documented in `docs/components.md` (the "Noodlegear composition" entries).
2. **No arbitrary values.** Every colour, font size, weight, line height, spacing, radius, border width,
   shadow, z-index, duration and breakpoint comes from a token. No hex, rgb, hsl, named colours or raw
   `px` values in components, except `0` and `100%`, and a `1px` hairline only via `tokens.strokeWidthThin`.
3. **No inline styles** (`style={{…}}`) except dynamic values that cannot be expressed as classes,
   e.g. a computed width percentage for a progress segment.
4. **Semantic colour only.** Use the role (`colorNeutralForeground3` for metadata), never a colour that
   looks right. Status colours only express status and always come with a text label.
5. **Statuses come from the registry** in `tokens/noodlegear.tokens.json → status.domains`. Never pick a
   badge colour ad hoc. New status → add it to the registry first.
6. **One page title, one primary button per view.** See `docs/patterns.md`.
7. **Light theme by default; dark theme must work** because all colour comes from tokens. Never test a
   screen in only one theme.
8. **Accessibility is a requirement, not polish.** WCAG 2.2 AA. Keyboard-complete, visible focus,
   labelled controls, semantic HTML. See `docs/design-principles.md §7`.
9. **Format through shared helpers.** Dates, times, currency and numbers use one formatting module
   (locale `en-GB` by default, set in one place). Never call `toLocaleString` ad hoc.
10. **Do not edit tokens, principles or patterns as a side effect of a feature.** Propose changes
    separately (see §8).

### Never

- Glassmorphism, blur, gradients, glow, neon, decorative shadows, oversized rounding (> 4px on page
  content), hero sections, illustrations, mascots, emoji in UI, confetti, parallax, decorative animation.
- Purple/pink/teal "SaaS" accents, or any accent other than the Noodlegear brand blue.
- Wrapping every element in a card. Nesting cards inside cards.
- Typography larger than `title3` (24px) for page titles; nothing above `title2` (28px) anywhere.
- Charts that do not answer a specific question for the user.
- Custom-built versions of controls Fluent already provides (buttons, inputs, menus, dialogs, tooltips,
  tables, tabs, toasts, drawers, nav).
- `!important`, global CSS overrides of Fluent class names, or targeting `.fui-*` classes.

## 5. Recommended code structure

The design system lives in its own folder and is the only place that defines visual building blocks.
Feature code composes it and never restyles it.

```
src/
  design-system/            # the ONLY place visual building blocks are defined
    tokens/                 # generated from tokens/noodlegear.tokens.json (do not hand-edit)
    theme/                  # Fluent light/dark themes + NoodlegearProvider (FluentProvider + Toaster)
    layout/                 # AppShell, AppHeader, SideNav, PageHeader, PageContent, Section
    data/                   # DataTable, Pagination, StatusBadge, StatusIndicator, EmptyState, DescriptionList
    forms/                  # FormSection, FormGrid, FormActions, DateField
    feedback/               # ConfirmDialog, useNotify
    business/               # MetricCard, DetailPanel, ProfileHeader, ActivityTimeline, FilterBar, CommandBar
    utils/                  # format.ts (dates, money), useMediaQuery
    index.ts                # public API — features import from here only
  features/                 # learners/, instructors/, bookings/, vehicles/, payments/, tests/, reports/
  app/                      # routing, providers, shell wiring
```

- Feature code imports UI from `@/design-system` (the compositions) or `@fluentui/react-components`.
  It never imports from another feature's components.
- Feature files may use `makeStyles` **only for layout** (grid/flex arrangement, gaps, widths) using
  tokens. Visual styling (colour, border, shadow, typography) belongs in the design system.
- Naming: components `PascalCase.tsx`, hooks `useCamelCase.ts`, one component per file, named exports,
  props interfaces named `<Component>Props` and exported.

## 6. How to use tokens in code

```tsx
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalL}`,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  meta: { color: tokens.colorNeutralForeground3 },
  panel: { width: 'var(--ng-layout-detail-panel-width)' }, // Noodlegear layout token
});
```

```tsx
// ❌ Never
const useStyles = makeStyles({
  card: { padding: '18px', borderRadius: '12px', background: '#f7f9ff', boxShadow: '0 10px 30px rgba(0,0,0,.1)' },
});
```

Typography: use Fluent text components (`<Title3>`, `<Subtitle2>`, `<Body1>`, `<Body1Strong>`,
`<Caption1>`) or spread `typographyStyles.body1` in `makeStyles`. Never set `fontSize` directly.

## 7. Building a screen: checklist

1. Identify the page type in `docs/patterns.md` (list, detail, form, dashboard, settings) and follow its
   layout exactly.
2. Pick components from `docs/components.md`. Prefer the Noodlegear composition where one exists.
3. Use realistic states: loading (skeleton), empty (first use vs no results), error, and permission.
4. Place actions according to `docs/patterns.md §4`. One primary button.
5. Map every status through the status registry.
6. Format dates and money through the shared helpers.
7. Verify:
   - Keyboard only: every action reachable, logical tab order, visible focus, Esc closes overlays.
   - Light **and** dark theme.
   - Widths 1366, 1024 and 390px.
   - No raw values: search your diff for `#`, `rgb(`, `px'`, `style={{`.
   - `tsc` passes with no `any`.

## 8. When the design system does not cover something

1. Check again: Fluent v9 component list, `docs/components.md`, `docs/patterns.md`.
2. If truly missing, **stop and propose** instead of inventing. Describe the need, the closest existing
   pattern, and the minimal addition. Proposals must fit Fluent 2 conventions.
3. Once approved, update in this order: tokens JSON (if a value is needed) → docs → design-system code →
   feature code. Never add a one-off style in a feature to "get it working".

## 9. Definition of done for UI work

- [ ] Uses Fluent components / Noodlegear compositions; no reinvented controls.
- [ ] No hard-coded visual values; no inline styles; no `any`.
- [ ] Matches the page pattern and action placement rules.
- [ ] Loading, empty, error states implemented.
- [ ] Keyboard and screen-reader usable; labels, names and roles correct.
- [ ] Works in light and dark themes and at tablet width.
- [ ] Copy follows the writing rules (sentence case, specific verbs).
