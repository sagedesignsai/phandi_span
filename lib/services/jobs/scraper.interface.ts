import type { Job, JobSearchQuery } from '@/lib/models/job';

export interface JobScraper {
  source: string;
  search(query: JobSearchQuery): Promise<Job[]>;
  getJobDetails(url: string): Promise<Job>;
}

