"use client";

import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import type { Resume, Experience, Education, Skill, Project } from '@/lib/models/resume';
import type { PDFTemplateComponent } from './types';

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 11,
    fontFamily: 'Times-Roman',
    color: '#000000',
  },
  header: {
    marginBottom: 30,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    paddingBottom: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 1,
    fontFamily: 'Times-Bold',
  },
  title: {
    fontSize: 14,
    marginBottom: 10,
    color: '#666666',
    fontStyle: 'italic',
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 5,
    gap: 10,
  },
  contactItem: {
    fontSize: 10,
    color: '#666666',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 5,
    fontFamily: 'Times-Bold',
  },
  experienceItem: {
    marginBottom: 15,
    textAlign: 'center',
  },
  experienceHeader: {
    marginBottom: 5,
  },
  position: {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'Times-Bold',
  },
  company: {
    fontSize: 11,
    color: '#666666',
    fontStyle: 'italic',
    marginTop: 2,
  },
  date: {
    fontSize: 10,
    color: '#666666',
    marginTop: 3,
  },
  description: {
    fontSize: 10,
    marginTop: 5,
    color: '#333333',
    lineHeight: 1.5,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 5,
  },
  skillTag: {
    fontSize: 10,
    padding: 3,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
  },
  projectItem: {
    marginBottom: 12,
    textAlign: 'center',
  },
});

export const ClassicTemplatePDF: PDFTemplateComponent = ({ resume }) => {
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
        </View>
        {(resume.personalInfo.linkedin || resume.personalInfo.github || resume.personalInfo.website) && (
          <View style={styles.contactInfo}>
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
        )}
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
                    <Text style={styles.position}>{exp.position}</Text>
                    <Text style={styles.company}>{exp.company}</Text>
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
                    <Text style={styles.position}>
                      {edu.degree}
                      {edu.field && ` in ${edu.field}`}
                    </Text>
                    <Text style={styles.company}>{edu.institution}</Text>
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
              <Text style={[styles.description, { textAlign: 'center', fontStyle: 'italic' }]}>
                {section.items[0] as string}
              </Text>
            )}
          </View>
        ))}
    </View>
  );
};

