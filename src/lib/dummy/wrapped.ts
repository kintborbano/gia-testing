import type { Wrapped } from '@/types/wrapped';

// Narrative (v2) fixture for /wrapped?demo=1, themed for @bini_ph.
export const DEMO_WRAPPED: Wrapped = {
  schemaVersion: 2,
  handle: '@bini_ph',
  totalViews: '29.2M',
  topVideo: { title: 'On our rollerblades for @nona', views: '8.3M' },
  archetypes: [
    {
      name: 'Event Announcement',
      emoji: '📣',
      note: 'surprise-tour energy, zero warning',
    },
    { name: 'Milestone Celebration' },
    { name: 'Fan Challenge' },
  ],
  commentQuote: 'ang flirty talaga ni mikha, kuhang kuha',
  fanTerm: 'Blooms',
  copy: {
    cover: { tagline: 'your hooks, decoded' },
    energy: {
      eyebrow: 'your energy',
      headline: 'the surprise-drop superstars',
      body: 'you don’t announce — you arrive. every post lands like news your audience has to witness in real time.',
    },
    number: {
      eyebrow: 'the headline',
      caption: 'views — and your audience stayed for all of them.',
    },
    signature: {
      eyebrow: 'your signature move',
      headline: 'you’re a moment-maker',
      body: 'unexpected reveals and playful role-plays — you turn an ordinary day into something worth watching.',
    },
    breakout: {
      eyebrow: 'the breakout',
      headline: 'the post that broke through',
      body: 'one perfectly-timed moment and the whole timeline took notice. this is the one they’ll be quoting for a long time.',
    },
    audience: {
      eyebrow: 'what your people did',
      headline: 'they couldn’t keep you to themselves',
      body: 'Blooms shared every drop the second it landed — each post turned into a group-chat event.',
    },
    comment: {
      eyebrow: 'what they said',
      reaction:
        'this is devotion, not casual viewing. your audience shows up for the people, not just the posts.',
    },
    superpower: {
      eyebrow: 'your superpower',
      headline: 'turning surprise into devotion',
      body: 'the real, unscripted moments win every time for you. keep leaning into the unplanned ones.',
    },
    finale: {
      identity_tag: 'the surprise-drop superstars',
      signoff: 'that’s a feed worth screenshotting. now go make the next one.',
    },
  },
};
