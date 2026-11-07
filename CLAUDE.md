# CLAUDE.md

@AGENTS.md

The shared agent instructions above apply in full. This file adds Claude Code-specific guidance only.

## Before UI work

- Read `docs/design-principles.md`, then the relevant sections of `docs/components.md` and
  `docs/patterns.md` for the screen you are building. Do not rely on memory of earlier sessions;
  the docs may have changed.
- Look up values in `tokens/noodlegear.tokens.json`. Never guess a token name. If you are unsure one
  exists, search the Fluent `tokens` export or the JSON.
- The owner of this repository builds the frontend and backend themselves. Unless they explicitly ask
  you to write code, help by explaining, reviewing, or proposing changes against the design system.

## When asked to build or change UI

- For a new screen or anything not clearly covered by an existing pattern, use plan mode first and
  name the page pattern and components you intend to use.
- Never introduce a new visual pattern, token, dependency or status mapping on your own. Propose it
  (AGENTS.md §8) and wait for approval.
- Keep diffs scoped to the request. Do not "tidy up" tokens or docs as a side effect.

## Verifying UI

- Run the type check and build before reporting completion.
- When a browser is available, check the screen at 1366×768 and 1024×768, and in light and dark
  themes. Tab through it once with the keyboard.
- Report honestly: list anything not verified.

## Reviewing UI code

When asked to review, check against AGENTS.md §4 (rules) and §9 (definition of done), and flag:
raw colour/px values, inline styles, custom controls duplicating Fluent, ad-hoc status colours,
more than one primary button, missing loading/empty/error states, missing labels, and `any`.
