# Dev Bypass (paywall + backend)

A local-only switch that lets you roam the full analyze flow — **form → loading → report** — without the paywall (BetaGate / checkout) or a live backend. With it on, the API client returns a mock job that progresses for ~12s and then a bundled demo result, so you can exercise the loading animation and the report UI offline.

> **This is a development aid, not a feature.** It is hard-gated to non-production builds and never ships an open paywall. See [Safety](#safety) and [How to remove it](#how-to-remove-it-undo) below.

---

## How to enable / disable

The switch is the env var `NEXT_PUBLIC_DEV_BYPASS`, set in [.env.local](../.env.local) (gitignored — local only):

```bash
NEXT_PUBLIC_DEV_BYPASS=true   # on
# NEXT_PUBLIC_DEV_BYPASS=false (or remove the line / file) → off
```

- `NEXT_PUBLIC_*` vars are inlined at build time, so **restart `next dev`** after changing it.
- Only takes effect under `next dev`. `next build && next start` runs as production, where the bypass is forced off (see [Safety](#safety)).

With it on: fill the form normally and hit **Continue** — no gate. You land on `/loading`, watch the loop while the mock job runs (~12s), then reach a fully populated `/report` (the bundled `DEMO_RESULT`). Form-field validation still applies; the bypass only removes the paywall + backend.

---

## What it touches

| File                                            | Change                                                                                 |
| ----------------------------------------------- | -------------------------------------------------------------------------------------- |
| [src/lib/devBypass.ts](../src/lib/devBypass.ts) | **New.** The `DEV_BYPASS` flag + mock `devStartAnalysis` / `devStatus` / `devResults`. |
| [src/lib/auth.ts](../src/lib/auth.ts)           | `isAuthenticated()` returns `true` under bypass, so the form skips the BetaGate.       |
| [src/lib/api.ts](../src/lib/api.ts)             | `startAnalysis` / `getStatus` / `getResults` short-circuit to the mocks under bypass.  |
| [.env.local](../.env.local)                     | The switch itself (gitignored).                                                        |

The mock job (`devStatus`) emits scripted "thinking" messages over time so the loading bar advances and the loop plays, then reports `done`. Results come from the existing `DEMO_RESULT` fixture in [src/lib/dummy/apiResult.ts](../src/lib/dummy/apiResult.ts) — the same one the report's `?demo=1` mode uses.

---

## Safety

`DEV_BYPASS` is defined as:

```ts
export const DEV_BYPASS =
  process.env.NEXT_PUBLIC_DEV_BYPASS === 'true' &&
  process.env.NODE_ENV !== 'production';
```

The `NODE_ENV !== 'production'` guard means that even if `NEXT_PUBLIC_DEV_BYPASS=true` ever leaks into a production deploy, the real paywall and backend stay active. The trade-off: it also won't activate in a local production build (`next build && next start`). If you ever need to exercise it against a production build, that guard is the single line to relax — then put it back.

---

## How to remove it (undo)

To strip the bypass entirely:

1. **Delete** [src/lib/devBypass.ts](../src/lib/devBypass.ts).
2. **[src/lib/auth.ts](../src/lib/auth.ts)** — drop the import and restore:
   ```ts
   export function isAuthenticated(): boolean {
     return !!getToken();
   }
   ```
3. **[src/lib/api.ts](../src/lib/api.ts)** — remove the `devBypass` import and the three `if (DEV_BYPASS) return …;` guards in `startAnalysis`, `getStatus`, and `getResults`.
4. **Delete** [.env.local](../.env.local) (or just the `NEXT_PUBLIC_DEV_BYPASS` line). It's gitignored, so nothing to revert in git.
5. **Delete** this doc.
6. Verify: `pnpm type-check && pnpm lint`.

That returns the flow to: BetaGate on submit → `api.startAnalysis` → real `/api/status` + `/api/results` polling.
