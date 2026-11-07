# Noodlegear application patterns

Standard layouts and workflows. Every new screen must match one of the page types in §3. Component
details are in [`components.md`](components.md).

## 1. Application shell

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ☰  ▣ Noodlegear | Northside Driving School   [🔍 Search …]     🔔  ?  ⚙  (DP) │  AppHeader 48px
├──────────────┬─────────────────────────────────────────────────────────────┤
│ ⌂ Dashboard  │  Breadcrumb (detail pages only)                              │
│              │  Page title                    [Secondary] [⋯] [Primary]    │  PageHeader
│ LEARNING     │  Description                                                │
│ 👥 Learners   │                                                              │
│ 📅 Lessons    │  MessageBar (page-level, optional)                          │
│ 📋 Tests      │  FilterBar                                                  │
│              │  ┌───────────────────────────────────────────────────────┐ │
│ OPERATIONS   │  │ CommandBar                                             │ │  Section (surface)
│ 🧑‍🏫 Instructors│  │ DataTable                                              │ │
│ 🚗 Vehicles   │  │ Pagination                                             │ │
│              │  └───────────────────────────────────────────────────────┘ │
│ FINANCE      │                                                              │
│ 💳 Payments   │                                                              │
│ 🧾 Invoices   │                                                              │
│ 📊 Reports    │                                                              │
│ ──────────── │                                                              │
│ ⚙ Settings   │                                                              │
└──────────────┴─────────────────────────────────────────────────────────────┘
   SideNav 240px                       main (only this scrolls) · canvas #fafafa
```

- Header and sidebar are white surfaces separated by 1px dividers. The canvas is `colorNeutralBackground2`.
- The main region scrolls independently. Gutters are 24px (16px below `md`); content max width is 1600px.

## 2. Navigation structure

Defined once (`SideNav` entries). Do not change the order per role. Hide items the user has no
permission for instead.

| Section header | Item | Route | Icon |
|---|---|---|---|
| — | Dashboard | `/` | `Board` |
| Learning | Learners | `/learners` | `PeopleCommunity` |
| | Lessons (schedule) | `/lessons` | `CalendarLtr` |
| | Driving tests | `/tests` | `ClipboardTask` |
| | Attendance & progress | `/progress` | `ArrowTrending` |
| Operations | Instructors | `/instructors` | `PersonStar` |
| | Vehicles | `/vehicles` | `VehicleCar` |
| Finance | Payments | `/payments` | `Payment` |
| | Invoices | `/invoices` | `DocumentText` |
| | Reports | `/reports` | `DataPie` |
| (divider, bottom) | Settings | `/settings` | `Settings` |

- New modules slot into an existing section. A new section needs approval.
- Instructors may see a reduced nav (Dashboard → "My day", Lessons, Learners). It uses the same
  components and order.
- Routes are nouns, plural, kebab-case: `/learners/:id`, `/learners/:id/edit`, `/learners/new`.

## 3. Page types

### 3.1 List page (Learners, Instructors, Vehicles, Payments, Invoices, Tests)

```
PageHeader   title "Learners" · description "312 learners · 18 test ready" · [Import] [⋯] [Add learner]
FilterBar    search + 3–4 filters + active filter tags + result count
Section flush
  CommandBar   (Export · Send reminder · Refresh | farItems: columns/density)  → bulk actions when selected
  DataTable    size small, sortable, multiselect where bulk actions exist
  Pagination
```

- Opening a row shows the **DetailPanel** (quick look) by default; "Open full record" in the panel
  header goes to the detail page. Modules with complex records (learners, instructors) may open the
  detail page directly. Be consistent within a module.
- Default sort: most relevant first (upcoming lessons by time; payments by due date; learners by last name).
- The list remembers filters, sort and page in the URL.

### 3.2 Detail page (Learner, Instructor, Vehicle)

```
PageHeader   breadcrumb · title + StatusBadge · [Edit] [⋯] [Book lesson] · TabList
             Overview | Lessons | Payments | Driving tests | Progress | Documents | Notes
ProfileHeader (Overview tab) — identifiers and 4 key details
MessageBar   only for active conditions ("£120.00 overdue")
Two-column layout ≥ lg (2fr / 1fr), single column below:
  main:  Section "Upcoming lessons" (table, extra-small) · Section "Details" (DescriptionList, 2 cols)
  aside: Section "Balance" (MetricCard-like summary) · Section "Activity" (ActivityTimeline, 8 items)
```

- Tabs switch content in place and update the URL (`/learners/L-10234/payments`).
- Each tab follows the list or form patterns for its content.
- Editing: the "Edit" button opens the edit page (large records) or a DetailPanel/Dialog (small groups,
  e.g. "Edit contact details"). Never edit inline in a DescriptionList.

### 3.3 Create / edit form page

```
PageHeader   breadcrumb (Learners › New learner) · title "New learner" (no actions in header)
PageContent  width="form" (960px)
  MessageBar (error summary, only after a failed submit)
  FormSection "Personal details"   FormGrid 2 cols
  FormSection "Contact"            FormGrid 2 cols
  FormSection "Licence"            FormGrid 2 cols
  FormSection "Lesson preferences" FormGrid 2 cols
FormActions sticky   [Save learner] [Cancel]          ← bottom, left-aligned, primary first
```

- Long or multi-step creation (e.g. learner + package + first booking) uses a step indicator above the
  first section, with "Back", "Next" and the final "Create" in FormActions. Steps are 3–5 at most and
  can be revisited.
- Navigating away with unsaved changes asks for confirmation ("Discard changes?").
- On success: go to the record's detail page and show a toast ("Learner added").

### 3.4 Dashboard

```
PageHeader   "Dashboard" · description "Saturday 07 Nov 2026" · [Book lesson]
MetricGrid   4 metrics: Lessons today · Unassigned lessons · Payments due this week · Tests this week
Two columns ≥ lg (2fr / 1fr):
  main:  Section "Today's lessons" (DataTable, by time, with status)
  aside: Section "Needs attention" (list: overdue payments, expiring documents, vehicles service due)
         Section "Recent activity" (ActivityTimeline)
```

- Every metric links to a filtered list. Charts are allowed only when they answer a question
  ("Lessons booked per week, last 12 weeks"). They must have labelled axes, use the brand colour plus
  neutrals, and offer a table alternative.
- Dashboards are role-specific (admin, reception, instructor) but use this same layout.

### 3.5 Settings page

`PageContent width="readable"`. Left: vertical `TabList` of categories (School profile, Lesson types &
prices, Working hours, Notifications, Users & roles). Right: FormSections. Settings forms use a Save
button, except toggles marked "applies immediately", which use `Switch`.

### 3.6 Schedule / calendar (Lessons)

A week view (Mon–Sun, 07:00–21:00, 30-minute rows) with instructor columns or a resource filter.
Lessons are blocks on `colorBrandBackground2` with a 3px left border in `colorCompoundBrandStroke`,
showing the learner name and time. Status changes the border colour by tone. Toggle between week,
day and list view. Every drag interaction has a non-drag equivalent ("Reschedule" dialog). Build
the calendar from tokens and Fluent primitives. Do not add a calendar library without approval.

## 4. Action placement

| Context | Position | Order | Primary |
|---|---|---|---|
| Page header | Right of title row | secondary → overflow ⋯ → **primary (right-most)** | 1 max |
| Command bar (table) | Top of table section, left; view options right | most used first | none (subtle) |
| Full-page form | Bottom, **left-aligned**, sticky | **primary first**, then Cancel | 1 |
| Dialog | Bottom, right-aligned | **primary first**, then Cancel | 1 |
| Detail panel | Footer, right-aligned | **primary first**, then Cancel/Close | 1 |
| Table row | Trailing ⋯ menu | — | none |
| MessageBar | Inline actions at end | — | small default buttons |
| Empty state | Centred under the text | — | 1 (first use) |

- The same action has the same label and icon everywhere ("Book lesson" + `CalendarAdd`).
- Destructive actions are never primary in a page header. They live in the overflow menu, last, after a
  divider, and confirm.

## 5. Forms

- Labels above inputs; 4px label to control; 16px between fields; 24px between columns.
- Two columns at desktop (`FormGrid columns={2}`), one column below `md`. Related short fields pair up
  (First name / Last name; Postcode / City). Address and notes span the full width.
- Field widths come from the grid, not the content. Don't size inputs individually, except
  short-format fields (postcode, registration plate, time), which may use `span={1}` in a 3-column grid.
- Defaults: today for dates, the school's default lesson duration, the learner's usual instructor.
- Required fields are marked. Units and currency go in `contentBefore`/`contentAfter`.
- Save is never disabled for validation reasons. Validate on submit and show what to fix.
- Keyboard: Enter submits single-line forms in dialogs; Ctrl/Cmd+S saves full-page forms.

## 6. Tables

- Default `size="small"` (34px rows), sortable headers, sticky header, 25 rows per page.
- Columns, left to right: **identity** (name/reference) → **key attributes** → **dates** → **money** →
  **status** → **row actions**.
- Money and numbers right-aligned. Dates `12 Nov 2026`; with time when relevant.
- Selection checkboxes only when bulk actions exist.
- Row click opens the record; links inside cells (e.g. instructor name) navigate to that record.
- Empty cells show "—" in `colorNeutralForeground3`.
- No zebra striping, no coloured rows, no inline editing, no more than ~8 visible columns (use a column
  chooser for the rest).

## 7. Status

- All statuses are rendered with `StatusBadge` (tables, headers) or `StatusIndicator` (lists, legends),
  mapped through the registry in `tokens/noodlegear.tokens.json`.
- One status per record per context. If two are relevant (lesson status + payment status), use separate
  columns with clear headers.
- Status text is user language ("No-show"), never an enum (`NO_SHOW`).

## 8. Loading, empty, error and permission states

Every data region implements all of these:

| State | Pattern |
|---|---|
| Loading (first) | Skeleton shaped like the content; header, filters and actions stay visible and usable |
| Refreshing | Keep the old data; small spinner by the section title |
| Empty, first use | `EmptyState kind="firstUse"` with the creation action |
| Empty, filtered | `EmptyState kind="noResults"` with "Clear filters"; filters stay visible |
| Error | `EmptyState kind="error"` in the region (or `MessageBar intent="error"` above existing data) with "Try again" |
| No permission | `EmptyState kind="noPermission"`; hide the nav item if the whole module is restricted |
| Partial failure | Show what loaded, plus a `MessageBar intent="warning"` describing what didn't |
| Saving | Disable the submitting button, show its spinner, keep the form visible |

Errors never show raw exception text or stack traces. Log them and show a human message.

## 9. Overlays: dialog, panel or page

| Task | Use |
|---|---|
| Confirm an action | `ConfirmDialog` |
| Short task, ≤ 6 fields, no context needed (Record payment, Reschedule) | `Dialog` (medium) |
| View a record from a list; light edit with context visible | `DetailPanel` |
| Create/edit a full record, multi-section form, multi-step flow | Full page |
| Pick from many records (choose learner) | `Combobox` / `TagPicker` in place, not a dialog |

Never open a dialog from a dialog, or a panel from a panel. A dialog may open from a panel (e.g.
confirm a cancellation).

## 10. Responsive behaviour

| Width | Behaviour |
|---|---|
| ≥ 1366 (lg) | Reference layout. Two-column detail/dashboard. |
| 1024–1365 | Same as desktop; detail aside drops below main if cramped. |
| 640–1023 (tablet) | Sidebar becomes an overlay drawer (hamburger). Form grids are 1 column. Low-priority table columns hide (`hideBelow="md"`). Gutter 16px. PageHeader actions wrap below the title. |
| < 640 (phone) | Tables become stacked lists. FilterBar collapses into a "Filters" drawer. Detail panels go full-screen. Overflow menus hold secondary actions. Primary action stays visible. |

Instructors often use tablets in the car, so their key flows (today's lessons, mark attendance, add
lesson notes) must work well at tablet width with touch targets of at least 32px.

## 11. Keyboard

- Tab moves between regions and controls; arrow keys move within composite widgets (nav, toolbar,
  table, tabs, menus), which is Fluent's default behaviour.
- Esc closes the topmost overlay and returns focus to its trigger.
- Enter on a table row opens it. Space toggles selection.
- Global: `/` focuses global search; `Ctrl/Cmd+S` saves the current form. Document any new shortcut in
  the Help panel and here. Never override browser or screen-reader shortcuts.

## 12. Data formatting

| Data | Format | Example |
|---|---|---|
| Date | `formatDate` | 12 Nov 2026 |
| Date + time | `formatDateTime` | 12 Nov 2026, 14:30 |
| Time | `formatTime`, 24h | 14:30 |
| Short day | `formatWeekday` | Thu 12 Nov |
| Money | `formatCurrency` | £1,250.00 |
| Negative money / refunds | `-£60.00` in `colorNeutralForeground1`, labelled "Refund" | |
| Duration | minutes → "1 h 30 min" | 1 h 30 min |
| Phone | as entered, monospace not required | 07700 900123 |
| IDs | prefix + number | L-10234 (learner), I-021 (instructor), INV-2026-0142 |
| Registration plate | uppercase, monospace allowed | AB12 CDE |
| Empty value | em dash in tertiary colour | — |

Locale and currency are set once in the shared formatting module (`en-GB`, `GBP` by default).
