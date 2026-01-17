import * as cheerio from 'cheerio';
import type { JobScraper } from '../scraper.interface';
import type { Job, JobSearchQuery } from '@/lib/models/job';

/**
 * PNet Scraper - South Africa's largest job board
 * https://www.pnet.co.za
 */
export class PNetScraper implements JobScraper {
  source = 'pnet';
  private baseUrl = 'https://www.pnet.co.za';

  async search(query: JobSearchQuery): Promise<Job[]> {
    const jobs: Job[] = [];
    
    try {
      const searchUrl = this.buildSearchUrl(query);
      
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml',
        },
      });

      if (!response.ok) {
        throw new Error(`PNet returned ${response.status}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // PNet job listing selectors (adjust based on actual HTML structure)
      $('.job-result-card, .job-item, [data-job-id]').each((_, element) => {
        const $el = $(element);
        
        const title = $el.find('.job-title, h2, h3').first().text().trim();
        const company = $el.find('.company-name, .employer').first().text().trim();
        const location = $el.find('.location, .job-location').first().text().trim();
        const salary = $el.find('.salary, .salary-range').first().text().trim();
        const jobUrl = $el.find('a').first().attr('href');
        const jobId = $el.attr('data-job-id') || this.extractJobId(jobUrl);

        if (title && jobUrl) {
          jobs.push({
            title,
            company: company || 'Not specified',
            location: location || 'South Africa',
            salary_range: salary || undefined,
            source: this.source,
            source_url: jobUrl.startsWith('http') ? jobUrl : `${this.baseUrl}${jobUrl}`,
            source_id: jobId,
            posted_date: new Date().toISOString(),
          });
        }
      });

      // Limit results
      return jobs.slice(0, query.limit || 50);
    } catch (error) {
      console.error('PNet scraping error:', error);
      return [];
    }
  }

  async getJobDetails(url: string): Promise<Job> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      const html = await response.text();
      const $ = cheerio.load(html);

      const title = $('.job-title, h1').first().text().trim();
      const company = $('.company-name, .employer-name').first().text().trim();
      const location = $('.location, .job-location').first().text().trim();
      const description = $('.job-description, .description').first().text().trim();
      const requirements = $('.requirements, .job-requirements').first().text().trim();
      const salary = $('.salary, .salary-range').first().text().trim();
      const jobType = $('.job-type, .employment-type').first().text().trim();

      return {
        title: title || 'Unknown',
        company: company || 'Not specified',
        location: location || 'South Africa',
        job_type: jobType || undefined,
        description: description || undefined,
        requirements: requirements || undefined,
        salary_range: salary || undefined,
        source: this.source,
        source_url: url,
        source_id: this.extractJobId(url),
        posted_date: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching PNet job details:', error);
      throw error;
    }
  }

  private buildSearchUrl(query: JobSearchQuery): string {
    const params = new URLSearchParams();
    
    if (query.query) params.append('q', query.query);
    if (query.location) params.append('l', query.location);
    if (query.jobType) params.append('jt', query.jobType);
    if (query.experienceLevel) params.append('exp', query.experienceLevel);
    
    return `${this.baseUrl}/jobs?${params.toString()}`;
  }

  private extractJobId(url?: string): string {
    if (!url) return '';
    const match = url.match(/\/(\d+)$/);
    return match ? match[1] : '';
  }
}
