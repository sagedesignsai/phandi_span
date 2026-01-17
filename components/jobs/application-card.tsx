"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { JobApplication } from '@/lib/models/job';
import { format } from 'date-fns';
import { ExternalLink, FileText, Calendar } from 'lucide-react';

interface ApplicationCardProps {
  application: JobApplication & {
    job?: {
      title: string;
      company: string;
      location: string;
    };
  };
  onViewCoverLetter?: (coverLetterId: string) => void;
}

export function ApplicationCard({ application, onViewCoverLetter }: ApplicationCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'applied':
        return <Badge variant="default">Applied</Badge>;
      case 'viewed':
        return <Badge variant="secondary">Viewed</Badge>;
      case 'interview':
        return <Badge className="bg-blue-500">Interview</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'offer':
        return <Badge className="bg-green-500">Offer</Badge>;
      case 'withdrawn':
        return <Badge variant="outline">Withdrawn</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">
              {application.job?.title || 'Job Title'}
            </CardTitle>
            <CardDescription className="mt-1">
              {application.job?.company || 'Company'} • {application.job?.location || 'Location'}
            </CardDescription>
          </div>
          {getStatusBadge(application.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Application Date */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            Applied on{' '}
            {application.applied_at
              ? format(new Date(application.applied_at), 'MMM d, yyyy')
              : 'N/A'}
          </span>
        </div>

        {/* Response Date */}
        {application.response_received_at && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Response received on {format(new Date(application.response_received_at), 'MMM d, yyyy')}</span>
          </div>
        )}

        {/* Email Status */}
        {application.email_sent && (
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline" className="text-xs">
              Email Sent
            </Badge>
            {application.email_id && (
              <span className="text-xs text-muted-foreground">ID: {application.email_id.slice(0, 8)}...</span>
            )}
          </div>
        )}

        {/* Notes */}
        {application.notes && (
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm font-medium mb-1">Notes</p>
            <p className="text-sm text-muted-foreground">{application.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {application.cover_letter_id && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewCoverLetter?.(application.cover_letter_id!)}
            >
              <FileText className="h-4 w-4 mr-2" />
              View Cover Letter
            </Button>
          )}
          <Button variant="outline" size="sm" asChild>
            <a href={`/dashboard/careers/${application.resume_id}/jobs/applications/${application.id}`} target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Details
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
