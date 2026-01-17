"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { JobMatch } from '@/lib/models/job';
import { useJobMatches } from '@/lib/hooks/use-job-matches';
import { useJobApplications } from '@/lib/hooks/use-job-applications';
import { useState } from 'react';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, Eye, Archive } from 'lucide-react';

interface JobMatchCardProps {
  match: JobMatch & {
    job?: {
      title: string;
      company: string;
      location: string;
      source: string;
    };
  };
  resumeId: string;
  onStatusChange?: () => void;
}

export function JobMatchCard({ match, resumeId, onStatusChange }: JobMatchCardProps) {
  const [isApplying, setIsApplying] = useState(false);
  const { createApplication } = useJobApplications({ autoFetch: false });

  const handleApply = async () => {
    if (!match.job_id) return;

    try {
      setIsApplying(true);
      await createApplication(match.job_id, resumeId, false);
      toast.success('Application submitted successfully');
      onStatusChange?.();
    } catch (error) {
      toast.error('Failed to submit application');
      console.error(error);
    } finally {
      setIsApplying(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'applied':
        return <Badge variant="default" className="bg-green-500">Applied</Badge>;
      case 'viewed':
        return <Badge variant="secondary">Viewed</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'archived':
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge variant="outline">New</Badge>;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{match.job?.title || 'Job Title'}</CardTitle>
            <CardDescription className="mt-1">
              {match.job?.company || 'Company'} • {match.job?.location || 'Location'}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(match.status)}
            <Badge variant="outline" className="text-xs">
              {match.job?.source || 'unknown'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Match Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Match Score</span>
            <span className={`text-lg font-bold ${getScoreColor(match.match_score)}`}>
              {match.match_score.toFixed(0)}%
            </span>
          </div>
          <Progress value={match.match_score} className="h-2" />
        </div>

        {/* Matched Skills */}
        {match.matched_skills && match.matched_skills.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Matched Skills</p>
            <div className="flex flex-wrap gap-2">
              {match.matched_skills.slice(0, 5).map((skill, idx) => (
                <Badge key={idx} variant="default" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {match.matched_skills.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{match.matched_skills.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Missing Skills */}
        {match.missing_skills && match.missing_skills.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2 text-muted-foreground">Missing Skills</p>
            <div className="flex flex-wrap gap-2">
              {match.missing_skills.slice(0, 3).map((skill, idx) => (
                <Badge key={idx} variant="outline" className="text-xs opacity-60">
                  {skill}
                </Badge>
              ))}
              {match.missing_skills.length > 3 && (
                <Badge variant="outline" className="text-xs opacity-60">
                  +{match.missing_skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {match.status === 'new' && (
            <Button
              onClick={handleApply}
              disabled={isApplying}
              className="flex-1"
            >
              {isApplying ? 'Applying...' : 'Apply Now'}
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              // Mark as viewed
              // This would call an API to update status
              toast.info('Marked as viewed');
              onStatusChange?.();
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              // Archive
              toast.info('Archived');
              onStatusChange?.();
            }}
          >
            <Archive className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

