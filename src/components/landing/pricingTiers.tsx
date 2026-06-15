import { Fragment } from 'react';

/*
 * Shared tier content for the pricing cards.
 *
 * The open beta card (betaDeepDive) renders as real DOM on /pricing. The two
 * flanking tiers (lockedQuickScan, lockedProStudio) ship as blurred image bakes
 * in production so their teaser copy + price never reach the served HTML — but
 * their source still lives here so the dev-only /pricing/bake route can render
 * them as real cards for scripts/rebake-locked-cards.cjs to re-screenshot.
 *
 * Keep five bullets and short lines on the locked tiers so all three cards stay
 * the same height. After editing copy/price here, re-run the rebake script.
 */

export const betaDeepDive = {
  tier: 'DEEP\nDIVE',
  originalPrice: '₱799.00',
  price: '₱299.00',
  badge: 'BETA PRICING',
  features: [
    <Fragment key="videos">
      Analysis across your <b>20 most recent videos</b>
    </Fragment>,
    <Fragment key="scoring">
      <b>Hook scoring:</b> see what made people stop, skip, or stay
    </Fragment>,
    <Fragment key="comments">
      <b>Comment intelligence:</b> what your audience keeps asking for, turned
      into ideas
    </Fragment>,
    // Plain-string tails: this Next's JSX transform drops the space between
    // an element and a following text node that contains an entity.
    <Fragment key="patterns">
      <b>Performance patterns:</b>
      {" what's actually driving your saves, shares, and views"}
    </Fragment>,
    <Fragment key="pdf">
      A <b>downloadable PDF</b> of your GIA report.
    </Fragment>,
    <Fragment key="wrapped">
      <b>GIA Wrapped:</b> a shareable recap on your wins.
    </Fragment>,
  ],
};

export const lockedQuickScan = {
  tier: 'QUICK\nSCAN',
  price: '₱499.00',
  description:
    'A fast pulse-check on your posts — the quickest way to see what is landing and what is not.',
  features: [
    <Fragment key="hooks">
      <b>Top 3 hooks</b> from your recent posts, ranked by what stopped the
      scroll
    </Fragment>,
    <Fragment key="engagement">
      A quick <b>engagement read</b> on every video so you know what to repeat
    </Fragment>,
    <Fragment key="pattern">
      <b>One standout pattern</b> we noticed across your last few weeks
    </Fragment>,
    <Fragment key="captions">
      <b>Caption tips</b> shaped around the style of your next upload
    </Fragment>,
    <Fragment key="timing">
      <b>Best time to post</b> for your audience, based on your own data
    </Fragment>,
  ],
};

export const lockedProStudio = {
  tier: 'PRO\nSTUDIO',
  price: '₱999.00',
  description:
    'The full creative system — deeper analysis, more videos, and guidance to scale what works.',
  features: [
    <Fragment key="everything">
      <b>Everything in Deep Dive</b>, plus a deeper layer of strategy and review
    </Fragment>,
    <Fragment key="videos">
      Analysis across your <b>50 most recent videos</b>, not just the top
      performers
    </Fragment>,
    <Fragment key="calls">
      <b>Monthly strategy calls</b> to map out your next content moves
    </Fragment>,
    <Fragment key="scripts">
      <b>Custom hook scripts</b> written for you and ready to film this week
    </Fragment>,
    <Fragment key="support">
      <b>Priority support</b> and early access to every new GIA feature
    </Fragment>,
  ],
};
