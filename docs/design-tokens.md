# Noodlegear design tokens

**Source of truth:** [`tokens/noodlegear.tokens.json`](../tokens/noodlegear.tokens.json).
This document explains the tokens and how to use them. If a value here ever differs from the JSON,
the JSON is correct.

## 1. How the token system works

```
tokens/noodlegear.tokens.json
 ├─ brand            ──► createLightTheme(brand) / createDarkTheme(brand) + themeOverrides
 │                        └─► Fluent tokens (colour, type, spacing, radius, stroke, shadow, motion)
 │                             used as tokens.colorNeutralBackground1, tokens.spacingHorizontalM …
 ├─ color / typography / spacing / radius / stroke / shadow / motion
 │                   ──► documentation of the Fluent tokens Noodlegear uses and what for
 └─ layout / breakpoints / zIndex / iconSize / density / status
                     ──► Noodlegear-only tokens, generated as CSS variables  --ng-<group>-<key>
                         plus a typed TS export (raw numbers for breakpoints)
```

Two kinds of token:

1. **Fluent tokens** (`tokens.*` from `@fluentui/react-components`). These cover all colour, typography,
   spacing, radius, stroke, shadow and motion. Noodlegear does not redefine them; it only supplies the
   brand ramp and a few dark-theme overrides. The JSON lists which ones to use and what for, with the
   resolved light/dark values for reference.
2. **Noodlegear tokens** (`--ng-*`). Application concerns Fluent does not cover: shell dimensions,
   container widths, breakpoints, z-index layers, icon sizes, density defaults and the status registry.

### Rules

- Never write a resolved value (`#0F6CBD`, `16px`) in code. Use the token.
- Never create a token in a feature. Tokens are added to the JSON first (AGENTS.md §8).
- Never edit generated token files by hand. Regenerate them from the JSON.

## 2. Setting up the theme (reference implementation)

```tsx
// src/design-system/theme/themes.ts
import { createDarkTheme, createLightTheme, type BrandVariants, type Theme } from '@fluentui/react-components';
import source from '../../../tokens/noodlegear.tokens.json';

const b = source.brand;
export const noodlegearBrand: BrandVariants = {
  10: b['10'], 20: b['20'], 30: b['30'], 40: b['40'], 50: b['50'], 60: b['60'], 70: b['70'], 80: b['80'],
  90: b['90'], 100: b['100'], 110: b['110'], 120: b['120'], 130: b['130'], 140: b['140'], 150: b['150'], 160: b['160'],
};

export const noodlegearLightTheme: Theme = createLightTheme(noodlegearBrand);

export const noodlegearDarkTheme: Theme = {
  ...createDarkTheme(noodlegearBrand),
  colorBrandForeground1: noodlegearBrand[110],
  colorBrandForeground2: noodlegearBrand[120],
  colorBrandForegroundLink: noodlegearBrand[110],
  colorBrandForegroundLinkHover: noodlegearBrand[120],
  colorBrandForegroundLinkPressed: noodlegearBrand[100],
};
```

```tsx
// App root
<FluentProvider theme={mode === 'dark' ? noodlegearDarkTheme : noodlegearLightTheme}>
  <App />
  <Toaster toasterId="noodlegear-toaster" position="bottom-end" pauseOnHover pauseOnWindowBlur />
</FluentProvider>
```

Fluent puts its CSS variables on the `FluentProvider` element, not `:root`. Anything outside the
provider, such as the `body` background, must be set from the theme object.

### Generating Noodlegear CSS variables

A small build script (run before `dev` and `build`) reads the JSON and writes:

```css
/* tokens.generated.css — GENERATED, do not edit */
:root {
  --ng-layout-header-height: 48px;
  --ng-layout-sidebar-width: 240px;
  --ng-layout-content-max-width: 1600px;
  /* … every key in layout, zIndex, iconSize, density, breakpoints */
  --ng-z-sticky: 100;
  --ng-icon-size-medium: 20px;
}
```

```ts
// tokens.generated.ts — GENERATED
export const ngTokens = {
  layoutHeaderHeight: 'var(--ng-layout-header-height)',
  layoutSidebarWidth: 'var(--ng-layout-sidebar-width)',
  // …
} as const;

// tokens/index.ts — hand-written, raw numbers for media queries
export const breakpoints = { sm: 640, md: 1024, lg: 1366, xl: 1920 } as const;
export const media = {
  belowSm: `@media (max-width: ${breakpoints.sm - 1}px)`,
  belowMd: `@media (max-width: ${breakpoints.md - 1}px)`,
  belowLg: `@media (max-width: ${breakpoints.lg - 1}px)`,
} as const;
```

Naming: `--ng-<group>-<kebab-key>`, with the group shortened for z-index (`--ng-z-*`), icon size
(`--ng-icon-size-*`) and breakpoints (`--ng-breakpoint-*`).

### Usage

```tsx
import { makeStyles, tokens } from '@fluentui/react-components';
import { ngTokens, media } from '@/design-system/tokens';

const useStyles = makeStyles({
  header: {
    height: ngTokens.layoutHeaderHeight,
    paddingInline: tokens.spacingHorizontalL,
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalXXL}`,
    [media.belowMd]: { gridTemplateColumns: 'minmax(0, 1fr)' },
  },
});
```

---

## 3. Brand

Fluent 2 brand ramp (Microsoft enterprise web blue). 80 is the light-theme accent.

| 10 | 20 | 30 | 40 | 50 | 60 | 70 | **80** | 90 | 100 | 110 | 120 | 130 | 140 | 150 | 160 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| #061724 | #082338 | #0A2E4A | #0C3B5E | #0E4775 | #0F548C | #115EA3 | **#0F6CBD** | #2886DE | #479EF5 | #62ABF5 | #77B7F7 | #96C6FA | #B4D6FA | #CFE4FA | #EBF3FC |

Do not use ramp values directly. Use the semantic brand tokens below.

## 4. Colour roles

### Surfaces

| Role | Fluent token | Light | Dark | Use |
|---|---|---|---|---|
| Canvas | `colorNeutralBackground2` | #fafafa | #1f1f1f | Page background |
| Surface | `colorNeutralBackground1` | #ffffff | #292929 | Header, sidebar, sections, tables, panels, inputs |
| Surface hover | `colorNeutralBackground1Hover` | #f5f5f5 | #3d3d3d | Hovered row |
| Surface selected | `colorNeutralBackground1Selected` | #ebebeb | #383838 | Selected/active row |
| Subtle | `colorNeutralBackground3` | #f5f5f5 | #141414 | Table header band, read-only groups |
| Brand tint | `colorBrandBackground2` | #EBF3FC | #082338 | Selected nav item tint, info highlights |
| Overlay | `colorBackgroundOverlay` | rgba(0,0,0,.4) | rgba(0,0,0,.5) | Modal backdrop (Fluent) |

### Text

| Role | Fluent token | Light | Dark | Use |
|---|---|---|---|---|
| Primary | `colorNeutralForeground1` | #242424 | #ffffff | Body, titles, values |
| Secondary | `colorNeutralForeground2` | #424242 | #d6d6d6 | Labels, toolbar icons |
| Tertiary | `colorNeutralForeground3` | #616161 | #adadad | Descriptions, metadata, column headers |
| Disabled | `colorNeutralForegroundDisabled` | #bdbdbd | #5c5c5c | Disabled controls only |
| On brand | `colorNeutralForegroundOnBrand` | #ffffff | #ffffff | Text on primary button |
| Brand | `colorBrandForeground1` | #0F6CBD | #62ABF5 | Selected nav, active tab |
| Link | `colorBrandForegroundLink` | #115EA3 | #62ABF5 | Links |

### Brand fills

| Role | Fluent token | Light | Dark |
|---|---|---|---|
| Rest | `colorBrandBackground` | #0F6CBD | #115EA3 |
| Hover | `colorBrandBackgroundHover` | #115EA3 | #0F6CBD |
| Pressed | `colorBrandBackgroundPressed` | #0C3B5E | #0C3B5E |

### Strokes

| Role | Fluent token | Light | Dark | Use |
|---|---|---|---|---|
| Control | `colorNeutralStroke1` | #d1d1d1 | #666666 | Input and button borders |
| Divider | `colorNeutralStroke2` | #e0e0e0 | #525252 | Region borders, separators, row lines |
| Subtle | `colorNeutralStroke3` | #f0f0f0 | #3d3d3d | Dividers inside a surface |
| Accessible | `colorNeutralStrokeAccessible` | #616161 | #adadad | Input underline, checkbox outline |
| Brand | `colorCompoundBrandStroke` | #0F6CBD | #479EF5 | Focused input underline, selection bar |

### Status

| Tone | Background | Foreground | Border | Dot |
|---|---|---|---|---|
| Success | `colorStatusSuccessBackground1` #f1faf1 | `colorStatusSuccessForeground1` #0e700e | `colorStatusSuccessBorder1` | `colorStatusSuccessBackground3` |
| Warning | `colorStatusWarningBackground1` #fff9f5 | `colorStatusWarningForeground3` #bc4b09 | `colorStatusWarningBorder1` | `colorStatusWarningBackground3` |
| Danger | `colorStatusDangerBackground1` #fdf3f4 | `colorStatusDangerForeground1` #b10e1c | `colorStatusDangerBorder1` | `colorStatusDangerBackground3` |
| Info | `colorBrandBackground2` | `colorBrandForeground2` | — | `colorBrandBackground` |
| Neutral | `colorNeutralBackground3` | `colorNeutralForeground3` | — | `colorNeutralForeground3` |

In practice, render statuses with Fluent `Badge` (see the status registry, §11). Use these tokens
directly only inside design-system components.

## 5. Typography

| Style | Size / line | Weight | Use |
|---|---|---|---|
| `caption1` | 12 / 16 | 400 | Metadata, helper text, timestamps |
| `caption1Strong` | 12 / 16 | 600 | Nav section headers, metric labels |
| `body1` | 14 / 20 | 400 | **Default** |
| `body1Strong` | 14 / 20 | 600 | Emphasis, record name in tables |
| `body2` | 16 / 22 | 400 | Empty-state descriptions |
| `subtitle2` | 16 / 22 | 600 | Section headings |
| `subtitle1` | 20 / 28 | 600 | Dialog / panel titles |
| `title3` | 24 / 32 | 600 | Page title |
| `title2` | 28 / 36 | 600 | Metric values only |
| `title1`, `largeTitle`, `display` | — | — | **Not allowed** |

Font family `fontFamilyBase` (Segoe UI stack); `fontFamilyMonospace` for IDs and plates if alignment
matters. Weights: `fontWeightRegular` (400) and `fontWeightSemibold` (600) only.

```tsx
import { Title3, Caption1, typographyStyles, makeStyles } from '@fluentui/react-components';
const useStyles = makeStyles({ label: typographyStyles.caption1Strong });
```

## 6. Spacing

Fluent spacing tokens exist on both axes (`spacingHorizontalM`, `spacingVerticalM`). Use the axis that
matches the property.

| Token suffix | Value | Typical use |
|---|---|---|
| `XXS` | 2px | Icon–text gap in badges |
| `XS` | 4px | Label → control; inline icon gap |
| `S` | 8px | Button group gap; toolbar gap; cell inner gap |
| `M` | 12px | Filter bar gap; card inner gap |
| `L` | 16px | Section padding; field-to-field gap; section-to-section gap; compact gutter |
| `XL` | 20px | Page top padding |
| `XXL` | 24px | Desktop gutter; form column gap; header → content |
| `XXXL` | 32px | Empty-state padding (maximum) |

`SNudge` (6px) and `MNudge` (10px) are Fluent-internal. Avoid them.

## 7. Radius, stroke, shadow

| Token | Value | Use |
|---|---|---|
| `borderRadiusNone` | 0 | Header, sidebar, table cells |
| `borderRadiusSmall` | 2px | Checkbox, small tags |
| `borderRadiusMedium` | 4px | **Default**: buttons, inputs, sections, cards, menus |
| `borderRadiusXLarge` | 8px | Dialogs and popovers (Fluent default) |
| `borderRadiusCircular` | — | Avatars, dots |
| `strokeWidthThin` | 1px | All borders |
| `strokeWidthThick` | 2px | Focus ring |
| `strokeWidthThicker` | 3px | Selected nav / tab indicator |

| Elevation | Token | Use |
|---|---|---|
| 0 | none | **All page content**: sections, tables, metric cards, header, sidebar |
| 2 | `shadow2` | Sticky header/footer while content scrolls beneath |
| 4 | `shadow4` | Optional hover on clickable cards |
| 8 | `shadow8` | Toasts (Fluent) |
| 16 | `shadow16` | Menus, popovers, dropdowns (Fluent) |
| 64 | `shadow64` | Dialogs, overlay drawers (Fluent) |

## 8. Layout tokens (`--ng-layout-*`)

| Token | Value | Use |
|---|---|---|
| `headerHeight` | 48px | App header |
| `sidebarWidth` | 240px | Expanded sidebar |
| `contentMaxWidth` | 1600px | List/dashboard pages |
| `contentPaddingInline` | 24px | Desktop gutter |
| `contentPaddingInlineCompact` | 16px | Gutter below `md` |
| `contentPaddingBlock` | 20px | Page top/bottom padding |
| `formMaxWidth` | 960px | Create/edit pages |
| `readableMaxWidth` | 720px | Settings, long text |
| `detailPanelWidth` | 480px | Detail drawer |
| `detailPanelWidthWide` | 720px | Drawer with a form/table |
| `dialogWidthSmall` / `Medium` / `Large` | 440 / 600 / 880px | Dialog sizes |
| `searchFieldWidth` | 280px | Filter bar search |
| `filterFieldWidth` | 200px | Filter bar dropdowns |
| `metricCardMinWidth` | 200px | Metric grid min column |
| `formColumnMinWidth` | 260px | Form grid min column |

## 9. Breakpoints, z-index, icon sizes

| Breakpoint | Min width | Behaviour below it |
|---|---|---|
| `sm` | 640 | Phone: single column, stacked filters, card lists |
| `md` | 1024 | Tablet: sidebar becomes overlay, form grids collapse, compact gutter |
| `lg` | 1366 | Reference desktop |
| `xl` | 1920 | Content capped at 1600px |

| z-index | Value | Use |
|---|---|---|
| `base` | 0 | |
| `raised` | 1 | Overlapping borders |
| `sticky` | 100 | Sticky table header, form footer, command bar |
| `header` | 200 | App header |
| `sidebar` | 300 | Inline sidebar overlapping content |
| `overlay` | 1000 | Reserved. Fluent portals handle overlays; never set z-index on them. |

| Icon size | Value | Use |
|---|---|---|
| `small` | 16px | Table cells, badges, captions |
| `medium` | 20px | **Default**: buttons, nav, toolbars, inputs |
| `large` | 24px | Page-level emphasis, message bars |
| `xlarge` | 32px | Rare |
| `empty` | 48px | Empty states only |

## 10. Density

| Item | Value | Fluent prop |
|---|---|---|
| Controls (default) | 32px | `size="medium"` |
| Controls in table rows / dense toolbars | 24px | `size="small"` |
| Large controls | 40px | `size="large"`, **not used** |
| Table rows (default list screens) | 34px | `<Table size="small">` |
| Table rows with avatars / two lines | 44px | `<Table size="medium">` |
| Nested tables in panels | 24px | `<Table size="extra-small">` |
| Default page size | 25 | Options 25 / 50 / 100 |

## 11. Status registry

Statuses are part of the token system so they look the same in every module.

| Tone | Badge `color` | Meaning |
|---|---|---|
| success | `success` | Completed, paid, passed, healthy |
| warning | `warning` | Needs attention soon |
| danger | `danger` | Problem or blocked |
| info | `brand` | Scheduled, in progress, upcoming |
| neutral | `informative` | Inactive, draft, cancelled, archived |

Badges use `appearance="tint"` and `size="medium"`; `filled` is not used.

| Domain | Status → tone |
|---|---|
| Learner | Enquiry · neutral, Active · success, On hold · warning, Test ready · info, Passed · success, Withdrawn · neutral |
| Instructor | Available · success, On lesson · info, On leave · neutral, Inactive · neutral |
| Lesson | Scheduled · info, In progress · info, Completed · success, Cancelled · neutral, No-show · danger, Rescheduled · warning |
| Payment | Paid · success, Partially paid · warning, Pending · info, Overdue · danger, Refunded · neutral, Void · neutral |
| Invoice | Draft · neutral, Issued · info, Paid · success, Overdue · danger, Void · neutral |
| Driving test | Not booked · neutral, Booked · info, Passed · success, Failed · danger, Cancelled · neutral |
| Vehicle | Available · success, In use · info, Service due · warning, Off road · danger, Retired · neutral |
| Attendance | Present · success, Late · warning, Absent · danger, Excused · neutral |

To add a status: add it to `status.domains` in the JSON, then update this table.

## 12. Changing tokens

1. Propose the change with a reason (accessibility, a missing need). Not taste.
2. Edit `tokens/noodlegear.tokens.json`.
3. Regenerate the generated files and update this document.
4. Check contrast in **both** themes and review the reference page.
