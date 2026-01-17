"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, RefreshCw } from 'lucide-react';
import type { CoverLetter } from '@/lib/models/job';

interface CoverLetterViewerProps {
  coverLetter: CoverLetter;
  onRegenerate?: () => void;
}

export function CoverLetterViewer({ coverLetter, onRegenerate }: CoverLetterViewerProps) {
  const handleDownload = () => {
    // Create a blob and download
    const blob = new Blob([coverLetter.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${coverLetter.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Cover Letter</CardTitle>
            <CardDescription>
              Template: <Badge variant="outline">{coverLetter.template}</Badge>
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {onRegenerate && (
              <Button variant="outline" size="sm" onClick={onRegenerate}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none whitespace-pre-wrap text-sm">
          {coverLetter.content}
        </div>
        {coverLetter.created_at && (
          <p className="text-xs text-muted-foreground mt-4">
            Created on {new Date(coverLetter.created_at).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

