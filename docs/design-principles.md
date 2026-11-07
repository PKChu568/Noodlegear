# Noodlegear design principles

Noodlegear is software people use for hours every working day: receptionists booking lessons,
administrators chasing payments, instructors checking their schedule between lessons. The interface
exists to get that work done quickly and without mistakes. Everything here follows from that.

**Primary reference:** Microsoft Fluent 2 and its use in Dynamics 365, Entra admin center, Azure portal
and Microsoft 365 admin center. When a decision is unclear, do what those products do.

---

## 1. Principles

### 1.1 Function before form
Every element must help someone read, decide or act. If removing something loses no information and no
capability, remove it. No ornament.

### 1.2 Consistency over novelty
The same thing looks and behaves the same everywhere. A "Paid" badge, a page header, a delete
confirmation, a table: identical across every module. Users should learn the app once.

### 1.3 Density with clarity
Show enough data to work without scrolling or clicking around, while keeping it legible: compact rows
(34px), 14px body text, tight but consistent spacing on a 4px grid. Density comes from removing waste
(oversized padding, decorative cards, giant headings), not from shrinking text.

### 1.4 Clear hierarchy
Exactly one page title. Section headings are smaller and quieter. Primary information is
`colorNeutralForeground1`; supporting metadata is `colorNeutralForeground3`. Hierarchy is made with
weight, size and colour from the scale, not with boxes, colours or decoration.

### 1.5 Restrained colour
The interface is neutral: white surfaces on a near-white canvas, grey text and dividers. Blue (brand) is
reserved for interactive emphasis: the primary button, links, selection and focus. Status colours appear
only to communicate status. If a screen looks colourful, something is wrong.

### 1.6 Predictable interaction
Primary actions sit in the same place on every page. Destructive actions always confirm. Dialogs always
close with Esc. Tables always sort from the header. Nothing moves, animates or appears unexpectedly.

### 1.7 Efficient workflows
Minimise clicks and context switches. Prefer inline panels over page navigation for quick look-ups,
sensible defaults over empty forms, and keyboard paths for frequent tasks. Never make the user re-enter
information the system already has.

### 1.8 Accessible by default
WCAG 2.2 AA is the minimum. Accessibility is part of "done", not a later pass.

---

## 2. Visual language

| Aspect | Rule |
| --- | --- |
| Theme | Light by default. Dark is supported through tokens. Never design for one theme only. |
| Canvas | `colorNeutralBackground2` (#fafafa). |
| Surfaces | `colorNeutralBackground1` (white) with a 1px `colorNeutralStroke2` border and `borderRadiusMedium` (4px). No shadow. |
| Header & sidebar | White surfaces separated from the canvas by a 1px divider. Not brand-filled. |
| Accent | Brand blue `#0F6CBD` only, through brand tokens. No second accent colour. |
| Borders | 1px solid. Used to separate regions, instead of shadows. |
| Radius | 4px for nearly everything; 8px only for dialogs and popovers (Fluent default); circular for avatars and dots. |
| Shadow | None on page content. Elevation is reserved for things floating above the page: menus, popovers, dialogs, drawers and toasts, all handled by Fluent. |
| Gradients, blur, glass | Never. |

### Surfaces and cards
A surface is a white region with a border. Use one surface per **logical region** (a table, a form
section, a metric group, a detail column). Do not:

- put a surface inside a surface;
- wrap a single line of text, a single button or a page header in a surface;
- use surfaces as decoration or to make a page "look designed".

Page headers, filter bars and command bars sit directly on the canvas or at the top of their region,
not in their own cards.

---

## 3. Typography

Font: **Segoe UI** (Fluent `fontFamilyBase`), falling back to the platform UI font.

| Role | Fluent style | Size / line height |
| --- | --- | --- |
| Page title | `title3` | 24 / 32, semibold |
| Dialog & panel title | `subtitle1` | 20 / 28, semibold |
| Section heading | `subtitle2` | 16 / 22, semibold |
| Body, cells, inputs, labels | `body1` | 14 / 20 |
| Emphasis, primary cell | `body1Strong` | 14 / 20, semibold |
| Metadata, helper, timestamps | `caption1` | 12 / 16 |
| Metric value | `title2` | 28 / 36, semibold (the only use of title2) |

Rules:

- Two weights only: regular (400) and semibold (600).
- Sentence case everywhere: titles, buttons, labels, column headers, menu items. Never ALL CAPS, except
  for established abbreviations (ID, DVLA, VAT).
- Numbers in tables and metrics use `font-variant-numeric: tabular-nums` and are right-aligned in columns.
- Long text wraps at `--ng-layout-readable-max-width` (720px).
- Truncate with an ellipsis only where the full value is available (tooltip, detail panel).

---

## 4. Spacing and layout

- **4px grid.** Use only Fluent spacing tokens: 2, 4, 8, 12, 16, 20, 24, 32. Avoid the "nudge" values
  (6, 10).
- **Proximity:** related items are closer together than unrelated ones. Label to control is 4px; field
  to field is 16px; section to section is 16–24px.
- **Gutters:** 24px page side gutter on desktop, 16px below 1024px.
- **Widths:** list pages fill the width up to 1600px. Forms cap at 960px, settings and long text at 720px.
- **Desktop-first:** design at 1366×768 (a common office laptop) and adapt down to tablet (1024) and
  phone (390). See `docs/patterns.md §10`.

---

## 5. Iconography

- **Fluent UI React Icons only.** Regular style at rest, Filled for selected/active (nav).
- 20px default; 16px in table cells and badges; 24px for page-level emphasis; 48px only in empty states.
- Icons support labels; they do not replace them. An icon-only button needs an `aria-label` and a
  Tooltip.
- Use the same icon for the same concept everywhere:

| Concept | Icon |
| --- | --- |
| Dashboard | `Board` / `Home` |
| Learners | `PeopleCommunity` |
| Instructors | `PersonStar` / `HatGraduation` |
| Lessons / schedule | `CalendarLtr` |
| Booking | `CalendarAdd` |
| Vehicles | `VehicleCar` |
| Payments | `Payment` |
| Invoices | `DocumentText` / `Receipt` |
| Driving tests | `ClipboardTask` |
| Attendance | `PersonClock` |
| Progress | `ArrowTrending` / `DataBarHorizontal` |
| Reports | `DataPie` / `ChartMultiple` |
| Settings | `Settings` |
| Add / create | `Add` |
| Edit | `Edit` |
| Delete | `Delete` |
| Filter | `Filter` |
| Search | `Search` |
| Export | `ArrowDownload` |
| Refresh | `ArrowClockwise` |
| More actions | `MoreHorizontal` |
| Close | `Dismiss` |

---

## 6. Motion

Use only Fluent's built-in component motion (drawers, dialogs, menus, toasts). No custom entrance
animations, no animated numbers, no hover bounces. Respect `prefers-reduced-motion`. Skeletons may use
Fluent's default shimmer.

---

## 7. Accessibility (WCAG 2.2 AA)

| Requirement | How |
| --- | --- |
| Contrast | Text ≥ 4.5:1, large text and UI component boundaries ≥ 3:1. Neutral tokens meet this. Never use `colorNeutralForeground4` or disabled colours for essential information. |
| Colour is not the only signal | Statuses always have a text label; validation always has a message; required fields have a visible indicator. |
| Keyboard | Every action works with the keyboard. Logical tab order follows reading order. Tables use arrow-key navigation (Fluent `useArrowNavigationGroup`). Esc closes overlays and returns focus to the trigger. |
| Focus visible (2.4.7) / not obscured (2.4.11) | Use Fluent's focus indicator (2px `colorStrokeFocus2` ring). Never remove outlines. Sticky headers/footers must not cover the focused element (use `scroll-padding`). |
| Target size (2.5.8) | Interactive targets are at least 24×24px. Fluent small controls are 24px. Do not go smaller. |
| Dragging (2.5.7) | Any drag interaction (e.g. moving a lesson on a calendar) has a non-drag alternative (Edit / Reschedule action). |
| Names and roles | Every input has a visible label through Fluent `Field`. Icon buttons have `aria-label`. Use landmark elements: `header`, `nav`, `main`, `aside`, and one `h1` per page. |
| Status messages (4.1.3) | Toasts and async results are announced (Fluent Toast and MessageBar use live regions). |
| Errors (3.3.1 / 3.3.3) | Inline errors under the field, explaining how to fix it. On submit, focus the first invalid field. |
| Redundant entry (3.3.7) | Pre-fill known data (e.g. learner address on an invoice). |
| Consistent help (3.2.6) | Help is always in the same place (header help button). |
| Skip link | First focusable element: "Skip to main content". |
| Reflow | Usable at 320 CSS px width / 400% zoom; wide tables scroll horizontally inside their region, not the page. |

---

## 8. Writing

- **Sentence case.** "Add learner", not "Add Learner".
- **Specific verbs** on buttons: "Book lesson", "Record payment", "Cancel lesson". Avoid "OK", "Yes",
  "Submit".
- Destructive confirmations name the object and consequence: *"Cancel lesson for Amaya Silva on
  12 Nov? The learner will be notified."*
- Empty states say what is missing and what to do next.
- Error messages say what happened and how to fix it. No blame, no jargon, no error codes alone.
- Dates: `12 Nov 2026`; with time `12 Nov 2026, 14:30`; 24-hour clock. Money: `£1,250.00`
  (locale and currency are configured in one place).
- Use the product's nouns consistently: **learner** (not student), **instructor**, **lesson**,
  **booking**, **vehicle**, **driving test**, **invoice**, **payment**.

---

## 9. Anti-patterns (reject in review)

- Glassmorphism, gradients, glow, blur, coloured shadows.
- Large rounded cards (> 4px radius) and "card soup": everything boxed.
- Floating decorative shapes, illustrations, mascots, stock imagery, emoji.
- Oversized headings, hero banners, marketing copy.
- Purple, pink or teal accents; multiple accent colours; random colours per module.
- Shadows on static content.
- Animations that are not Fluent component motion.
- Charts with no clear question, 3D charts, pie charts with more than 5 slices, decorative sparklines.
- Icon-only actions without labels or tooltips.
- Custom controls that duplicate Fluent ones.
