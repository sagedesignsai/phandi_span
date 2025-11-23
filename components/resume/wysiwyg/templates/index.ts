import { DefaultTemplatePDF } from './default-template-pdf';
import { ModernTemplatePDF } from './modern-template-pdf';
import { ClassicTemplatePDF } from './classic-template-pdf';
import { MinimalistTemplatePDF } from './minimalist-template-pdf';
import type { TemplateRegistry } from './types';

/**
 * Template Registry
 * Maps template IDs to their PDF components
 */
export const pdfTemplateRegistry: TemplateRegistry = {
  default: DefaultTemplatePDF,
  modern: ModernTemplatePDF,
  classic: ClassicTemplatePDF,
  minimalist: MinimalistTemplatePDF,
};

/**
 * Get PDF template component by ID
 */
export function getPDFTemplate(templateId: string) {
  return pdfTemplateRegistry[templateId] || pdfTemplateRegistry.default;
}

