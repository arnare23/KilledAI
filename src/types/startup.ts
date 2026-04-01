export type FailureCategory =
  | 'platform-absorbed'
  | 'no-moat'
  | 'funding'
  | 'pricing'
  | 'market'
  | 'competition'
  | 'technical'
  | 'regulatory'
  | 'acqui-hired'
  | 'other';

export type Status = 'draft' | 'researched' | 'published' | 'unverified' | 'rejected';
export type Confidence = 'high' | 'medium' | 'low';

export interface StartupSource {
  url: string;
  title: string;
  date: string;
  snapshot_path?: string;
}

export interface StartupIndex {
  name: string;
  slug: string;
  tagline: string;
  founded: string;
  shutdown: string;
  category: FailureCategory;
  funding_raised: string;
  status: Status;
  confidence: Confidence;
}

export interface StartupDetail extends StartupIndex {
  description: string;
  story: string;
  funding_stage?: string;
  employee_count?: number;
  tags: string[];
  url?: string;
  sources: StartupSource[];
  created_at: string;
  updated_at: string;
}

export interface IndexFile {
  version: number;
  generated_at: string;
  count: number;
  startups: StartupIndex[];
}
