/* Noodlegear wireframes: rendering helpers.
   Static prototype only. Not application code: the real UI uses Fluent UI React v9 (see AGENTS.md). */
(function () {
  'use strict';
  const NG = (window.NG = window.NG || {});
  NG.screens = {};
  NG.order = [];
  NG.screen = (def) => { NG.screens[def.id] = def; NG.order.push(def.id); };

  /* Status registry: copied from tokens/noodlegear.tokens.json → status.domains (source of truth). */
  NG.status = {
    learner: { enquiry: ['Enquiry', 'neutral'], active: ['Active', 'success'], onHold: ['On hold', 'warning'], testReady: ['Test ready', 'info'], passed: ['Passed', 'success'], withdrawn: ['Withdrawn', 'neutral'] },
    instructor: { available: ['Available', 'success'], onLesson: ['On lesson', 'info'], onLeave: ['On leave', 'neutral'], inactive: ['Inactive', 'neutral'] },
    lesson: { scheduled: ['Scheduled', 'info'], inProgress: ['In progress', 'info'], completed: ['Completed', 'success'], cancelled: ['Cancelled', 'neutral'], noShow: ['No-show', 'danger'], rescheduled: ['Rescheduled', 'warning'] },
    payment: { paid: ['Paid', 'success'], partiallyPaid: ['Partially paid', 'warning'], pending: ['Pending', 'info'], overdue: ['Overdue', 'danger'], refunded: ['Refunded', 'neutral'], void: ['Void', 'neutral'] },
    invoice: { draft: ['Draft', 'neutral'], issued: ['Issued', 'info'], paid: ['Paid', 'success'], overdue: ['Overdue', 'danger'], void: ['Void', 'neutral'] },
    test: { notBooked: ['Not booked', 'neutral'], booked: ['Booked', 'info'], passed: ['Passed', 'success'], failed: ['Failed', 'danger'], cancelled: ['Cancelled', 'neutral'] },
    vehicle: { available: ['Available', 'success'], inUse: ['In use', 'info'], serviceDue: ['Service due', 'warning'], offRoad: ['Off road', 'danger'], retired: ['Retired', 'neutral'] },
    attendance: { present: ['Present', 'success'], late: ['Late', 'warning'], absent: ['Absent', 'danger'], excused: ['Excused', 'neutral'] },
  };

  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  NG.esc = esc;
  NG.icon = (name, cls = '') => `<svg class="ic ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  NG.badge = (domain, key, small) => {
    const s = NG.status[domain][key];
    if (!s) throw new Error(`Unknown status ${domain}.${key}`);
    return `<span class="badge ${small ? 'small ' : ''}tone-${s[1]}">${s[0]}</span>`;
  };
  NG.toneBadge = (tone, label, small) => `<span class="badge ${small ? 'small ' : ''}tone-${tone}">${esc(label)}</span>`;
  NG.dot = (domain, key) => { const s = NG.status[domain][key]; return `<span class="indicator"><span class="dot ${s[1]}" aria-hidden="true"></span>${s[0]}</span>`; };

  /* Formatting (mirrors the shared helpers in docs/patterns.md §12) */
  const L = 'en-GB';
  const d = (v) => (v instanceof Date ? v : new Date(v));
  NG.fmt = {
    date: (v) => (v ? new Intl.DateTimeFormat(L, { day: '2-digit', month: 'short', year: 'numeric' }).format(d(v)) : '—'),
    day: (v) => new Intl.DateTimeFormat(L, { weekday: 'short', day: '2-digit', month: 'short' }).format(d(v)),
    time: (v) => new Intl.DateTimeFormat(L, { hour: '2-digit', minute: '2-digit' }).format(d(v)),
    dayTime: (v) => (v ? `${NG.fmt.day(v)}, ${NG.fmt.time(v)}` : '<span class="empty-cell">—</span>'),
    gbp: (n) => new Intl.NumberFormat(L, { style: 'currency', currency: 'GBP' }).format(n),
    mins: (m) => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}` : `${m} min`),
  };
  NG.initials = (n) => n.split(' ').map((p) => p[0]).slice(0, 2).join('');
  NG.avatar = (name, size = '') => `<span class="avatar ${size}" aria-hidden="true">${NG.initials(name)}</span>`;
  NG.empty = '<span class="empty-cell">—</span>';

  /* Building blocks */
  NG.btn = (label, o = {}) => {
    const cls = ['btn', o.kind || '', o.small ? 'small' : '', o.iconOnly ? 'icon' : '', o.touch ? 'touch' : ''].join(' ').trim();
    const attrs = Object.entries(o.attrs || {}).map(([k, v]) => `${k}="${esc(v)}"`).join(' ');
    const aria = o.iconOnly ? ` aria-label="${esc(label)}" title="${esc(label)}"` : '';
    return `<button type="button" class="${cls}"${aria} ${attrs}>${o.icon ? NG.icon(o.icon, o.small ? 'ic16' : '') : ''}${o.iconOnly ? '' : esc(label)}</button>`;
  };
  NG.go = (screen, extra = '') => `data-go="${screen}${extra}"`;

  NG.pageHeader = (o) => `
    <div class="page-header">
      ${o.crumbs ? `<ol class="breadcrumb" aria-label="Breadcrumb">${o.crumbs.map((c, i) => i < o.crumbs.length - 1
        ? `<li><a href="#/${c[1]}">${esc(c[0])}</a></li><li aria-hidden="true">›</li>` : `<li><span aria-current="page">${esc(c[0])}</span></li>`).join('')}</ol>` : ''}
      <div class="page-header-row">
        <div class="ph-text"><h1 class="page-title">${esc(o.title)} ${o.meta || ''}</h1>${o.desc ? `<p class="page-desc">${o.desc}</p>` : ''}</div>
        ${o.actions ? `<div class="page-actions">${o.actions}</div>` : ''}
      </div>
      ${o.tabs ? NG.tabs(o.tabs, o.tab) : ''}
    </div>`;
  NG.tabs = (tabs, selected, id = 'pageTabs') => `<div class="tabs" role="tablist" aria-label="Views" id="${id}">${tabs.map(([key, label]) =>
    `<button class="tab" role="tab" data-tab="${key}" aria-selected="${key === selected}" tabindex="${key === selected ? 0 : -1}">${esc(label)}</button>`).join('')}</div>`;

  NG.section = (o) => `<section class="surface ${o.flush ? 'flush' : ''}" ${o.label ? `aria-label="${esc(o.label)}"` : ''}>
      ${o.title ? `<div class="section-head"><h2>${esc(o.title)}</h2>${o.badge || ''}${o.actions ? `<div class="acts">${o.actions}</div>` : ''}</div>` : ''}
      ${o.flush ? o.body : `<div class="pad stack">${o.body}</div>`}
    </section>`;

  /* cols: [{h, end, cls, hide}] ; rows: array of arrays of html, or {cells, attrs, cls} */
  NG.table = (o) => {
    const head = o.cols.map((c) => `<th scope="col" class="${c.end ? 'end ' : ''}${c.hide ? 'hide-' + c.hide + ' ' : ''}${c.cls || ''}">${c.sort ? `<button class="sort">${esc(c.h)}${c.sort === 'asc' ? `<svg class="ic sort-ic" aria-hidden="true" style="transform:rotate(180deg)"><use href="#i-chevron_down"/></svg>` : ''}</button>` : c.h}</th>`).join('');
    const body = o.rows.map((r) => {
      const cells = Array.isArray(r) ? r : r.cells;
      const attrs = Array.isArray(r) ? '' : Object.entries(r.attrs || {}).map(([k, v]) => `${k}="${esc(v)}"`).join(' ');
      const cls = Array.isArray(r) ? '' : r.cls || '';
      return `<tr class="${cls}" ${attrs}>${cells.map((c, i) => `<td class="${o.cols[i].end ? 'end num ' : ''}${o.cols[i].hide ? 'hide-' + o.cols[i].hide + ' ' : ''}${o.cols[i].cls || ''}">${c}</td>`).join('')}</tr>`;
    }).join('');
    return `<div class="table-wrap"><table class="dt ${o.size || ''}" ${o.id ? `id="${o.id}"` : ''}><caption class="sr-only">${esc(o.caption || '')}</caption><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
  };
  NG.rowMenu = (name) => `<button class="btn subtle small icon" aria-label="More actions for ${esc(name)}">${NG.icon('more_horizontal', 'ic16')}</button>`;
  NG.selCell = (label, checked) => `<label class="choice" style="padding:0"><input type="checkbox" aria-label="Select ${esc(label)}" ${checked ? 'checked' : ''}></label>`;

  NG.pagination = (range, page) => `<nav class="pagination" aria-label="Pagination"><span>${range}</span><span class="pg">
      <span class="hide-sm">Rows per page</span><span class="input select hide-sm"><select aria-label="Rows per page"><option>25</option><option>50</option><option>100</option></select>${NG.icon('chevron_down', 'ic16 chev')}</span>
      <button class="btn subtle small icon hide-sm" aria-label="First page" disabled>${NG.icon('chevron_double_left', 'ic16')}</button>
      <button class="btn subtle small icon" aria-label="Previous page" disabled>${NG.icon('chevron_left', 'ic16')}</button>
      <span style="padding:0 6px">${page}</span>
      <button class="btn subtle small icon" aria-label="Next page">${NG.icon('chevron_right', 'ic16')}</button>
      <button class="btn subtle small icon hide-sm" aria-label="Last page">${NG.icon('chevron_double_right', 'ic16')}</button></span></nav>`;

  NG.commandBar = (items, far = '') => `<div class="commandbar" role="toolbar" aria-label="Commands">${items}<div class="far">${far}</div></div>`;

  NG.search = (placeholder, value = '', cls = 'search') => `<div class="input ${cls}">${NG.icon('search', 'affix')}<input aria-label="${esc(placeholder)}" placeholder="${esc(placeholder)}" value="${esc(value)}"></div>`;
  NG.selectBox = (label, options, o = {}) => `<div class="input select ${o.cls || ''}"><select aria-label="${esc(label)}" ${o.id ? `id="${o.id}"` : ''}>${options.map((x) => {
    const [v, t] = Array.isArray(x) ? x : [x, x]; return `<option value="${esc(v)}" ${o.value === v ? 'selected' : ''}>${esc(t)}</option>`; }).join('')}</select>${NG.icon('chevron_down', 'ic16 chev')}</div>`;
  NG.filterBar = (o) => `<div class="filterbar"><div class="filterbar-row">${o.search ? NG.search(o.search) : ''}${(o.filters || []).map((f) => NG.selectBox(f[0], f[1], { cls: 'filter ' + (f[2] || '') })).join('')}${o.more ? NG.btn('More filters', { kind: 'subtle', icon: 'filter' }) : ''}<span class="count" aria-live="polite">${o.count || ''}</span></div>
      ${o.tags && o.tags.length ? `<div class="tags">${o.tags.map((t) => `<span class="tag">${esc(t)}<button aria-label="Remove filter ${esc(t)}">${NG.icon('dismiss', 'ic16')}</button></span>`).join('')}<button class="btn transparent small">Clear all</button></div>` : ''}</div>`;

  /* Form fields */
  let fid = 0;
  NG.field = (label, control, o = {}) => {
    const id = o.id || `f${++fid}`;
    const ctl = control.replace('%ID%', id);
    return `<div class="field ${o.full ? 'full' : ''}"><label class="label" for="${id}">${esc(label)}${o.req ? '<span class="req" aria-hidden="true">*</span>' : ''}${o.optional ? ' <span class="muted">(optional)</span>' : ''}</label>${ctl}
      ${o.error ? `<span class="vmsg error">${NG.icon('error_circle')}${esc(o.error)}</span>` : ''}${o.warning ? `<span class="vmsg warning">${NG.icon('warning')}${esc(o.warning)}</span>` : ''}${o.hint ? `<span class="hint">${esc(o.hint)}</span>` : ''}</div>`;
  };
  NG.text = (value = '', o = {}) => `<div class="input ${o.error ? 'error' : ''} ${o.warn ? 'warn' : ''} ${o.disabled ? 'disabled' : ''}">${o.before ? `<span class="affix">${o.before}</span>` : ''}${o.icon ? NG.icon(o.icon, 'ic16 affix') : ''}<input id="%ID%" value="${esc(value)}" placeholder="${esc(o.ph || '')}" ${o.disabled ? 'disabled' : ''} class="${o.num ? 'num' : ''} ${o.mono ? 'mono' : ''}">${o.after ? NG.icon(o.after, 'affix') : ''}</div>`;
  NG.date = (value = '', o = {}) => NG.text(value, { ...o, after: 'calendar_ltr', ph: o.ph || 'dd/mm/yyyy' });
  NG.select = (options, value, o = {}) => `<div class="input select ${o.error ? 'error' : ''}"><select id="%ID%">${options.map((x) => {
    const [v, t] = Array.isArray(x) ? x : [x, x]; return `<option value="${esc(v)}" ${value === v ? 'selected' : ''}>${esc(t)}</option>`; }).join('')}</select>${NG.icon('chevron_down', 'ic16 chev')}</div>`;
  NG.textarea = (value = '', ph = '') => `<div class="input textarea"><textarea id="%ID%" rows="3" placeholder="${esc(ph)}">${esc(value)}</textarea></div>`;
  NG.radios = (name, options, value) => `<div class="choice-group horizontal" role="radiogroup">${options.map((o) => `<label class="choice"><input type="radio" name="${name}" ${o === value ? 'checked' : ''}>${esc(o)}</label>`).join('')}</div>`;
  NG.check = (label, checked, o = {}) => `<label class="choice"><input type="checkbox" ${o.switch ? 'role="switch"' : ''} ${checked ? 'checked' : ''} ${o.disabled ? 'disabled' : ''}>${esc(label)}</label>`;
  NG.fieldset = (legend, body, desc) => `<fieldset><legend>${esc(legend)}</legend>${desc ? `<p class="hint" style="margin:-8px 0 12px">${esc(desc)}</p>` : ''}<div class="form-grid">${body}</div></fieldset>`;

  NG.dlist = (items, one) => `<dl class="dlist ${one ? 'one' : ''}">${items.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v === undefined || v === null || v === '' ? NG.empty : v}</dd></div>`).join('')}</dl>`;
  NG.msg = (intent, title, body, acts = '') => `<div class="msgbar ${intent}">${NG.icon({ info: 'info', success: 'checkmark_circle', warning: 'warning', error: 'error_circle' }[intent || 'info'])}<div class="body">${title ? `<span class="title">${esc(title)}</span>` : ''}${body}</div>${acts ? `<div class="acts">${acts}</div>` : ''}</div>`;
  NG.metric = (icon, label, value, foot, go) => `<a class="surface metric" ${go ? `href="#/${go}"` : ''}><span class="m-label">${NG.icon(icon)}${esc(label)}</span><span class="m-value">${value}</span><span class="m-foot">${foot}</span></a>`;
  NG.meter = (level) => `<span class="meter" role="img" aria-label="Level ${level} of 5">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= level ? 'on' : ''}"></i>`).join('')}<b>${level}</b></span>`;
  NG.timeline = (items) => `<ol class="timeline">${items.map((t) => `<li><span class="tl-icon ${t.tone || ''}" aria-hidden="true">${NG.icon(t.icon)}</span><div><div class="tl-title">${t.title}</div><div class="tl-meta">${t.meta}</div></div></li>`).join('')}</ol>`;
  NG.emptyState = (kind, title, desc, action = '') => {
    const ic = { firstUse: 'people_community', noResults: 'search', error: 'error_circle', noPermission: 'lock_closed' }[kind];
    return `<div class="empty">${NG.icon(ic, 'ic48')}<h3>${esc(title)}</h3>${desc ? `<p>${esc(desc)}</p>` : ''}${action ? `<div class="acts">${action}</div>` : ''}</div>`;
  };
  NG.skeleton = (cols, rows = 6) => `<tbody aria-hidden="true">${Array.from({ length: rows }, (_, i) => `<tr>${Array.from({ length: cols }, (_, c) => `<td>${c === 0 ? `<span class="cell-primary"><span class="skel circle"></span><span class="skel" style="width:${130 - (i % 3) * 18}px"></span></span>` : `<span class="skel" style="width:${50 + ((i + c) % 4) * 18}px"></span>`}</td>`).join('')}</tr>`).join('')}</tbody>`;

  /* List-screen state handling: renders the data region for the chosen prototype state */
  NG.listState = (ctx, o) => {
    if (ctx.state === 'loading') {
      return `<div aria-busy="true" aria-label="Loading">${o.commandBar || ''}<div class="table-wrap"><table class="dt"><thead><tr>${o.cols.map((c) => `<th>${c.h}</th>`).join('')}</tr></thead>${NG.skeleton(o.cols.length)}</table></div></div>`;
    }
    if (ctx.state === 'empty') return NG.emptyState('firstUse', o.emptyTitle, o.emptyDesc, o.emptyAction);
    if (ctx.state === 'noResults') return NG.emptyState('noResults', o.noResultsTitle || 'No results match your filters', 'Try a different search or remove some filters.', NG.btn('Clear filters'));
    if (ctx.state === 'error') return NG.emptyState('error', o.errorTitle || "Couldn't load this list", 'Check your connection and try again. If it keeps happening, contact your administrator.', NG.btn('Try again', { icon: 'arrow_clockwise' }));
    return null;
  };
})();
