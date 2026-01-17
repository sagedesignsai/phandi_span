"use client";

import { Suspense, useEffect, useState } from 'react';
import { JobDiscoveryDashboard } from '@/components/jobs/job-discovery-dashboard';
import { Loader } from '@/components/ai-elements/loader';
import { useHeader } from '@/lib/contexts/header-context';
import { createClient } from '@/lib/supabase/client';

export default function JobsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const { updateConfig } = useHeader();

  useEffect(() => {
    updateConfig({
      title: "Job Discovery",
      description: "AI-powered job matching based on your resume and preferences",
    });
  }, [updateConfig]);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  if (!userId) {
    return <Loader />;
  }
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <Suspense fallback={<Loader />}>
              <JobDiscoveryDashboard userId={userId} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
