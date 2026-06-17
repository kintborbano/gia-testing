export interface WrappedArchetype {
  name: string;
  hook_type?: string;
  er: string;
  emoji: string;
  note: string;
}

export interface WrappedVoiceLine {
  line: string;
  mood: string;
}

export interface WrappedVoice {
  intro_headline: string;
  intro_body: string;
  intro_body_muted: string;
  gia_hero_line: string;
  views: WrappedVoiceLine;
  eng: WrappedVoiceLine;
  hook: WrappedVoiceLine;
  comment: WrappedVoiceLine;
  finale_signoff: string;
}

export interface Wrapped {
  handle: string;
  videoCount: number;
  totalViews: string;
  avgEngagement: string;
  benchmark: string;
  benchmarkMult: string;
  avgHook: string;
  topVideo: {
    title: string;
    views: string;
    er: string;
    likes: string;
    shares: string;
  };
  archetypes: WrappedArchetype[];
  share: { stat: string; label: string; line: string };
  save: { stat: string; label: string; line: string };
  comment: { quote: string; line: string };
  purchaseIntent: string;
  idealHook: string;
  emotionalTrigger: string;
  recs: string[];
  fanTerm: string;
  voice: WrappedVoice;
  schemaVersion: number;
}
