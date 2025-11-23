"use client";

import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { Resume, Experience, Education, Skill, Project } from '@/lib/models/resume';
import type { PDFTemplateComponent } from './types';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#000000',
  },
  header: {
    marginBottom: 30,
    paddingLeft: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666666',
    fontWeight: 'medium',
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
    gap: 10,
  },
  contactItem: {
    fontSize: 10,
    color: '#666666',
  },
  contactLink: {
    fontSize: 10,
    color: '#3b82f6',
    fontWeight: 'medium',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
    paddingBottom: 3,
  },
  experienceItem: {
    marginBottom: 15,
    paddingLeft: 20,
    borderLeftWidth: 2,
    borderLeftColor: '#3b82f633',
    position: 'relative',
  },
  experienceDot: {
    position: 'absolute',
    left: -6,
    top: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  position: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  company: {
    fontSize: 11,
    color: '#3b82f6',
    fontWeight: 'medium',
  },
  date: {
    fontSize: 10,
    fontWeight: 'medium',
    color: '#666666',
  },
  description: {
    fontSize: 10,
    marginTop: 5,
    color: '#333333',
    lineHeight: 1.5,
  },
  achievement: {
    fontSize: 10,
    marginTop: 3,
    color: '#333333',
    paddingLeft: 5,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  skillTag: {
    fontSize: 10,
    padding: 4,
    backgroundColor: '#3b82f61a',
    color: '#3b82f6',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#3b82f633',
    fontWeight: 'medium',
  },
  projectItem: {
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 10,
  },
});

export const ModernTemplatePDF: PDFTemplateComponent = ({ resume }) => {
  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{resume.personalInfo.name || 'Your Name'}</Text>
        {resume.title && <Text style={styles.title}>{resume.title}</Text>}
        <View style={styles.contactInfo}>
          {resume.personalInfo.email && (
            <Text style={styles.contactLink}>{resume.personalInfo.email}</Text>
          )}
          {resume.personalInfo.phone && (
            <Text style={styles.contactItem}>{resume.personalInfo.phone}</Text>
          )}
          {resume.personalInfo.location && (
            <Text style={styles.contactItem}>{resume.personalInfo.location}</Text>
          )}
        </View>
        <View style={styles.contactInfo}>
          {resume.personalInfo.linkedin && (
            <Text style={styles.contactLink}>LinkedIn</Text>
          )}
          {resume.personalInfo.github && (
            <Text style={styles.contactLink}>GitHub</Text>
          )}
          {resume.personalInfo.website && (
            <Text style={styles.contactLink}>Website</Text>
          )}
        </View>
      </View>

      {/* Sections */}
      {resume.sections
        .sort((a, b) => a.order - b.order)
        .map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            {section.type === 'experience' &&
              (section.items as Experience[]).map((exp) => (
                <View key={exp.id} style={styles.experienceItem}>
                  <View style={styles.experienceDot} />
                  <View style={styles.experienceHeader}>
                    <View>
                      <Text style={styles.position}>{exp.position}</Text>
                      <Text style={styles.company}>{exp.company}</Text>
                    </View>
                    <Text style={styles.date}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate || 'Present'}
                    </Text>
                  </View>
                  {exp.description && (
                    <Text style={styles.description}>{exp.description}</Text>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <View style={{ marginTop: 5 }}>
                      {exp.achievements.map((achievement, idx) => (
                        <Text key={idx} style={styles.achievement}>
                          ▸ {achievement}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              ))}

            {section.type === 'education' &&
              (section.items as Education[]).map((edu) => (
                <View key={edu.id} style={styles.experienceItem}>
                  <View style={styles.experienceDot} />
                  <View style={styles.experienceHeader}>
                    <View>
                      <Text style={styles.position}>
                        {edu.degree}
                        {edu.field && ` in ${edu.field}`}
                      </Text>
                      <Text style={styles.company}>{edu.institution}</Text>
                    </View>
                    {edu.startDate && edu.endDate && (
                      <Text style={styles.date}>
                        {edu.startDate} - {edu.endDate}
                      </Text>
                    )}
                  </View>
                  {edu.gpa && <Text style={styles.description}>GPA: {edu.gpa}</Text>}
                </View>
              ))}

            {section.type === 'skills' && (
              <View style={styles.skillsContainer}>
                {(section.items as Skill[]).map((skill) => (
                  <Text key={skill.id} style={styles.skillTag}>
                    {skill.name}
                    {skill.level && ` • ${skill.level}`}
                  </Text>
                ))}
              </View>
            )}

            {section.type === 'projects' &&
              (section.items as Project[]).map((proj) => (
                <View key={proj.id} style={styles.projectItem}>
                  <Text style={styles.position}>{proj.name}</Text>
                  {proj.description && (
                    <Text style={styles.description}>{proj.description}</Text>
                  )}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <View style={{ marginTop: 5, flexDirection: 'row', flexWrap: 'wrap', gap: 3 }}>
                      {proj.technologies.map((tech, idx) => (
                        <Text key={idx} style={styles.skillTag}>
                          {tech}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              ))}

            {section.type === 'summary' && section.items[0] && (
              <Text style={styles.description}>{section.items[0] as string}</Text>
            )}
          </View>
        ))}
    </View>
  );
};

