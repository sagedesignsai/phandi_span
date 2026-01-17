'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { JobPreparationPanel } from './job-preparation-panel';
import { 
  BriefcaseIcon, 
  MapPinIcon, 
  DollarSignIcon,
  ExternalLinkIcon,
  BookmarkIcon,
  SparklesIcon,
  TrendingUpIcon,
  EyeIcon,
  ArchiveIcon
} from 'lucide-react';
import type { JobMatch, Job } from '@/lib/models/job';

interface EnhancedJobMatchCardProps {
  match: JobMatch & { job: Job };
  resumeId?: string;
}

export function EnhancedJobMatchCard({ match, resumeId }: EnhancedJobMatchCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const { job, match_score, matched_skills, missing_skills } = match;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-orange-600 bg-orange-50 border-orange-200';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: 'Excellent Match', variant: 'default' as const };
    if (score >= 80) return { label: 'Great Match', variant: 'default' as const };
    if (score >= 70) return { label: 'Good Match', variant: 'secondary' as const };
    return { label: 'Fair Match', variant: 'outline' as const };
  };

  const scoreBadge = getScoreBadge(match_score);

  return (
    <>
      <Card className="hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer group">
        <CardHeader onClick={() => setShowDetails(true)}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {job.title}
                </CardTitle>
                {match_score >= 80 && (
                  <SparklesIcon className="size-4 text-yellow-500 flex-shrink-0" />
                )}
              </div>
              <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="flex items-center gap-1">
                  <BriefcaseIcon className="size-3.5" />
                  {job.company || 'Company not specified'}
                </span>
                {job.location && (
                  <span className="flex items-center gap-1">
                    <MapPinIcon className="size-3.5" />
                    {job.location}
                  </span>
                )}
                {job.job_type && (
                  <Badge variant="outline" className="text-xs">
                    {job.job_type}
                  </Badge>
                )}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <div className={`px-3 py-1.5 rounded-full border font-semibold ${getScoreColor(match_score)}`}>
                {Math.round(match_score)}%
              </div>
              <Badge variant={scoreBadge.variant} className="text-xs">
                {scoreBadge.label}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4" onClick={() => setShowDetails(true)}>
          {job.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {job.description}
            </p>
          )}

          {job.salary_range && (
            <div className="flex items-center gap-2 text-sm font-medium">
              <DollarSignIcon className="size-4 text-green-600" />
              <span>{job.salary_range}</span>
            </div>
          )}

          <div className="space-y-3">
            {matched_skills && matched_skills.length > 0 && (
              <div>
                <p className="text-xs font-medium mb-2 flex items-center gap-1.5 text-green-600">
                  <TrendingUpIcon className="size-3.5" />
                  Your Skills ({matched_skills.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {matched_skills.slice(0, 6).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {matched_skills.length > 6 && (
                    <Badge variant="outline" className="text-xs">
                      +{matched_skills.length - 6}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {missing_skills && missing_skills.length > 0 && (
              <div>
                <p className="text-xs font-medium mb-2 text-muted-foreground">
                  Skills to Learn ({missing_skills.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {missing_skills.slice(0, 4).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {missing_skills.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{missing_skills.length - 4}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
            <Button className="flex-1" onClick={() => setShowDetails(true)}>
              View & Prepare
            </Button>
            <Button variant="outline" size="icon">
              <BookmarkIcon className="size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <DialogTitle className="text-2xl">{job.title}</DialogTitle>
                <DialogDescription className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                  <span className="flex items-center gap-1.5">
                    <BriefcaseIcon className="size-4" />
                    {job.company || 'Company not specified'}
                  </span>
                  {job.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPinIcon className="size-4" />
                      {job.location}
                    </span>
                  )}
                  {job.salary_range && (
                    <span className="flex items-center gap-1.5">
                      <DollarSignIcon className="size-4" />
                      {job.salary_range}
                    </span>
                  )}
                </DialogDescription>
              </div>
              <div className={`px-4 py-2 rounded-full border font-bold text-lg ${getScoreColor(match_score)}`}>
                {Math.round(match_score)}%
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="details" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Job Details</TabsTrigger>
              <TabsTrigger value="match">Match Analysis</TabsTrigger>
              <TabsTrigger value="prepare">Prepare</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              {job.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {job.description}
                  </p>
                </div>
              )}

              {job.requirements && (
                <div>
                  <h3 className="font-semibold mb-2">Requirements</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {job.requirements}
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button className="flex-1">
                  Apply Now
                </Button>
                {job.source_url && (
                  <Button variant="outline" asChild>
                    <a href={job.source_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLinkIcon className="size-4 mr-2" />
                      View on {job.source}
                    </a>
                  </Button>
                )}
              </div>
            </TabsContent>

            <TabsContent value="match" className="space-y-4 mt-4">
              <div>
                <h3 className="font-semibold mb-3">Match Score Breakdown</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Skills Match</span>
                      <span className="font-medium">
                        {matched_skills?.length || 0} / {(matched_skills?.length || 0) + (missing_skills?.length || 0)}
                      </span>
                    </div>
                    <Progress 
                      value={((matched_skills?.length || 0) / ((matched_skills?.length || 0) + (missing_skills?.length || 0))) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              </div>

              {matched_skills && matched_skills.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-green-600">✓ Your Matching Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {matched_skills.map((skill) => (
                      <Badge key={skill} variant="default">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {missing_skills && missing_skills.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 text-orange-600">⚠ Skills to Develop</h3>
                  <div className="flex flex-wrap gap-2">
                    {missing_skills.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    Don't let missing skills stop you! Many employers value potential and willingness to learn.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="prepare" className="mt-4">
              <JobPreparationPanel job={job} resumeId={resumeId || 'default'} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
