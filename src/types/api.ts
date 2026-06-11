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
  engagement_rate: number;
  saves_to_views: number;
  hook_strength: number;
  hook_type: string;
  hook_trigger_3s: string;
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
  gia_breakdown: {
    shares: number;
    reactions: number;
    comments: number;
    saves: number;
  };
}

export interface ContentPillar {
  pillar: string;
  video_count: number;
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
  // Not sent by the backend today (reverted in c9b2f99) — render conditionally.
  followers?: number;
}

export interface ApiResult {
  analyses: VideoAnalysis[];
  overall: OverallStrategy;
  profile_handle: string;
  creator_profile: CreatorProfile;
}

export interface JobStatus {
  state: string;
  messages: string[];
  done: boolean;
}
