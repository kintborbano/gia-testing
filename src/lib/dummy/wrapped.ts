import type { Wrapped } from '@/types/wrapped';

// Ported from the design handoff (@bini_ph edition) for /wrapped?demo=1.
export const DEMO_WRAPPED: Wrapped = {
  handle: '@bini_ph',
  videoCount: 20,
  totalViews: '29.2M',
  avgEngagement: '16.3%',
  benchmark: '4.32%',
  benchmarkMult: '4×',
  avgHook: '9.0',
  topVideo: {
    title: 'On our rollerblades for @nona',
    views: '8.3M',
    er: '11.2%',
    likes: '876.4K',
    shares: '16.8K',
  },
  archetypes: [
    {
      name: 'Event announcement',
      er: '24.65%',
      emoji: '📣',
      note: 'surprise-tour energy, role-play',
    },
    {
      name: 'Milestone celebration',
      er: '22.16%',
      emoji: '🏆',
      note: 'raw, post-performance tears',
    },
    {
      name: 'Fan challenge prompt',
      er: '21.35%',
      emoji: '💫',
      note: 'playful acting & dance dares',
    },
  ],
  share: {
    stat: '16.8K',
    label: 'shares on one video',
    line: 'When P-Pop artists link up, Blooms hit “send” faster than the algorithm can blink. One video, 16.8K group-chat invasions.',
  },
  save: {
    stat: '19.4K',
    label: 'saves on “passinho do jamal”',
    line: 'Dance challenges get bookmarked like recipes. Blooms are in their rooms right now, mirror up, learning the footwork.',
  },
  comment: {
    quote: 'ang flirty talaga ni mikha, kuhang kuha',
    line: 'Your comments aren’t about the group — they’re about that one member. Blooms came with a bias and zero chill.',
  },
  purchaseIntent: 'HIGH',
  idealHook:
    'Open on the full group — or one beloved member — in an unexpected or emotional moment. Minimal text. One casual question.',
  emotionalTrigger: 'curiosity + humor',
  recs: [
    'fan challenges are literally free engagement like why aren’t you posting more?? 21.35% ER with zero effort bestie.',
    'the crying was camp. coachella moment ate at 22.16% bc it was raw and unscripted — keep being unhinged on camera plz.',
    'casual announcements went 24.65%. polished press releases went 6.92%. the math is mathing, stop overthinking it.',
  ],
  fanTerm: 'Blooms',
  voice: {
    intro_headline: 'ok Blooms.',
    intro_body:
      'you’ve been dropping surprise tour announcements, daring Blooms with acting challenges, and absolutely unaliving the FYP.',
    intro_body_muted:
      'raw talent plus zero chill — the algorithm is still recovering tbh.',
    gia_hero_line: 'no bc we need to talk rn.',
    views: {
      line: '29.2M and you didn’t even try that hard?? the algorithm is literally obsessed.',
      mood: 'lowkey shook',
    },
    eng: {
      line: '4× the benchmark like it’s NOTHING. other artists are in their flop era.',
      mood: 'unwell',
    },
    hook: {
      line: 'i was SO ready to humble you but 9/10 across the board?? gagged. this is violence.',
      mood: 'gagged',
    },
    comment: {
      line: 'the bias is giving parasocial and i am LIVING. blooms don’t do casual.',
      mood: 'obsessed',
    },
    finale_signoff: 'ate that. left no crumbs. now do it again.',
  },
  schemaVersion: 1,
};
