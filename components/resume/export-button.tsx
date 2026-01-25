"use client";

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DownloadIcon, FileTextIcon, FileIcon } from 'lucide-react';
import type { Resume } from '@/lib/models/resume';
import { generatePDF, generateHTML } from '@/lib/utils/export';
import type { BlockResume } from '@/lib/models/resume';

interface ExportButtonProps {
  resume: BlockResume;
  className?: string;
}

export function ExportButton({ resume, className }: ExportButtonProps) {
  const handleExportPDF = async () => {
    try {
      const blob = await generatePDF(resume);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resume.title.replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const handleExportHTML = async () => {
    try {
      const html = generateHTML(resume);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resume.title.replace(/\s+/g, '-')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export HTML:', error);
      alert('Failed to export HTML. Please try again.');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className}>
          <DownloadIcon className="size-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportPDF}>
          <FileTextIcon className="size-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportHTML}>
          <FileIcon className="size-4 mr-2" />
          Export as HTML
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

