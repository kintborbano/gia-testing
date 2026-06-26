# TikTok Video Embeds Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let users play the analyzed TikTok videos inline in the report via the official TikTok embed, loaded lazily on click.

**Architecture:** Thread the TikTok `url` into the `Video` card type; in each expandable video card render a "Watch this video" button that swaps in the official TikTok embed iframe (`https://www.tiktok.com/embed/v2/<video_id>`) on click; allowlist `https://www.tiktok.com` in the hosting CSP `frame-src`. No rehosting, no stored MP4s.

**Tech Stack:** Next.js 16 / React 19 / TypeScript / Tailwind v4; Firebase Hosting CSP.

## Global Constraints

- pnpm; static export (`output: 'export'`). No frontend unit-test runner — verify with `pnpm type-check && pnpm lint && pnpm build` + manual.
- Conventional commits `type(scope): desc` with `-` bullets; **never** a `Co-Authored-By` trailer.
- No docstrings/banner comments; comments only for non-obvious _why_.
- Strictly maroon/gold/cream tokens (`bg-brand-primary`, `text-brand-primary`, etc.); no emoji; no layout shift (reserve a 9:16 box).
- Official TikTok embed only — no self-hosted MP4s.
- Deploy: `pnpm build && firebase deploy --only hosting --project=sofi-gia` (live `gia.sofitech.ai`).

> **Spec note:** the spec said "play overlay on the thumbnail," but the web report cards are text-only (no thumbnail image — those exist only in the PDF). So the play control lives **inside the expanded card**. Adding thumbnail images to the cards is out of scope (possible follow-up).

---

### Task 1: Thread the TikTok URL into the Video card

**Files:**

- Modify: `src/types/report.ts` (`Video` interface)
- Modify: `src/components/report/VideoBreakdownSection.tsx` (`toVideo()`)

**Interfaces:**

- Produces: `Video.url?: string` (TikTok page URL); `Video.id` already exists (= `video_id`).

- [ ] **Step 1: Add `url` to the `Video` type**

In `src/types/report.ts`, add to `interface Video` (after `id?: string;`):

```typescript
  url?: string;
```

- [ ] **Step 2: Map it in `toVideo()`**

In `src/components/report/VideoBreakdownSection.tsx`, add to the object returned by `toVideo()` (next to `id: a.video_id,`):

```typescript
    url: a.url,
```

- [ ] **Step 3: Verify**

Run: `cd "/Users/codexesc/Documents/Project GIA/gia-testing" && pnpm type-check`
Expected: no errors (`ApiResult`'s `VideoAnalysis.url` is `string`).

- [ ] **Step 4: Commit**

```bash
git add src/types/report.ts src/components/report/VideoBreakdownSection.tsx
git commit -m "feat(report): carry the TikTok url into the video card type"
```

---

### Task 2: Lazy TikTok embed in the expanded card

**Files:**

- Modify: `src/components/report/VideoBreakdown.tsx` (the inner card component, ~lines 156–237)

**Interfaces:**

- Consumes: `Video.url`, `Video.id` (Task 1).

- [ ] **Step 1: Import the Play icon**

At the top of `src/components/report/VideoBreakdown.tsx`, add `Play` to the existing lucide-react import (the file already imports `ChevronDown` from `lucide-react` — add `Play` to that import).

- [ ] **Step 2: Add per-card player state**

In the inner card component (the one with props `{ video, profileUrl, open, onToggle, cardRef }`, starting ~line 156), add at the top of the function body:

```tsx
const [showPlayer, setShowPlayer] = useState(false);
```

(`useState` is already imported at the top of the file.)

- [ ] **Step 3: Render the embed inside the expanded section**

Inside the expandable area — within `<div className="min-h-0 overflow-hidden">`, immediately **before** the `{video.details ? (...) : (...)}` block — add:

```tsx
{
  video.id && (
    <div className="border-t border-gray-200 px-5 pt-5">
      {showPlayer ? (
        <div
          className="relative mx-auto w-full max-w-[325px] overflow-hidden rounded-xl bg-black"
          style={{ aspectRatio: '9 / 16' }}
        >
          <iframe
            src={`https://www.tiktok.com/embed/v2/${video.id}`}
            title={video.title}
            loading="lazy"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowPlayer(true)}
          className="bg-brand-primary hover:bg-brand-primary-dark inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition-colors"
        >
          <Play className="h-4 w-4" /> Watch this video
        </button>
      )}
      {video.url && (
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-primary mt-2 block text-xs underline"
        >
          View on TikTok ↗
        </a>
      )}
    </div>
  );
}
```

The iframe mounts only after the user clicks (lazy); the `<a>` is the fallback for private/unembeddable videos.

> **ID form check:** `embed/v2/<id>` needs TikTok's **numeric** video id (the trailing number in `tiktok.com/@user/video/<id>`). `a.video_id` is expected to be that number. If the manual test (Task 4) shows the player not loading, derive the id from `video.url` instead — e.g. `video.url?.match(/\/video\/(\d+)/)?.[1]` — and use that for the iframe src. Confirm during the smoke test before finalizing.

- [ ] **Step 4: Verify**

Run: `cd "/Users/codexesc/Documents/Project GIA/gia-testing" && pnpm type-check && pnpm lint && pnpm build`
Expected: all clean; static export completes.

- [ ] **Step 5: Commit**

```bash
git add src/components/report/VideoBreakdown.tsx
git commit -m "feat(report): play TikTok videos inline via lazy official embed

- expanded card shows a Watch button that swaps in the TikTok embed iframe on
  click (one iframe per click, not per card); 9:16 box avoids layout shift
- View on TikTok link as fallback for private/unembeddable videos"
```

---

### Task 3: Allow TikTok in the hosting CSP

**Files:**

- Modify: `firebase.json` (the `Content-Security-Policy` header value)

- [ ] **Step 1: Add `https://www.tiktok.com` to `frame-src`**

In `firebase.json`, the CSP currently has:
`frame-src 'self' https://sofi-gia.firebaseapp.com https://accounts.google.com https://apis.google.com;`
Change it to:
`frame-src 'self' https://sofi-gia.firebaseapp.com https://accounts.google.com https://apis.google.com https://www.tiktok.com;`

(`img-src` already includes `https://*.tiktokcdn.com`, so poster frames are covered. Do not add `script-src` — the `embed/v2` iframe doesn't load `embed.js` on our page.)

- [ ] **Step 2: Verify the build still emits the header config**

Run: `cd "/Users/codexesc/Documents/Project GIA/gia-testing" && pnpm build`
Expected: build completes (firebase.json isn't part of the JS build, but confirm no JSON syntax error by running `python3 -c "import json;json.load(open('firebase.json'))"` → no error).

- [ ] **Step 3: Commit**

```bash
git add firebase.json
git commit -m "fix(csp): allow the TikTok player in frame-src for report embeds"
```

---

### Task 4: Deploy + verify live

**Files:** none.

- [ ] **Step 1: Deploy**

Run: `cd "/Users/codexesc/Documents/Project GIA/gia-testing" && pnpm build && firebase deploy --only hosting --project=sofi-gia`
Expected: deploy completes.

- [ ] **Step 2: Verify the live CSP allows TikTok**

Run: `curl -sI https://gia.sofitech.ai/report | grep -i content-security-policy | grep -o "frame-src[^;]*;"`
Expected: the `frame-src` includes `https://www.tiktok.com`.

- [ ] **Step 3: Manual smoke test**

On a real report (`https://gia.sofitech.ai/report?job=<id>`): expand a video card → click **Watch this video** → the TikTok player loads inline and plays; before clicking, no iframe is mounted; a private video shows the "View on TikTok" fallback without breaking the page.
