// A one-shot, cross-navigation flag that asks the next page's freshly-mounted
// StickyHeader to play its slide-in entrance.
//
// The sticky header is rendered per-page, so a client navigation unmounts the
// current header and mounts a brand-new one on the destination. That means the
// menu-close → navigate choreography can't span the swap inside one component.
// Instead, when the mobile menu routes away we raise this module-level flag (the
// module persists across client navigation, only the React tree changes); the
// destination's header reads it on mount and slides in *after* the new page has
// rendered — the order the intro/landing page uses — rather than animating on the
// outgoing page before it's gone.

let pending = false;

/** Ask the next-mounted header to slide in. Set just before a client navigation. */
export function requestHeaderEntry(): void {
  pending = true;
}

/** Read the flag without clearing it — safe to call from a render/useState
 *  initializer, which React may invoke more than once (StrictMode, hydration). */
export function peekHeaderEntry(): boolean {
  return pending;
}

/** Clear the flag. Call once from a mount effect so it can't leak to a later,
 *  unrelated header mount. */
export function consumeHeaderEntry(): void {
  pending = false;
}
