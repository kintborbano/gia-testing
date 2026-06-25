export interface CommentSentiment {
  purchase_intent: string[];
  curiosity: string[];
  positive: string[];
  negative: string[];
}

export interface VideoAnalysis {
  video_id: string;
  url: string;
  title: string;
  views: number | string;
  likes: number | string;
  shares: number | string;
  bookmarks: number | string;
  comment_count: number | string;
  // Already a percentage (5.2 means 5.2%) — backend pre-multiplies.
  engagement_rate: number;
  saves_to_views: number;
  hook_strength: number;
  hook_type: string;
  hook_trigger_3s: string | null;
  text_overlay: string | null;
  spoken_hook_transcript: string | null;
  emotional_trigger: string;
  pacing: string;
  why_it_works: string;
  improvement: string;
  in_solution: boolean;
  comment_sentiment: CommentSentiment;
  comment_insights: string;
  gia_score: number;
  gia_raw: number;
  // Per-metric rates as percentages; empty object when the scraper couldn't
  // resolve a follower count (compute_gia_score bails to {}).
  gia_breakdown: {
    view_rate?: number;
    share_rate?: number;
    reaction_rate?: number;
    comment_rate?: number;
    save_rate?: number;
  };
}

export interface ContentPillar {
  pillar: string;
  video_count: number;
  // Already a percentage, same convention as VideoAnalysis.engagement_rate.
  avg_engagement_rate: number;
  verdict: string;
}

export interface ScriptVariation {
  spoken_hook: string;
  visual_hook: string;
}

export interface OverallStrategy {
  creator_hook_summary: string;
  creator_profile_summary: string;
  top_hook_types: string[];
  content_pillars: ContentPillar[];
  content_themes_that_work: string[];
  content_themes_to_avoid: string[];
  audience_signals: {
    what_they_share: string;
    what_they_save: string;
    what_they_comment_about: string;
    what_they_like: string;
    what_they_dislike: string;
    purchase_intent_level: string;
  };
  ideal_hook_formula: string;
  visual_style_recommendation: string;
  emotional_trigger_to_prioritize: string;
  posting_strategy: string;
  script_hook_variations: {
    for_comments: ScriptVariation;
    for_shares: ScriptVariation;
    for_saves: ScriptVariation;
  };
  avg_gia_score: number;
}

export interface CreatorProfile {
  niche: string;
  sub_niche: string;
  primary_language: string;
  content_format: string;
  hook_vocabulary: string[];
  // Merged from scraped creator_meta; may be 0/absent if scraping misses it.
  followers?: number;
}

export interface ApiResult {
  analyses: VideoAnalysis[];
  overall: OverallStrategy;
  profile_handle: string;
  creator_profile: CreatorProfile;
  locked?: boolean;
  hidden_video_count?: number;
}

export interface JobStatus {
  state: string;
  messages: string[];
  done: boolean;
  // Set when state === 'error': 'no_content' (no analyzable videos) | 'failed'.
  error_kind?: string;
}
