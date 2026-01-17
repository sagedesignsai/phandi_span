import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ScrapingDashboard } from '@/components/jobs/scraping-dashboard';
import { Loader } from '@/components/ai-elements/loader';

export const metadata = {
  title: 'Job Scraping | Phandi Span',
  description: 'Manage job scraping from multiple sources',
};

export default async function ScrapingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Job Scraping</h1>
        <p className="text-muted-foreground mt-1">
          Discover jobs from South African and international job boards
        </p>
      </div>

      <Suspense fallback={<Loader />}>
        <ScrapingDashboard />
      </Suspense>
    </div>
  );
}
