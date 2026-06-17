// Creator tips shown on the loading screen while GIA works. They make the wait
// feel valuable (perceived performance) and double as proof of what the
// broadcast channel promises — see LoadingTip.tsx for how they're rotated.
//
// Inline *single asterisks* mark emphasis and render as italic; keep them in the
// copy rather than baking <em> tags into the data.
export const LOADING_TIPS: readonly string[] = [
  'Your first 3 seconds decide everything. If your hook doesn’t stop the scroll, nothing else matters.',
  'A question hook works best when it’s something your viewer is *already* asking themselves.',
  'Saves > Likes. When someone saves your video, TikTok sees it as high-value content worth pushing.',
  'Posting at the “right time” is less important than posting *consistently*. The algorithm rewards cadence.',
  'Your engagement rate means more when your reach is high. Low reach + high ER = niche resonance, not a hit.',
  'Talk to one person, not everyone. “For the girls who…” always outperforms “For everyone who…”',
  'The comment section is free market research. What people *ask* in comments = your next video idea.',
  'A video that gets shared is a video that made someone feel seen, smart, or entertained enough to pass it on.',
  'Text overlays aren’t decoration — they’re a second hook. Use them to restate or deepen what you’re saying.',
  'Replying to comments with a video isn’t just engagement — it’s a new piece of content with a built-in audience.',
  'If your video flopped, check your hook first. Most flops die in the first 2 seconds.',
  'Don’t sleep on your B-roll. Visually dynamic videos hold attention longer, even with average audio.',
  'Your bio is your landing page. If someone visits your profile after watching a video, your bio should close the deal.',
  'The TikTok algorithm doesn’t care how many followers you have — it cares if people *finish* your video.',
  'Trending sounds don’t guarantee reach, but they do lower the barrier to entry in the FYP.',
  'Pacing matters. A slow mid-section is where viewers drop off. Keep the energy consistent throughout.',
  'A strong CTA at the end doubles your comment rate. “Tell me in the comments” actually works.',
  'Batch filming saves your life. Shoot 3–5 videos in one session so you’re never scrambling to post.',
  'Don’t delete a flopped video right away. Sometimes TikTok pushes old content weeks later.',
  'Your first video in a new content era will almost always underperform. Push through — the algorithm needs to re-learn you.',
  'Duets and Stitches are free distribution. Engaging with bigger creators puts you in front of their audience.',
  'A good thumbnail (cover frame) won’t go viral for you — but a bad one will silently tank your profile visits.',
  'If your audience is Filipino, Taglish hooks outperform pure English. Speak how they actually think.',
  'Data tells you *what* happened. GIA tells you *why*. Use both. 💛',
];

// The guaranteed closing line — pinned as the last tip shown as the bar fills to
// 100% (see LoadingTip's `closing` prop). It previews exactly what the
// broadcast-channel CTA below offers, so it replaces the old static subtext that
// used to sit under the heading.
export const LOADING_CLOSING_TIP =
  'For creator tips, behind the scenes, & access to new features';
