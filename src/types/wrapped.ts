export interface WrappedArchetype {
  name: string;
  emoji?: string;
  note?: string;
}

export interface BeatCopy {
  eyebrow?: string;
  headline?: string;
  body?: string;
}

export interface WrappedCopy {
  cover: { tagline: string };
  energy: BeatCopy;
  number: { eyebrow: string; caption: string };
  signature: BeatCopy;
  breakout: BeatCopy;
  audience: BeatCopy;
  comment: { eyebrow: string; reaction: string };
  superpower: BeatCopy;
  finale: { identity_tag: string; signoff: string };
}

export interface Wrapped {
  schemaVersion: number;
  handle: string;
  totalViews: string;
  topVideo: { title: string; views: string };
  archetypes: WrappedArchetype[];
  commentQuote: string;
  fanTerm: string;
  copy: WrappedCopy;
}
