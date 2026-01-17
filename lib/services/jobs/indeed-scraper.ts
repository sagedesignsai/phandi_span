import type { JobScraper } from './scraper.interface';
import type { Job, JobSearchQuery } from '@/lib/models/job';

export class IndeedScraper implements JobScraper {
  source = 'indeed';

  async search(query: JobSearchQuery): Promise<Job[]> {
    // Indeed South Africa base URL
    const baseUrl = 'https://za.indeed.com';
    const jobs: Job[] = [];

    try {
      // Build search URL
      const params = new URLSearchParams();
      if (query.query) params.append('q', query.query);
      if (query.location) params.append('l', query.location);
      if (query.jobType) params.append('jt', query.jobType);

      const searchUrl = `${baseUrl}/jobs?${params.toString()}`;

      // For MVP, we'll use a simple fetch approach
      // In production, you might need Puppeteer/Playwright for dynamic content
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      if (!response.ok) {
        throw new Error(`Indeed API returned ${response.status}`);
      }

      const html = await response.text();

      // Parse HTML to extract job listings
      // This is a simplified parser - in production, use cheerio or similar
      const jobMatches = this.parseJobListings(html, baseUrl);

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
      console.error('Error scraping Indeed:', error);
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

  private parseJobListings(html: string, baseUrl: string): Array<{
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

    // Extract job card data attributes (Indeed uses data-jk attribute)
    const jobCardRegex = /data-jk="([^"]+)"[^>]*>[\s\S]*?<h2[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>[\s\S]*?<span[^>]*class="[^"]*companyName[^"]*"[^>]*>([^<]+)<\/span>[\s\S]*?<div[^>]*class="[^"]*companyLocation[^"]*"[^>]*>([^<]+)<\/div>/g;

    let match;
    while ((match = jobCardRegex.exec(html)) !== null) {
      const [, id, path, title, company, location] = match;
      const url = path.startsWith('http') ? path : `${baseUrl}${path}`;

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
    // This is simplified - in production, use a proper HTML parser like cheerio

    const titleMatch = html.match(/<h1[^>]*class="[^"]*jobsearch-JobInfoHeader-title[^"]*"[^>]*>([^<]+)<\/h1>/);
    const companyMatch = html.match(/<div[^>]*class="[^"]*jobsearch-InlineCompanyRating[^"]*"[^>]*>[\s\S]*?<a[^>]*>([^<]+)<\/a>/);
    const locationMatch = html.match(/<div[^>]*class="[^"]*jobsearch-JobInfoHeader-subtitle[^"]*"[^>]*>[\s\S]*?<div[^>]*>([^<]+)<\/div>/);
    const descriptionMatch = html.match(/<div[^>]*id="jobDescriptionText"[^>]*>([\s\S]*?)<\/div>/);

    const title = titleMatch ? titleMatch[1].trim() : 'Job Title';
    const company = companyMatch ? companyMatch[1].trim() : '';
    const location = locationMatch ? locationMatch[1].trim() : '';
    const description = descriptionMatch ? this.stripHtml(descriptionMatch[1]) : '';

    // Extract requirements from description
    const requirements = this.extractRequirements(description);

    // Extract salary if present
    const salaryMatch = html.match(/<span[^>]*class="[^"]*salaryText[^"]*"[^>]*>([^<]+)<\/span>/);
    const salaryRange = salaryMatch ? salaryMatch[1].trim() : '';

    return {
      title,
      company,
      location,
      description,
      requirements,
      salary_range: salaryRange,
      source: this.source,
      source_url: url,
      source_id: this.extractJobId(url),
      posted_date: new Date().toISOString(),
    };
  }

  private extractJobId(url: string): string {
    const match = url.match(/jk=([^&]+)/);
    return match ? match[1] : '';
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

    return description.substring(0, 500); // Return first 500 chars if no specific section found
  }
}

