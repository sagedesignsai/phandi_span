import { NextResponse } from 'next/server';
import { getScraper } from '@/lib/services/jobs/scraper-factory';
import { saveJob } from '@/lib/supabase/jobs-client';
import { jobSearchQuerySchema } from '@/lib/models/job';

export const maxDuration = 60; // Allow longer for scraping

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sources, query } = body;

    if (!sources || !Array.isArray(sources) || sources.length === 0) {
      return NextResponse.json(
        { error: 'sources array is required' },
        { status: 400 }
      );
    }

    const searchQuery = query ? jobSearchQuerySchema.parse(query) : {
      limit: 50,
      offset: 0,
    };

    let totalJobsFound = 0;
    let totalJobsSaved = 0;
    const errors: string[] = [];

    // Scrape from each source
    for (const source of sources) {
      try {
        const scraper = getScraper(source);
        const jobs = await scraper.search(searchQuery);

        totalJobsFound += jobs.length;

        // Save each job to database
        for (const job of jobs) {
          try {
            await saveJob(job);
            totalJobsSaved++;
          } catch (error) {
            console.error(`Error saving job ${job.source_url}:`, error);
            errors.push(`Failed to save job: ${job.title}`);
          }
        }

        // Rate limiting: wait 1 second between sources
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error scraping ${source}:`, error);
        errors.push(`Failed to scrape ${source}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      message: 'Job scraping completed',
      jobsFound: totalJobsFound,
      jobsSaved: totalJobsSaved,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Error scraping jobs:', error);
    return NextResponse.json(
      {
        error: 'Failed to scrape jobs',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

