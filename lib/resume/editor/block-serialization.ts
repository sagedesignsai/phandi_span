import { nanoid } from 'nanoid';
import type { BlockResume } from '@/lib/models/resume';
import type { Block, BlockType, HeaderBlockData, SectionBlockData, ExperienceBlockData, EducationBlockData, SkillBlockData, ProjectBlockData, SummaryBlockData, TableBlockData, ImageBlockData } from './block-types';

/**
 * Create a new block with default data
 */
export function createDefaultBlock(type: BlockType, order: number): Block {
  const id = nanoid();
  
  switch (type) {
    case 'header':
      return {
        id: 'header-block',
        type: 'header',
        order: 0,
        data: {
          name: '',
          title: '',
        } as HeaderBlockData,
      };
    
    case 'section':
      return {
        id,
        type: 'section',
        order,
        data: {
          title: 'New Section',
          sectionType: 'custom',
        } as SectionBlockData,
      };
    
    case 'experience':
      return {
        id,
        type: 'experience',
        order,
        data: {
          id,
          company: '',
          position: '',
          startDate: '',
          current: false,
        } as ExperienceBlockData,
      };
    
    case 'education':
      return {
        id,
        type: 'education',
        order,
        data: {
          id,
          institution: '',
          degree: '',
        } as EducationBlockData,
      };
    
    case 'skill':
      return {
        id,
        type: 'skill',
        order,
        data: {
          id,
          name: '',
        } as SkillBlockData,
      };
    
    case 'project':
      return {
        id,
        type: 'project',
        order,
        data: {
          id,
          name: '',
          description: '',
        } as ProjectBlockData,
      };
    
    case 'summary':
      return {
        id,
        type: 'summary',
        order,
        data: {
          content: '',
        } as SummaryBlockData,
      };
    
    case 'table':
      return {
        id,
        type: 'table',
        order,
        data: {
          id,
          title: 'Table',
          headers: ['Column 1', 'Column 2'],
          rows: [['Row 1 Col 1', 'Row 1 Col 2']],
          showHeaders: true,
          bordered: true,
        } as TableBlockData,
      };
    
    case 'image':
      return {
        id,
        type: 'image',
        order,
        data: {
          id,
          src: '',
          alt: 'Image',
          caption: '',
          alignment: 'center',
        } as ImageBlockData,
      };
    
    case 'divider':
      return {
        id,
        type: 'divider',
        order,
        data: {},
      };
    
    case 'custom':
      return {
        id,
        type: 'custom',
        order,
        data: {},
      };
    
    default:
      throw new Error(`Unknown block type: ${type}`);
  }
}

/**
 * Create a new block-based resume
 */
export function createBlockResume(title: string = 'New Resume'): BlockResume {
  const now = new Date().toISOString();
  const id = nanoid();
  
  // Create default header block
  const headerBlock = createDefaultBlock('header', 0);
  
  return {
    id,
    title,
    blocks: [headerBlock],
    template: 'default',
    metadata: {
      createdAt: now,
      updatedAt: now,
      lastEdited: now,
      version: 1,
    },
  };
}



