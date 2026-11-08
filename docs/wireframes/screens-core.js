/* Screens: catalogue, sign in, dashboards */
(function () {
  'use strict';
  const { NG } = window; const D = NG.data; const f = NG.fmt;
  const insName = (id) => (id ? D.instructor(id).name : NG.empty);

  NG.screen({
    id: 'index', name: 'Screen catalogue', shell: false, roles: ['owner', 'admin', 'receptionist', 'instructor'],
    notes: { purpose: 'Start page of the wireframes. Every screen in docs/requirements/screen-inventory.md, grouped by area.', points: ['Use the bar at the top to switch screen, role, state and theme.', '"Notes" opens the annotations for each screen: purpose, user stories and behaviour.'] },
    render() {
      const groups = {};
      NG.order.filter((id) => id !== 'index').forEach((id) => { const s = NG.screens[id]; (groups[s.group] = groups[s.group] || []).push(s); });
      return `<div class="content" style="margin:0 auto">
        ${NG.pageHeader({ title: 'Noodlegear wireframes', desc: 'Clickable, static prototype of every screen in the first release. Built with the Noodlegear design system; sample data is fictional. Prototype date: Tue 10 Nov 2026, 11:20.' })}
        ${NG.msg('info', 'Not application code.', ' These pages are a design reference. The product is built in React + Fluent UI v9 following AGENTS.md. Requirements: <a href="../requirements/README.md">docs/requirements</a>.')}
        ${Object.entries(groups).map(([g, list]) => `<div class="cat-group">${NG.esc(g).toUpperCase()}</div><div class="catalogue">${list.map((s) => `
          <a class="surface cat-card" href="#/${s.id}"><span class="wf-tag">${s.id}</span><span class="strong">${NG.esc(s.name)}</span><span class="caption muted">${NG.esc(s.notes.purpose)}</span>
          <span class="caption muted">Roles: ${s.roles.map((r) => D.users[r].role).join(', ')}</span></a>`).join('')}</div>`).join('')}
      </div>`;
    },
  });

  NG.screen({
    id: 'SCR-00', name: 'Sign in', group: 'Access', shell: false, roles: ['owner', 'admin', 'receptionist', 'instructor'],
    states: [['default', 'Default'], ['error', 'Wrong password'], ['locked', 'Locked out']],
    notes: { purpose: 'Staff sign in with email and password.', stories: ['US-AUTH-01', 'US-AUTH-02'], points: ['Proposed pattern P-01: centred 400px surface, no illustration.', 'Error never says whether the email or the password was wrong.', 'After 5 failed attempts in 15 minutes the account locks for 15 minutes.', 'Signing in lands on the role\'s dashboard (SCR-01/02/03).'] },
    render(ctx) {
      const err = ctx.state === 'error', locked = ctx.state === 'locked';
      return `<div class="signin"><form class="surface signin-card" onsubmit="return false" aria-labelledby="si-title">
        <div class="brand"><span class="brand-mark" aria-hidden="true">N</span>Noodlegear</div>
        <div><h1 class="t-subtitle1" id="si-title">Sign in</h1><p class="muted">Northside Driving School</p></div>
        ${err ? NG.msg('error', '', 'Email or password is incorrect.') : ''}${locked ? NG.msg('warning', 'Account locked.', ' Too many attempts. Try again in 15 minutes or reset your password.') : ''}
        ${NG.field('Email', NG.text('dilani@northside-driving.example'), { req: true })}
        ${NG.field('Password', NG.text(err ? '' : '••••••••••', { error: err }), { req: true })}
        <label class="choice">${'<input type="checkbox">'}Keep me signed in on this computer</label>
        <button class="btn primary" type="button" data-go="SCR-02" ${locked ? 'disabled' : ''}>Sign in</button>
        <a href="#/SCR-00" class="caption">Forgot your password?</a>
        <p class="signin-foot">Shared computer? Sign out when you finish.</p>
      </form></div>`;
    },
  });

  /* ---------------- Owner / admin dashboard ---------------- */
  NG.screen({
    id: 'SCR-01', name: 'Dashboard', group: 'Dashboards', nav: 'dashboard', roles: ['owner', 'admin'],
    notes: { purpose: 'Run the school at a glance: today, money due, things needing attention.', stories: ['US-DSH-01', 'US-DSH-04', 'US-INS-05'], points: ['Every metric links to the filtered list behind it.', '"Needs attention" order: unassigned lessons, compliance, unrecorded lessons, overdue invoices, absence requests.', 'No charts on the dashboard: utilisation is a table with values.'] },
    render() {
      const rows = D.lessonsToday.slice().sort((a, b) => a.start.localeCompare(b.start)).slice(0, 10).map((l) => [
        `<span class="num">${f.time(l.start)}</span>`, `<a class="cell-link" href="#/SCR-11">${l.learner}</a>`, insName(l.ins), `<span class="hide-md">${l.type}</span>`, NG.badge('lesson', l.status)]);
      return `${NG.pageHeader({ title: 'Dashboard', desc: 'Tuesday 10 Nov 2026 · Northside Driving School', actions: NG.btn('Export day sheet', { icon: 'arrow_download' }) + NG.btn('Book lesson', { kind: 'primary', icon: 'calendar_add', attrs: { 'data-go': 'SCR-21' } }) })}
        <div class="metrics">
          ${NG.metric('calendar_ltr', 'Lessons today', '19', '<span class="delta-positive">↑ 3 vs last Tuesday</span>', 'SCR-20')}
          ${NG.metric('person_star', 'Unassigned lessons', '3', 'Next 7 days · need an instructor', 'SCR-20')}
          ${NG.metric('payment', 'Overdue invoices', f.gbp(330), '2 invoices · oldest 26 days', 'SCR-70')}
          ${NG.metric('clipboard_task', 'Driving tests this week', '1', 'George Hall today 15:40', 'SCR-40')}
        </div>
        <div class="two-col">
          <div class="col">
            ${NG.section({ title: "Today's lessons", flush: true, actions: `<a class="btn subtle small" href="#/SCR-20">Open schedule</a>`, body: NG.table({ caption: "Today's lessons", cols: [{ h: 'Time' }, { h: 'Learner' }, { h: 'Instructor' }, { h: 'Type', hide: 'md' }, { h: 'Status' }], rows }) + `<div class="pagination"><span>Showing 10 of 19</span><a class="ml-auto" href="#/SCR-20">View all</a></div>` })}
            ${NG.section({ title: 'Instructor utilisation this week', flush: true, body: NG.table({ caption: 'Utilisation', cols: [{ h: 'Instructor' }, { h: 'Booked', end: true }, { h: 'Available', end: true }, { h: 'Utilisation' }], rows: D.instructors.map((i) => [i.name, `${i.week} h`, `${i.cap} h`,
              i.absence ? `<span class="muted">${i.absence}</span>` : `<span class="row" style="flex-wrap:nowrap"><span class="progress thick" style="width:120px" role="progressbar" aria-label="${i.name} utilisation" aria-valuenow="${Math.round((i.week / i.cap) * 100)}"><div style="width:${Math.round((i.week / i.cap) * 100)}%"></div></span><span class="num">${Math.round((i.week / i.cap) * 100)}%</span></span>`]) }) })}
          </div>
          ${NG.section({ title: 'Needs attention', flush: true, badge: '<span class="counter">7</span>', body: `<ul class="list-plain">
            <li>${NG.icon('person_star', 'li-icon')}<span class="li-main"><a href="#/SCR-20">3 lessons without an instructor</a><span class="caption muted">Thu 12 – Mon 16 Nov</span></span></li>
            <li>${NG.icon('vehicle_car', 'li-icon')}<span class="li-main"><a href="#/SCR-61">YR22 HDF MOT due</a><span class="caption muted">22 Nov 2026</span></span>${NG.toneBadge('warning', 'In 12 days', true)}</li>
            <li>${NG.icon('vehicle_car', 'li-icon')}<span class="li-main"><a href="#/SCR-61">DA19 RTY MOT expired</a><span class="caption muted">Off road · clutch replacement</span></span>${NG.toneBadge('danger', 'Expired', true)}</li>
            <li>${NG.icon('person_clock', 'li-icon')}<span class="li-main"><a href="#/SCR-22">Jack Wilson 09:15 not recorded</a><span class="caption muted">Sam Patel · ended 10:15</span></span></li>
            <li>${NG.icon('payment', 'li-icon')}<span class="li-main"><a href="#/SCR-70">2 overdue invoices</a><span class="caption muted">Amaya Silva, Sophie Clarke · ${f.gbp(330)}</span></span></li>
            <li>${NG.icon('hat_graduation', 'li-icon')}<span class="li-main"><a href="#/SCR-51">Sam Patel ADI badge expires</a><span class="caption muted">20 Dec 2026</span></span>${NG.toneBadge('warning', 'In 40 days', true)}</li>
            <li>${NG.icon('calendar_clock', 'li-icon')}<span class="li-main"><a href="#/SCR-51">Absence request: Ayesha Khan</a><span class="caption muted">Fri 27 Nov · awaiting approval</span></span></li>
          </ul>` })}
        </div>`;
    },
  });

  /* ---------------- Reception "Today" ---------------- */
  NG.screen({
    id: 'SCR-02', name: 'Today (reception)', group: 'Dashboards', nav: 'dashboard', roles: ['receptionist'],
    notes: { purpose: 'Front desk view: who is driving now, what is next, who to call.', stories: ['US-DSH-02'], points: ['Optimised for phone calls: global search in the header finds any learner.', 'Primary action is "Book lesson"; register and record payment are one click away.', 'Balance flags show in the lesson list so the receptionist can mention them.'] },
    render() {
      const rows = D.lessonsToday.slice().sort((a, b) => a.start.localeCompare(b.start)).filter((l) => l.status !== 'completed').map((l) => {
        const lr = D.byName(l.learner);
        return { cls: l.status === 'inProgress' ? 'active' : '', cells: [`<span class="num">${f.time(l.start)}</span>`, `<a class="cell-link" href="#/SCR-11">${l.learner}</a>`, insName(l.ins), `<span class="caption">${l.pickup}</span>`,
          lr && lr.balance ? `<span class="num">${f.gbp(lr.balance)}</span> ${lr.overdue ? NG.badge('payment', 'overdue', true) : ''}` : NG.empty, NG.badge('lesson', l.status), NG.rowMenu(l.learner)] };
      });
      return `${NG.pageHeader({ title: 'Today', desc: 'Tuesday 10 Nov 2026 · 19 lessons · 6 completed', actions: NG.btn('Register learner', { icon: 'person_add', attrs: { 'data-go': 'SCR-12' } }) + NG.btn('Record payment', { icon: 'payment', attrs: { 'data-go': 'SCR-73' } }) + NG.btn('Book lesson', { kind: 'primary', icon: 'calendar_add', attrs: { 'data-go': 'SCR-21' } }) })}
        <div class="metrics">
          ${NG.metric('calendar_ltr', 'Still to come today', '13', '3 in progress now', 'SCR-20')}
          ${NG.metric('calendar_add', 'Free slots today', '7', 'Sarah Mitchell has most (3)', 'SCR-20')}
          ${NG.metric('payment', 'Payments today', f.gbp(0), 'No payments recorded yet', 'SCR-72')}
          ${NG.metric('person_add', 'New enquiries', '1', 'James Whitaker · yesterday', 'SCR-10')}
        </div>
        <div class="two-col">
          ${NG.section({ title: 'Upcoming and in progress', flush: true, actions: `<a class="btn subtle small" href="#/SCR-20">Open schedule</a>`, body: NG.table({ caption: 'Upcoming lessons', cols: [{ h: 'Time' }, { h: 'Learner' }, { h: 'Instructor' }, { h: 'Pick-up', hide: 'md' }, { h: 'Balance', end: true }, { h: 'Status' }, { h: '<span class="sr-only">Actions</span>', cls: 'rowact' }], rows }) })}
          <div class="col">
            ${NG.section({ title: 'Learners to call', flush: true, body: `<ul class="list-plain">
              <li>${NG.avatar('Amaya Silva', 'md')}<span class="li-main"><a href="#/SCR-11">Amaya Silva</a><span class="caption muted">${f.gbp(120)} overdue since 28 Oct</span></span>${NG.btn('Call', { kind: 'subtle', small: true, icon: 'call' })}</li>
              <li>${NG.avatar('Sophie Clarke', 'md')}<span class="li-main"><a href="#/SCR-11">Sophie Clarke</a><span class="caption muted">${f.gbp(210)} overdue · on hold</span></span>${NG.btn('Call', { kind: 'subtle', small: true, icon: 'call' })}</li>
              <li>${NG.avatar('James Whitaker', 'md')}<span class="li-main"><a href="#/SCR-11">James Whitaker</a><span class="caption muted">New enquiry · wants manual lessons</span></span>${NG.btn('Call', { kind: 'subtle', small: true, icon: 'call' })}</li></ul>` })}
            ${NG.section({ title: 'Driving tests today', flush: true, body: `<ul class="list-plain"><li>${NG.icon('clipboard_task', 'li-icon')}<span class="li-main"><span><b>George Hall</b> · 15:40 Northside</span><span class="caption muted">Sam Patel · PF21 XKD · warm-up from 14:30</span></span>${NG.badge('test', 'booked', true)}</li></ul>` })}
          </div>
        </div>`;
    },
  });

  /* ---------------- Instructor "My day" ---------------- */
  NG.screen({
    id: 'SCR-03', name: 'My day (instructor)', group: 'Dashboards', nav: 'dashboard', roles: ['instructor'],
    notes: { purpose: "An instructor's lessons for today, tablet-first, for use between lessons.", stories: ['US-DSH-03', 'US-ATT-01'], points: ['Touch targets are 40px (patterns §10).', 'Instructors see a balance flag, never amounts (BR-21).', 'Unrecorded past lessons are surfaced first with a direct "Record" action.', 'Try it at tablet width (1024) and phone width (390).'] },
    render() {
      const mine = D.lessonsToday.filter((l) => l.ins === 'I-025');
      const item = (l) => {
        const end = new Date(new Date(l.start).getTime() + l.mins * 60000);
        const past = end < D.now, current = new Date(l.start) <= D.now && end > D.now;
        const lr = D.byName(l.learner);
        const action = l.note === 'Not recorded yet' ? NG.btn('Record', { kind: 'primary', touch: true, attrs: { 'data-go': 'SCR-22' } })
          : past || current ? NG.btn(current ? 'Record' : 'View record', { touch: true, attrs: { 'data-go': 'SCR-22' } }) : NG.btn('Details', { touch: true, attrs: { 'data-go': 'SCR-22' } });
        return `<li class="day-item ${past ? 'past' : ''} ${current ? 'current' : ''}"><div class="t">${f.time(l.start)}<small>${NG.fmt.mins(l.mins)}</small></div>
          <div class="stack" style="gap:2px"><div class="row"><b>${l.learner}</b>${NG.badge('lesson', l.note === 'Not recorded yet' ? 'scheduled' : l.status, true)}${lr && lr.balance ? NG.toneBadge('warning', 'Balance outstanding', true) : ''}</div>
          <span class="caption">${l.type} · ${NG.icon('location', 'ic16')} ${l.pickup}</span>${l.note && l.note !== 'Balance outstanding' ? `<span class="caption muted">${l.note}</span>` : ''}</div>${action}</li>`;
      };
      return `${NG.pageHeader({ title: 'My day', desc: 'Tuesday 10 Nov · 6 lessons · PF21 XKD', actions: NG.btn('My week', { icon: 'calendar_ltr', attrs: { 'data-go': 'SCR-20' } }) })}
        ${NG.msg('warning', 'Lesson not recorded.', ' Jack Wilson at 09:15 needs attendance and progress.', NG.btn('Record now', { small: true, attrs: { 'data-go': 'SCR-22' } }))}
        <div class="two-col">
          ${NG.section({ title: 'Lessons', flush: true, body: `<ol class="day-list">${mine.map(item).join('')}</ol>` })}
          <div class="col">
            ${NG.section({ title: 'Driving test today', body: `<div class="row"><b>George Hall</b>${NG.badge('test', 'booked', true)}</div><span class="caption">15:40 · Northside test centre · warm-up from 14:30</span>${NG.dlist([['Ref', '<span class="mono">58213907</span>'], ['Car', 'PF21 XKD']])}` })}
            ${NG.section({ title: 'This week', flush: true, body: NG.table({ caption: 'This week', cols: [{ h: 'Day' }, { h: 'Lessons', end: true }], rows: [['Mon 9 Nov', '6'], ['<b>Tue 10 Nov (today)</b>', '<b>6</b>'], ['Wed 11 Nov', '7'], ['Thu 12 Nov', '5'], ['Fri 13 Nov', '4']] }) })}
          </div>
        </div>`;
    },
  });
})();
