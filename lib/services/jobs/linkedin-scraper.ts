import type { JobScraper } from './scraper.interface';
import type { Job, JobSearchQuery } from '@/lib/models/job';

export class LinkedInScraper implements JobScraper {
  source = 'linkedin';

  async search(query: JobSearchQuery): Promise<Job[]> {
    // LinkedIn Jobs base URL for South Africa
    const baseUrl = 'https://www.linkedin.com/jobs/search';
    const jobs: Job[] = [];

    try {
      // Build search URL
      const params = new URLSearchParams();
      if (query.query) params.append('keywords', query.query);
      if (query.location) {
        params.append('location', query.location);
      } else {
        params.append('location', 'South Africa');
      }
      if (query.jobType) {
        // LinkedIn uses different job type values
        const linkedinJobType = this.mapJobType(query.jobType);
        if (linkedinJobType) {
          params.append('f_JT', linkedinJobType);
        }
      }

      const searchUrl = `${baseUrl}?${params.toString()}`;

      // For MVP, we'll use a simple fetch approach
      // Note: LinkedIn may require authentication or have anti-scraping measures
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      if (!response.ok) {
        throw new Error(`LinkedIn API returned ${response.status}`);
      }

      const html = await response.text();

      // Parse HTML to extract job listings
      const jobMatches = this.parseJobListings(html);

      for (const match of jobMatches) {
        try {
          const job = await this.getJobDetails(match.url);
          jobs.push(job);
        } catch (error) {
          console.error(`Error fetching job details for ${match.url}:`, error);
          // Continue with basic info if details fail
          jobs.push({
            title: match.title,
            company: match.company,
            location: match.location,
            source: this.source,
            source_url: match.url,
            source_id: match.id,
            description: match.description || '',
          });
        }
      }

      return jobs.slice(0, query.limit || 50);
    } catch (error) {
      console.error('Error scraping LinkedIn:', error);
      throw error;
    }
  }

  async getJobDetails(url: string): Promise<Job> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch job details: ${response.status}`);
      }

      const html = await response.text();
      return this.parseJobDetails(html, url);
    } catch (error) {
      console.error(`Error fetching job details from ${url}:`, error);
      throw error;
    }
  }

  private parseJobListings(html: string): Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    url: string;
    description?: string;
  }> {
    const jobs: Array<{
      id: string;
      title: string;
      company: string;
      location: string;
      url: string;
      description?: string;
    }> = [];

    // LinkedIn uses data-entity-urn for job IDs
    const jobCardRegex = /data-entity-urn="([^"]+)"[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*class="[^"]*base-card__full-link[^"]*"[^>]*>[\s\S]*?<span[^>]*aria-hidden="true"[^>]*>([^<]+)<\/span>[\s\S]*?<h4[^>]*class="[^"]*base-search-card__subtitle[^"]*"[^>]*>([^<]+)<\/h4>[\s\S]*?<span[^>]*class="[^"]*job-search-card__location[^"]*"[^>]*>([^<]+)<\/span>/g;

    let match;
    while ((match = jobCardRegex.exec(html)) !== null) {
      const [, urn, path, title, company, location] = match;
      const url = path.startsWith('http') ? path : `https://www.linkedin.com${path}`;
      const id = urn.split(':').pop() || '';

      jobs.push({
        id,
        title: title.trim(),
        company: company.trim(),
        location: location.trim(),
        url,
      });
    }

    return jobs;
  }

  private parseJobDetails(html: string, url: string): Job {
    // Extract job details from HTML
    const titleMatch = html.match(/<h1[^>]*class="[^"]*top-card-layout__title[^"]*"[^>]*>([^<]+)<\/h1>/);
    const companyMatch = html.match(/<a[^>]*class="[^"]*topcard__org-name-link[^"]*"[^>]*>([^<]+)<\/a>/);
    const locationMatch = html.match(/<span[^>]*class="[^"]*topcard__flavor[^"]*topcard__flavor--bullet[^"]*"[^>]*>([^<]+)<\/span>/);
    const descriptionMatch = html.match(/<div[^>]*class="[^"]*show-more-less-html__markup[^"]*"[^>]*>([\s\S]*?)<\/div>/);

    const title = titleMatch ? titleMatch[1].trim() : 'Job Title';
    const company = companyMatch ? companyMatch[1].trim() : '';
    const location = locationMatch ? locationMatch[1].trim() : '';
    const description = descriptionMatch ? this.stripHtml(descriptionMatch[1]) : '';

    // Extract requirements
    const requirements = this.extractRequirements(description);

    // Extract salary if present
    const salaryMatch = html.match(/<span[^>]*class="[^"]*job-criteria__text[^"]*"[^>]*>([^<]+)<\/span>/);
    const salaryRange = salaryMatch ? salaryMatch[1].trim() : '';

    // Extract job ID from URL
    const jobId = this.extractJobId(url);

    return {
      title,
      company,
      location,
      description,
      requirements,
      salary_range: salaryRange,
      source: this.source,
      source_url: url,
      source_id: jobId,
      posted_date: new Date().toISOString(),
    };
  }

  private extractJobId(url: string): string {
    const match = url.match(/\/jobs\/view\/(\d+)/);
    return match ? match[1] : '';
  }

  private mapJobType(jobType: string): string | null {
    const mapping: Record<string, string> = {
      'full-time': 'F',
      'part-time': 'P',
      'contract': 'C',
      'temporary': 'T',
    };
    return mapping[jobType.toLowerCase()] || null;
  }

  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private extractRequirements(description: string): string {
    // Simple extraction - look for common requirement patterns
    const requirementPatterns = [
      /requirements?:[\s\S]*?(?=benefits|qualifications|skills|$)/i,
      /qualifications?:[\s\S]*?(?=benefits|requirements|skills|$)/i,
      /skills?:[\s\S]*?(?=benefits|requirements|qualifications|$)/i,
    ];

    for (const pattern of requirementPatterns) {
      const match = description.match(pattern);
      if (match) {
        return match[0].trim();
      }
    }

    return description.substring(0, 500);
  }
}

