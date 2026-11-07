# Noodlegear components

Every component is one of two kinds:

- **Fluent**: use the Fluent UI React v9 component directly, following the Noodlegear defaults listed.
  Do not wrap it.
- **Composition**: a Noodlegear component built **once** in `src/design-system/` from Fluent parts,
  because the app needs one consistent behaviour or layout. Each entry gives the props contract to
  implement. Feature code uses the composition and never rebuilds it.

Everything not listed here: use Fluent if it exists. If it does not, propose it (AGENTS.md §8).

Imports in the examples:
`import { … } from '@fluentui/react-components'`, icons from `@fluentui/react-icons`, compositions
from `@/design-system`.

## Contents

1. [Application layout](#1-application-layout): AppShell, AppHeader, SideNav, Breadcrumb, PageHeader, PageContent, Section
2. [Data display](#2-data-display): DataTable, Pagination, StatusBadge, StatusIndicator, EmptyState, loading and Skeleton, Tooltip, DescriptionList
3. [Forms and inputs](#3-forms-and-inputs): Field, Input, SpinButton, SearchBox, Select/Dropdown/Combobox, DateField, Checkbox, RadioGroup, Switch, FormSection/FormGrid/FormActions, validation
4. [Actions](#4-actions): Button, icon button, SplitButton, Menu, CommandBar
5. [Feedback and overlays](#5-feedback-and-overlays): Dialog, ConfirmDialog, notifications (toasts), MessageBar, progress
6. [Business components](#6-business-components): MetricCard, DetailPanel, ProfileHeader, ActivityTimeline, FilterBar

---

## 1. Application layout

### AppShell (composition)

The frame of every authenticated screen: skip link, header, sidebar and the main region.

```
┌──────────────────────────────────────────────────────────────┐
│ AppHeader (48px, surface, bottom divider)                    │
├────────────┬─────────────────────────────────────────────────┤
│ SideNav    │ <main id="main"> canvas                          │
│ 240px      │   PageHeader                                     │
│ surface    │   PageContent …                                  │
│ right      │                                                  │
│ divider    │                                                  │
└────────────┴─────────────────────────────────────────────────┘
```

```ts
export interface AppShellProps {
  header: React.ReactNode;     // <AppHeader />
  nav: React.ReactNode;        // <SideNav />
  children: React.ReactNode;   // page
}
// useAppShell(): { navOpen: boolean; setNavOpen(open: boolean): void; toggleNav(): void; isCompact: boolean }
```

- At ≥ 1024px the sidebar is inline and can be collapsed by the hamburger. Below 1024px it is an
  overlay drawer, closed by default, which closes after navigation.
- Only `main` scrolls. Header and sidebar stay fixed.
- The first focusable element is a visually hidden "Skip to main content" link targeting `#main`
  (`tabIndex={-1}` on `main`).

**Do:** use for every signed-in page. **Don't:** create page-specific shells or hide the sidebar on
some pages (except full-screen flows such as printing an invoice).

### AppHeader (composition)

```ts
export interface AppHeaderProps {
  productName?: string;              // default "Noodlegear"
  schoolName?: string;               // tenant, shown after a divider: "Noodlegear | Northside Driving School"
  search?: React.ReactNode;          // optional global SearchBox, centred, max 480px
  actions?: React.ReactNode;         // icon buttons: notifications, help, settings
  user: { name: string; role: string; avatarUrl?: string };
  userMenu?: React.ReactNode;        // MenuList items: Profile, Theme, Sign out
}
```

- Height `--ng-layout-header-height` (48px), `colorNeutralBackground1`, bottom border `colorNeutralStroke2`.
  **Not** brand-filled.
- Left to right: `Hamburger` (Fluent), product mark (20px brand-coloured logo + `body1Strong` name),
  optional tenant name in `colorNeutralForeground3`, search (centre), actions, user `Avatar` (size 28)
  opening a `Menu`.
- Header actions are `Button appearance="subtle"` icon buttons with `aria-label` and `Tooltip`.
- Help is always in the same position (WCAG 3.2.6).

### SideNav (Fluent `NavDrawer`)

Use Fluent `NavDrawer`, `NavDrawerBody`, `NavSectionHeader`, `NavItem`, `NavCategory`,
`NavCategoryItem`, `NavSubItemGroup` and `NavSubItem`, `NavDivider`. A thin data-driven wrapper is
recommended so the navigation is defined once:

```ts
export type NavEntry =
  | { kind: 'item'; value: string; label: string; href: string; icon: FluentIcon; badgeCount?: number }
  | { kind: 'group'; value: string; label: string; icon: FluentIcon; items: { value: string; label: string; href: string }[] }
  | { kind: 'section'; label: string };
export interface SideNavProps { entries: NavEntry[]; selectedValue: string; footer?: React.ReactNode }
```

```tsx
const Learners = bundleIcon(PeopleCommunity20Filled, PeopleCommunity20Regular);

<NavDrawer open={navOpen} type={isCompact ? 'overlay' : 'inline'} selectedValue={selected}
           onOpenChange={(_, d) => setNavOpen(d.open)} density="medium">
  <NavDrawerBody>
    <NavItem href="/" icon={<Dashboard />} value="dashboard">Dashboard</NavItem>
    <NavSectionHeader>Learning</NavSectionHeader>
    <NavItem href="/learners" icon={<Learners />} value="learners">Learners</NavItem>
    <NavItem href="/lessons" icon={<Lessons />} value="lessons">Lessons</NavItem>
  </NavDrawerBody>
</NavDrawer>
```

Rules:
- Width `--ng-layout-sidebar-width`. Items 40px (`density="medium"`). Icons 20px, `bundleIcon(Filled, Regular)`.
- Order and grouping are defined in `docs/patterns.md §2`. Do not reorder per page.
- One level of nesting at most (`NavCategory`). No third level.
- Items are real links (`href`) so they can be opened in a new tab.
- Count badges only for actionable queues (e.g. "Overdue payments 4"). Use `CounterBadge`
  `appearance="ghost"`. Never decorative.

**Don't:** put actions ("Add learner") in the nav; use the nav for in-page tabs; hide labels and
show only icons on desktop.

### Breadcrumb (Fluent `Breadcrumb`)

```tsx
<Breadcrumb aria-label="Breadcrumb" size="small">
  <BreadcrumbItem><BreadcrumbButton href="/learners">Learners</BreadcrumbButton></BreadcrumbItem>
  <BreadcrumbDivider />
  <BreadcrumbItem><BreadcrumbButton current>Amaya Silva</BreadcrumbButton></BreadcrumbItem>
</Breadcrumb>
```

- **Use** on detail, edit and nested pages, inside `PageHeader` above the title.
- **Don't** use on top-level pages reached from the sidebar (the nav already shows location).
- The last item is the current page (`current`), not a link. Keep it to at most 4 levels; collapse the
  middle with an overflow menu.

### PageHeader (composition)

The single, consistent top of every page.

```ts
export interface PageHeaderProps {
  title: string;                       // h1, title3
  description?: string;                // caption1/body1 in colorNeutralForeground3, one line
  breadcrumbs?: { label: string; href?: string }[];
  meta?: React.ReactNode;              // status badge(s) next to the title (detail pages)
  primaryAction?: React.ReactNode;     // one Button appearance="primary"
  secondaryActions?: React.ReactNode;  // up to 2 Buttons (default/subtle) + overflow Menu
  tabs?: React.ReactNode;              // optional TabList below, for detail pages
}
```

```
Learners › Amaya Silva                                  (breadcrumb, small)
Amaya Silva  [Active]                [Edit] [⋯]  [Book lesson]
Learner L-10234 · Category B manual · Joined 03 Feb 2026
─ Overview ─ Lessons ─ Payments ─ Tests ─ Documents ─   (TabList)
```

- Title is the only `h1` on the page. `title3` (24px).
- Actions are right-aligned, on the title row, in this order: secondary actions, overflow `Menu`, then
  the primary button **last (right-most)**. Primary is the action people take most often here.
- Wraps below `md`: actions move below the title, left-aligned.
- Sits directly on the canvas. No card, no background, no shadow.

**Don't:** put filters, search or metrics in the header; use more than one primary button; write a
marketing-style description.

### PageContent (composition)

```ts
export interface PageContentProps {
  width?: 'full' | 'form' | 'readable';   // 1600 / 960 / 720 max width
  children: React.ReactNode;
}
```

Applies the page gutters (`--ng-layout-content-padding-*`), the max width, and a vertical stack with
`spacingVerticalL` (16px) between regions.

### Section (composition)

A titled region of a page. Optionally a surface.

```ts
export interface SectionProps {
  title?: string;                 // h2, subtitle2
  description?: string;
  actions?: React.ReactNode;      // subtle/default buttons, right-aligned on the title row
  surface?: boolean;              // default true: white, 1px colorNeutralStroke2 border, radius 4px, padding 16px
  flush?: boolean;                // no inner padding (for tables that run edge to edge)
  children: React.ReactNode;
}
```

**Use** to group related content: a table, a form section on a detail page, "Upcoming lessons".
**Don't** nest Sections with `surface`. Don't use a Section for a single line of text.

---

## 2. Data display

### DataTable (composition over Fluent `Table`)

The most important component in Noodlegear. Build it once on Fluent's `Table`, `TableHeader`,
`TableHeaderCell`, `TableBody`, `TableRow`, `TableCell`, `TableCellLayout` and `TableSelectionCell`,
with `useTableFeatures`, `useTableSort` and `useTableSelection`. Use `DataGrid` only if column
resizing is required.

```ts
export interface DataTableColumn<T> {
  id: string;
  header: string;                               // sentence case
  render: (item: T) => React.ReactNode;
  sortValue?: (item: T) => string | number | Date; // presence = sortable
  align?: 'start' | 'end';                      // 'end' for money, counts, durations
  width?: string;                               // use only for fixed columns (status, actions)
  minWidth?: string;
  hideBelow?: 'sm' | 'md' | 'lg';              // responsive column hiding
}

export interface DataTableProps<T> {
  ariaLabel: string;                            // "Learners"
  columns: DataTableColumn<T>[];
  items: T[];
  getRowId: (item: T) => string;
  size?: 'extra-small' | 'small' | 'medium';    // default 'small' (34px)
  selectionMode?: 'none' | 'multiselect';       // default 'none'
  selectedIds?: ReadonlySet<string>;
  onSelectionChange?: (ids: Set<string>) => void;
  onRowOpen?: (item: T) => void;                // row click / Enter → opens detail panel or page
  activeRowId?: string;                         // highlighted row while its DetailPanel is open
  rowActions?: (item: T) => React.ReactNode;    // overflow Menu in a trailing 44px column
  defaultSort?: { columnId: string; direction: 'ascending' | 'descending' };
  sort?: { columnId: string; direction: 'ascending' | 'descending' }; // controlled (server-side)
  onSortChange?: (sort: { columnId: string; direction: 'ascending' | 'descending' }) => void;
  loading?: boolean;                            // skeleton rows, keeps the header
  error?: React.ReactNode;                      // MessageBar intent="error" with Retry, in place of rows
  emptyState?: React.ReactNode;                 // <EmptyState /> in place of rows
  stickyHeader?: boolean;                       // default true inside scrolling regions
}
```

Spec:
- Inside a `Section flush`. Header row on `colorNeutralBackground3`, text `body1Strong` in
  `colorNeutralForeground2`, bottom border `colorNeutralStroke2`.
- Row height 34px (`size="small"`). Hover is `colorNeutralBackground1Hover`, the active row is
  `colorNeutralBackground1Selected`.
- **First column** holds the record's name as the primary cell (`body1Strong`). Use `TableCellLayout`
  with `media` (Avatar size 24) and `description` (caption) for two-line cells, which needs `size="medium"`.
- Money, numbers and durations are right-aligned with tabular numerals. Dates use `formatDate`.
- Status column uses `StatusBadge`. Never coloured text.
- Row actions: one trailing column with a `MoreHorizontal` subtle icon button opening a `Menu`
  (`aria-label="More actions for Amaya Silva"`). Do not render more than one inline icon button per row.
- Bulk actions appear in the `CommandBar` when rows are selected ("3 selected · Send reminder · Export").
- Sorting: click or Enter on a sortable header. `aria-sort` is set by Fluent. Default sort is documented
  per screen (usually the most recent first).
- Keyboard: `useArrowNavigationGroup({ axis: 'grid' })` on the table. Enter on a row calls `onRowOpen`.
  The primary cell should also be a `Link` so the record is reachable with Tab.
- Wide tables scroll horizontally inside their Section, never the page. Below `md`, hide low-priority
  columns (`hideBelow`); below `sm`, switch to a stacked card list (one surface, rows divided by
  `colorNeutralStroke2`).
- Long text truncates with an ellipsis, with the full value in a `Tooltip` or the detail panel.

```tsx
const columns: DataTableColumn<Learner>[] = [
  { id: 'name', header: 'Learner', sortValue: (l) => l.lastName,
    render: (l) => <TableCellLayout media={<Avatar name={l.name} size={24} />}><Link onClick={() => open(l)}>{l.name}</Link></TableCellLayout> },
  { id: 'instructor', header: 'Instructor', sortValue: (l) => l.instructor, render: (l) => l.instructor, hideBelow: 'md' },
  { id: 'next', header: 'Next lesson', sortValue: (l) => l.nextLesson ?? 0, render: (l) => formatDateTime(l.nextLesson) },
  { id: 'balance', header: 'Balance', align: 'end', sortValue: (l) => l.balance, render: (l) => formatCurrency(l.balance) },
  { id: 'status', header: 'Status', width: '140px', render: (l) => <StatusBadge domain="learner" status={l.status} /> },
];

<Section flush>
  <DataTable ariaLabel="Learners" columns={columns} items={page} getRowId={(l) => l.id}
             selectionMode="multiselect" onRowOpen={openPanel} activeRowId={panelId}
             loading={isLoading} emptyState={<EmptyState kind={hasFilters ? 'noResults' : 'firstUse'} … />}
             rowActions={(l) => <LearnerRowMenu learner={l} />} />
  <Pagination page={page} pageSize={25} totalItems={total} onPageChange={setPage} onPageSizeChange={setPageSize} />
</Section>
```

**Don't:** use a table for fewer than ~3 records with different fields (use DescriptionList); zebra
stripes; coloured row backgrounds for status; editable cells (use a panel or dialog); icons as the only
content of a column without a header.

### Pagination (composition)

Fluent has no pagination component.

```ts
export interface PaginationProps {
  page: number;                       // 1-based
  pageSize: number;                   // 25 | 50 | 100
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}
```

```
Showing 26–50 of 312        Rows per page [25 ▾]   |◀  ◀   Page 2 of 13   ▶  ▶|
```

- Sits at the bottom of the table's Section, separated by a top `colorNeutralStroke2` border, 44px high,
  with `caption1` text in `colorNeutralForeground3`.
- Buttons are `appearance="subtle"` icon buttons (`ChevronDoubleLeft`, `ChevronLeft`, `ChevronRight`,
  `ChevronDoubleRight`) with `aria-label`s ("First page", …), disabled at the ends.
- The wrapper is a `nav` with `aria-label="Pagination"`. Changing page moves focus to the table and
  announces "Page 2 of 13".
- Hide the page-size selector and first/last buttons below `sm`.

**Don't** use infinite scroll for business records. Users need stable positions and totals.

### StatusBadge (composition over Fluent `Badge`)

```ts
type StatusDomain = 'learner' | 'instructor' | 'lesson' | 'payment' | 'invoice' | 'test' | 'vehicle' | 'attendance';
export interface StatusBadgeProps<D extends StatusDomain> {
  domain: D;
  status: StatusKey<D>;     // typed from tokens JSON status.domains
  size?: 'small' | 'medium'; // default 'medium'
}
```

Renders `<Badge appearance="tint" shape="rounded" color={toneToBadgeColor[tone]}>{label}</Badge>` using
the registry in `tokens/noodlegear.tokens.json → status`.

- **Use** for the state of a record (payment status, lesson status).
- **Don't** use for counts (use `CounterBadge`), categories or tags (use `Tag`), or for decoration.
  Never `appearance="filled"`. Never choose a colour directly.
- The label is the accessible text, so do not add a separate `aria-label`.

### StatusIndicator (composition)

An 8px dot plus a `body1` label, for live or availability state in dense contexts (instructor
availability, vehicle availability in a picker, schedule legends).

```ts
export interface StatusIndicatorProps<D extends StatusDomain> { domain: D; status: StatusKey<D>; }
```

The dot colour is the tone's `dot` token. The dot is `aria-hidden` and the label is always visible.
Prefer `StatusBadge` in tables; use `StatusIndicator` where a badge is too heavy (lists, legends,
profile headers).

### EmptyState (composition)

```ts
export interface EmptyStateProps {
  kind: 'firstUse' | 'noResults' | 'error' | 'noPermission';
  icon?: FluentIcon;          // 48px, colorNeutralForeground3; defaults by kind
  title: string;              // subtitle1
  description?: string;       // body1, colorNeutralForeground3, max 480px
  action?: React.ReactNode;   // firstUse: primary button; noResults: "Clear filters" secondary button
}
```

| Kind | Example title | Action |
|---|---|---|
| `firstUse` | "No learners yet" / "Add your first learner to start booking lessons." | Primary "Add learner" |
| `noResults` | "No learners match your filters" | "Clear filters" |
| `error` | "Couldn't load learners" | "Try again" |
| `noPermission` | "You don't have access to payments" | none; say who to ask |

Centred in the region, `spacingVerticalXXXL` padding. No illustrations. Do not use for a single empty
field (show "—" or "Not set").

### Loading: Spinner and Skeleton (Fluent)

| Situation | Use |
|---|---|
| Initial load of a table or list | `DataTable loading` (skeleton rows matching the column layout) |
| Initial load of a detail page/panel | `Skeleton` + `SkeletonItem` shaped like the content (header line, description list rows) |
| Region refresh with existing data | Keep the data; show `Spinner size="tiny"` next to the region title |
| Button action in progress | Disable the button, swap its icon for `Spinner size="tiny"`, keep the label ("Saving…") |
| Whole-page blocking work (rare) | `Spinner size="medium" label="Loading schedule…"` centred |
| Long task with known progress | `ProgressBar` with value and label |

- Show loading UI only after ~300ms to avoid flicker. Never show a spinner and a skeleton together.
- Skeletons are `aria-hidden`; the region has `aria-busy="true"` and the Spinner has a label.

### Tooltip (Fluent)

```tsx
<Tooltip content="Export to CSV" relationship="label">
  <Button appearance="subtle" icon={<ArrowDownload20Regular />} aria-label="Export to CSV" />
</Tooltip>
```

- **Use** for icon-only buttons (`relationship="label"`), truncated text, and short explanations of a
  column or metric (`relationship="description"`).
- **Don't** put essential information or interactive content in tooltips (use `InfoLabel` or a
  `Popover`). Don't tooltip a control that already has a visible label saying the same thing.
- For field help, use `Field hint` or `InfoLabel`, not a tooltip.

### DescriptionList (composition)

Key-value display for record details in panels and detail pages. Semantic `<dl>`.

```ts
export interface DescriptionListProps {
  items: { label: string; value: React.ReactNode }[];   // empty value renders "—"
  columns?: 1 | 2 | 3;                                   // default 1 in panels, 2 on pages
  layout?: 'stacked' | 'inline';                         // stacked: label above value (default); inline: label left 160px
}
```

Labels are `caption1` in `colorNeutralForeground3`; values `body1` in `colorNeutralForeground1`.
Row gap `spacingVerticalM`. Use this rather than read-only form fields.

---

## 3. Forms and inputs

### Field (Fluent): wraps every input

Every input is wrapped in `Field`. It provides the label, required marker, hint and validation
message, and wires up `aria-*`.

```tsx
<Field label="Email" required hint="Used for lesson reminders"
       validationState={errors.email ? 'error' : 'none'} validationMessage={errors.email}>
  <Input type="email" value={email} onChange={(_, d) => setEmail(d.value)} />
</Field>
```

- Labels on top (`orientation="vertical"`, the default). `horizontal` only in narrow settings lists.
- Sentence-case labels without colons. Mark required fields with `required`. If most fields are
  optional, mark only the required ones; if most are required, label the optional ones "(optional)".
- Placeholders show format examples only ("e.g. AB12 CDE"), never instead of a label.

### Input: text fields (Fluent)

- Default `size="medium"`, `appearance="outline"`. Use `contentBefore` for units or currency
  (`£`) and `contentAfter` for inline actions (show password).
- Use the correct `type` and `autoComplete` (email, tel, postal-code, name).
- Use `Textarea` for multi-line notes (`resize="vertical"`, 3 rows).

### SpinButton: number fields (Fluent)

```tsx
<Field label="Lesson duration (minutes)"><SpinButton min={30} max={240} step={15} value={duration} onChange={onDuration} /></Field>
```

Use for bounded integers with a natural step (durations, lesson counts). For money use `Input` with
`contentBefore="£"` and `inputMode="decimal"`. Never use SpinButton for IDs or phone numbers.

### SearchBox (Fluent)

- In filter bars: width `--ng-layout-search-field-width`, placeholder "Search learners", filters as you
  type (debounced 250ms) and clears with Esc or the dismiss button.
- Global search in the header: placeholder "Search learners, instructors, bookings"; Enter opens results.
- Always give it an accessible name (`aria-label` when there is no visible label).

### Select, Dropdown, Combobox (Fluent)

| Need | Use |
|---|---|
| ≤ 7 options, simple form | `Select` (native, best on touch) or `RadioGroup` if options must be visible |
| Styled single/multi select, filters | `Dropdown` (`multiselect` for filters) |
| Many options or type to search (learner, instructor, vehicle pickers) | `Combobox` with filtering, or `TagPicker` for multiple people |

- Filter dropdowns show the current value in the trigger ("Instructor: All", "Status: 2 selected").
- Do not use a select for yes/no (use `Switch` or `Checkbox`).

### DateField (composition over `@fluentui/react-datepicker-compat` `DatePicker`)

Wraps `DatePicker` so every date input behaves the same.

```ts
export interface DateFieldProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;   // default "dd/mm/yyyy"
}
// Fixed internally: allowTextInput, formatDate = formatDate() (12 Nov 2026), parseDateFromString = parseDate() (dd/mm/yyyy),
// firstDayOfWeek = Monday, showWeekNumbers = false, highlightCurrentMonth, strings localised.
```

```tsx
<Field label="Test date" required><DateField value={testDate} onChange={setTestDate} minDate={today} /></Field>
```

Time: use a `Combobox` of 15-minute slots (07:00–21:00) beside the date. Do not add a time-picker library.

### Checkbox, RadioGroup, Switch (Fluent)

| Control | Use when | Don't |
|---|---|---|
| `Checkbox` | Independent options; consent; multi-select in lists; the change applies on Save | Don't use for an immediate on/off setting |
| `RadioGroup` | 2–5 mutually exclusive options that should all be visible (transmission: Manual / Automatic) | Don't use for more than 5 options (use Dropdown) |
| `Switch` | A setting that applies **immediately** (Send SMS reminders) | Don't use inside a form that has a Save button |

All three are labelled through their own `label` prop, and the group through `Field label`.

### FormSection, FormGrid, FormActions (compositions)

```ts
export interface FormSectionProps { title: string; description?: string; children: React.ReactNode } // fieldset + legend (subtitle2)
export interface FormGridProps { columns?: 1 | 2 | 3; children: React.ReactNode }                     // default 2
export interface FormGridItemProps { span?: 1 | 2 | 3 | 'full'; children: React.ReactNode }
export interface FormActionsProps { sticky?: boolean; children: React.ReactNode }                     // primary first
```

- `FormGrid`: CSS grid, `gap: spacingVerticalL spacingHorizontalXXL`, each column at least
  `--ng-layout-form-column-min-width`. It collapses to 1 column below `md`. Long fields (address,
  notes) use `span="full"`.
- `FormSection`s stack with `spacingVerticalXXL`. Group by meaning: Personal details, Contact, Licence,
  Lesson preferences.
- `FormActions` on a full-page form: at the bottom, **left-aligned**, primary first ("Save learner",
  then "Cancel"). With `sticky`, it is a footer bar (`colorNeutralBackground1`, top divider, `shadow2`
  only while content scrolls under it).
- In dialogs and panels, actions follow those containers' rules (right-aligned, primary first).

```tsx
<form onSubmit={submit} noValidate>
  <FormSection title="Personal details">
    <FormGrid>
      <Field label="First name" required><Input /></Field>
      <Field label="Last name" required><Input /></Field>
      <Field label="Date of birth" required><DateField value={dob} onChange={setDob} maxDate={today} /></Field>
      <Field label="Provisional licence number"><Input placeholder="e.g. SILVA902125AM9IJ" /></Field>
    </FormGrid>
  </FormSection>
  <FormActions sticky>
    <Button appearance="primary" type="submit">Save learner</Button>
    <Button onClick={cancel}>Cancel</Button>
  </FormActions>
</form>
```

### Validation

- Validate on blur for format, and on submit for everything. Don't show errors while the user is still
  typing in an untouched field.
- Error message under the field (`validationState="error"`), stating the fix: "Enter a date after
  today", not "Invalid date".
- On submit with errors, show a `MessageBar intent="error"` at the top of the form summarising the
  count ("2 fields need attention"), then move focus to the first invalid field.
- `validationState="warning"` for non-blocking issues ("This instructor already has a lesson at 10:00").
- `validationState="success"` is not used.
- Server errors that belong to a field are mapped to that field; others go in the form-level MessageBar.

---

## 4. Actions

### Button (Fluent)

| Appearance | Use | Limit |
|---|---|---|
| `primary` | The main action of the view: "Add learner", "Save", "Book lesson" | **One per view** (page, dialog or panel) |
| default (`secondary`) | Other actions: "Cancel", "Export", "Edit" | 2–3 visible; overflow the rest into a Menu |
| `subtle` | Toolbar/command bar actions, header icons, row actions, low emphasis | |
| `transparent` | Inline text-like actions inside content | Rare. Prefer `Link` |
| `outline` | Not used | |

- Size `medium` (32px). `small` (24px) only inside table rows and dense toolbars.
- Labels are specific verbs in sentence case. Icons (20px Regular) are optional and go before the label.
- Loading: disable the button, show `Spinner size="tiny"` as the icon, and change the label ("Saving…").
- Disabled buttons need a reason. Put it in nearby text or a `Tooltip` on a wrapping element. Prefer an
  enabled button that explains the problem on click.
- **Destructive** actions use the default appearance with a clear verb ("Delete invoice") and always
  open a `ConfirmDialog`. There is no red button.

### Icon button

`<Button appearance="subtle" icon={<Edit20Regular />} aria-label="Edit learner" />` wrapped in
`Tooltip relationship="label"`. Use only for universally understood actions (close, more, edit,
refresh, expand). Anything else gets a text label.

### SplitButton (Fluent)

```tsx
<Menu positioning="below-end">
  <MenuTrigger disableButtonEnhancement>
    {(triggerProps: MenuButtonProps) => (
      <SplitButton appearance="primary" menuButton={triggerProps} primaryActionButton={{ onClick: bookLesson }}>
        Book lesson
      </SplitButton>
    )}
  </MenuTrigger>
  <MenuPopover><MenuList>
    <MenuItem>Book block of lessons</MenuItem>
    <MenuItem>Book driving test</MenuItem>
  </MenuList></MenuPopover>
</Menu>
```

Use when there is one dominant action with closely related variants. Don't use when the variants are
equally common (use a `MenuButton`) or unrelated.

### Menu (Fluent): dropdown and overflow menus

- `MenuButton` for a labelled group ("Export ▾"). Overflow: subtle icon button with `MoreHorizontal`,
  `aria-label="More actions"`.
- Items: sentence case, optional 20px icon, `MenuDivider` between groups. Destructive items go last,
  after a divider, and still confirm.
- Max ~8 items. Use `MenuGroupHeader` for grouping. No nested submenus deeper than one level.

### CommandBar (composition over Fluent `Toolbar`)

The Dynamics/Azure-style action bar above a table or detail view.

```ts
export interface CommandBarProps {
  ariaLabel: string;
  children: React.ReactNode;     // ToolbarButton (appearance="subtle", icon + label), ToolbarDivider, Menu
  farItems?: React.ReactNode;    // right side: view options, refresh, density
  selectionCount?: number;       // when > 0 shows "3 selected" and a Clear selection button, swapping in bulk actions
}
```

- Fluent `Toolbar size="medium"`, sits at the top of the table's Section with a bottom
  `colorNeutralStroke2` border. No background of its own.
- Buttons are `subtle` with icon and label ("Add", "Export", "Refresh"). Overflow with `Overflow` /
  `useOverflowMenu` when narrow.
- Arrow keys move between items (Fluent default). One Tab stop.

**Don't** duplicate the page's primary action in the command bar. Don't use it for filters (use FilterBar).

---

## 5. Feedback and overlays

### Choosing feedback

| Need | Component |
|---|---|
| Result of an action the user just took ("Lesson booked") | Toast via `useNotify` |
| Persistent state of a page or region ("This learner has an overdue balance") | `MessageBar` at the top of the region |
| Problem with one field | `Field validationMessage` |
| Decision that blocks progress, or confirming a destructive/irreversible action | `Dialog` / `ConfirmDialog` |
| View or edit a record without leaving the list | `DetailPanel` |
| Long task progress | `ProgressBar` |

### Dialog (Fluent)

```tsx
<Dialog open={open} onOpenChange={(_, d) => setOpen(d.open)}>
  <DialogSurface className={styles.medium /* width: var(--ng-layout-dialog-width-medium) */}>
    <form onSubmit={submit}>
      <DialogBody>
        <DialogTitle>Record payment</DialogTitle>
        <DialogContent>…fields…</DialogContent>
        <DialogActions>
          <Button appearance="primary" type="submit">Record payment</Button>
          <DialogTrigger disableButtonEnhancement><Button>Cancel</Button></DialogTrigger>
        </DialogActions>
      </DialogBody>
    </form>
  </DialogSurface>
</Dialog>
```

- **Use** for short, focused tasks (up to ~6 fields): record payment, reschedule lesson, assign instructor.
- **Don't** use for long forms (use a page), for viewing records (use DetailPanel), or open a dialog
  from a dialog.
- Widths: small 440 (confirmations), medium 600 (default), large 880 (rare).
- Actions are right-aligned, **primary first**, then Cancel (Fluent convention). The primary label
  repeats the title's verb.
- `modalType="modal"` by default; `"alert"` for confirmations, where clicking the backdrop does not close.
  Esc closes and focus returns to the trigger (Fluent handles this).
- Initial focus goes to the first field, or to the least destructive button in confirmations.

### ConfirmDialog (composition)

```ts
export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;                      // "Cancel this lesson?"
  message: React.ReactNode;           // names the object and consequence
  confirmLabel: string;               // "Cancel lesson" (a verb, never "OK"/"Yes")
  cancelLabel?: string;               // default "Keep lesson" / "Cancel"
  destructive?: boolean;              // alert modal type, default focus on cancel
  onConfirm: () => void | Promise<void>; // async: shows a spinner on the confirm button, closes on success, shows error inline on failure
  requireReason?: { label: string };  // optional Textarea, e.g. cancellation reason
}
```

Use for every delete, cancel, void, refund and bulk change. Don't confirm reversible, low-risk actions.
Prefer undo in a toast for those.

### Notifications: `useNotify` (composition over Fluent Toast)

```ts
const notify = useNotify();
notify.success('Lesson booked', 'Amaya Silva · Tue 12 Nov, 10:00 with R. Fernando');
notify.error('Payment not recorded', 'The card was declined. Try another payment method.');
notify.warning(title, body?); notify.info(title, body?);
notify.success('Learner archived', undefined, { action: { label: 'Undo', onClick: restore } });
```

- One `Toaster` at the app root (`bottom-end`). Toasts use Fluent `Toast`, `ToastTitle` (with the
  intent icon), `ToastBody` and `ToastFooter` for one action.
- Timeouts: success/info 5s, warning 8s, error persists until dismissed.
- Toasts confirm; they never carry the only copy of important information or ask for decisions.
- Max one toast per action. For bulk results use one summarising toast ("12 reminders sent").

### MessageBar: alerts and inline messages (Fluent)

```tsx
<MessageBar intent="warning">
  <MessageBarBody>
    <MessageBarTitle>Outstanding balance</MessageBarTitle>
    Amaya has £120.00 overdue since 28 Oct.
  </MessageBarBody>
  <MessageBarActions><Button size="small">Record payment</Button></MessageBarActions>
</MessageBar>
```

- Intents: `info`, `success`, `warning`, `error`. Place at the top of the page content (page-level) or
  the top of a Section/panel (region-level).
- Use `layout="multiline"` for longer text. Dismissible only if the condition is not ongoing.
- Max one page-level MessageBar at a time. Don't stack several; summarise them instead.

### Progress (Fluent)

- `ProgressBar` with a known `value` for imports/exports and bulk operations, with a label
  ("Importing learners · 120 of 300"). Without a value it is indeterminate; use that sparingly.
- `ProgressBar` with `color="success"`/`"warning"` and `thickness="large"` is allowed for **learner
  progress** (e.g. syllabus 14 of 20 skills), with the numeric value always shown next to it.
- `Spinner` for short unknown waits (see Loading).

---

## 6. Business components

### MetricCard and MetricGrid (compositions)

```ts
export interface MetricCardProps {
  label: string;                         // "Lessons today" (caption1Strong, colorNeutralForeground3)
  value: string;                         // preformatted "38", "£4,820.00" (title2, tabular-nums)
  icon?: FluentIcon;                     // 20px, colorNeutralForeground3. Optional
  change?: { value: string; direction: 'up' | 'down' | 'flat'; sentiment: 'positive' | 'negative' | 'neutral'; period: string };
                                         // "↑ 12% vs last week": caption1, colour by sentiment (status foreground tokens)
  helper?: string;                       // "6 unassigned"
  href?: string;                         // whole card becomes a link to the filtered list
}
export interface MetricGridProps { children: React.ReactNode }  // auto-fill, minmax(var(--ng-layout-metric-card-min-width), 1fr), gap 16px
```

- Surface style (white, 1px divider, 4px radius, 16px padding). No shadow, no coloured backgrounds,
  no big icons in circles.
- 3–5 metrics per row; each must be actionable or decision-relevant ("Overdue payments £1,240 → View").
- Sentiment colour applies only to the change text, never to the whole card. Include the arrow and words
  so colour is not the only signal.

**Don't:** show vanity metrics, add sparklines without axes, or use a MetricCard as a navigation tile.

### DetailPanel (composition over Fluent `OverlayDrawer` / `InlineDrawer`)

```ts
export interface DetailPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;                          // subtitle1, the record name
  subtitle?: React.ReactNode;             // ID, status badge
  size?: 'default' | 'wide';              // 480 / 720px
  mode?: 'overlay' | 'inline';            // overlay (default) on list pages; inline beside content on wide screens
  headerActions?: React.ReactNode;        // e.g. "Open full record" subtle icon button (before close)
  footer?: React.ReactNode;               // actions: right-aligned, primary first
  loading?: boolean;                      // skeleton body
  children: React.ReactNode;
}
```

- Opens from the end (right). `DrawerHeader` has the title and a `Dismiss` close button
  (`aria-label="Close"`). The body scrolls; the header and footer stay fixed.
- The list row stays highlighted (`activeRowId`). Arrow keys in the list can move to the next record
  while the panel is open (optional).
- Content: `DescriptionList`, short `Section`s without surfaces (the panel is the surface), and a
  compact `ActivityTimeline`.

**Use** for quick look-up and light edits from a list. **Don't** use for multi-step workflows or long
forms (use a page), or stack panels on panels.

### ProfileHeader (composition)

The top of a learner, instructor or vehicle detail page, used inside or right below `PageHeader`.

```ts
export interface ProfileHeaderProps {
  name: string;
  avatar?: { imageUrl?: string; icon?: FluentIcon };   // Avatar size 56; vehicles use the VehicleCar icon
  status?: React.ReactNode;                           // StatusBadge
  identifiers: string[];                              // ["L-10234", "Category B · Manual"], caption-separated by " · "
  details: { icon: FluentIcon; label: string; value: React.ReactNode }[]; // phone, email, instructor, next lesson (max 4)
  actions?: React.ReactNode;                          // follows PageHeader action rules
}
```

Not a card or banner, with no cover image. Details are `body1` with 16px icons in
`colorNeutralForeground3`, wrapping into rows.

### ActivityTimeline (composition)

A chronological list of events: lesson completed, payment recorded, test booked, note added.

```ts
export interface ActivityItem {
  id: string;
  icon: FluentIcon;               // 16px in a 24px circle on colorNeutralBackground3
  title: React.ReactNode;         // "Payment recorded · £60.00"
  description?: React.ReactNode;  // caption1, colorNeutralForeground3
  timestamp: Date;                // formatDateTime, in a <time dateTime>
  actor?: string;                 // "by Dilani (Reception)"
  tone?: 'neutral' | 'success' | 'warning' | 'danger'; // only tints the icon circle
}
export interface ActivityTimelineProps { items: ActivityItem[]; maxItems?: number; onShowAll?: () => void }
```

Semantic `<ol>`, newest first, with a 1px `colorNeutralStroke2` connecting line. Group by day ("Today",
"Yesterday", "05 Nov 2026") when there are more than 10 items. Do not use it for notifications
or chat.

### FilterBar (composition)

The single, consistent way to filter a list.

```ts
export interface FilterBarProps {
  search?: { value: string; onChange: (v: string) => void; placeholder: string };
  children?: React.ReactNode;                     // filter Dropdowns/Comboboxes/DateFields, each width var(--ng-layout-filter-field-width), size medium
  activeFilters?: { key: string; label: string }[]; // "Instructor: R. Fernando"
  onRemoveFilter?: (key: string) => void;
  onClearAll?: () => void;
  resultCount?: number;                           // "48 learners", caption1, announced via aria-live="polite"
  endContent?: React.ReactNode;                   // saved views, column chooser
}
```

```
[🔍 Search learners      ] [Status: Active ▾] [Instructor: All ▾] [Transmission ▾] [More filters]
Status: Active ✕   Instructor: R. Fernando ✕   Clear all                              48 learners
```

- Sits between the PageHeader and the table Section, on the canvas (or at the top of the Section).
  Gap `spacingHorizontalM`. Wraps on narrow screens; below `sm`, filters collapse into a "Filters (2)"
  button opening an `OverlayDrawer`.
- 3–4 visible filters at most; more go behind "More filters" (drawer).
- Filters apply immediately, with no "Apply" button, except in the mobile drawer.
- Active filters show as dismissible Fluent `Tag`s (`TagGroup` with `onDismiss`), each with
  `aria-label="Remove filter Instructor: R. Fernando"`.
- Persist filters in the URL query string so views can be shared and survive reloads.

**Don't:** use a filter bar for fewer than ~20 records; put actions in it; hide search behind an icon on
desktop.
