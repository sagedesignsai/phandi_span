import type { Resume } from '@/lib/models/resume';
import type { ReactNode } from 'react';

/**
 * PDF Template Component Type
 * Templates must render using @react-pdf/renderer components
 */
export interface PDFTemplateComponent {
  (props: { resume: Resume }): ReactNode;
}

/**
 * Template Registry
 * Maps template IDs to their PDF components
 */
export type TemplateRegistry = Record<string, PDFTemplateComponent>;

