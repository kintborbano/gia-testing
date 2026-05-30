export type Tech = {
  label: string;
  description: string;
};

export const TECHS: Tech[] = [
  {
    label: 'TypeScript',
    description: 'End-to-end type safety across the entire codebase.',
  },
  {
    label: 'React',
    description: 'Component-driven UI with hooks and concurrent features.',
  },
  {
    label: 'Node.js',
    description: 'Scalable server-side JS with async-first architecture.',
  },
  {
    label: 'Postgres',
    description: 'Reliable relational storage with full ACID compliance.',
  },
  {
    label: 'Docker',
    description: 'Containerized deploys that run the same everywhere.',
  },
];

export const OBJECT_POSITIONS = [
  { top: '15%', left: '8%' },
  { top: '10%', right: '8%' },
  { bottom: '20%', left: '12%' },
  { bottom: '18%', right: '10%' },
  { top: '45%', left: '5%' },
];
