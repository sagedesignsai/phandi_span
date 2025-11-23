"use client";

import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { Resume, Experience, Education, Skill, Project } from '@/lib/models/resume';
import type { PDFTemplateComponent } from './types';

const styles = StyleSheet.create({
  page: {
    padding: 60,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#000000',
  },
  header: {
    marginBottom: 40,
  },
  name: {
    fontSize: 20,
    fontWeight: 'normal',
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 9,
    marginBottom: 20,
    color: '#666666',
    fontWeight: 'normal',
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
    gap: 15,
  },
  contactItem: {
    fontSize: 8,
    color: '#666666',
    fontWeight: 'normal',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 7,
    fontWeight: 'normal',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 2,
    color: '#666666',
  },
  experienceItem: {
    marginBottom: 20,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  position: {
    fontSize: 10,
    fontWeight: 'normal',
  },
  company: {
    fontSize: 9,
    color: '#666666',
    fontWeight: 'normal',
    marginTop: 2,
  },
  date: {
    fontSize: 8,
    color: '#666666',
    fontWeight: 'normal',
  },
  description: {
    fontSize: 9,
    marginTop: 5,
    color: '#333333',
    lineHeight: 1.4,
    fontWeight: 'normal',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    fontSize: 9,
    color: '#666666',
    fontWeight: 'normal',
  },
  projectItem: {
    marginBottom: 15,
  },
});

export const MinimalistTemplatePDF: PDFTemplateComponent = ({ resume }) => {
  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{resume.personalInfo.name || 'Your Name'}</Text>
        {resume.title && <Text style={styles.title}>{resume.title}</Text>}
        <View style={styles.contactInfo}>
          {resume.personalInfo.email && (
            <Text style={styles.contactItem}>{resume.personalInfo.email}</Text>
          )}
          {resume.personalInfo.phone && (
            <Text style={styles.contactItem}>{resume.personalInfo.phone}</Text>
          )}
          {resume.personalInfo.location && (
            <Text style={styles.contactItem}>{resume.personalInfo.location}</Text>
          )}
          {resume.personalInfo.linkedin && (
            <Text style={styles.contactItem}>LinkedIn</Text>
          )}
          {resume.personalInfo.github && (
            <Text style={styles.contactItem}>GitHub</Text>
          )}
          {resume.personalInfo.website && (
            <Text style={styles.contactItem}>Website</Text>
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
                </View>
              ))}

            {section.type === 'education' &&
              (section.items as Education[]).map((edu) => (
                <View key={edu.id} style={styles.experienceItem}>
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

