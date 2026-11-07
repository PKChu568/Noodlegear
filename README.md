# Noodlegear

Noodlegear is a Driving School Management System: an internal, desktop-first business web application
for driving schools. It manages learners, instructors, lessons, vehicles, payments, driving tests and
reports.

This repository currently holds the **design system specification**. It is the source of truth that
people and coding agents follow when building the frontend.

| Path | What it is |
| --- | --- |
| [`AGENTS.md`](AGENTS.md) | Rules for any coding agent working on the UI. Start here. |
| [`CLAUDE.md`](CLAUDE.md) | Claude Code-specific additions. |
| [`tokens/noodlegear.tokens.json`](tokens/noodlegear.tokens.json) | Design tokens: the single source of truth for every visual value. |
| [`docs/design-principles.md`](docs/design-principles.md) | Philosophy, visual rules, accessibility, writing. |
| [`docs/design-tokens.md`](docs/design-tokens.md) | Token reference and how to consume tokens. |
| [`docs/components.md`](docs/components.md) | Components: when to use, when not, specs, examples. |
| [`docs/patterns.md`](docs/patterns.md) | Page layouts, navigation, action placement, states. |
| [`docs/reference/index.html`](docs/reference/index.html) | Visual reference page. Open it in a browser (light/dark toggle in the header). |

**Basis:** Microsoft Fluent 2. The intended stack is React, TypeScript, Vite, Fluent UI React v9
(`@fluentui/react-components`), `@fluentui/react-icons` and `@fluentui/react-datepicker-compat`.

To view the reference page, open `docs/reference/index.html` in a browser. It is a single static file
with no build step. Add `?theme=dark` to the URL to open it in dark theme.
