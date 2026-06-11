import type { ApiResult, VideoAnalysis } from '@/types/api';

/**
 * Realistic ApiResult fixture for iterating on the report view without a live
 * job (the frontend twin of the backend's test_pdf_sample.py). Served by
 * ReportShell when the URL has ?demo=1 and no job id.
 */

function video(
  overrides: Partial<VideoAnalysis> & Pick<VideoAnalysis, 'video_id' | 'title'>
): VideoAnalysis {
  return {
    url: `https://www.tiktok.com/@sophia.cashflow/video/${overrides.video_id}`,
    views: 500_000,
    likes: 50_000,
    shares: 5_000,
    bookmarks: 10_000,
    comment_count: 2_000,
    engagement_rate: 8.0,
    saves_to_views: 2.0,
    hook_strength: 7,
    hook_type: 'TUTORIAL',
    hook_trigger_3s: 'Creator speaks directly to camera with text overlay.',
    text_overlay: null,
    spoken_hook_transcript: null,
    emotional_trigger: 'curiosity',
    pacing: 'fast',
    why_it_works: '• **Specific numbers** make the promise feel real.',
    improvement: '• **Add a save-hook** in the last two seconds.',
    in_solution: true,
    comment_sentiment: {
      purchase_intent: [],
      curiosity: [],
      positive: [],
      negative: [],
    },
    comment_insights: 'Viewers ask follow-up questions about exact steps.',
    gia_score: 7.0,
    gia_raw: 0.7,
    gia_breakdown: {
      view_rate: 176.06,
      share_rate: 1.76,
      reaction_rate: 17.61,
      comment_rate: 0.7,
      save_rate: 3.52,
    },
    ...overrides,
  };
}

export const DEMO_RESULT: ApiResult = {
  profile_handle: 'sophia.cashflow',
  creator_profile: {
    niche: 'personal finance',
    sub_niche: 'gen z money',
    primary_language: 'English',
    content_format: 'talking head + text overlays',
    hook_vocabulary: ['I lost', 'POV:', 'Save this'],
    followers: 284_000,
  },
  analyses: [
    video({
      video_id: '7301',
      title: "I spent $800 on a mistake so you don't have to",
      views: 1_420_000,
      likes: 187_000,
      shares: 43_200,
      bookmarks: 91_500,
      comment_count: 8_400,
      engagement_rate: 13.2,
      hook_strength: 9,
      hook_type: 'MYSTERY',
      hook_trigger_3s:
        'Opens on a phone screen showing a -$800 brokerage loss; calm smile to camera.',
      why_it_works:
        "• **Contrarian hook** ('losing money was good') triggers instant curiosity\n• The $800 amount is **specific enough to feel real**",
      improvement:
        "• **Add text overlay** 'The $800 lesson' at 0-2s to capture mute viewers",
      comment_sentiment: {
        purchase_intent: ['What app is this?'],
        curiosity: [],
        positive: [
          'The calm face while showing a loss got me',
          'First loss taught me everything too',
        ],
        negative: [],
      },
      gia_score: 9.1,
      gia_raw: 0.91,
      gia_breakdown: {
        view_rate: 500.0,
        share_rate: 15.21,
        reaction_rate: 65.85,
        comment_rate: 2.96,
        save_rate: 32.22,
      },
    }),
    video({
      video_id: '7302',
      title: 'POV: you open your first Roth IRA at 22',
      views: 890_000,
      likes: 94_000,
      shares: 12_100,
      bookmarks: 58_000,
      comment_count: 5_100,
      engagement_rate: 10.7,
      hook_strength: 8,
      hook_type: 'TUTORIAL',
      gia_score: 8.2,
      gia_raw: 0.82,
      gia_breakdown: {
        view_rate: 313.38,
        share_rate: 4.26,
        reaction_rate: 33.1,
        comment_rate: 1.8,
        save_rate: 20.42,
      },
    }),
    video({
      video_id: '7303',
      title: 'Your bank is literally paying you 0.01%',
      views: 640_000,
      likes: 61_000,
      shares: 19_400,
      bookmarks: 22_000,
      comment_count: 3_900,
      engagement_rate: 8.4,
      hook_strength: 7,
      hook_type: 'CONTRARIAN',
      gia_score: 7.6,
      gia_raw: 0.76,
      gia_breakdown: {
        view_rate: 225.35,
        share_rate: 6.83,
        reaction_rate: 21.48,
        comment_rate: 1.37,
        save_rate: 7.75,
      },
    }),
    video({
      video_id: '7304',
      title: '5 side hustles that actually work in 2026',
      views: 420_000,
      likes: 31_000,
      shares: 5_200,
      bookmarks: 18_000,
      comment_count: 1_800,
      engagement_rate: 6.1,
      hook_strength: 6,
      hook_type: 'LISTICLE',
      gia_score: 6.0,
      gia_raw: 0.6,
      gia_breakdown: {
        view_rate: 147.89,
        share_rate: 1.83,
        reaction_rate: 10.92,
        comment_rate: 0.63,
        save_rate: 6.34,
      },
    }),
    video({
      video_id: '7305',
      title: 'I tested 3 budgeting apps for 30 days',
      views: 310_000,
      likes: 19_000,
      shares: 2_800,
      bookmarks: 11_000,
      comment_count: 1_200,
      engagement_rate: 5.2,
      hook_strength: 6,
      hook_type: 'REVIEW',
      gia_score: 5.4,
      gia_raw: 0.54,
      gia_breakdown: {
        view_rate: 109.15,
        share_rate: 0.99,
        reaction_rate: 6.69,
        comment_rate: 0.42,
        save_rate: 3.87,
      },
    }),
    video({
      video_id: '7306',
      title: 'A week in my life as a finance creator',
      views: 210_000,
      likes: 12_000,
      shares: 1_100,
      bookmarks: 3_000,
      comment_count: 800,
      engagement_rate: 3.9,
      hook_strength: 5,
      hook_type: 'VLOG',
      gia_score: 3.8,
      gia_raw: 0.38,
      gia_breakdown: {
        view_rate: 73.94,
        share_rate: 0.39,
        reaction_rate: 4.23,
        comment_rate: 0.28,
        save_rate: 1.06,
      },
    }),
  ],
  overall: {
    creator_hook_summary:
      'Finance creator helping Gen Z build wealth through real talk and no-filter money advice.',
    creator_profile_summary:
      'Sophia blends relatable life moments with actionable money tips — her content sits at the intersection of lifestyle and wealth-building.',
    top_hook_types: ['MYSTERY', 'TUTORIAL', 'CONTRARIAN'],
    content_pillars: [
      {
        pillar: 'Side Hustles & Income',
        video_count: 12,
        avg_engagement_rate: 9.8,
        verdict: 'STRONG',
      },
      {
        pillar: 'Investing 101',
        video_count: 8,
        avg_engagement_rate: 7.2,
        verdict: 'STRONG',
      },
      {
        pillar: 'Budgeting & Saving',
        video_count: 15,
        avg_engagement_rate: 5.1,
        verdict: 'MIXED',
      },
      {
        pillar: 'Product Reviews',
        video_count: 4,
        avg_engagement_rate: 4.7,
        verdict: 'MIXED',
      },
      {
        pillar: 'Life Updates & Vlogs',
        video_count: 6,
        avg_engagement_rate: 3.4,
        verdict: 'WEAK',
      },
    ],
    content_themes_that_work: [
      "Relatable money mistakes ('I spent $800 on...')",
      'Side hustle income reveals',
      'Investing for beginners — step by step',
    ],
    content_themes_to_avoid: [
      'Generic budgeting tips without personal story',
      'Long explainers without a strong hook',
      'Crypto content — low saves, high skip rate',
    ],
    audience_signals: {
      what_they_share:
        'Videos revealing exact numbers — income, savings balance, investment returns. Feels like insider access.',
      what_they_save:
        "Step-by-step 'how to start' content — opening a Roth IRA, setting up an emergency fund.",
      what_they_comment_about:
        "Follow-up questions ('What app do you use?') and sharing their own wins.",
      what_they_like:
        'Authentic, numbers-first storytelling — receipts, statements, and real dollar amounts.',
      what_they_dislike:
        "Vague advice ('just invest more') without a clear action step.",
      purchase_intent_level: 'HIGH',
    },
    ideal_hook_formula:
      'Specific dollar amount + unexpected outcome + calm confidence in the first 3 seconds.',
    visual_style_recommendation:
      'Open on the receipt/screenshot before the face shot; keep text overlays under six words.',
    emotional_trigger_to_prioritize: 'curiosity',
    posting_strategy:
      'Post 4-6x per week between 6-9 PM. Trending audio paired with text overlays outperforms talking-head formats 3x.',
    script_hook_variations: {
      for_comments: {
        spoken_hook:
          "I made $4,200 last month from a side hustle I started with $0. Comment 'HUSTLE' and I'll DM you exactly how.",
        visual_hook:
          'Phone screen with payment notification, then zoom out to your shocked face.',
      },
      for_shares: {
        spoken_hook:
          "If you're still using a regular savings account, share this with someone you care about.",
        visual_hook:
          'Split screen: 0.01% APY account vs 5.2% APY high-yield account.',
      },
      for_saves: {
        spoken_hook:
          "Save this. In 60 seconds I'll show you the 5-step system I used to go from $200 to $10,000 saved.",
        visual_hook: 'Step-by-step checklist animating in as you speak.',
      },
    },
    avg_gia_score: 8.2,
  },
};
