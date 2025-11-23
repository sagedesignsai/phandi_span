"use client";

import { useMemo } from 'react';
import type { Resume } from '@/lib/models/resume';
import type { Experience, Education, Skill, Project } from '@/lib/models/resume';

export interface EditableRegion {
  id: string;
  path: string; // JSON path to the value in resume data
  x: number; // PDF coordinates in points
  y: number;
  width: number;
  height: number;
  type: 'text' | 'textarea' | 'section' | 'item';
  multiline?: boolean;
  sectionId?: string;
  itemId?: string;
}

// Approximate positions based on A4 layout (595.28 x 841.89 points)
const HEADER_Y = 40;
const HEADER_NAME_Y = 40;
const HEADER_TITLE_Y = 70;
const HEADER_CONTACT_Y = 90;
const SECTION_SPACING = 15;
const ITEM_SPACING = 10;

/**
 * Calculate editable regions for a resume
 * This is a simplified version - in a real implementation, you'd calculate
 * actual positions from the rendered PDF layout
 */
export function useEditableRegions(resume: Resume): EditableRegion[] {
  return useMemo(() => {
    const regions: EditableRegion[] = [];
    let currentY = HEADER_Y;

    // Personal Info - Name
    regions.push({
      id: 'personal-info-name',
      path: 'personalInfo.name',
      x: 40,
      y: HEADER_NAME_Y,
      width: 300,
      height: 24,
      type: 'text',
    });

    // Personal Info - Title
    if (resume.title) {
      regions.push({
        id: 'resume-title',
        path: 'title',
        x: 40,
        y: HEADER_TITLE_Y,
        width: 300,
        height: 14,
        type: 'text',
      });
    }

    // Personal Info - Contact
    currentY = HEADER_CONTACT_Y;
    let contactX = 40;
    if (resume.personalInfo.email) {
      regions.push({
        id: 'personal-info-email',
        path: 'personalInfo.email',
        x: contactX,
        y: currentY,
        width: 150,
        height: 10,
        type: 'text',
      });
      contactX += 160;
    }
    if (resume.personalInfo.phone) {
      regions.push({
        id: 'personal-info-phone',
        path: 'personalInfo.phone',
        x: contactX,
        y: currentY,
        width: 120,
        height: 10,
        type: 'text',
      });
      contactX += 130;
    }
    if (resume.personalInfo.location) {
      regions.push({
        id: 'personal-info-location',
        path: 'personalInfo.location',
        x: contactX,
        y: currentY,
        width: 120,
        height: 10,
        type: 'text',
      });
    }

    // Sections
    currentY = 120;
    resume.sections
      .sort((a, b) => a.order - b.order)
      .forEach((section) => {
        // Section Title
        regions.push({
          id: `section-title-${section.id}`,
          path: `sections.${section.id}.title`,
          x: 40,
          y: currentY,
          width: 200,
          height: 14,
          type: 'text',
          sectionId: section.id,
        });

        currentY += 25;

        // Section Items
        section.items.forEach((item, index) => {
          const itemId = typeof item === 'object' && 'id' in item ? item.id : `item-${index}`;

          if (section.type === 'experience') {
            const exp = item as Experience;
            regions.push({
              id: `exp-position-${exp.id}`,
              path: `sections.${section.id}.items.${index}.position`,
              x: 40,
              y: currentY,
              width: 250,
              height: 12,
              type: 'text',
              sectionId: section.id,
              itemId: exp.id,
            });
            currentY += 15;
            regions.push({
              id: `exp-company-${exp.id}`,
              path: `sections.${section.id}.items.${index}.company`,
              x: 40,
              y: currentY,
              width: 200,
              height: 11,
              type: 'text',
              sectionId: section.id,
              itemId: exp.id,
            });
            currentY += 15;
            if (exp.description) {
              regions.push({
                id: `exp-description-${exp.id}`,
                path: `sections.${section.id}.items.${index}.description`,
                x: 40,
                y: currentY,
                width: 500,
                height: 30,
                type: 'textarea',
                multiline: true,
                sectionId: section.id,
                itemId: exp.id,
              });
              currentY += 35;
            }
            currentY += ITEM_SPACING;
          } else if (section.type === 'education') {
            const edu = item as Education;
            regions.push({
              id: `edu-degree-${edu.id}`,
              path: `sections.${section.id}.items.${index}.degree`,
              x: 40,
              y: currentY,
              width: 250,
              height: 12,
              type: 'text',
              sectionId: section.id,
              itemId: edu.id,
            });
            currentY += 15;
            regions.push({
              id: `edu-institution-${edu.id}`,
              path: `sections.${section.id}.items.${index}.institution`,
              x: 40,
              y: currentY,
              width: 200,
              height: 11,
              type: 'text',
              sectionId: section.id,
              itemId: edu.id,
            });
            currentY += ITEM_SPACING + 15;
          } else if (section.type === 'skills') {
            const skill = item as Skill;
            regions.push({
              id: `skill-${skill.id}`,
              path: `sections.${section.id}.items.${index}.name`,
              x: 40 + (index % 5) * 100,
              y: currentY + Math.floor(index / 5) * 20,
              width: 80,
              height: 10,
              type: 'text',
              sectionId: section.id,
              itemId: skill.id,
            });
            if ((index + 1) % 5 === 0) {
              currentY += 20;
            }
          } else if (section.type === 'projects') {
            const proj = item as Project;
            regions.push({
              id: `proj-name-${proj.id}`,
              path: `sections.${section.id}.items.${index}.name`,
              x: 40,
              y: currentY,
              width: 200,
              height: 12,
              type: 'text',
              sectionId: section.id,
              itemId: proj.id,
            });
            currentY += 15;
            if (proj.description) {
              regions.push({
                id: `proj-description-${proj.id}`,
                path: `sections.${section.id}.items.${index}.description`,
                x: 40,
                y: currentY,
                width: 500,
                height: 30,
                type: 'textarea',
                multiline: true,
                sectionId: section.id,
                itemId: proj.id,
              });
              currentY += 35;
            }
            currentY += ITEM_SPACING;
          } else if (section.type === 'summary') {
            regions.push({
              id: `summary-${section.id}`,
              path: `sections.${section.id}.items.0`,
              x: 40,
              y: currentY,
              width: 500,
              height: 60,
              type: 'textarea',
              multiline: true,
              sectionId: section.id,
            });
            currentY += 65;
          }
        });

        currentY += SECTION_SPACING;
      });

    return regions;
  }, [resume]);
}

