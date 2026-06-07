import type { Video } from '@/types/report';

/** Placeholder video breakdown shown on the dummy report page. */
export const reportVideos: Video[] = [
  {
    gia: '4.8',
    score: 9,
    title: '(untitled)',
    hook: 'relatable everyday experience',
    er: '16.7% ER',
    views: '4.3K views',
    proven: true,
  },
  {
    gia: '3.8',
    score: 9,
    title: '#levisjeans #bruh',
    hook: 'relatable everyday experience',
    er: '13.1% ER',
    views: '3.2K views',
    proven: true,
    details: {
      rawScore: '37.81',
      gauge: [
        { label: 'Views', value: '23.3%', weight: '30%' },
        { label: 'Shares', value: '0.3%', weight: '25%' },
        { label: 'Reactions', value: '2.3%', weight: '20%' },
        { label: 'Comments', value: '0.0%', weight: '15%' },
        { label: 'Saves', value: '0.4%', weight: '10%' },
      ],
      counts: {
        views: '3.2K',
        likes: '323',
        shares: '44',
        saves: '53',
        comments: '2',
      },
      hookTrigger:
        "Direct eye contact from the creator at 0s along with the text overlay 'don't mind the tag pls' immediately draws viewers in.",
      whyItWorks: [
        'The casual, direct gaze from the creator creates an intimate, personal connection with the viewer right away',
        "The on-screen text 'don't mind the tag pls' generates immediate curiosity, making viewers wonder what 'tag' she's referring to and why it shouldn't be minded",
        'The strong 13.12% engagement rate shows that this personal, slightly mysterious opening successfully prompted viewers to stay and find out more',
      ],
      improvements: [
        "Show the Levi's jeans briefly in the first 2 seconds to link the visual hook directly to the video's topic, for example, a quick shot of the waistband or a full body shot.",
        "Add a direct question in text overlay in the first 3 seconds, like 'Do you ever forget to cut the tag off?' to explicitly build curiosity around the topic.",
        "Start with a quick, relatable sound effect (e.g., a short 'oops!' or a sigh) to instantly match the casual, slightly self-deprecating vibe of the text overlay.",
      ],
      commentInsights:
        "The single comment 'Wow your hot' shows that the creator's appearance is a key draw for some viewers, reinforcing the effectiveness of her direct visual hook. This comment reflects an appreciation for the creator herself, indicating that her personal presence is engaging.",
      positive: ['Wow your hot'],
    },
  },
  {
    gia: '3.0',
    score: 9,
    title: 'to usc we sing #freedom',
    hook: 'milestone announcement',
    er: '5.8% ER',
    views: '4.6K views',
    proven: true,
  },
  {
    gia: '2.6',
    score: 9,
    title: 'update : YESSS',
    hook: 'relatable everyday experience',
    er: '8.8% ER',
    views: '2.2K views',
    proven: true,
  },
  {
    gia: '2.0',
    score: 5,
    title: 'ni goon …',
    hook: 'question-based engagement',
    er: '2.2% ER',
    views: '1.1K views',
    proven: false,
  },
];
