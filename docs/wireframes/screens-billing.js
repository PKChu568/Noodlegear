/* Screens: invoices, payments, packages, reports, settings */
(function () {
  'use strict';
  const { NG } = window; const D = NG.data; const f = NG.fmt;
  const LIST_STATES = [['default', 'With data'], ['loading', 'Loading'], ['empty', 'Empty (first use)'], ['noResults', 'No results'], ['error', 'Error']];

  /* ---------------- SCR-70 Invoices ---------------- */
  NG.screen({
    id: 'SCR-70', name: 'Invoices', group: 'Billing', nav: 'invoices', roles: ['owner', 'admin', 'receptionist'], states: LIST_STATES,
    notes: { purpose: 'All invoices with what is owed and what is overdue.', stories: ['US-BIL-01', 'US-BIL-02', 'US-BIL-07'], points: ['Overdue is derived from the due date, never stored stale.', 'Days overdue shown so admins can prioritise chasing.', 'Pay-as-you-go invoices are created automatically from completed lessons (A-05).'] },
    render(ctx) {
      const cols = [{ h: NG.selCell('all invoices'), cls: 'sel' }, { h: 'Invoice', sort: 'desc' }, { h: 'Learner' }, { h: 'Issued', hide: 'md' }, { h: 'Due', hide: 'sm' }, { h: 'Total', end: true }, { h: 'Outstanding', end: true, hide: 'sm' }, { h: 'Status' }, { h: '<span class="sr-only">Actions</span>', cls: 'rowact' }];
      const cmd = NG.commandBar(NG.btn('Send reminders', { kind: 'subtle', icon: 'mail' }) + NG.btn('Export', { kind: 'subtle', icon: 'arrow_download' }));
      const st = NG.listState(ctx, { cols, commandBar: cmd, emptyTitle: 'No invoices yet', emptyDesc: 'Invoices are created when pay-as-you-go lessons are completed, or you can create one now.', emptyAction: NG.btn('New invoice', { kind: 'primary', icon: 'add' }), noResultsTitle: 'No invoices match your filters', errorTitle: "Couldn't load invoices" });
      const rows = D.invoices.map((i) => { const out = i.status === 'void' ? 0 : i.total - i.paid; const od = i.status === 'overdue' ? -D.daysUntil(i.due) : 0; return [NG.selCell(i.no), `<a class="cell-link mono" href="#/SCR-71">${i.no}</a>`, i.learner, f.date(i.issued), f.date(i.due) + (od ? `<br><span class="caption delta-negative">${od} days overdue</span>` : ''), f.gbp(i.total), out ? f.gbp(out) : NG.empty, NG.badge('invoice', i.status), NG.rowMenu(i.no)]; });
      return `${NG.pageHeader({ title: 'Invoices', desc: `${f.gbp(538)} outstanding · ${f.gbp(330)} overdue`, actions: NG.btn('Record payment', { icon: 'payment', attrs: { 'data-go': 'SCR-73' } }) + NG.btn('New invoice', { kind: 'primary', icon: 'add', attrs: { 'data-go': 'SCR-71' } }) })}
        <div class="metrics">${NG.metric('receipt', 'Outstanding', f.gbp(538), '5 invoices')}${NG.metric('warning', 'Overdue', f.gbp(330), '<span class="delta-negative">2 invoices · oldest 26 days</span>')}${NG.metric('money', 'Paid this month', f.gbp(445), '2 invoices')}</div>
        ${NG.filterBar({ search: 'Search invoice number or learner', filters: [['Status', ['Status: All', 'Status: Issued', 'Status: Overdue', 'Status: Paid', 'Status: Draft', 'Status: Void']], ['Issued', ['Issued: Last 90 days', 'This month', 'Last month', 'This year']]], count: ctx.state === 'noResults' ? '0 invoices' : '10 invoices', tags: ctx.state === 'noResults' ? ['Status: Draft'] : [] })}
        <section class="surface" aria-label="Invoices">${st || cmd + NG.table({ caption: 'Invoices', cols, rows }) + NG.pagination('Showing 1–10 of 151', 'Page 1 of 7')}</section>`;
    },
  });

  /* ---------------- SCR-71 Invoice detail ---------------- */
  NG.screen({
    id: 'SCR-71', name: 'Invoice detail', group: 'Billing', nav: 'invoices', roles: ['owner', 'admin', 'receptionist'],
    notes: { purpose: 'One invoice as the learner sees it, with payments allocated to it. Example: INV-2026-0146 (overdue).', stories: ['US-BIL-02', 'US-BIL-05', 'US-BIL-06'], points: ['Issued invoices are immutable (BR-30): correct by voiding or a credit note (Admin).', 'Email and PDF use the school profile from Settings.', 'VAT handling depends on Q-07.'] },
    render(ctx) {
      const i = D.invoices.find((x) => x.no === 'INV-2026-0146'); const admin = ctx.role !== 'receptionist';
      return `${NG.pageHeader({ crumbs: [['Invoices', 'SCR-70'], [i.no]], title: i.no, meta: NG.badge('invoice', i.status), desc: `Amaya Silva · issued ${f.date(i.issued)} · due ${f.date(i.due)}`,
        actions: NG.btn('Download PDF', { icon: 'arrow_download' }) + NG.btn('Email', { icon: 'mail' }) + (admin ? `<span style="position:relative">${NG.btn('More actions', { iconOnly: true, icon: 'more_horizontal', attrs: { 'data-menu': 'invMenu', 'aria-haspopup': 'menu' } })}<div class="menu" role="menu" id="invMenu" hidden style="position:absolute;right:0;top:36px;z-index:10"><div role="menuitem" class="menu-item">${NG.icon('receipt')}Issue credit note…</div><div class="menu-divider"></div><div role="menuitem" class="menu-item">${NG.icon('dismiss')}Void invoice…</div></div></span>` : '') + NG.btn('Record payment', { kind: 'primary', icon: 'payment', attrs: { 'data-go': 'SCR-73' } }) })}
        ${NG.msg('error', '13 days overdue.', ` Reminder emailed on 04 Nov 2026.`, NG.btn('Send reminder', { small: true }))}
        <div class="two-col"><section class="surface pad stack" aria-label="Invoice">
          <div class="doc-head"><div>${NG.dlist([['Bill to', 'Amaya Silva<br>14 Elm Grove, Northside, NS4 7QT'], ['Learner ID', '<span class="mono">L-10234</span>']], true)}</div>
          <div>${NG.dlist([['From', 'Northside Driving School<br>2 Market Street, Northside, NS1 1AA'], ['Payment terms', '14 days']], true)}</div></div>
          ${NG.table({ caption: 'Invoice lines', cols: [{ h: 'Description' }, { h: 'Qty', end: true }, { h: 'Unit price', end: true }, { h: 'Amount', end: true }], rows: i.lines.map(([d, q, p]) => [d, q, f.gbp(p), f.gbp(q * p)]) })}
          <div class="totals surface"><span>Subtotal</span><span class="num">${f.gbp(120)}</span><span class="muted">VAT</span><span class="num muted">Not VAT registered</span><span class="grand">Total</span><span class="grand num">${f.gbp(120)}</span><span>Paid</span><span class="num">${f.gbp(0)}</span><span class="strong">Outstanding</span><span class="strong num">${f.gbp(120)}</span></div>
        </section><div class="col">
          ${NG.section({ title: 'Payments', body: '<p class="muted">No payments allocated yet. A card payment of £60.00 on 07 Nov is held as learner credit.</p>' + NG.btn('Allocate credit', { small: true }) })}
          ${NG.section({ title: 'History', body: NG.timeline([{ icon: 'mail', title: 'Reminder emailed', meta: 'Automatic · 04 Nov 2026, 09:00' }, { icon: 'warning', tone: 'danger', title: 'Became overdue', meta: '29 Oct 2026' }, { icon: 'mail', title: 'Invoice emailed', meta: 'Priya Shah · 14 Oct 2026, 16:02' }, { icon: 'receipt', title: 'Issued', meta: 'Priya Shah · 14 Oct 2026, 16:01' }]) })}
        </div></div>`;
    },
  });

  /* ---------------- SCR-72 Payments ---------------- */
  NG.screen({
    id: 'SCR-72', name: 'Payments', group: 'Billing', nav: 'payments', roles: ['owner', 'admin', 'receptionist'], states: LIST_STATES,
    notes: { purpose: 'Money received, how it was paid and which invoices it settled.', stories: ['US-BIL-03', 'US-BIL-08'], points: ['Payments are recorded, not taken (A-04).', 'Refund and void are Admin-only and need a reason.', 'Unallocated money is shown as learner credit.'] },
    render(ctx) {
      const cols = [{ h: 'Reference' }, { h: 'Date', sort: 'desc' }, { h: 'Learner' }, { h: 'Method', hide: 'sm' }, { h: 'Allocated to', hide: 'md' }, { h: 'Amount', end: true }, { h: 'Status' }, { h: 'Recorded by', hide: 'md' }, { h: '<span class="sr-only">Actions</span>', cls: 'rowact' }];
      const cmd = NG.commandBar(NG.btn('Export', { kind: 'subtle', icon: 'arrow_download' }));
      const st = NG.listState(ctx, { cols, commandBar: cmd, emptyTitle: 'No payments recorded', emptyDesc: 'Record a payment when a learner pays by card, cash or bank transfer.', emptyAction: NG.btn('Record payment', { kind: 'primary', icon: 'payment', attrs: { 'data-go': 'SCR-73' } }), errorTitle: "Couldn't load payments" });
      const rows = D.payments.map((p) => [`<span class="mono">${p.ref}</span>`, f.date(p.at), `<a class="cell-link" href="#/SCR-11">${p.learner}</a>`, p.method, p.alloc.startsWith('INV') ? `<a class="mono" href="#/SCR-71">${p.alloc}</a>` : p.alloc, (p.status === 'refunded' ? '-' : '') + f.gbp(p.amount), NG.badge('payment', p.status), p.by, NG.rowMenu(p.ref)]);
      return `${NG.pageHeader({ title: 'Payments', desc: `${f.gbp(1712)} received in the last 90 days`, actions: NG.btn('Record payment', { kind: 'primary', icon: 'payment', attrs: { 'data-go': 'SCR-73' } }) })}
        ${NG.filterBar({ search: 'Search reference or learner', filters: [['Method', ['Method: All', 'Card', 'Cash', 'Bank transfer']], ['Date', ['Last 90 days', 'This month', 'Last month']]], count: ctx.state === 'noResults' ? '0 payments' : '7 payments', tags: ctx.state === 'noResults' ? ['Method: Cash', 'This month'] : [] })}
        <section class="surface" aria-label="Payments">${st || cmd + NG.table({ caption: 'Payments', cols, rows })}</section>`;
    },
  });

  /* ---------------- SCR-73 Record payment (dialog) ---------------- */
  NG.screen({
    id: 'SCR-73', name: 'Record payment', group: 'Billing', nav: 'payments', parent: 'SCR-72', roles: ['owner', 'admin', 'receptionist'],
    notes: { purpose: 'Record money received and allocate it to invoices, oldest first.', stories: ['US-BIL-03'], points: ['Allocation defaults to the oldest unpaid invoice (BR-31); staff can change it.', 'Any unallocated amount becomes learner credit.', 'Receipt email is offered on save.'] },
    dialog() {
      return { size: 'medium', html: `<div class="dlg-title">Record payment${NG.btn('Close', { kind: 'subtle', iconOnly: true, icon: 'dismiss', attrs: { 'data-close': '' } })}</div>
        <div class="dlg-content"><div class="form-grid">
          ${NG.field('Learner', `<div class="input">${NG.icon('search', 'ic16 affix')}<input id="%ID%" value="Amaya Silva · L-10234 · owes £120.00" role="combobox"></div>`, { req: true, full: true })}
          ${NG.field('Amount', NG.text('150.00', { before: '£', num: true }), { req: true })}${NG.field('Payment date', NG.date('Tue 10 Nov 2026'), { req: true })}
          ${NG.field('Method', NG.select(['Card', 'Cash', 'Bank transfer', 'Other'], 'Card'), { req: true })}${NG.field('Reference', NG.text('', { ph: 'Optional, e.g. last 4 digits' }))}
        </div>
        <fieldset><legend>Allocate to invoices</legend>${NG.table({ size: 'extra-small', caption: 'Allocation', cols: [{ h: '' }, { h: 'Invoice' }, { h: 'Due' }, { h: 'Outstanding', end: true }, { h: 'Allocate', end: true }], rows: [[NG.check('', true), '<span class="mono">INV-2026-0146</span>', '28 Oct 2026', f.gbp(120), f.gbp(120)]] })}
          <div class="row between" style="margin-top:8px"><span class="caption muted">Remaining ${f.gbp(30)} will be kept as learner credit.</span><span class="strong num">Allocated ${f.gbp(120)} of ${f.gbp(150)}</span></div></fieldset>
        ${NG.check('Email a receipt to amaya.silva@example.com', true)}</div>
        <div class="dlg-actions">${NG.btn('Record payment', { kind: 'primary', attrs: { 'data-close': '', 'data-toast': 'success|Payment recorded|£150.00 · Amaya Silva · INV-2026-0146 paid' } })}${NG.btn('Cancel', { attrs: { 'data-close': '' } })}</div>` };
    },
  });

  /* ---------------- SCR-74 Sell package (dialog) ---------------- */
  NG.screen({
    id: 'SCR-74', name: 'Sell package', group: 'Billing', nav: 'learners', parent: 'SCR-11', roles: ['owner', 'admin', 'receptionist'],
    notes: { purpose: 'Sell a block of prepaid lessons; credit is consumed as lessons are completed.', stories: ['US-BIL-04'], points: ['Credit is used on completion, not on booking (BR-32).', 'Expiry and part-refund rules depend on Q-05 and Q-06.', 'Creates an invoice; payment can be recorded straight away.'] },
    dialog() {
      return { size: 'medium', html: `<div class="dlg-title">Sell package${NG.btn('Close', { kind: 'subtle', iconOnly: true, icon: 'dismiss', attrs: { 'data-close': '' } })}</div>
        <div class="dlg-content"><p>Learner: <b>Amaya Silva</b> · <span class="mono">L-10234</span></p>
        <fieldset><legend>Package</legend><div class="choice-group">${D.packages.map((p, i) => `<label class="choice" style="justify-content:space-between;border:1px solid var(--colorNeutralStroke2);border-radius:4px;padding:8px 12px;margin-bottom:8px"><span class="row"><input type="radio" name="pkg" ${i === 1 ? 'checked' : ''}><span><b>${p[0]}</b><br><span class="caption muted">${p[1]} × 60 min lessons · valid ${p[3]}</span></span></span><span class="num strong">${f.gbp(p[2])}</span></label>`).join('')}</div></fieldset>
        <div class="form-grid">${NG.field('Start date', NG.date('Tue 10 Nov 2026'))}${NG.field('Discount', NG.text('0.00', { before: '£', num: true }), { optional: true })}</div>
        ${NG.msg('info', '', `Creates invoice for ${f.gbp(350)}. Learner credit becomes 10 lessons.`)}
        ${NG.check('Record payment now', true)}</div>
        <div class="dlg-actions">${NG.btn('Sell package', { kind: 'primary', attrs: { 'data-close': '', 'data-toast': 'success|Package sold|10 lessons · Amaya Silva · invoice INV-2026-0152' } })}${NG.btn('Cancel', { attrs: { 'data-close': '' } })}</div>` };
    },
  });

  /* ---------------- SCR-80 Reports ---------------- */
  NG.screen({
    id: 'SCR-80', name: 'Reports', group: 'Reports & settings', nav: 'reports', roles: ['owner', 'admin'],
    notes: { purpose: 'A short, curated list of reports. Each answers one business question.', stories: ['US-RPT-02', 'US-RPT-03', 'US-RPT-04', 'US-RPT-05'], points: ['Every report exports to CSV.', 'No dashboard of decorative charts (design-principles §9).'] },
    render() {
      const reps = [['data_bar_horizontal', 'Lessons and revenue', 'How many lessons did we deliver and what did we earn, week by week?', 'SCR-81'], ['person_star', 'Instructor utilisation', 'How much of each instructor\'s available time is booked?'], ['receipt', 'Aged debtors', 'Who owes money, and for how long?'], ['clipboard_task', 'Driving test results', 'What are our pass rates by instructor and test centre?'], ['people_community', 'Learner pipeline', 'How many enquiries become active learners, and how long until they pass?'], ['vehicle_car', 'Vehicle usage and compliance', 'How much is each car used, and what is due?']];
      return `${NG.pageHeader({ title: 'Reports', desc: 'Choose a report. All reports export to CSV.' })}
        <div class="catalogue">${reps.map(([ic, t, q, go]) => `<a class="surface cat-card" ${go ? `href="#/${go}"` : 'href="#/SCR-80"'}><span class="row">${NG.icon(ic)}<span class="strong">${t}</span></span><span class="caption muted">${q}</span>${go ? '' : '<span class="caption muted">Wireframe not drawn: same layout as Lessons and revenue.</span>'}</a>`).join('')}</div>`;
    },
  });

  /* ---------------- SCR-81 Lessons & revenue report ---------------- */
  NG.screen({
    id: 'SCR-81', name: 'Lessons & revenue report', group: 'Reports & settings', nav: 'reports', roles: ['owner', 'admin'],
    notes: { purpose: 'Answers: how many lessons did we deliver and what did we earn, week by week?', stories: ['US-RPT-01', 'US-RPT-05'], points: ['One chart with labelled axes, brand colour only; the table below is the accessible alternative.', 'The current (partial) week is shown with a dashed outline and labelled.'] },
    render() {
      const max = 200;
      return `${NG.pageHeader({ crumbs: [['Reports', 'SCR-80'], ['Lessons and revenue']], title: 'Lessons and revenue', desc: 'Completed lessons and invoiced revenue per week', actions: NG.btn('Export CSV', { kind: 'primary', icon: 'arrow_download' }) })}
        ${NG.filterBar({ filters: [['Period', ['Last 9 weeks', 'Last 12 weeks', 'This year']], ['Instructor', ['Instructor: All', ...D.instructors.map((i) => 'Instructor: ' + i.name)]]] })}
        <div class="metrics">${NG.metric('calendar_ltr', 'Lessons (8 full weeks)', '1,406', 'Average 176 per week')}${NG.metric('money', 'Revenue (8 full weeks)', f.gbp(53428), 'Average ' + f.gbp(6679) + ' per week')}${NG.metric('arrow_trending', 'Last full week', '186 lessons', '<span class="delta-positive">↑ 25% vs previous week</span>')}</div>
        ${NG.section({ title: 'Completed lessons per week', body: `<div class="chart" role="img" aria-label="Bar chart of completed lessons per week; values in the table below">
          <div class="chart-y"><span>200</span><span>150</span><span>100</span><span>50</span><span>0</span></div>
          <div class="chart-plot">${D.weekly.map((w, i) => `<div class="chart-bar ${i === D.weekly.length - 1 ? 'current' : ''}" style="height:${(w[1] / max) * 100}%" title="${w[0]}: ${w[1]} lessons"></div>`).join('')}</div>
          <div class="chart-x">${D.weekly.map((w, i) => `<span>${w[0]}${i === D.weekly.length - 1 ? '*' : ''}</span>`).join('')}</div></div><span class="caption muted">* Week in progress (to Tue 10 Nov).</span>` })}
        ${NG.section({ title: 'By week', flush: true, body: NG.table({ caption: 'Lessons and revenue by week', cols: [{ h: 'Week starting' }, { h: 'Lessons', end: true }, { h: 'Revenue', end: true }, { h: 'No-shows', end: true, hide: 'sm' }, { h: 'Cancelled', end: true, hide: 'sm' }], rows: D.weekly.slice().reverse().map((w, i) => [w[0] + ' 2026' + (i === 0 ? ' <span class="caption muted">(in progress)</span>' : ''), w[1], f.gbp(w[2]), [1, 4, 2, 5, 3, 2, 6, 3, 2][i], [3, 9, 11, 8, 12, 7, 10, 9, 6][i]]) }) })}`;
    },
  });

  /* ---------------- SCR-90 Settings ---------------- */
  NG.screen({
    id: 'SCR-90', name: 'Settings', group: 'Reports & settings', nav: 'settings', roles: ['owner', 'admin'],
    tabs: [['profile', 'School profile'], ['types', 'Lesson types & prices'], ['packages', 'Packages'], ['hours', 'Opening hours'], ['policies', 'Cancellations & reminders'], ['users', 'Users & roles']],
    notes: { purpose: 'School-wide configuration. Admin cannot edit the Owner account.', stories: ['US-SET-01', 'US-SET-02', 'US-SET-03', 'US-SET-04', 'US-SET-05', 'US-SET-06', 'US-AUTH-04'], points: ['Settings use a vertical tab list (patterns §3.5).', 'Forms save with a button; switches that apply immediately are labelled so.', 'Price changes apply to new bookings only.'] },
    render(ctx) {
      const tab = ctx.tab || 'users';
      const side = `<div class="tabs side-tabs" role="tablist" aria-orientation="vertical" id="pageTabs">${this.tabs.map(([k, l]) => `<button class="tab" role="tab" data-tab="${k}" aria-selected="${k === tab}" tabindex="${k === tab ? 0 : -1}">${l}</button>`).join('')}</div>`;
      let body;
      if (tab === 'profile') body = NG.section({ title: 'School profile', body: `<div class="form-grid">${NG.field('School name', NG.text('Northside Driving School'), { req: true })}${NG.field('Phone', NG.text('01632 960 123'))}${NG.field('Email', NG.text('office@northside-driving.example'))}${NG.field('Website', NG.text('northside-driving.example'))}${NG.field('Address', NG.text('2 Market Street, Northside, NS1 1AA'), { full: true })}${NG.field('Invoice footer', NG.textarea('Bank: Example Bank · Sort code 00-00-00 · Account 00000000'), { full: true })}</div><div class="form-actions">${NG.btn('Save changes', { kind: 'primary' })}${NG.btn('Cancel')}</div>` });
      else if (tab === 'types') body = NG.section({ title: 'Lesson types & prices', flush: true, actions: NG.btn('Add lesson type', { kind: 'subtle', small: true, icon: 'add' }), body: NG.table({ caption: 'Lesson types', cols: [{ h: 'Name' }, { h: 'Duration', end: true }, { h: 'Price', end: true }, { h: 'Active' }, { h: '<span class="sr-only">Actions</span>', cls: 'rowact' }], rows: D.lessonTypes.map(([n, m, p]) => [n, f.mins(m), f.gbp(p), NG.badge('instructor', 'available', true).replace('Available', 'Active'), NG.rowMenu(n)]) }) + '<div class="pagination"><span>Price changes apply to new bookings only.</span></div>' });
      else if (tab === 'packages') body = NG.section({ title: 'Packages', flush: true, actions: NG.btn('Add package', { kind: 'subtle', small: true, icon: 'add' }), body: NG.table({ caption: 'Packages', cols: [{ h: 'Name' }, { h: 'Lessons', end: true }, { h: 'Price', end: true }, { h: 'Per lesson', end: true }, { h: 'Valid for' }, { h: '<span class="sr-only">Actions</span>', cls: 'rowact' }], rows: D.packages.map(([n, c, p, v]) => [n, c, f.gbp(p), f.gbp(p / c), v, NG.rowMenu(n)]) }) });
      else if (tab === 'hours') body = NG.section({ title: 'Opening hours', flush: true, body: NG.table({ caption: 'Opening hours', cols: [{ h: 'Day' }, { h: 'Open' }, { h: 'Hours' }], rows: [['Monday', NG.check('', true, { switch: true }), '07:30–20:00'], ['Tuesday', NG.check('', true, { switch: true }), '07:30–20:00'], ['Wednesday', NG.check('', true, { switch: true }), '07:30–20:00'], ['Thursday', NG.check('', true, { switch: true }), '07:30–20:00'], ['Friday', NG.check('', true, { switch: true }), '07:30–20:00'], ['Saturday', NG.check('', true, { switch: true }), '08:00–16:00'], ['Sunday', NG.check('', false, { switch: true }), '<span class="muted">Closed</span>']] }) + `<div class="pad stack">${NG.field('Closed days', NG.text('25 Dec, 26 Dec, 01 Jan', { after: 'calendar_ltr' }))}<div class="row">${NG.btn('Save changes', { kind: 'primary' })}</div></div>` });
      else if (tab === 'policies') body = NG.section({ title: 'Cancellations & reminders', body: `<div class="form-grid">${NG.field('Late cancellation notice', NG.select(['24 hours', '48 hours', '72 hours'], '48 hours'), { hint: 'Pending decision Q-03' })}${NG.field('Late cancellation fee', NG.select(['Full lesson price', '50% of lesson price', 'No fee'], 'Full lesson price'))}${NG.field('No-show charge', NG.select(['Full lesson price', '50% of lesson price', 'No charge'], 'Full lesson price'), { hint: 'Pending decision Q-04' })}${NG.field('Lesson reminder', NG.select(['24 hours before', '48 hours before', 'Off'], '24 hours before'))}${NG.field('Overdue payment reminder', NG.select(['3 days after due date', '7 days after due date', 'Off'], '7 days after due date'), { hint: 'Pending decision Q-12' })}</div><div class="form-actions">${NG.btn('Save changes', { kind: 'primary' })}${NG.btn('Cancel')}</div>` });
      else body = NG.section({ title: 'Users & roles', flush: true, actions: NG.btn('Invite user', { kind: 'subtle', small: true, icon: 'person_add' }), body: NG.table({ caption: 'Users', cols: [{ h: 'Name' }, { h: 'Email', hide: 'md' }, { h: 'Role' }, { h: 'Last sign-in', hide: 'sm' }, { h: '<span class="sr-only">Actions</span>', cls: 'rowact' }], rows: D.staff.map(([n, e, r, s]) => [`<span class="cell-primary">${NG.avatar(n)}<b>${n}</b></span>`, e, r === 'Owner' ? `${r} <span class="caption muted">(only the owner can change)</span>` : NG.selectBox('Role for ' + n, ['Admin', 'Receptionist', 'Instructor'], { value: r, cls: 'filter' }), s, NG.rowMenu(n)]) }) + '<div class="pagination"><span>Role permissions are listed in docs/requirements/roles-and-permissions.md</span></div>' });
      return `${NG.pageHeader({ title: 'Settings', desc: 'Northside Driving School' })}<div class="settings-layout">${side}<div class="col">${body}</div></div>`;
    },
  });
})();
