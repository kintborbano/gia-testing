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
    cover: { tagline: 'your year on the fyp' },
    energy: {
      eyebrow: 'your energy',
      headline: 'the surprise-drop superstars',
      body: 'you don’t announce — you ambush. every post feels like breaking news Blooms have to witness live.',
    },
    number: {
      eyebrow: 'the headline',
      caption: 'views. and Blooms watched every second.',
    },
    signature: {
      eyebrow: 'your signature move',
      headline: 'you’re a moment-maker',
      body: 'unexpected role-plays and out-of-nowhere reveals — you turn a normal tuesday into an event.',
    },
    breakout: {
      eyebrow: 'the breakout',
      headline: 'the rollerblade heard round the fyp',
      body: 'one synchronized stunt and the whole timeline lost it. this is the one they’ll still be quoting next year.',
    },
    audience: {
      eyebrow: 'what your people did',
      headline: 'they couldn’t keep you to themselves',
      body: 'Blooms hit “send” faster than the algorithm could blink — every drop became a group-chat invasion.',
    },
    comment: {
      eyebrow: 'what they said',
      reaction:
        'the bias is giving parasocial and i am LIVING. Blooms don’t do casual — only unhinged devotion.',
    },
    superpower: {
      eyebrow: 'your superpower',
      headline: 'turning surprise into obsession',
      body: 'casual beats polished every time for you. keep dropping the unscripted, unhinged, no-warning moments.',
    },
    finale: {
      identity_tag: 'the surprise-drop superstars',
      signoff: 'ate that. left no crumbs. now do it again.',
    },
  },
};
