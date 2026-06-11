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
    engagement_rate: 0.08,
    saves_to_views: 0.02,
    hook_strength: 7,
    hook_type: 'TUTORIAL',
    hook_trigger_3s: 'Creator speaks directly to camera with text overlay.',
    text_overlay: null,
    spoken_hook_transcript: null,
    emotional_trigger: 'curiosity',
    pacing: 'fast',
    why_it_works: 'Specific numbers make the promise feel real.',
    improvement: 'Add a save-hook in the last two seconds.',
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
    gia_breakdown: { shares: 0.7, reactions: 0.7, comments: 0.7, saves: 0.7 },
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
      engagement_rate: 0.132,
      hook_strength: 9,
      hook_type: 'MYSTERY',
      hook_trigger_3s:
        'Opens on a phone screen showing a -$800 brokerage loss; calm smile to camera.',
      why_it_works:
        "Contrarian hook ('losing money was good') triggers instant curiosity; the $800 amount is specific enough to feel real.",
      improvement:
        "Add text overlay 'The $800 lesson' at 0-2s to capture mute viewers.",
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
        shares: 0.95,
        reactions: 0.9,
        comments: 0.88,
        saves: 0.92,
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
      engagement_rate: 0.107,
      hook_strength: 8,
      hook_type: 'TUTORIAL',
      gia_score: 8.2,
      gia_raw: 0.82,
      gia_breakdown: {
        shares: 0.7,
        reactions: 0.85,
        comments: 0.9,
        saves: 0.95,
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
      engagement_rate: 0.084,
      hook_strength: 7,
      hook_type: 'CONTRARIAN',
      gia_score: 7.6,
      gia_raw: 0.76,
      gia_breakdown: {
        shares: 0.9,
        reactions: 0.7,
        comments: 0.72,
        saves: 0.65,
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
      engagement_rate: 0.061,
      hook_strength: 6,
      hook_type: 'LISTICLE',
      gia_score: 6.0,
      gia_raw: 0.6,
      gia_breakdown: {
        shares: 0.5,
        reactions: 0.6,
        comments: 0.55,
        saves: 0.7,
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
      engagement_rate: 0.052,
      hook_strength: 6,
      hook_type: 'REVIEW',
      gia_score: 5.4,
      gia_raw: 0.54,
      gia_breakdown: {
        shares: 0.4,
        reactions: 0.55,
        comments: 0.5,
        saves: 0.68,
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
      engagement_rate: 0.039,
      hook_strength: 5,
      hook_type: 'VLOG',
      gia_score: 3.8,
      gia_raw: 0.38,
      gia_breakdown: {
        shares: 0.3,
        reactions: 0.45,
        comments: 0.4,
        saves: 0.35,
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
        avg_engagement_rate: 0.098,
        verdict: 'STRONG',
      },
      {
        pillar: 'Investing 101',
        video_count: 8,
        avg_engagement_rate: 0.072,
        verdict: 'STRONG',
      },
      {
        pillar: 'Budgeting & Saving',
        video_count: 15,
        avg_engagement_rate: 0.051,
        verdict: 'MIXED',
      },
      {
        pillar: 'Product Reviews',
        video_count: 4,
        avg_engagement_rate: 0.047,
        verdict: 'MIXED',
      },
      {
        pillar: 'Life Updates & Vlogs',
        video_count: 6,
        avg_engagement_rate: 0.034,
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
