/* Screens: driving tests, instructors, vehicles */
(function () {
  'use strict';
  const { NG } = window; const D = NG.data; const f = NG.fmt;
  const LIST_STATES = [['default', 'With data'], ['loading', 'Loading'], ['empty', 'Empty (first use)'], ['error', 'Error']];
  // P-04 compliance date cell: due within 30 days = warning, past = danger
  const due = (iso) => { const n = D.daysUntil(iso); return `<span class="num">${f.date(iso)}</span>${n < 0 ? ' ' + NG.toneBadge('danger', 'Expired', true) : n <= 30 ? ' ' + NG.toneBadge('warning', `In ${n} days`, true) : ''}`; };

  /* ---------------- SCR-40 Driving tests ---------------- */
  NG.screen({
    id: 'SCR-40', name: 'Driving tests', group: 'Driving tests', nav: 'tests', roles: ['owner', 'admin', 'receptionist', 'instructor'], states: LIST_STATES,
    notes: { purpose: 'Upcoming and past practical tests, results and pass rate.', stories: ['US-TST-01', 'US-TST-03'], points: ['Upcoming first, soonest at the top.', 'Recording a pass sets the learner to Passed and offers to cancel future lessons.', 'Instructor role sees only their learners\' tests.'] },
    render(ctx) {
      const ins = ctx.role === 'instructor';
      const list = ins ? D.tests.filter((t) => t.ins === 'I-025') : D.tests;
      const cols = [{ h: 'Date and time', sort: 'asc' }, { h: 'Learner' }, { h: 'Instructor', hide: 'sm' }, { h: 'Centre', hide: 'md' }, { h: 'DVSA ref', hide: 'md' }, { h: 'Car', hide: 'md' }, { h: 'Result' }, { h: '<span class="sr-only">Actions</span>', cls: 'rowact' }];
      const cmd = NG.commandBar(NG.btn('Export', { kind: 'subtle', icon: 'arrow_download' }), NG.selectBox('Show', ['Upcoming and recent', 'Upcoming', 'Past'], { cls: 'filter' }));
      const st = NG.listState(ctx, { cols, commandBar: cmd, emptyTitle: 'No driving tests recorded', emptyDesc: 'Record a test when a learner books one with the DVSA.', emptyAction: NG.btn('Record test booking', { kind: 'primary', attrs: { 'data-go': 'SCR-41' } }), errorTitle: "Couldn't load driving tests" });
      const rows = list.map((t) => [f.dayTime(t.at), `<a class="cell-link" href="#/SCR-11">${t.learner}</a>`, D.instructor(t.ins).name, t.centre, `<span class="mono">${t.ref}</span>`, `<span class="mono">${t.car}</span>`,
        NG.badge('test', t.status) + (t.faults ? `<br><span class="caption muted">${t.faults}</span>` : ''), t.status === 'booked' ? NG.btn('Record result', { small: true }) : NG.rowMenu(t.learner)]);
      return `${NG.pageHeader({ title: 'Driving tests', desc: '4 upcoming · pass rate 64% (last 90 days)', actions: ins ? '' : NG.btn('Record test booking', { kind: 'primary', icon: 'clipboard_task', attrs: { 'data-go': 'SCR-41' } }) })}
        ${ins ? '' : `<div class="metrics">${NG.metric('clipboard_task', 'Upcoming tests', '4', 'Next: George Hall today 15:40')}${NG.metric('checkmark_circle', 'Pass rate (90 days)', '64%', '<span class="delta-positive">↑ 3 pts vs previous 90 days</span>', 'SCR-81')}${NG.metric('people_community', 'Test ready, not booked', '1', 'Oliver Bennett has a test; 1 learner waiting', 'SCR-30')}</div>`}
        <section class="surface" aria-label="Driving tests">${st || cmd + NG.table({ caption: 'Driving tests', cols, rows })}</section>`;
    },
  });

  /* ---------------- SCR-41 Book driving test (dialog) ---------------- */
  NG.screen({
    id: 'SCR-41', name: 'Record test booking', group: 'Driving tests', nav: 'tests', parent: 'SCR-40', roles: ['owner', 'admin', 'receptionist'],
    notes: { purpose: 'Record a practical test booked with the DVSA and reserve the car and instructor.', stories: ['US-TST-01', 'US-TST-02'], points: ['Only learners with status Test ready are suggested first.', 'Reserving creates a "Test day" lesson so nothing is booked over it (BR-01).', 'Who books with the DVSA is open question Q-14.'] },
    dialog() {
      return { size: 'medium', html: `<div class="dlg-title">Record test booking${NG.btn('Close', { kind: 'subtle', iconOnly: true, icon: 'dismiss', attrs: { 'data-close': '' } })}</div>
        <div class="dlg-content"><div class="form-grid">
          ${NG.field('Learner', `<div class="input">${NG.icon('search', 'ic16 affix')}<input id="%ID%" value="Hannah Lewis · L-10274 · Test ready" role="combobox"></div>`, { req: true, full: true })}
          ${NG.field('Test date', NG.date('Tue 24 Nov 2026'), { req: true })}${NG.field('Test time', NG.select(['13:50'], '13:50'), { req: true })}
          ${NG.field('Test centre', NG.select(['Northside', 'Eastfield', 'Westgate'], 'Eastfield'), { req: true })}${NG.field('DVSA booking reference', NG.text('58224015', { mono: true }), { req: true })}
        </div>
        <fieldset><legend>Reserve for test day</legend><div class="form-grid">
          ${NG.field('Instructor', NG.select(['Ruwan Fernando'], 'Ruwan Fernando'))}${NG.field('Car', NG.select(['LB73 WNZ · Ford Fiesta · Manual'], 'LB73 WNZ · Ford Fiesta · Manual'))}
          ${NG.field('Warm-up lesson', NG.select(['60 min before test', '90 min before test', 'None'], '60 min before test'), { hint: 'Creates a Test day booking 12:50–15:00' })}${NG.field('Test day fee', NG.text('95.00', { before: '£', num: true }), { hint: 'Invoiced now' })}
        </div></fieldset></div>
        <div class="dlg-actions">${NG.btn('Save test booking', { kind: 'primary', attrs: { 'data-close': '', 'data-toast': 'success|Test booking recorded|Hannah Lewis · 24 Nov 2026, 13:50 · Eastfield' } })}${NG.btn('Cancel', { attrs: { 'data-close': '' } })}</div>` };
    },
  });

  /* ---------------- SCR-50 Instructors ---------------- */
  NG.screen({
    id: 'SCR-50', name: 'Instructors', group: 'Operations', nav: 'instructors', roles: ['owner', 'admin', 'receptionist'], states: LIST_STATES,
    notes: { purpose: 'All instructors with live status, workload this week and compliance.', stories: ['US-INS-01', 'US-INS-04'], points: ['Status is derived from the schedule (On lesson) or absences (On leave).', 'ADI badge expiry uses the compliance cell (P-04) with a 60-day warning for badges.', 'Receptionist role: read only, no "Add instructor".'] },
    render(ctx) {
      const ro = ctx.role === 'receptionist';
      const cols = [{ h: 'Instructor', sort: 'asc' }, { h: 'Status' }, { h: 'Transmission', hide: 'md' }, { h: 'Car', hide: 'md' }, { h: 'This week' }, { h: 'Learners', end: true, hide: 'sm' }, { h: 'ADI badge expires', hide: 'sm' }, { h: '<span class="sr-only">Actions</span>', cls: 'rowact' }];
      const cmd = NG.commandBar(NG.btn('Export', { kind: 'subtle', icon: 'arrow_download' }));
      const st = NG.listState(ctx, { cols, commandBar: cmd, emptyTitle: 'No instructors yet', emptyDesc: 'Add instructors so lessons can be booked with them.', emptyAction: NG.btn('Add instructor', { kind: 'primary', icon: 'person_add' }), errorTitle: "Couldn't load instructors" });
      const rows = D.instructors.map((i) => { const pct = Math.round((i.week / i.cap) * 100); const n = D.daysUntil(i.badge); return [
        `<span class="cell-primary">${NG.avatar(i.name)}<span class="cell-two"><a class="cell-link" href="#/SCR-51">${i.name}</a><span class="caption muted mono">${i.id} · ADI ${i.adi}</span></span></span>`, NG.dot('instructor', i.status) + (i.absence ? `<br><span class="caption muted">${i.absence}</span>` : ''), i.trans, `<span class="mono">${i.car}</span>`,
        i.week ? `<span class="row" style="flex-wrap:nowrap"><span class="num">${i.week} of ${i.cap} h</span><span class="caption muted">${pct}%</span></span>` : NG.empty, i.learners,
        `<span class="num">${f.date(i.badge)}</span>${n <= 60 ? ' ' + NG.toneBadge('warning', `In ${n} days`, true) : ''}`, NG.rowMenu(i.name)]; });
      return `${NG.pageHeader({ title: 'Instructors', desc: '5 instructors · 1 on leave · 3 on lessons now', actions: ro ? '' : NG.btn('Add instructor', { kind: 'primary', icon: 'person_add' }) })}
        <section class="surface" aria-label="Instructors">${st || cmd + NG.table({ caption: 'Instructors', size: 'medium', cols, rows })}</section>`;
    },
  });

  /* ---------------- SCR-51 Instructor detail ---------------- */
  NG.screen({
    id: 'SCR-51', name: 'Instructor detail', group: 'Operations', nav: 'instructors', roles: ['owner', 'admin', 'instructor'],
    tabs: [['availability', 'Availability'], ['overview', 'Overview'], ['learners', 'Learners']],
    notes: { purpose: 'Instructor profile, weekly working hours and absences. Example: Sam Patel.', stories: ['US-INS-02', 'US-INS-03', 'US-INS-05'], points: ['Working hours are local times, converted per date (DST-safe).', 'Absence requests from instructors need approval (pending Q-09).', 'Instructor role sees their own profile as "My availability".'] },
    render(ctx) {
      const i = D.instructor('I-025'); const me = ctx.role === 'instructor'; const tab = ctx.tab || 'availability';
      const head = NG.pageHeader({ crumbs: me ? null : [['Instructors', 'SCR-50'], [i.name]], title: me ? 'My availability' : i.name, meta: NG.badge('instructor', i.status), desc: `<span class="mono">${i.id}</span> · ADI ${i.adi} · ${i.trans} · <span class="mono">${i.car}</span>`,
        actions: me ? NG.btn('Request time off', { kind: 'primary', icon: 'calendar_clock' }) : NG.btn('Edit', { icon: 'edit' }) + NG.btn('Add absence', { icon: 'calendar_clock' }) + NG.btn('View schedule', { kind: 'primary', icon: 'calendar_ltr', attrs: { 'data-go': 'SCR-20' } }), tabs: me ? null : this.tabs, tab });
      const badge = NG.msg('warning', 'ADI badge expires in 40 days.', ' 20 Dec 2026. Upload the renewed badge to keep booking lessons (BR-11).', me ? '' : NG.btn('Update badge', { small: true }));
      if (tab === 'availability' || me) {
        const week = [['Monday', ['08:00–12:30', '13:30–18:30']], ['Tuesday', ['08:00–18:30']], ['Wednesday', ['08:00–12:30', '13:30–18:30']], ['Thursday', ['08:00–18:30']], ['Friday', ['08:00–16:00']], ['Saturday', []], ['Sunday', []]];
        return head + badge + `<div class="two-col">
          ${NG.section({ title: 'Weekly working hours', flush: true, actions: me ? '' : NG.btn('Edit hours', { kind: 'subtle', small: true, icon: 'edit' }), body: NG.table({ caption: 'Working hours', size: 'medium', cols: [{ h: 'Day' }, { h: 'Hours' }, { h: 'Total', end: true }], rows: week.map(([d, r]) => [d, r.length ? `<span class="avail">${r.map((x) => `<span class="range">${x}</span>`).join('')}</span>` : '<span class="muted">Not working</span>', r.length ? ['9 h 30 min', '10 h 30 min', '9 h 30 min', '10 h 30 min', '8 h'][week.findIndex((w) => w[0] === d)] : NG.empty]) }) + '<div class="pagination"><span>48 h available per week · effective from 01 Sep 2026</span></div>' })}
          ${NG.section({ title: 'Absences', flush: true, body: NG.table({ caption: 'Absences', cols: [{ h: 'Dates' }, { h: 'Reason' }, { h: 'Status' }], rows: [['Fri 27 Nov 2026', 'Personal', NG.toneBadge('warning', 'Awaiting approval')], ['21–31 Dec 2026', 'Annual leave', NG.toneBadge('success', 'Approved')], ['14 Oct 2026', 'Sick', NG.toneBadge('neutral', 'Taken')]] }) + (me ? '' : `<div class="pagination"><span>1 request awaiting approval</span><span class="ml-auto row">${NG.btn('Approve', { small: true })}${NG.btn('Decline', { small: true, kind: 'subtle' })}</span></div>`) })}
        </div>`;
      }
      if (tab === 'overview') return head + badge + `<div class="two-col">${NG.section({ title: 'Details', body: NG.dlist([['Mobile', i.phone], ['Email', 'sam@northside-driving.example'], ['ADI number', i.adi], ['Badge expiry', f.date(i.badge)], ['DBS check', 'Enhanced · 03 Mar 2025'], ['Default car', `<span class="mono">${i.car}</span> · Kia Picanto Auto`], ['Teaches', 'Automatic'], ['Started', '01 Feb 2024']]) })}
        <div class="col">${NG.metric('calendar_ltr', 'Booked this week', '34 h', 'of 40 h available (85%)')}${NG.metric('checkmark_circle', 'Pass rate (12 months)', '66%', '21 of 32 tests')}</div></div>`;
      return head + NG.section({ flush: true, label: 'Learners', body: NG.table({ caption: 'Learners', cols: [{ h: 'Learner' }, { h: 'Next lesson' }, { h: 'Lessons', end: true }, { h: 'Status' }], rows: D.learners.filter((l) => l.ins === 'I-025').map((l) => [`<a class="cell-link" href="#/SCR-11">${l.name}</a>`, f.dayTime(l.next), l.lessons, NG.badge('learner', l.status)]) }) });
    },
  });

  /* ---------------- SCR-60 Vehicles ---------------- */
  NG.screen({
    id: 'SCR-60', name: 'Vehicles', group: 'Operations', nav: 'vehicles', roles: ['owner', 'admin', 'receptionist', 'instructor'], states: LIST_STATES,
    notes: { purpose: 'The fleet with live status and every legal date in one table.', stories: ['US-VEH-01', 'US-VEH-02'], points: ['Compliance cells (proposal P-04): warning within 30 days, danger when expired.', 'Expired MOT/insurance/tax blocks the car from bookings (BR-10).', 'Read only for Receptionist and Instructor; anyone can report a defect.'] },
    render(ctx) {
      const edit = ctx.role === 'owner' || ctx.role === 'admin';
      const cols = [{ h: 'Registration', sort: 'asc' }, { h: 'Vehicle', hide: 'sm' }, { h: 'Transmission', hide: 'md' }, { h: 'Instructor', hide: 'md' }, { h: 'Status' }, { h: 'MOT' }, { h: 'Insurance', hide: 'sm' }, { h: 'Service', hide: 'md' }, { h: '<span class="sr-only">Actions</span>', cls: 'rowact' }];
      const cmd = NG.commandBar(NG.btn('Export', { kind: 'subtle', icon: 'arrow_download' }) + NG.btn('Report defect', { kind: 'subtle', icon: 'warning' }));
      const st = NG.listState(ctx, { cols, commandBar: cmd, emptyTitle: 'No vehicles yet', emptyDesc: 'Add the school\'s cars so lessons can use them.', emptyAction: edit ? NG.btn('Add vehicle', { kind: 'primary', icon: 'add' }) : '', errorTitle: "Couldn't load vehicles" });
      const rows = D.vehicles.map((v) => [`<a class="cell-link mono" href="#/SCR-61">${v.reg}</a>`, v.model, v.trans, v.ins ? D.instructor(v.ins).name : '<span class="muted">Spare</span>', NG.badge('vehicle', v.status) + (v.reason ? `<br><span class="caption muted">${v.reason}</span>` : ''), due(v.mot), due(v.insurance), due(v.service), NG.rowMenu(v.reg)]);
      return `${NG.pageHeader({ title: 'Vehicles', desc: '6 vehicles · 1 off road · 3 dates due within 30 days', actions: edit ? NG.btn('Add vehicle', { kind: 'primary', icon: 'add' }) : '' })}
        ${NG.msg('warning', '3 compliance dates due soon.', ' YR22 HDF MOT (22 Nov), PF21 XKD service (28 Nov), LB73 WNZ service (02 Dec).')}
        <section class="surface" aria-label="Vehicles">${st || cmd + NG.table({ caption: 'Vehicles', cols, rows })}</section>`;
    },
  });

  /* ---------------- SCR-61 Vehicle detail ---------------- */
  NG.screen({
    id: 'SCR-61', name: 'Vehicle detail', group: 'Operations', nav: 'vehicles', roles: ['owner', 'admin', 'receptionist', 'instructor'],
    notes: { purpose: 'One car: compliance dates, status, defects and usage. Example: YR22 HDF.', stories: ['US-VEH-02', 'US-VEH-03', 'US-VEH-04'], points: ['Setting "Off road" asks for a reason and an expected return date; future lessons are listed for rebooking.', 'Defect reports go to Admin and appear in "Needs attention".'] },
    render(ctx) {
      const v = D.vehicles[1]; const edit = ctx.role === 'owner' || ctx.role === 'admin';
      return `${NG.pageHeader({ crumbs: [['Vehicles', 'SCR-60'], [v.reg]], title: v.reg, meta: NG.badge('vehicle', v.status), desc: `${v.model} · ${v.trans} · Sarah Mitchell · ${v.miles.toLocaleString('en-GB')} miles`, actions: (edit ? NG.btn('Edit', { icon: 'edit' }) + NG.btn('Set off road', { icon: 'warning' }) : '') + NG.btn('Report defect', { kind: edit ? '' : 'primary', icon: 'warning' }) + (edit ? NG.btn('Update dates', { kind: 'primary', icon: 'calendar_ltr' }) : '') })}
        ${NG.msg('warning', 'MOT due in 12 days.', ' 22 Nov 2026. Book the MOT; the car cannot be used for lessons after it expires (BR-10).', edit ? NG.btn('Update MOT date', { small: true }) : '')}
        <div class="two-col"><div class="col">
          ${NG.section({ title: 'Compliance', flush: true, body: NG.table({ caption: 'Compliance', size: 'medium', cols: [{ h: 'Item' }, { h: 'Due' }, { h: 'Last done', hide: 'sm' }, { h: 'Reference', hide: 'md' }], rows: [['MOT', due(v.mot), '23 Nov 2025', '<span class="mono">MOT-7731 2045</span>'], ['Insurance', due(v.insurance), '15 May 2026', 'Dual-control learner policy'], ['Road tax', due(v.tax), '01 Feb 2026', NG.empty], ['Service', due(v.service), '10 Mar 2026', '42,000 miles'], ['Dual controls check', due('2027-01-15'), '15 Jul 2026', NG.empty]] }) })}
          ${NG.section({ title: 'Defects', flush: true, body: NG.table({ caption: 'Defects', cols: [{ h: 'Reported' }, { h: 'Description' }, { h: 'Status' }], rows: [['04 Nov 2026 · Sarah Mitchell', 'Passenger-side dual-control pedal sticks', NG.toneBadge('warning', 'Open')], ['12 Sep 2026 · Sarah Mitchell', 'Rear wiper blade split', NG.toneBadge('success', 'Fixed')]] }) })}
        </div><div class="col">
          ${NG.section({ title: 'Details', body: NG.dlist([['Make and model', v.model], ['Transmission', v.trans], ['Default instructor', 'Sarah Mitchell'], ['Mileage', `${v.miles.toLocaleString('en-GB')} (06 Nov 2026)`], ['Colour', 'Silver'], ['Dual controls', 'Yes']], true) })}
          ${NG.section({ title: 'Usage this week', body: `<div class="m-value t-title2 num">22 h</div><span class="caption muted">17 lessons · 2 different instructors</span>` })}
        </div></div>`;
    },
  });
})();
