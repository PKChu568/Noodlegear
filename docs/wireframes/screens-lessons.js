/* Screens: schedule, booking, lesson record, attendance & progress */
(function () {
  'use strict';
  const { NG } = window; const D = NG.data; const f = NG.fmt;
  const START = 8, END = 19, HOUR = 48; // grid 08:00–19:00, 48px per hour (P-02)
  const hours = { 'I-021': [8, 18], 'I-022': [8.5, 18], 'I-023': [9, 17.5], 'I-024': null, 'I-025': [8, 18.5] };
  const toH = (iso) => { const d = new Date(iso); return d.getHours() + d.getMinutes() / 60; };
  const hhmm = (h) => `${String(Math.floor(h)).padStart(2, '0')}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;

  function scheduleGrid(role) {
    const cols = role === 'instructor' ? D.instructors.filter((i) => i.id === 'I-025') : D.instructors;
    const times = Array.from({ length: END - START }, (_, i) => `<div class="sched-time">${i ? hhmm(START + i) : ''}</div>`).join('');
    const col = (ins) => {
      const wh = hours[ins.id];
      const lessons = D.lessonsToday.filter((l) => l.ins === ins.id);
      let html = '';
      if (!wh) html += `<div class="sched-off" style="top:0;bottom:0"><span>${ins.absence}</span></div>`;
      else {
        if (wh[0] > START) html += `<div class="sched-off" style="top:0;height:${(wh[0] - START) * HOUR}px"><span>Not working</span></div>`;
        if (wh[1] < END) html += `<div class="sched-off" style="top:${(wh[1] - START) * HOUR}px;bottom:0"><span>Not working</span></div>`;
        for (let h = Math.max(wh[0], 11.5); h < wh[1]; h += 0.5) { // free slots after "now"
          const busy = lessons.some((l) => { const s = toH(l.start); return h < s + l.mins / 60 && h + 0.5 > s; });
          if (!busy) html += `<div class="slot" role="button" tabindex="0" aria-label="Book ${ins.name} at ${hhmm(h)}" data-go="SCR-21" style="top:${(h - START) * HOUR}px"></div>`;
        }
      }
      lessons.forEach((l) => {
        const s = toH(l.start); const test = l.type.startsWith('Test day');
        html += `<button class="lesson st-${test ? 'test' : l.status}" data-go="${l.status === 'completed' || l.status === 'inProgress' || l.note === 'Not recorded yet' ? 'SCR-22' : 'SCR-23'}" style="top:${(s - START) * HOUR + 1}px;height:${(l.mins / 60) * HOUR - 2}px"
          aria-label="${l.learner}, ${f.time(l.start)}, ${l.type}, ${NG.status.lesson[l.status][0]}"><span class="l-name">${l.learner}</span><span class="l-meta">${f.time(l.start)} · ${l.type}</span>${l.mins >= 90 ? `<span class="l-meta">${l.pickup}</span>` : ''}</button>`;
      });
      return `<div class="sched-col ${wh ? '' : 'unavailable'}" style="height:${(END - START) * HOUR}px">${html}</div>`;
    };
    return `<div class="sched" style="grid-template-columns:56px repeat(${cols.length}, minmax(168px, 1fr))">
        <div class="sched-head" style="background:var(--colorNeutralBackground3)"></div>
        ${cols.map((i) => `<div class="sched-head">${NG.avatar(i.name, 'md')}<span class="cell-two"><b>${i.name}</b><span class="meta">${i.car} · ${i.trans}</span></span></div>`).join('')}
        <div class="sched-times" style="padding-top:8px">${times}</div>
        ${cols.map(col).join('')}
        <div class="now-line" aria-hidden="true" style="top:${48 + 8 + (11 + 20 / 60 - START) * HOUR}px;grid-column:1/-1"></div>
      </div>`;
  }

  /* ---------------- SCR-20 Schedule ---------------- */
  NG.screen({
    id: 'SCR-20', name: 'Schedule', group: 'Lessons', nav: 'lessons', roles: ['owner', 'admin', 'receptionist', 'instructor'],
    notes: { purpose: 'Day schedule with one column per instructor; find a free slot and book in it.', stories: ['US-LES-01', 'US-LES-02', 'US-LES-04', 'US-LES-10'], points: ['Proposed grid metrics P-02: 08:00–19:00, 48px per hour.', 'Hover or Tab to a free slot and press Enter to book with instructor and time pre-filled.', 'Grey = not working or absent (Liam Turner on leave).', 'Red line = now (11:20). Completed lessons are muted; no-shows are red; test days are orange.', 'Click a past lesson to open its record (SCR-22); a future one to cancel or reschedule (SCR-23).', 'Every drag action needs a non-drag alternative (WCAG 2.5.7): use Reschedule.'] },
    render(ctx) {
      const ins = ctx.role === 'instructor';
      return `${NG.pageHeader({ title: ins ? 'My schedule' : 'Schedule', desc: ins ? 'Sam Patel · PF21 XKD' : '19 lessons today · 3 unassigned this week', actions: ins ? NG.btn('Request time off', { icon: 'calendar_clock', attrs: { 'data-go': 'SCR-51' } }) : NG.btn('Book series', { icon: 'calendar_clock' }) + NG.btn('Book lesson', { kind: 'primary', icon: 'calendar_add', attrs: { 'data-go': 'SCR-21' } }) })}
        <section class="surface" aria-label="Schedule">
          <div class="sched-toolbar">
            ${NG.btn('Today', { small: true })}${NG.btn('Previous day', { kind: 'subtle', small: true, iconOnly: true, icon: 'chevron_left' })}${NG.btn('Next day', { kind: 'subtle', small: true, iconOnly: true, icon: 'chevron_right' })}
            <b style="margin:0 8px">Tuesday 10 Nov 2026</b>
            <span class="seg-choice" role="radiogroup" aria-label="View" style="gap:0">${['Day', 'Week', 'List'].map((v, i) => `<label style="height:24px;padding:0 10px;border-radius:${i === 0 ? '4px 0 0 4px' : i === 2 ? '0 4px 4px 0' : '0'};margin-left:-1px"><input type="radio" name="view" ${i === 0 ? 'checked' : ''} class="sr-only">${v}</label>`).join('')}</span>
            <span class="ml-auto row">${ins ? '' : NG.selectBox('Instructors', ['All instructors', 'Manual only', 'Automatic only'], { cls: 'filter' })}${NG.btn('Show cancelled', { kind: 'subtle', small: true })}</span>
          </div>
          <div class="table-wrap" style="max-height:calc(100vh - 290px);overflow:auto">${scheduleGrid(ctx.role)}</div>
          <div class="pagination"><div class="legend">
            <span><i style="border-color:var(--colorCompoundBrandStroke);background:var(--colorBrandBackground2)"></i>Scheduled</span>
            <span><i style="border-color:var(--colorStatusSuccessBackground3);background:var(--colorNeutralBackground3)"></i>Completed</span>
            <span><i style="border-color:var(--colorStatusDangerBackground3);background:var(--colorStatusDangerBackground1)"></i>No-show</span>
            <span><i style="border-color:var(--colorStatusWarningBackground3);background:var(--colorStatusWarningBackground1)"></i>Driving test</span>
            <span><i style="border-color:transparent;background:var(--colorNeutralBackground3)"></i>Not working</span></div></div>
        </section>`;
    },
  });

  /* ---------------- SCR-21 Book lesson (dialog) ---------------- */
  NG.screen({
    id: 'SCR-21', name: 'Book lesson', group: 'Lessons', nav: 'lessons', parent: 'SCR-20', roles: ['owner', 'admin', 'receptionist'],
    states: [['default', 'Ready to book'], ['clash', 'Double-booking clash'], ['credit', 'Uses package credit']],
    notes: { purpose: 'Book a lesson in one dialog, usually while the learner is on the phone.', stories: ['US-LES-03', 'US-LES-05', 'US-LES-06', 'US-LES-07'], points: ['Lesson type sets duration and price; instructor sets the default vehicle.', 'BR-01: clashes are blocked and the next free slots are suggested. The database enforces it too.', 'Overdue balance is a warning, not a block (pending Q-03).', 'Shows how the lesson will be paid: pay as you go or package credit.', 'Learner is a searchable combobox, not a separate picker dialog.'] },
    dialog(ctx) {
      const clash = ctx.state === 'clash', credit = ctx.state === 'credit';
      const learner = credit ? 'Daniel Okafor · L-10263' : 'Amaya Silva · L-10234';
      return { size: 'medium', html: `
        <div class="dlg-title">Book lesson${NG.btn('Close', { kind: 'subtle', iconOnly: true, icon: 'dismiss', attrs: { 'data-close': '' } })}</div>
        <div class="dlg-content">
          ${clash ? NG.msg('error', 'Ruwan Fernando is already booked.', ' Daniel Okafor has a Motorway lesson from 14:00 to 16:00.', '') + `<div class="row"><span class="caption muted">Next free:</span>${NG.btn('Ruwan · 16:00', { small: true })}${NG.btn('Sarah Mitchell · 14:00', { small: true })}${NG.btn('Ruwan · Wed 14:00', { small: true })}</div>` : ''}
          ${!credit && !clash ? NG.msg('warning', '', `Amaya Silva has ${f.gbp(120)} overdue. You can still book.`) : ''}
          <div class="form-grid">
            ${NG.field('Learner', `<div class="input">${NG.icon('search', 'ic16 affix')}<input id="%ID%" value="${learner}" role="combobox" aria-expanded="false"></div>`, { req: true, full: true })}
            ${NG.field('Lesson type', NG.select(D.lessonTypes.map((t) => [t[0], `${t[0]} · ${f.mins(t[1])} · ${f.gbp(t[2])}`]), credit ? 'Double lesson' : 'Standard lesson'), { req: true })}
            ${NG.field('Instructor', NG.select(D.instructors.filter((i) => i.id !== 'I-024').map((i) => i.name), credit ? 'Ruwan Fernando' : 'Ruwan Fernando', { error: clash }), { req: true })}
            ${NG.field('Date', NG.date('Tue 10 Nov 2026'), { req: true })}
            ${NG.field('Start time', NG.select(['14:00', '16:00', '17:00'], clash ? '14:00' : '17:00', { error: clash }), { req: true, error: clash ? 'Choose a time when Ruwan Fernando is free' : '', hint: clash ? '' : 'Ends 18:00' })}
            ${NG.field('Vehicle', NG.select(['LB73 WNZ · Ford Fiesta · Manual', 'MA23 PLE · Vauxhall Corsa · Manual'], 'LB73 WNZ · Ford Fiesta · Manual'), { hint: "Instructor's car" })}
            ${NG.field('Pick-up', NG.text('Northside College'))}
            ${NG.field('Repeat', NG.select(['Does not repeat', 'Weekly', 'Every 2 weeks'], 'Does not repeat'))}
            ${NG.field('Notes for instructor', NG.text('', { ph: 'Optional' }))}
          </div>
          <div class="msgbar" role="note">${NG.icon('receipt')}<div class="body">${credit ? '<b>Uses package credit.</b> 1 of 5 remaining lessons in "10 lessons" package.' : `<b>Pay as you go.</b> ${f.gbp(38)} is invoiced when the lesson is completed.`}</div></div>
          ${NG.check('Email confirmation to learner', true)}
        </div>
        <div class="dlg-actions">${NG.btn('Book lesson', { kind: 'primary', attrs: { 'data-toast': 'success|Lesson booked|Amaya Silva · Tue 10 Nov, 17:00 with Ruwan Fernando', 'data-close': '' } })}${NG.btn('Cancel', { attrs: { 'data-close': '' } })}</div>` };
    },
  });

  /* ---------------- SCR-23 Cancel lesson (dialog) ---------------- */
  NG.screen({
    id: 'SCR-23', name: 'Cancel lesson', group: 'Lessons', nav: 'lessons', parent: 'SCR-20', roles: ['owner', 'admin', 'receptionist'],
    states: [['late', 'Late cancellation (fee)'], ['default', 'Enough notice']],
    notes: { purpose: 'Cancel or reschedule a booked lesson with a reason, applying the fee policy.', stories: ['US-LES-07', 'US-LES-08'], points: ['Alert dialog: backdrop click does not close; focus starts on "Keep lesson".', 'Late-cancellation fee follows the policy in Settings (Q-03). Staff can waive it with a reason.', 'Package credit reserved for the lesson is released.', 'Reschedule opens Book lesson pre-filled (SCR-21).'] },
    dialog(ctx) {
      const late = ctx.state !== 'default';
      return { size: 'small', alert: true, html: `
        <div class="dlg-title">Cancel this lesson?</div>
        <div class="dlg-content">
          <p><b>Amaya Silva</b> · Standard lesson · Tue 10 Nov 2026, 16:30 with Ruwan Fernando.</p>
          ${NG.field('Reason', NG.select(['Learner request', 'Instructor unavailable', 'Vehicle unavailable', 'Weather', 'Other'], 'Learner request'), { req: true })}
          ${late ? NG.msg('warning', 'Less than 48 hours\' notice.', ` A late cancellation fee of ${f.gbp(38)} will be invoiced.`) + NG.check('Waive the fee', false) : NG.msg('info', '', 'More than 48 hours\' notice. No fee.')}
          ${NG.check('Email the learner', true)}
          <a href="#/SCR-21" class="caption">Reschedule instead</a>
        </div>
        <div class="dlg-actions">${NG.btn('Cancel lesson', { kind: 'primary', attrs: { 'data-toast': 'info|Lesson cancelled|Amaya Silva has been emailed.', 'data-close': '' } })}${NG.btn('Keep lesson', { attrs: { 'data-close': '', autofocus: '' } })}</div>` };
    },
  });

  /* ---------------- SCR-22 Lesson record ---------------- */
  NG.screen({
    id: 'SCR-22', name: 'Lesson record', group: 'Lessons', nav: 'lessons', roles: ['owner', 'admin', 'receptionist', 'instructor'],
    states: [['default', 'Recording'], ['saved', 'Already recorded']],
    notes: { purpose: 'Instructor records attendance, skills and a note in under a minute, on a tablet.', stories: ['US-ATT-01', 'US-ATT-02', 'US-ATT-03', 'US-LRN-07'], points: ['Large 40px choices for attendance (touch).', 'Skills covered last time are listed first; levels 1–5 as a segmented control.', 'Completed → invoice line or package credit is used (A-05, BR-32).', 'Editable until 7 days after the lesson (BR-05); after that Admin only.', 'When all skills reach 4+, a "Mark test ready" suggestion appears.'] },
    render(ctx) {
      const saved = ctx.state === 'saved';
      const covered = [['Junctions', 3], ['Roundabouts', 3], ['Mirrors and signals', 4], ['Hazard awareness', 2]];
      return `${NG.pageHeader({ crumbs: [['Schedule', 'SCR-20'], ['Jack Wilson · 09:15']], title: 'Jack Wilson · Tue 10 Nov, 09:15', meta: NG.badge('lesson', saved ? 'completed' : 'scheduled'), desc: 'Standard lesson · 60 min · Sam Patel · PF21 XKD · Pick-up: Home, NS2 7MN' })}
        ${saved ? NG.msg('success', 'Recorded.', ' Saved by Sam Patel at 10:22. You can change it until 17 Nov 2026.') : ''}
        <div class="two-col"><form class="surface pad stack" onsubmit="return false" aria-label="Lesson record" style="gap:24px">
          <fieldset><legend>Attendance</legend><div class="seg-choice" role="radiogroup">
            ${['Completed', 'Late', 'No-show', 'Excused'].map((a, i) => `<label><input type="radio" name="att" ${i === 0 ? 'checked' : ''}>${a}</label>`).join('')}</div></fieldset>
          <fieldset><legend>Skills covered</legend><p class="hint" style="margin:-8px 0 12px">1 Introduced · 2 Under instruction · 3 Prompted · 4 Seldom prompted · 5 Independent</p>
            <div class="stack">${covered.map(([s, lv]) => `<div class="row between" style="padding:6px 0;border-bottom:1px solid var(--colorNeutralStroke3)"><span>${s}<br><span class="caption muted">Last: level ${lv - (saved ? 0 : 1) || 1}</span></span>
              <span class="level-pick" role="group" aria-label="${s} level">${[1, 2, 3, 4, 5].map((n) => `<button type="button" aria-pressed="${n === lv}" aria-label="Level ${n}">${n}</button>`).join('')}</span></div>`).join('')}
            <div class="row">${NG.selectBox('Add a skill', ['Add a skill…', ...D.skills], { cls: 'filter' })}</div></div></fieldset>
          <fieldset><legend>Lesson note</legend>${NG.field('What went well and what to work on next', NG.textarea(saved ? 'Good observation at junctions. Roundabouts improving; still late signalling on exit.' : '', 'Visible to staff and the next instructor'), { full: true })}</fieldset>
          <div class="form-actions">${NG.btn(saved ? 'Save changes' : 'Save record', { kind: 'primary', touch: true, attrs: { 'data-toast': 'success|Lesson recorded|Jack Wilson · completed · 4 skills assessed' } })}${NG.btn('Cancel', { touch: true, attrs: { 'data-go': 'SCR-03' } })}</div>
        </form>
        <div class="col">
          ${NG.section({ title: 'Jack Wilson', body: `<div class="row">${NG.badge('learner', 'active')}<span class="caption muted mono">L-10298</span></div>${NG.dlist([['Lessons completed', '19'], ['Last driving test', 'Failed · 27 Oct 2026'], ['Test faults', '1 serious (junction observation), 6 minors']], true)}` })}
          ${NG.section({ title: 'Last lesson note', body: '<p>Work on observation at T-junctions before emerging. Practise the route around Eastfield test centre.</p><span class="caption muted">Sam Patel · 03 Nov 2026</span>' })}
          ${NG.section({ title: 'Progress', body: `<div class="progress-label"><span>Skills at level 4 or 5</span><span class="num muted">11 of 16</span></div><div class="progress thick" role="progressbar" aria-label="Skills at level 4 or 5" aria-valuenow="69"><div style="width:69%"></div></div>` })}
        </div></div>`;
    },
  });

  /* ---------------- SCR-30 Attendance & progress ---------------- */
  NG.screen({
    id: 'SCR-30', name: 'Attendance & progress', group: 'Lessons', nav: 'progress', roles: ['owner', 'admin', 'receptionist'],
    tabs: [['register', 'Attendance register'], ['progress', 'Learner progress']],
    notes: { purpose: 'Office view of unrecorded lessons and every learner\'s progress towards the test.', stories: ['US-ATT-04', 'US-ATT-05'], points: ['Register defaults to today and highlights lessons not recorded 2 hours after they end.', 'Progress is sorted by readiness so test-ready learners rise to the top.'] },
    render(ctx) {
      const tab = ctx.tab || 'register';
      const head = NG.pageHeader({ title: 'Attendance & progress', desc: 'Tuesday 10 Nov 2026', actions: NG.btn('Export', { icon: 'arrow_download' }), tabs: this.tabs, tab });
      if (tab === 'register') {
        const rows = D.lessonsToday.slice().sort((a, b) => a.start.localeCompare(b.start)).filter((l) => new Date(l.start) < D.now).map((l) => {
          const notRec = l.note === 'Not recorded yet';
          const att = l.status === 'completed' ? NG.badge('attendance', 'present') : l.status === 'noShow' ? NG.badge('attendance', 'absent') : notRec ? NG.toneBadge('warning', 'Not recorded') : '<span class="muted">In progress</span>';
          return [`<span class="num">${f.time(l.start)}</span>`, `<a class="cell-link" href="#/SCR-11">${l.learner}</a>`, D.instructor(l.ins).name, `<span class="hide-md">${l.type}</span>`, NG.badge('lesson', notRec ? 'scheduled' : l.status), att, notRec ? NG.btn('Record', { small: true, attrs: { 'data-go': 'SCR-22' } }) : NG.btn('View', { kind: 'subtle', small: true, attrs: { 'data-go': 'SCR-22' } })];
        });
        return head + NG.filterBar({ filters: [['Date', ['Today · 10 Nov 2026', 'Yesterday', 'This week']], ['Instructor', ['Instructor: All', ...D.instructors.map((i) => 'Instructor: ' + i.name)]], ['Recorded', ['Recorded: All', 'Not recorded only']]], count: '10 lessons so far · 1 not recorded' })
          + NG.section({ flush: true, label: 'Attendance register', body: NG.table({ caption: 'Attendance register', cols: [{ h: 'Time' }, { h: 'Learner' }, { h: 'Instructor' }, { h: 'Type', hide: 'md' }, { h: 'Lesson' }, { h: 'Attendance' }, { h: '<span class="sr-only">Actions</span>' }], rows }) });
      }
      const prog = [['George Hall', 'Sam Patel', 28, 16, 'testReady'], ['Oliver Bennett', 'Sarah Mitchell', 22, 15, 'testReady'], ['Hannah Lewis', 'Ruwan Fernando', 25, 14, 'testReady'], ['Jack Wilson', 'Sam Patel', 19, 11, 'active'], ['Noah Clarke', 'Sam Patel', 15, 7, 'active'], ['Amaya Silva', 'Ruwan Fernando', 14, 6, 'active'], ['Zara Ahmed', 'Ayesha Khan', 11, 5, 'active'], ['Ethan Brooks', 'Ruwan Fernando', 8, 3, 'active'], ['Priya Nair', 'Ayesha Khan', 6, 2, 'active']];
      return head + NG.filterBar({ search: 'Search learners', filters: [['Instructor', ['Instructor: All', ...D.instructors.map((i) => 'Instructor: ' + i.name)]], ['Readiness', ['Readiness: All', 'Test ready', 'Not ready']]], count: '9 learners' })
        + NG.section({ flush: true, label: 'Learner progress', body: NG.table({ caption: 'Learner progress', cols: [{ h: 'Learner', sort: 'desc' }, { h: 'Instructor', hide: 'sm' }, { h: 'Lessons', end: true, hide: 'md' }, { h: 'Skills at level 4+' }, { h: 'Status' }], rows: prog.map(([n, i, les, sk, st]) => [`<a class="cell-link" href="#/SCR-11">${n}</a>`, i, les,
          `<span class="row" style="flex-wrap:nowrap"><span class="progress thick ${sk === 16 ? 'success' : ''}" style="width:140px" role="progressbar" aria-label="${n} skills" aria-valuenow="${Math.round((sk / 16) * 100)}"><div style="width:${Math.round((sk / 16) * 100)}%"></div></span><span class="num">${sk} of 16</span></span>`, NG.badge('learner', st)]) }) });
    },
  });
})();
