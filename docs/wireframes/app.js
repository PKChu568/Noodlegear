/* Noodlegear wireframes: prototype runtime (routing, shell, prototype bar, overlays).
   Static prototype only. Not application code. */
(function () {
  'use strict';
  const { NG } = window; const D = NG.data;
  const $ = (s, r = document) => r.querySelector(s);
  const ROLES = [['owner', 'Owner'], ['admin', 'Admin'], ['receptionist', 'Receptionist'], ['instructor', 'Instructor']];
  const DASH = { owner: 'SCR-01', admin: 'SCR-01', receptionist: 'SCR-02', instructor: 'SCR-03' };
  const ALL = ['owner', 'admin', 'receptionist', 'instructor'], OFFICE = ['owner', 'admin', 'receptionist'], MGMT = ['owner', 'admin'];

  /* Navigation: order and grouping from docs/patterns.md §2; visibility by role (BR-23) */
  const NAV = [
    { key: 'dashboard', label: (r) => ({ receptionist: 'Today', instructor: 'My day' }[r] || 'Dashboard'), icon: 'board', go: (r) => DASH[r], roles: ALL },
    { section: 'Learning' },
    { key: 'learners', label: (r) => (r === 'instructor' ? 'My learners' : 'Learners'), icon: 'people_community', go: () => 'SCR-10', roles: ALL },
    { key: 'lessons', label: (r) => (r === 'instructor' ? 'My schedule' : 'Lessons'), icon: 'calendar_ltr', go: () => 'SCR-20', roles: ALL },
    { key: 'tests', label: () => 'Driving tests', icon: 'clipboard_task', go: () => 'SCR-40', roles: ALL },
    { key: 'progress', label: () => 'Attendance & progress', icon: 'person_clock', go: () => 'SCR-30', roles: OFFICE },
    { section: 'Operations' },
    { key: 'instructors', label: (r) => (r === 'instructor' ? 'My availability' : 'Instructors'), icon: 'person_star', go: (r) => (r === 'instructor' ? 'SCR-51' : 'SCR-50'), roles: ALL },
    { key: 'vehicles', label: () => 'Vehicles', icon: 'vehicle_car', go: () => 'SCR-60', roles: ALL },
    { section: 'Finance', roles: OFFICE },
    { key: 'payments', label: () => 'Payments', icon: 'payment', go: () => 'SCR-72', roles: OFFICE },
    { key: 'invoices', label: () => 'Invoices', icon: 'document_text', go: () => 'SCR-70', roles: OFFICE, count: 2 },
    { key: 'reports', label: () => 'Reports', icon: 'data_pie', go: () => 'SCR-80', roles: MGMT },
    { divider: true, roles: MGMT },
    { key: 'settings', label: () => 'Settings', icon: 'settings', go: () => 'SCR-90', roles: MGMT },
  ];

  const store = { get(k, d) { try { return localStorage.getItem('ngwf-' + k) || d; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem('ngwf-' + k, v); } catch (e) { /* ignore */ } } };
  const S = { role: store.get('role', 'owner'), theme: store.get('theme', 'light'), notes: store.get('notes', 'closed') === 'open', state: null, navOpen: true };
  const parse = () => { const [p, q] = (location.hash.replace(/^#\/?/, '') || 'index').split('?'); const [id, tab] = p.split('/'); const qs = new URLSearchParams(q || ''); return { id: NG.screens[id] ? id : 'index', tab, role: qs.get('role'), state: qs.get('state') }; };

  /* ---------- Prototype bar ---------- */
  function protoBar(route, scr) {
    const groups = {}; NG.order.forEach((id) => { const s = NG.screens[id]; const g = s.group || 'Start'; (groups[g] = groups[g] || []).push(s); });
    const states = scr.states || [];
    return `<b class="hide-sm">Noodlegear wireframes</b>
      <a href="#/" style="color:#f0f0f0" class="hide-sm">Catalogue</a>
      <label class="lbl hide-md" for="pbScreen">Screen</label>
      <select id="pbScreen" aria-label="Screen">${Object.entries(groups).map(([g, l]) => `<optgroup label="${g}">${l.map((s) => `<option value="${s.id}" ${s.id === route.id ? 'selected' : ''}>${s.id === 'index' ? '' : s.id + ' · '}${s.name}</option>`).join('')}</optgroup>`).join('')}</select>
      <span class="lbl hide-md">Role</span><span class="seg hide-sm" role="group" aria-label="Role">${ROLES.map(([k, l]) => `<button type="button" data-role="${k}" aria-pressed="${k === S.role}">${l}</button>`).join('')}</span>
      ${states.length ? `<label class="lbl hide-md" for="pbState">State</label><select id="pbState" aria-label="State">${states.map(([k, l]) => `<option value="${k}" ${k === S.state ? 'selected' : ''}>${l}</option>`).join('')}</select>` : ''}
      <span class="grow"></span>
      <button type="button" id="pbTheme" aria-label="Switch to ${S.theme === 'dark' ? 'light' : 'dark'} theme">${S.theme === 'dark' ? 'Light' : 'Dark'}</button>
      <button type="button" id="pbNotes" aria-pressed="${S.notes}" aria-controls="notes">Notes</button>`;
  }

  /* ---------- App shell ---------- */
  function shell(scr, body) {
    const u = D.users[S.role];
    const nav = NAV.filter((n) => !n.roles || n.roles.includes(S.role)).map((n) => {
      if (n.section) return `<div class="nav-section">${n.section}</div>`;
      if (n.divider) return '<div class="nav-divider" role="separator"></div>';
      const cur = scr.nav === n.key;
      return `<a class="nav-item" href="#/${n.go(S.role)}" ${cur ? 'aria-current="page"' : ''}>${NG.icon(n.icon)}${n.label(S.role)}${n.count ? `<span class="nav-count" aria-label="${n.count} overdue">${n.count}</span>` : ''}</a>`;
    }).join('');
    return `<a class="skip" href="#main" id="skipLink">Skip to main content</a>
      <header class="header" role="banner">
        <button class="btn subtle icon" id="navToggle" aria-label="Toggle navigation" aria-expanded="${S.navOpen}">${NG.icon('navigation')}</button>
        <div class="brand"><span class="brand-mark" aria-hidden="true">N</span>Noodlegear</div>
        <span class="brand-divider hide-sm" aria-hidden="true"></span><span class="muted hide-sm">Northside Driving School</span>
        <span class="header-spacer"></span>
        <div class="input hide-md" style="width:360px">${NG.icon('search', 'affix')}<input aria-label="Search learners, instructors, bookings" placeholder="Search learners, instructors, bookings"></div>
        <span class="header-spacer hide-md"></span>
        ${NG.btn('Notifications', { kind: 'subtle', iconOnly: true, icon: 'alert' })}${NG.btn('Help', { kind: 'subtle', iconOnly: true, icon: 'question_circle' })}
        ${MGMT.includes(S.role) ? `<a class="btn subtle icon hide-sm" href="#/SCR-90" aria-label="Settings" title="Settings">${NG.icon('settings')}</a>` : ''}
        <a href="#/SCR-00" class="avatar md" title="${u.name} · ${u.role} (sign out)" aria-label="${u.name}, ${u.role}. Sign out">${NG.initials(u.name)}</a>
      </header>
      <div class="layout">
        <nav class="sidebar" id="sideNav" aria-label="Main" ${S.navOpen ? '' : 'hidden'}>${nav}</nav>
        <main id="main" tabindex="-1"><div class="content">${body}</div></main>
      </div>`;
  }

  function noPermission() {
    return NG.emptyState('noPermission', "You don't have access to this page", `The ${D.users[S.role].role} role can't open it. Ask the owner or an administrator if you need access.`, `<a class="btn" href="#/${DASH[S.role]}">Go to ${S.role === 'instructor' ? 'My day' : 'dashboard'}</a>`);
  }

  /* ---------- Notes (annotations) ---------- */
  function notes(scr) {
    const n = scr.notes || {};
    return `<h2>${scr.id === 'index' ? '' : `<span class="wf-tag">${scr.id}</span><br>`}${scr.name}</h2>
      <p>${n.purpose || ''}</p>
      ${scr.roles ? `<h3>ROLES</h3><div>${scr.roles.map((r) => `<span class="chip">${D.users[r].role}</span>`).join('')}</div>` : ''}
      ${n.stories ? `<h3>USER STORIES</h3><div>${n.stories.map((s) => `<span class="chip">${s}</span>`).join('')}</div>` : ''}
      ${n.points ? `<h3>BEHAVIOUR AND NOTES</h3><ol>${n.points.map((p) => `<li>${p}</li>`).join('')}</ol>` : ''}
      <h3>SOURCES</h3><ul><li><a href="../requirements/screen-inventory.md">Screen inventory</a></li><li><a href="../requirements/user-stories.md">User stories</a></li><li><a href="../patterns.md">Patterns</a></li></ul>`;
  }

  /* ---------- Overlays ---------- */
  const dlg = $('#dlg'), panelEl = $('#panel'), backdrop = $('#panelBackdrop');
  let panelReturn = null;
  function openDialog(def, parentHash) {
    dlg.className = def.size === 'small' ? 'small' : def.size === 'large' ? 'large' : '';
    dlg.setAttribute('role', def.alert ? 'alertdialog' : 'dialog');
    dlg.innerHTML = `<form method="dialog" class="dlg" onsubmit="return false">${def.html}</form>`;
    dlg.onclose = () => history.replaceState(null, '', parentHash);
    dlg.oncancel = null;
    dlg.onclick = def.alert ? null : (e) => { if (e.target === dlg) dlg.close(); };
    dlg.showModal();
    bind(dlg);
    const af = dlg.querySelector('[autofocus]'); if (af) af.focus();
  }
  function openPanel(p, trigger) {
    panelReturn = trigger;
    document.querySelectorAll('tr.active').forEach((t) => t.classList.remove('active'));
    if (trigger) trigger.classList.add('active');
    panelEl.innerHTML = `<div class="drawer-header">${NG.avatar(p.avatar, 'lg')}<div style="min-width:0"><h2 id="panelTitle">${p.title}</h2><div class="caption muted row" style="margin-top:2px">${p.sub}</div></div>
      <div class="acts">${p.headerActions || ''}<button class="btn subtle icon" aria-label="Close" data-close>${NG.icon('dismiss')}</button></div></div>
      <div class="drawer-body">${p.body}</div><div class="drawer-footer">${p.footer}</div>`;
    panelEl.hidden = false; backdrop.hidden = false; bind(panelEl);
    panelEl.querySelector('[data-close]').focus();
  }
  function closePanel() { if (panelEl.hidden) return; panelEl.hidden = true; backdrop.hidden = true; if (panelReturn) { panelReturn.classList.remove('active'); panelReturn.focus(); } }
  backdrop.addEventListener('click', closePanel);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closePanel(); document.querySelectorAll('.menu[id]').forEach((m) => { m.hidden = true; }); }
    if (e.key === 'Tab' && !panelEl.hidden) { const f = [...panelEl.querySelectorAll('button, a[href], input, select, textarea')].filter((x) => !x.disabled); if (!f.length) return; if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); } }
  });
  function toast(kind, title, body) {
    const ic = { success: 'checkmark_circle', error: 'error_circle', warning: 'warning', info: 'info' }[kind];
    const t = document.createElement('div'); t.className = `toast ${kind}`; t.setAttribute('role', 'status');
    t.innerHTML = `${NG.icon(ic)}<span class="t-title">${title}</span><button class="btn subtle small icon" aria-label="Dismiss">${NG.icon('dismiss', 'ic16')}</button>${body ? `<span class="t-body">${body}</span>` : ''}`;
    t.querySelector('button').onclick = () => t.remove(); $('#toaster').append(t); if (kind !== 'error') setTimeout(() => t.remove(), 5000);
  }

  /* ---------- Generic bindings ---------- */
  function bind(root) {
    root.querySelectorAll('[data-go]').forEach((el) => {
      const go = () => { const target = el.dataset.go; if (dlg.open) dlg.close(); closePanel(); location.hash = '#/' + target; };
      el.addEventListener('click', (e) => { e.preventDefault(); go(); });
      if (el.getAttribute('role') === 'button' || el.getAttribute('role') === 'menuitem') { el.tabIndex = el.tabIndex < 0 ? 0 : el.tabIndex; el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } }); }
    });
    root.querySelectorAll('[data-toast]').forEach((el) => el.addEventListener('click', () => { const [k, t, b] = el.dataset.toast.split('|'); toast(k, t, b); }));
    root.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', () => { if (dlg.open && dlg.contains(el)) dlg.close(); else closePanel(); }));
    root.querySelectorAll('[data-menu]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); const m = document.getElementById(b.dataset.menu); m.hidden = !m.hidden; b.setAttribute('aria-expanded', String(!m.hidden)); if (!m.hidden) { const first = m.querySelector('[role="menuitem"]'); if (first) { first.tabIndex = 0; first.focus(); } } }));
    root.querySelectorAll('[data-tab-go]').forEach((b) => b.addEventListener('click', () => { location.hash = `#/${parse().id}/${b.dataset.tabGo}`; }));
    const tabs = [...root.querySelectorAll('#pageTabs [data-tab]')];
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => { location.hash = `#/${parse().id}/${t.dataset.tab}`; });
      t.addEventListener('keydown', (e) => { const n = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (n) { e.preventDefault(); tabs[(i + n + tabs.length) % tabs.length].focus(); } });
    });
    root.querySelectorAll('.level-pick').forEach((g) => g.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => g.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b))))));
  }
  document.addEventListener('click', () => document.querySelectorAll('.menu[id]').forEach((m) => { m.hidden = true; }));

  /* ---------- Render ---------- */
  let lastId = null;
  function render() {
    const route = parse();
    if (route.role && D.users[route.role]) { S.role = route.role; store.set('role', S.role); }
    let scr = NG.screens[route.id];
    if (route.id !== lastId) S.state = route.state || (scr.states ? scr.states[0][0] : null);
    else if (route.state) S.state = route.state;
    lastId = route.id;
    document.documentElement.dataset.theme = S.theme;
    if (dlg.open) { dlg.onclose = null; dlg.close(); }
    closePanel();

    const host = scr.parent ? NG.screens[scr.parent] : scr;
    const allowed = scr.roles.includes(S.role);
    const ctx = { role: S.role, state: S.state, tab: route.tab, panel: openPanel, toast };
    let body;
    if (host.shell === false) body = host.render(ctx);
    else body = shell(host, allowed ? host.render({ ...ctx, state: scr.parent ? null : S.state }) : noPermission());

    $('#proto').innerHTML = protoBar(route, scr);
    const app = $('#app'); app.innerHTML = body; app.classList.toggle('notes-open', S.notes);
    app.style.overflowY = host.shell === false ? 'auto' : '';
    const nt = $('#notes'); nt.hidden = !S.notes; nt.innerHTML = notes(scr);
    document.title = `${scr.id === 'index' ? '' : scr.id + ' '}${scr.name} · Noodlegear wireframes`;
    bind(app);
    if (allowed && host.after) host.after(ctx, app);
    if (allowed && scr.dialog) openDialog(scr.dialog(ctx), '#/' + scr.parent);
    const main = $('#main'); if (main) main.scrollTop = 0;

    // prototype bar events
    $('#pbScreen').onchange = (e) => { location.hash = '#/' + e.target.value; };
    document.querySelectorAll('[data-role]').forEach((b) => { b.onclick = () => { S.role = b.dataset.role; store.set('role', S.role); const cur = NG.screens[parse().id]; if (cur.nav === 'dashboard') location.hash = '#/' + DASH[S.role]; else render(); }; });
    const st = $('#pbState'); if (st) st.onchange = (e) => { S.state = e.target.value; render(); };
    $('#pbTheme').onclick = () => { S.theme = S.theme === 'dark' ? 'light' : 'dark'; store.set('theme', S.theme); render(); };
    $('#pbNotes').onclick = () => { S.notes = !S.notes; store.set('notes', S.notes ? 'open' : 'closed'); render(); };
    const nb = $('#navToggle'); if (nb) nb.onclick = () => { S.navOpen = !S.navOpen; const sn = $('#sideNav'); sn.hidden = !S.navOpen; nb.setAttribute('aria-expanded', String(S.navOpen)); };
    const sk = $('#skipLink'); if (sk) sk.onclick = (e) => { e.preventDefault(); $('#main').focus(); };
  }

  if (window.matchMedia('(max-width: 1023px)').matches) S.navOpen = false;
  window.addEventListener('hashchange', render);
  render();
})();
