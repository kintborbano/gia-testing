export interface ReportData {
  handle: string;
  category: string;
  followerCount: number;
  giaScore: number;
  giaScoreMax: number;
  giaScoreContext: string;
  giaTake: string;
  summary: string;
  topHooks: string[];
}

export interface VideoDetails {
  rawScore: string;
  gauge: { label: string; value: string; weight: string }[];
  counts: {
    views: string;
    likes: string;
    shares: string;
    saves: string;
    comments: string;
  };
  hookTrigger: string;
  whyItWorks: string[];
  improvements: string[];
  commentInsights: string;
  positive: string[];
}

export interface Video {
  gia: string;
  score: number;
  title: string;
  hook: string;
  er: string;
  views: string;
  proven: boolean;
  details?: VideoDetails;
}
