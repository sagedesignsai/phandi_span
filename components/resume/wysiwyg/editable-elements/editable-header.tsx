"use client";

import React from 'react';
import { EditableText } from './editable-text';
import type { PersonalInfo } from '@/lib/models/resume';

interface EditableHeaderProps {
  personalInfo: PersonalInfo;
  title?: string;
  onUpdate: (field: keyof PersonalInfo, value: string) => void;
  onTitleUpdate?: (title: string) => void;
  className?: string;
}

/**
 * Editable Header Component
 * Personal information editor with inline editing for all fields
 */
export function EditableHeader({
  personalInfo,
  title,
  onUpdate,
  onTitleUpdate,
  className,
}: EditableHeaderProps) {
  return (
    <div className={className}>
      {/* Name */}
      <div className="mb-2">
        <EditableText
          value={personalInfo.name || ''}
          onChange={(value) => onUpdate('name', value)}
          placeholder="Your Name"
          fontSize={24}
          fontWeight="bold"
        />
      </div>

      {/* Title */}
      {onTitleUpdate && (
        <div className="mb-4">
          <EditableText
            value={title || ''}
            onChange={onTitleUpdate}
            placeholder="Resume Title"
            fontSize={14}
          />
        </div>
      )}

      {/* Contact Information */}
      <div className="flex flex-wrap gap-4 mb-2 text-sm">
        {personalInfo.email && (
          <EditableText
            value={personalInfo.email}
            onChange={(value) => onUpdate('email', value)}
            placeholder="Email"
            fontSize={10}
          />
        )}
        {personalInfo.phone && (
          <EditableText
            value={personalInfo.phone}
            onChange={(value) => onUpdate('phone', value)}
            placeholder="Phone"
            fontSize={10}
          />
        )}
        {personalInfo.location && (
          <EditableText
            value={personalInfo.location}
            onChange={(value) => onUpdate('location', value)}
            placeholder="Location"
            fontSize={10}
          />
        )}
      </div>

      {/* Social Links */}
      <div className="flex flex-wrap gap-4 text-sm">
        {personalInfo.linkedin && (
          <EditableText
            value={personalInfo.linkedin}
            onChange={(value) => onUpdate('linkedin', value)}
            placeholder="LinkedIn URL"
            fontSize={10}
          />
        )}
        {personalInfo.github && (
          <EditableText
            value={personalInfo.github}
            onChange={(value) => onUpdate('github', value)}
            placeholder="GitHub URL"
            fontSize={10}
          />
        )}
        {personalInfo.website && (
          <EditableText
            value={personalInfo.website}
            onChange={(value) => onUpdate('website', value)}
            placeholder="Website URL"
            fontSize={10}
          />
        )}
        {personalInfo.portfolio && (
          <EditableText
            value={personalInfo.portfolio}
            onChange={(value) => onUpdate('portfolio', value)}
            placeholder="Portfolio URL"
            fontSize={10}
          />
        )}
      </div>

      {/* Add new fields */}
      {!personalInfo.email && (
        <div className="mt-2">
          <EditableText
            value=""
            onChange={(value) => value && onUpdate('email', value)}
            placeholder="+ Add Email"
            fontSize={10}
          />
        </div>
      )}
      {!personalInfo.phone && (
        <div className="mt-2">
          <EditableText
            value=""
            onChange={(value) => value && onUpdate('phone', value)}
            placeholder="+ Add Phone"
            fontSize={10}
          />
        </div>
      )}
    </div>
  );
}

