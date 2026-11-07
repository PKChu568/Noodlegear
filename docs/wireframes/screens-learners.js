/* Screens: learners */
(function () {
  'use strict';
  const { NG } = window; const D = NG.data; const f = NG.fmt;
  const insName = (id) => (id ? D.instructor(id).name : '<span class="muted">Not assigned</span>');
  const LIST_STATES = [['default', 'With data'], ['loading', 'Loading'], ['empty', 'Empty (first use)'], ['noResults', 'No results'], ['error', 'Error']];

  /* ---------------- SCR-10 Learners list ---------------- */
  NG.screen({
    id: 'SCR-10', name: 'Learners', group: 'Learners', nav: 'learners', roles: ['owner', 'admin', 'receptionist', 'instructor'], states: LIST_STATES,
    notes: { purpose: 'Find, filter and act on learners. Row click opens a quick-view panel.', stories: ['US-LRN-02', 'US-LRN-03', 'US-LRN-04'], points: ['Search matches name, ID, phone and email.', 'Filters persist in the URL.', 'Bulk actions appear in the command bar when rows are selected.', 'Instructor role sees "My learners", no amounts (BR-20, BR-21). Switch role to compare.', 'Use the State menu to review loading, empty, no-results and error states.'] },
    render(ctx) {
      const isIns = ctx.role === 'instructor';
      const list = isIns ? D.learners.filter((l) => l.ins === 'I-025') : D.learners;
      const cols = isIns
        ? [{ h: 'Learner', sort: 'asc' }, { h: 'Next lesson' }, { h: 'Lessons', end: true, hide: 'sm' }, { h: 'Progress', hide: 'md' }, { h: 'Status' }, { h: '<span class="sr-only">Actions</span>', cls: 'rowact' }]
        : [{ h: NG.selCell('all learners'), cls: 'sel' }, { h: 'Learner', sort: 'asc' }, { h: 'Instructor', hide: 'sm' }, { h: 'Next lesson', hide: 'sm' }, { h: 'Lessons', end: true, hide: 'md' }, { h: 'Credit', end: true, hide: 'md' }, { h: 'Balance', end: true, hide: 'sm' }, { h: 'Status' }, { h: '<span class="sr-only">Actions</span>', cls: 'rowact' }];
      const cmd = NG.commandBar(isIns ? NG.btn('Export', { kind: 'subtle', icon: 'arrow_download' }) : NG.btn('Export', { kind: 'subtle', icon: 'arrow_download' }) + NG.btn('Send reminder', { kind: 'subtle', icon: 'mail' }) + NG.btn('Assign instructor', { kind: 'subtle', icon: 'person_star' }), NG.btn('Refresh', { kind: 'subtle', iconOnly: true, icon: 'arrow_clockwise' }));
      const stateBody = NG.listState(ctx, { cols, commandBar: cmd, emptyTitle: 'No learners yet', emptyDesc: 'Register your first learner to start booking lessons.', emptyAction: NG.btn('Register learner', { kind: 'primary', icon: 'person_add', attrs: { 'data-go': 'SCR-12' } }), noResultsTitle: 'No learners match your filters', errorTitle: "Couldn't load learners" });
      const rows = list.map((l) => ({ cls: 'clickable', attrs: { tabindex: 0, 'data-panel': l.id }, cells: isIns
        ? [`<span class="cell-primary">${NG.avatar(l.name)}<span class="cell-two"><a class="cell-link" href="#/SCR-11">${l.name}</a><span class="caption muted mono">${l.id}</span></span></span>`, f.dayTime(l.next), l.lessons, NG.meter(Math.min(5, Math.round(l.lessons / 6))), NG.badge('learner', l.status), NG.rowMenu(l.name)]
        : [NG.selCell(l.name), `<span class="cell-primary">${NG.avatar(l.name)}<span class="cell-two"><a class="cell-link" href="#/SCR-11">${l.name}</a><span class="caption muted mono">${l.id}</span></span></span>`, insName(l.ins), f.dayTime(l.next), l.lessons, l.credit ? `${l.credit} left` : NG.empty, l.balance ? `${f.gbp(l.balance)}${l.overdue ? ' ' + NG.badge('payment', 'overdue', true) : ''}` : NG.empty, NG.badge('learner', l.status), NG.rowMenu(l.name)] }));
      const filters = isIns ? [['Status', ['Status: All', 'Status: Active', 'Status: Test ready']]] : [['Status', ['Status: All', 'Status: Active', 'Status: Test ready', 'Status: On hold', 'Status: Enquiry', 'Status: Passed', 'Status: Withdrawn']], ['Instructor', ['Instructor: All', ...D.instructors.map((i) => 'Instructor: ' + i.name)]], ['Transmission', ['Transmission: All', 'Transmission: Manual', 'Transmission: Automatic'], 'hide-md']];
      return `${NG.pageHeader({ title: isIns ? 'My learners' : 'Learners', desc: isIns ? '5 learners · 1 test ready' : '312 learners · 18 test ready · 2 with overdue balances', actions: isIns ? '' : NG.btn('Import', { icon: 'arrow_upload' }) + NG.btn('More actions', { iconOnly: true, icon: 'more_horizontal' }) + NG.btn('Register learner', { kind: 'primary', icon: 'person_add', attrs: { 'data-go': 'SCR-12' } }) })}
        ${NG.filterBar({ search: 'Search by name, ID, phone or email', filters, count: ctx.state === 'noResults' ? '0 learners' : `${list.length} learners`, tags: ctx.state === 'noResults' ? ['Status: Passed', 'Instructor: Liam Turner'] : [] })}
        <section class="surface" aria-label="Learners">${stateBody || cmd + NG.table({ caption: 'Learners', size: 'medium', cols, rows }) + NG.pagination(isIns ? '1–5 of 5' : `Showing 1–${list.length} of 312`, isIns ? 'Page 1 of 1' : 'Page 1 of 13')}</section>`;
    },
    after(ctx, root) {
      root.querySelectorAll('tr[data-panel]').forEach((tr) => {
        const open = (e) => { if (e.target.closest('a,button,input')) return; const l = D.learner(tr.dataset.panel); ctx.panel(learnerPanel(l, ctx.role), tr); };
        tr.addEventListener('click', open);
        tr.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target === tr) open(e); });
      });
    },
  });

  function learnerPanel(l, role) {
    const ins = role === 'instructor';
    return {
      title: l.name, avatar: l.name, sub: `<span class="mono">${l.id}</span>${NG.badge('learner', l.status)}`,
      body: `${l.overdue && !ins ? NG.msg('warning', 'Overdue balance', ` ${f.gbp(l.balance)} since 28 Oct 2026.`, NG.btn('Record payment', { small: true, attrs: { 'data-go': 'SCR-73' } })) : ''}
        ${l.balance && ins ? NG.msg('warning', '', 'Balance outstanding. Check with the office before the lesson.') : ''}
        <div class="panel-section"><h3>Details</h3>${NG.dlist([['Instructor', l.ins ? D.instructor(l.ins).name : ''], ['Transmission', l.trans], ['Mobile', l.phone], ['Email', l.email], ['Next lesson', l.next ? f.dayTime(l.next) : ''], ['Lessons completed', String(l.lessons)], ...(ins ? [] : [['Package credit', l.credit ? `${l.credit} lessons` : ''], ['Balance', l.balance ? f.gbp(l.balance) : f.gbp(0)]])])}</div>
        <div class="panel-section"><h3>Recent activity</h3>${NG.timeline([{ icon: 'checkmark_circle', tone: 'success', title: 'Lesson completed · Standard 60 min', meta: 'With ' + (l.ins ? D.instructor(l.ins).name : '—') + ' · 03 Nov 2026, 10:00' }, { icon: 'calendar_add', title: 'Lesson booked for ' + (l.next ? f.dayTime(l.next) : '—'), meta: 'By Dilani Perera · 01 Nov 2026, 15:20' }])}</div>`,
      footer: ins ? NG.btn('Close', { attrs: { 'data-close': '' } }) : NG.btn('Book lesson', { kind: 'primary', icon: 'calendar_add', attrs: { 'data-go': 'SCR-21' } }) + NG.btn('Close', { attrs: { 'data-close': '' } }),
      headerActions: `<a class="btn subtle icon" href="#/SCR-11" aria-label="Open full record" title="Open full record">${NG.icon('open')}</a>`,
    };
  }

  /* ---------------- SCR-11 Learner detail ---------------- */
  NG.screen({
    id: 'SCR-11', name: 'Learner detail', group: 'Learners', nav: 'learners', roles: ['owner', 'admin', 'receptionist', 'instructor'],
    tabs: [['overview', 'Overview'], ['lessons', 'Lessons'], ['payments', 'Payments'], ['tests', 'Driving tests'], ['progress', 'Progress'], ['notes', 'Notes']],
    notes: { purpose: 'Everything about one learner. Example: Amaya Silva, active, overdue balance, test booked.', stories: ['US-LRN-05', 'US-LRN-06', 'US-LRN-07', 'US-LRN-08', 'US-ATT-05', 'US-BIL-04'], points: ['Tabs update the URL (#/SCR-11/progress).', 'Status changes (on hold, withdraw, anonymise) live in the overflow menu and always confirm.', 'Instructor role: no Payments tab, a "Mark test ready" action instead of billing.', 'Progress uses proposed skill meter P-03.'] },
    render(ctx) {
      const l = D.learner('L-10234'); const ins = ctx.role === 'instructor';
      const tabs = this.tabs.filter((t) => !(ins && t[0] === 'payments'));
      const tab = ctx.tab || 'overview';
      const actions = ins ? NG.btn('Mark test ready', { icon: 'checkmark_circle' }) + NG.btn('Record lesson', { kind: 'primary', icon: 'note', attrs: { 'data-go': 'SCR-22' } })
        : NG.btn('Edit', { icon: 'edit', attrs: { 'data-go': 'SCR-12' } }) + NG.btn('Record payment', { icon: 'payment', attrs: { 'data-go': 'SCR-73' } }) + `<span style="position:relative">${NG.btn('More actions', { iconOnly: true, icon: 'more_horizontal', attrs: { 'data-menu': 'learnerMenu', 'aria-haspopup': 'menu' } })}
          <div class="menu" role="menu" id="learnerMenu" hidden style="position:absolute;right:0;top:36px;z-index:10"><div role="menuitem" class="menu-item" data-go="SCR-74">${NG.icon('receipt')}Sell package…</div><div role="menuitem" class="menu-item" data-go="SCR-41">${NG.icon('clipboard_task')}Book driving test…</div><div role="menuitem" class="menu-item">${NG.icon('mail')}Email learner</div><div class="menu-divider"></div><div role="menuitem" class="menu-item">${NG.icon('pause')}Put on hold…</div><div role="menuitem" class="menu-item">${NG.icon('person_delete')}Withdraw…</div><div role="menuitem" class="menu-item">${NG.icon('shield_lock')}Anonymise (GDPR)…</div></div></span>`
          + NG.btn('Book lesson', { kind: 'primary', icon: 'calendar_add', attrs: { 'data-go': 'SCR-21' } });
      const head = NG.pageHeader({ crumbs: [[ins ? 'My learners' : 'Learners', 'SCR-10'], [l.name]], title: l.name, meta: NG.badge('learner', l.status), desc: `<span class="mono">${l.id}</span> · Manual · Instructor Ruwan Fernando · Joined 03 Feb 2026`, actions, tabs, tab });
      return head + (ins ? NG.msg('warning', '', 'Balance outstanding. The office will contact the learner.') : NG.msg('warning', 'Overdue balance.', ` ${f.gbp(120)} on INV-2026-0146, due 28 Oct 2026.`, NG.btn('Record payment', { small: true, attrs: { 'data-go': 'SCR-73' } }))) + tabBody(tab, l, ins);
    },
  });

  function tabBody(tab, l, ins) {
    const upcoming = [['Tue 10 Nov, 16:30', 'Standard lesson · 60 min', 'Ruwan Fernando', NG.badge('lesson', 'scheduled')], ['Thu 12 Nov, 10:00', 'Standard lesson · 60 min', 'Ruwan Fernando', NG.badge('lesson', 'scheduled')], ['Tue 17 Nov, 10:00', 'Mock test · 60 min', 'Ruwan Fernando', NG.badge('lesson', 'scheduled')]];
    if (tab === 'overview') {
      return `<div class="two-col"><div class="col">
          ${NG.section({ title: 'Details', actions: ins ? '' : NG.btn('Edit', { kind: 'subtle', small: true, icon: 'edit', attrs: { 'data-go': 'SCR-12' } }), body: NG.dlist([['Date of birth', '14 Mar 2007 (19)'], ['Mobile', l.phone], ['Email', l.email], ['Address', `${l.address}, ${l.postcode}`], ['Provisional licence', `<span class="mono">${l.licence}</span>`], ['Theory test', 'Passed · 02 Sep 2026'], ['Default pick-up', 'Northside College'], ['Transmission', 'Manual']]) })}
          ${NG.section({ title: 'Upcoming lessons', flush: true, actions: NG.btn('View all', { kind: 'subtle', small: true, attrs: { 'data-tab-go': 'lessons' } }), body: NG.table({ size: 'extra-small', caption: 'Upcoming lessons', cols: [{ h: 'When' }, { h: 'Type' }, { h: 'Instructor', hide: 'sm' }, { h: 'Status' }], rows: upcoming }) })}
        </div><div class="col">
          ${ins ? '' : NG.section({ title: 'Balance', body: `<div class="m-value t-title2 num">${f.gbp(120)}</div><span class="caption muted">1 overdue invoice · no package credit</span><div class="row">${NG.btn('Record payment', { small: true, attrs: { 'data-go': 'SCR-73' } })}${NG.btn('Sell package', { small: true, attrs: { 'data-go': 'SCR-74' } })}</div>` })}
          ${NG.section({ title: 'Driving test', body: `<div class="row"><b>Wed 03 Dec 2026, 09:40</b>${NG.badge('test', 'booked', true)}</div><span class="caption muted">Northside test centre · ref 58230871 · LB73 WNZ</span>` })}
          ${NG.section({ title: 'Progress', body: `<div class="progress-label"><span>Skills at level 4 or 5</span><span class="num muted">6 of 16</span></div><div class="progress thick" role="progressbar" aria-label="Skills at level 4 or 5" aria-valuenow="38"><div style="width:38%"></div></div>${NG.btn('View progress', { kind: 'subtle', small: true, attrs: { 'data-tab-go': 'progress' } })}` })}
          ${NG.section({ title: 'Activity', body: NG.timeline([{ icon: 'payment', tone: 'success', title: `Payment recorded · ${f.gbp(60)}`, meta: 'Card · Dilani Perera · 07 Nov 2026, 09:12' }, { icon: 'checkmark_circle', tone: 'success', title: 'Lesson completed · Standard 60 min', meta: 'Ruwan Fernando · 06 Nov 2026, 11:00' }, { icon: 'clipboard_task', title: 'Driving test booked for 03 Dec 2026', meta: 'Dilani Perera · 04 Nov 2026, 15:20' }, { icon: 'dismiss', tone: 'warning', title: 'Lesson cancelled by learner (more than 48 h notice)', meta: '02 Nov 2026, 18:05' }]) })}
        </div></div>`;
    }
    if (tab === 'lessons') {
      const hist = [['Tue 17 Nov, 10:00', 'Mock test · 60 min', 'Ruwan Fernando', NG.badge('lesson', 'scheduled'), NG.empty], ['Thu 12 Nov, 10:00', 'Standard · 60 min', 'Ruwan Fernando', NG.badge('lesson', 'scheduled'), NG.empty], ['Tue 10 Nov, 16:30', 'Standard · 60 min', 'Ruwan Fernando', NG.badge('lesson', 'scheduled'), NG.empty], ['Tue 10 Nov, 10:00', 'Standard · 60 min', 'Ruwan Fernando', NG.badge('lesson', 'completed'), NG.badge('attendance', 'present', true)], ['Fri 06 Nov, 11:00', 'Standard · 60 min', 'Ruwan Fernando', NG.badge('lesson', 'completed'), NG.badge('attendance', 'late', true)], ['Mon 02 Nov, 10:00', 'Standard · 60 min', 'Ruwan Fernando', NG.badge('lesson', 'cancelled'), NG.empty], ['Thu 29 Oct, 10:00', 'Standard · 60 min', 'Ruwan Fernando', NG.badge('lesson', 'completed'), NG.badge('attendance', 'present', true)]];
      return NG.section({ flush: true, label: 'Lessons', body: NG.commandBar(NG.btn('Book lesson', { kind: 'subtle', icon: 'calendar_add', attrs: { 'data-go': 'SCR-21' } }) + NG.btn('Book series', { kind: 'subtle', icon: 'calendar_clock' }), NG.selectBox('Show', ['All lessons', 'Upcoming', 'Past'])) + NG.table({ caption: 'Lessons', cols: [{ h: 'When', sort: 'desc' }, { h: 'Type' }, { h: 'Instructor', hide: 'sm' }, { h: 'Status' }, { h: 'Attendance', hide: 'sm' }], rows: hist }) + NG.pagination('Showing 1–7 of 18', 'Page 1 of 1') });
    }
    if (tab === 'payments') {
      return `<div class="metrics">${NG.metric('payment', 'Balance', f.gbp(120), '<span class="delta-negative">Overdue since 28 Oct</span>')}${NG.metric('receipt', 'Package credit', '0 lessons', 'No active package')}${NG.metric('money', 'Paid to date', f.gbp(412), 'Since Feb 2026')}</div>
        ${NG.section({ title: 'Invoices', flush: true, actions: NG.btn('Sell package', { kind: 'subtle', small: true, attrs: { 'data-go': 'SCR-74' } }), body: NG.table({ caption: 'Invoices', cols: [{ h: 'Invoice' }, { h: 'Issued' }, { h: 'Due', hide: 'sm' }, { h: 'Total', end: true }, { h: 'Status' }], rows: [[`<a class="cell-link" href="#/SCR-71">INV-2026-0146</a>`, '14 Oct 2026', '28 Oct 2026', f.gbp(120), NG.badge('invoice', 'overdue')], ['INV-2026-0118', '15 Sep 2026', '29 Sep 2026', f.gbp(152), NG.badge('invoice', 'paid')], ['INV-2026-0090', '14 Aug 2026', '28 Aug 2026', f.gbp(200), NG.badge('invoice', 'paid')]] }) })}
        ${NG.section({ title: 'Payments', flush: true, body: NG.table({ caption: 'Payments', cols: [{ h: 'Reference' }, { h: 'Date' }, { h: 'Method', hide: 'sm' }, { h: 'Amount', end: true }, { h: 'Status' }], rows: [['PAY-20416', '07 Nov 2026', 'Card', f.gbp(60), NG.badge('payment', 'pending')], ['PAY-20302', '16 Sep 2026', 'Card', f.gbp(152), NG.badge('payment', 'paid')], ['PAY-20211', '20 Aug 2026', 'Bank transfer', f.gbp(200), NG.badge('payment', 'paid')]] }) })}`;
    }
    if (tab === 'tests') {
      return NG.section({ flush: true, label: 'Driving tests', body: NG.commandBar(NG.btn('Book driving test', { kind: 'subtle', icon: 'clipboard_task', attrs: { 'data-go': 'SCR-41' } })) + NG.table({ caption: 'Driving tests', cols: [{ h: 'Date' }, { h: 'Type' }, { h: 'Centre' }, { h: 'Reference', hide: 'sm' }, { h: 'Result' }], rows: [['Wed 03 Dec 2026, 09:40', 'Practical', 'Northside', '<span class="mono">58230871</span>', NG.badge('test', 'booked')], ['02 Sep 2026', 'Theory', 'Northside theory centre', '<span class="mono">TH-4471920</span>', NG.badge('test', 'passed')]] }) });
    }
    if (tab === 'progress') {
      const lv = D.skillLevels['Amaya Silva'];
      return `${NG.msg('info', 'Not test ready yet.', ' 6 of 16 skills are at level 4 or above. Focus next: dual carriageways, bay and parallel parking, motorways.')}
        ${NG.section({ flush: true, title: 'Skills', actions: ins ? NG.btn('Assess skills', { kind: 'subtle', small: true, icon: 'edit', attrs: { 'data-go': 'SCR-22' } }) : '', body: NG.table({ caption: 'Skills', cols: [{ h: 'Skill' }, { h: 'Level' }, { h: 'Meaning', hide: 'sm' }, { h: 'Last assessed', hide: 'md' }], rows: D.skills.map((s, i) => [s, NG.meter(lv[i]), D.levelNames[lv[i]], lv[i] > 1 ? `${['06 Nov', '29 Oct', '22 Oct'][i % 3]} 2026 · Ruwan Fernando` : NG.empty]) }) + '<div class="pagination"><span>Levels: 1 Introduced · 2 Under instruction · 3 Prompted · 4 Seldom prompted · 5 Independent</span></div>' })}`;
    }
    return NG.section({ title: 'Notes', body: `${NG.field('Add a note', NG.textarea('', 'Visible to all staff'))}<div class="row">${NG.btn('Add note')}</div>${NG.timeline([{ icon: 'note', title: 'Prefers morning lessons on weekdays. College finishes 15:30 on Tuesdays.', meta: 'Dilani Perera · 28 Oct 2026, 10:41' }, { icon: 'note', title: 'Nervous on roundabouts; build confidence with quieter ones first.', meta: 'Ruwan Fernando · 12 Oct 2026, 11:05' }])}` });
  }

  /* ---------------- SCR-12 New learner ---------------- */
  NG.screen({
    id: 'SCR-12', name: 'New learner', group: 'Learners', nav: 'learners', roles: ['owner', 'admin', 'receptionist'],
    states: [['default', 'Filling in'], ['errors', 'Validation errors'], ['duplicate', 'Possible duplicate']],
    notes: { purpose: 'Register a learner during a phone call, then book their first lesson.', stories: ['US-LRN-01', 'US-LRN-10'], points: ['Mobile or email: at least one is required.', 'Date of birth and address are required only when status is Active.', 'Errors: summary at the top + message under each field; focus moves to the first invalid field.', 'Duplicate check on name + date of birth, email or phone.', 'Save goes to the learner record (SCR-11) with "Book lesson" as the primary action.'] },
    render(ctx) {
      const e = ctx.state === 'errors', dup = ctx.state === 'duplicate';
      return `${NG.pageHeader({ crumbs: [['Learners', 'SCR-10'], ['New learner']], title: 'New learner' })}
        <div class="col" style="max-width:var(--ng-layout-form-max-width, 960px)">
        ${e ? NG.msg('error', '3 fields need attention.', ' Check the highlighted fields and try again.') : ''}
        ${dup ? NG.msg('warning', 'This learner may already exist.', ' <a href="#/SCR-11">Amaya Silva (L-10234)</a> has the same mobile number.', NG.btn('Open existing', { small: true, attrs: { 'data-go': 'SCR-11' } }) + NG.btn('Continue anyway', { small: true, kind: 'subtle' })) : ''}
        <form class="surface pad stack" onsubmit="return false" aria-label="New learner" style="gap:24px">
          ${NG.fieldset('Personal details', NG.field('First name', NG.text(e ? '' : 'Amaya', { error: e }), { req: true, error: e ? 'Enter a first name' : '' }) + NG.field('Last name', NG.text('Silva'), { req: true }) + NG.field('Date of birth', NG.date(e ? '31/02/2007' : '14/03/2007', { error: e }), { req: true, error: e ? 'Enter a real date, for example 14/03/2007' : '', hint: e ? '' : 'Required for active learners.' }) + NG.field('Status', NG.select(['Active', 'Enquiry'], 'Active'), { hint: 'Enquiry: not ready to book yet.' }))}
          ${NG.fieldset('Contact', NG.field('Mobile', NG.text(dup ? '07700 900123' : '07700 900123', { icon: 'call' }), { hint: 'Mobile or email is required.' }) + NG.field('Email', NG.text(e ? 'amaya.silva@' : 'amaya.silva@example.com', { error: e }), { error: e ? 'Enter an email address like name@example.com' : '' }) + NG.field('Address', NG.text('14 Elm Grove, Northside'), { req: true }) + NG.field('Postcode', NG.text('NS4 7QT'), { req: true }) + NG.field('Default pick-up location', NG.text('Same as address', { ph: 'e.g. Northside College' }), { full: true }))}
          ${NG.fieldset('Licence', NG.field('Provisional licence number', NG.text('SILVA902125AM9IJ', { mono: true }), { hint: '16 characters, as on the photocard.', optional: true }) + NG.field('Theory test', NG.select(['Not taken', 'Booked', 'Passed'], 'Passed')) + NG.field('Theory test pass date', NG.date('02/09/2026')) + NG.field('Theory certificate number', NG.text('', { mono: true }), { optional: true }))}
          ${NG.fieldset('Lesson preferences', `<div class="field"><span class="label">Transmission<span class="req" aria-hidden="true">*</span></span>${NG.radios('trans', ['Manual', 'Automatic'], 'Manual')}</div>` + NG.field('Preferred instructor', NG.select(['No preference', ...D.instructors.map((i) => i.name)], 'Ruwan Fernando'), { warning: 'Ruwan Fernando has 14 learners; Sarah Mitchell has more free slots.' }) + NG.field('Previous experience', NG.select(['None', 'Some lessons elsewhere', 'Previously failed a test'], 'None')) + NG.field('Notes for instructors', NG.textarea('', 'e.g. Prefers morning lessons'), { full: true, optional: true }))}
          ${NG.fieldset('Consent', `<div class="field full">${NG.check('Send lesson confirmations and reminders by email', true)}${NG.check('Learner (or parent/guardian) agreed to the school terms and privacy notice', true)}</div>`)}
          <div class="form-actions" style="position:sticky;bottom:0;background:var(--colorNeutralBackground1)">${NG.btn('Save learner', { kind: 'primary', attrs: { 'data-go': 'SCR-11' } })}${NG.btn('Save and book lesson', { attrs: { 'data-go': 'SCR-21' } })}${NG.btn('Cancel', { kind: 'subtle', attrs: { 'data-go': 'SCR-10' } })}</div>
        </form></div>`;
    },
  });
})();
