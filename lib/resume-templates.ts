import type { Template } from '@/lib/models/resume';

export const resumeTemplates: Template[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Clean and professional template with balanced layout',
    category: 'Professional',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with bold typography and accent colors',
    category: 'Modern',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional layout with elegant serif typography',
    category: 'Traditional',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Ultra-clean design with minimal styling and maximum readability',
    category: 'Minimal',
  },
];

export function getTemplate(id: string): Template | undefined {
  return resumeTemplates.find((t) => t.id === id);
}

export function getTemplatesByCategory(category: string): Template[] {
  return resumeTemplates.filter((t) => t.category === category);
}

