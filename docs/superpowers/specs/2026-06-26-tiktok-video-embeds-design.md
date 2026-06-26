# TikTok video embeds in the report — design

**Date:** 2026-06-26
**Repo:** `gia-testing` (frontend only)

## Goal

Let users play the analyzed TikTok videos directly in the GIA report by embedding
the **official TikTok player**, loaded **lazily on click** from the video thumbnail.
No rehosting, no stored MP4s — the video streams from TikTok, the creator is
attributed, and it stays within TikTok's terms.

## Decisions (locked)

- **Official TikTok embed**, not self-hosted MP4s (ToS/copyright/cost/expiry rule out
  rehosting the scraped files).
- **Play-on-click (lazy):** only the clicked video loads an iframe, so a ~20-card
  report stays fast (no 20 simultaneous embeds).
- Strictly maroon/gold/cream tokens; no emoji; no layout shift.

## Context

- Per-video data already returned by `/api/results` (`VideoAnalysis`): `video_id`,
  `url` (the TikTok page URL), `thumbnail_url`.
- `src/components/report/VideoBreakdownSection.tsx` maps `VideoAnalysis → Video`
  (`toVideo()`) and renders `VideoBreakdown` cards. The `Video` type
  (`src/types/report.ts`) currently does **not** carry the TikTok `url`/id, so the
  card can't embed yet — this must be threaded through.
- The site has a **strict CSP** in `firebase.json` (locked down for Firebase auth).
  Embedding TikTok requires allowlisting TikTok in `frame-src`, or the player is
  blocked. This is the load-bearing change.

## Components

### 1. Thread the video identity into the card

- `src/types/report.ts`: add `url?: string` (TikTok page URL) to `Video`. (`id` already
  exists and equals `video_id`.)
- `src/components/report/VideoBreakdownSection.tsx` `toVideo()`: set `url: a.url`.

### 2. Lazy embed in the card — `src/components/report/VideoBreakdown.tsx`

- The per-video thumbnail gets a **play overlay** (lucide `Play`, brand tokens).
- Local `playing` state per card (e.g. `playingId`); clicking the thumbnail sets it.
- When playing, render the official TikTok embed iframe in place of the thumbnail:
  `https://www.tiktok.com/embed/v2/<video_id>` inside a fixed **9:16 aspect box**
  (reserve the space to avoid layout shift), `loading="lazy"`,
  `allow="autoplay; encrypted-media; fullscreen"`.
- Keep a **"View on TikTok ↗"** link (using `url`) as a fallback and for private/
  unembeddable videos (TikTok's player shows its own unavailable state).
- If a card has no `video_id`/`url`, show the thumbnail only (no play control).

### 3. CSP — `firebase.json`

Extend the `Content-Security-Policy` header:

- `frame-src`: add `https://www.tiktok.com` (the embed iframe).
- `img-src`: ensure `https://*.tiktokcdn.com` is present (already is) for poster images.
- `script-src` / `connect-src`: only if the chosen embed needs them. The
  `embed/v2/<id>` **iframe** does not require loading TikTok's `embed.js` on our page,
  so no `script-src` change is expected. (Verify at implementation: if the iframe
  pulls sub-resources that CSP blocks, add the minimal source then.)

## Error handling / edge cases

- Private/region-locked/deleted video → TikTok's iframe renders its own "unavailable"
  message; the "View on TikTok" link remains. No crash.
- Missing `video_id` → no play control, thumbnail only.
- One iframe at a time is not required, but lazy mount means cost scales with clicks,
  not card count.

## Testing

- `pnpm type-check && pnpm lint && pnpm build` (static export completes).
- Manual: click a thumbnail → the TikTok player loads inline and plays; the live CSP
  header includes `https://www.tiktok.com` in `frame-src`; a private video shows the
  fallback link without breaking the page; report scroll/perf unaffected before any
  click (no iframes mounted).

## Out of scope

- Autoplay, custom player controls, muting logic.
- Rehosting/streaming the scraped MP4s.
- The GIA Wrapped deck (separate surface).
- Embeds anywhere other than the report's video breakdown cards.
