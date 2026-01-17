"use client";

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DownloadIcon, FileTextIcon, FileIcon } from 'lucide-react';
import type { CoverLetter } from '@/lib/models/cover-letter';
import { generateCoverLetterPDF, generateCoverLetterTXT } from '@/lib/utils/cover-letter-export';
import { toast } from 'sonner';

interface ExportButtonProps {
  coverLetter: CoverLetter;
  className?: string;
}

export function ExportButton({ coverLetter, className }: ExportButtonProps) {
  const handleExportPDF = async () => {
    try {
      const blob = await generateCoverLetterPDF(coverLetter);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cover-letter-${coverLetter.companyName || 'document'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('PDF exported successfully');
    } catch (error) {
      console.error('Failed to export PDF:', error);
      toast.error('Failed to export PDF');
    }
  };

  const handleExportTXT = () => {
    try {
      const txt = generateCoverLetterTXT(coverLetter);
      const blob = new Blob([txt], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cover-letter-${coverLetter.companyName || 'document'}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Text file exported successfully');
    } catch (error) {
      console.error('Failed to export TXT:', error);
      toast.error('Failed to export text file');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <DownloadIcon className="size-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportPDF}>
          <FileTextIcon className="size-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportTXT}>
          <FileIcon className="size-4 mr-2" />
          Export as TXT
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
