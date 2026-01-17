import { nanoid } from 'nanoid';
import type { Resume, ResumeSection, Experience, Education, Skill, Project, PersonalInfo } from '@/lib/models/resume';
import type { Block, BlockType, HeaderBlockData, SectionBlockData, ExperienceBlockData, EducationBlockData, SkillBlockData, ProjectBlockData, SummaryBlockData } from './block-types';

/**
 * Convert Resume schema to Blocks
 * This allows the editor to work with the existing Resume structure
 */
export function resumeToBlocks(resume: Resume): Block[] {
  const blocks: Block[] = [];

  // Header block (always first)
  const headerBlock: Block = {
    id: 'header-block',
    type: 'header',
    order: 0,
    data: {
      name: resume.personalInfo.name,
      title: resume.title,
      email: resume.personalInfo.email,
      phone: resume.personalInfo.phone,
      location: resume.personalInfo.location,
      linkedin: resume.personalInfo.linkedin,
      github: resume.personalInfo.github,
      website: resume.personalInfo.website,
      portfolio: resume.personalInfo.portfolio,
    } as HeaderBlockData,
  };
  blocks.push(headerBlock);

  // Process sections
  const sortedSections = [...resume.sections].sort((a, b) => a.order - b.order);
  
  sortedSections.forEach((section, sectionIndex) => {
    // Section header block
    const sectionBlock: Block = {
      id: section.id,
      type: 'section',
      order: (sectionIndex + 1) * 100,
      data: {
        title: section.title,
        sectionType: section.type,
      } as SectionBlockData,
    };
    blocks.push(sectionBlock);

    // Section items as individual blocks
    if (section.type === 'experience' && Array.isArray(section.items)) {
      (section.items as Experience[]).forEach((exp, itemIndex) => {
        const expBlock: Block = {
          id: exp.id,
          type: 'experience',
          order: (sectionIndex + 1) * 100 + itemIndex + 1,
          data: {
            id: exp.id,
            company: exp.company,
            position: exp.position,
            location: exp.location,
            startDate: exp.startDate,
            endDate: exp.endDate,
            current: exp.current,
            description: exp.description,
            achievements: exp.achievements,
          } as ExperienceBlockData,
        };
        blocks.push(expBlock);
      });
    } else if (section.type === 'education' && Array.isArray(section.items)) {
      (section.items as Education[]).forEach((edu, itemIndex) => {
        const eduBlock: Block = {
          id: edu.id,
          type: 'education',
          order: (sectionIndex + 1) * 100 + itemIndex + 1,
          data: {
            id: edu.id,
            institution: edu.institution,
            degree: edu.degree,
            field: edu.field,
            location: edu.location,
            startDate: edu.startDate,
            endDate: edu.endDate,
            gpa: edu.gpa,
            honors: edu.honors,
          } as EducationBlockData,
        };
        blocks.push(eduBlock);
      });
    } else if (section.type === 'skills' && Array.isArray(section.items)) {
      (section.items as Skill[]).forEach((skill, itemIndex) => {
        const skillBlock: Block = {
          id: skill.id,
          type: 'skill',
          order: (sectionIndex + 1) * 100 + itemIndex + 1,
          data: {
            id: skill.id,
            name: skill.name,
            category: skill.category,
            level: skill.level,
          } as SkillBlockData,
        };
        blocks.push(skillBlock);
      });
    } else if (section.type === 'projects' && Array.isArray(section.items)) {
      (section.items as Project[]).forEach((project, itemIndex) => {
        const projectBlock: Block = {
          id: project.id,
          type: 'project',
          order: (sectionIndex + 1) * 100 + itemIndex + 1,
          data: {
            id: project.id,
            name: project.name,
            description: project.description,
            technologies: project.technologies,
            url: project.url,
            github: project.github,
            startDate: project.startDate,
            endDate: project.endDate,
          } as ProjectBlockData,
        };
        blocks.push(projectBlock);
      });
    } else if (section.type === 'summary' && section.items.length > 0) {
      const summaryBlock: Block = {
        id: `summary-${section.id}`,
        type: 'summary',
        order: (sectionIndex + 1) * 100 + 1,
        data: {
          content: section.items[0] as string,
        } as SummaryBlockData,
      };
      blocks.push(summaryBlock);
    }
  });

  return blocks;
}

/**
 * Convert Blocks to Resume schema
 * This maintains compatibility with existing Resume structure
 */
export function blocksToResume(blocks: Block[], resumeId: string, template: string = 'default'): Resume {
  const headerBlock = blocks.find(b => b.type === 'header');
  const headerData = headerBlock?.data as HeaderBlockData | undefined;

  if (!headerData) {
    throw new Error('Resume must have a header block');
  }

  // Build personal info from header
  const personalInfo: PersonalInfo = {
    name: headerData.name || '',
    email: headerData.email,
    phone: headerData.phone,
    location: headerData.location,
    linkedin: headerData.linkedin,
    github: headerData.github,
    website: headerData.website,
    portfolio: headerData.portfolio,
  };

  // Group blocks by sections
  const sections: ResumeSection[] = [];
  const sortedBlocks = [...blocks]
    .filter(b => b.type !== 'header')
    .sort((a, b) => a.order - b.order);

  let currentSection: ResumeSection | null = null;
  let sectionOrder = 0;

  for (const block of sortedBlocks) {
    if (block.type === 'section') {
      // Save previous section if exists
      if (currentSection) {
        sections.push(currentSection);
      }

      // Start new section
      const sectionData = block.data as SectionBlockData;
      currentSection = {
        id: block.id,
        type: sectionData.sectionType,
        title: sectionData.title,
        items: [],
        order: sectionOrder++,
      };
    } else if (currentSection) {
      // Add item to current section
      if (block.type === 'experience') {
        const expData = block.data as ExperienceBlockData;
        currentSection.items.push({
          id: expData.id,
          company: expData.company,
          position: expData.position,
          location: expData.location,
          startDate: expData.startDate,
          endDate: expData.endDate,
          current: expData.current ?? false,
          description: expData.description,
          achievements: expData.achievements,
        } as Experience);
      } else if (block.type === 'education') {
        const eduData = block.data as EducationBlockData;
        currentSection.items.push({
          id: eduData.id,
          institution: eduData.institution,
          degree: eduData.degree,
          field: eduData.field,
          location: eduData.location,
          startDate: eduData.startDate,
          endDate: eduData.endDate,
          gpa: eduData.gpa,
          honors: eduData.honors,
        } as Education);
      } else if (block.type === 'skill') {
        const skillData = block.data as SkillBlockData;
        currentSection.items.push({
          id: skillData.id,
          name: skillData.name,
          category: skillData.category,
          level: skillData.level,
        } as Skill);
      } else if (block.type === 'project') {
        const projectData = block.data as ProjectBlockData;
        currentSection.items.push({
          id: projectData.id,
          name: projectData.name,
          description: projectData.description,
          technologies: projectData.technologies,
          url: projectData.url,
          github: projectData.github,
          startDate: projectData.startDate,
          endDate: projectData.endDate,
        } as Project);
      } else if (block.type === 'summary') {
        const summaryData = block.data as SummaryBlockData;
        currentSection.items = [summaryData.content];
      }
    }
  }

  // Add last section
  if (currentSection) {
    sections.push(currentSection);
  }

  // Build resume
  const now = new Date().toISOString();
  return {
    id: resumeId,
    title: headerData.title || `${headerData.name}'s Resume`,
    personalInfo,
    sections,
    template,
    metadata: {
      createdAt: now,
      updatedAt: now,
      lastEdited: now,
      version: 1,
    },
  };
}

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



