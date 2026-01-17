import type { JobScraper } from './scraper.interface';
import { IndeedScraper } from './indeed-scraper';
import { LinkedInScraper } from './linkedin-scraper';

const scrapers = new Map<string, JobScraper>([
  ['indeed', new IndeedScraper()],
  ['linkedin', new LinkedInScraper()],
]);

export function getScraper(source: string): JobScraper {
  const scraper = scrapers.get(source.toLowerCase());
  if (!scraper) {
    throw new Error(`No scraper found for source: ${source}`);
  }
  return scraper;
}

export function getAvailableSources(): string[] {
  return Array.from(scrapers.keys());
}

