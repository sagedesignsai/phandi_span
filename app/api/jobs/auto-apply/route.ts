import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserJobPreferences, getJobMatches } from '@/lib/supabase/jobs-client';
import { applyToJob } from '@/lib/services/jobs/application-service';

export const maxDuration = 60; // Allow longer for batch processing

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user preferences
    const preferences = await getUserJobPreferences(user.id);

    if (!preferences || !preferences.auto_apply_enabled) {
      return NextResponse.json({
        message: 'Auto-apply is not enabled for this user',
        applicationsSent: 0,
      });
    }

    // Get job matches that meet the threshold
    const matches = await getJobMatches(user.id, {
      status: 'new',
      minScore: preferences.auto_apply_threshold || 80,
      limit: 10, // Limit to 10 applications per run to avoid spam
    });

    if (matches.length === 0) {
      return NextResponse.json({
        message: 'No matching jobs found for auto-apply',
        applicationsSent: 0,
      });
    }

    // Get user's default resume (first resume from localStorage)
    // In production, you'd want to store a preferred resume ID in preferences
    const { defaultResumeId } = await req.json().catch(() => ({}));

    if (!defaultResumeId) {
      return NextResponse.json(
        { error: 'Default resume ID is required for auto-apply' },
        { status: 400 }
      );
    }

    // Apply to each matching job
    const results = [];
    let successCount = 0;
    let errorCount = 0;

    for (const match of matches) {
      try {
        const application = await applyToJob(
          user.id,
          match.job_id,
          defaultResumeId,
          true // autoApply flag
        );

        results.push({
          jobId: match.job_id,
          success: true,
          applicationId: application.id,
        });
        successCount++;

        // Rate limiting: wait 2 seconds between applications
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Error applying to job ${match.job_id}:`, error);
        results.push({
          jobId: match.job_id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        errorCount++;
      }
    }

    return NextResponse.json({
      message: `Auto-apply completed: ${successCount} successful, ${errorCount} failed`,
      applicationsSent: successCount,
      applicationsFailed: errorCount,
      results,
    });
  } catch (error) {
    console.error('Auto-apply error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process auto-apply',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET endpoint for manual triggering (can be called by cron)
export async function GET(req: Request) {
  // This endpoint can be called by external cron services
  // It would process all users with auto-apply enabled
  // For MVP, we'll keep it simple and require POST with user context

  return NextResponse.json({
    message: 'Use POST method to trigger auto-apply for authenticated user',
  });
}

