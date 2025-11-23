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
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  title: {
    fontSize: 14,
    marginBottom: 10,
    color: '#666666',
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
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 3,
  },
  experienceItem: {
    marginBottom: 10,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  position: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  company: {
    fontSize: 11,
    color: '#333333',
  },
  date: {
    fontSize: 10,
    color: '#666666',
  },
  description: {
    fontSize: 10,
    marginTop: 3,
    color: '#333333',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  skillTag: {
    fontSize: 10,
    padding: 3,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
  },
});

export const DefaultTemplatePDF: PDFTemplateComponent = ({ resume }) => {
  return (
    <View style={styles.page} wrap={false}>
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
                  {exp.achievements && exp.achievements.length > 0 && (
                    <View style={{ marginTop: 3 }}>
                      {exp.achievements.map((achievement, idx) => (
                        <Text key={idx} style={styles.description}>
                          • {achievement}
                        </Text>
                      ))}
                    </View>
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
                  {edu.honors && edu.honors.length > 0 && (
                    <View style={{ marginTop: 3 }}>
                      {edu.honors.map((honor, idx) => (
                        <Text key={idx} style={styles.description}>
                          • {honor}
                        </Text>
                      ))}
                    </View>
                  )}
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
                <View key={proj.id} style={styles.experienceItem}>
                  <Text style={styles.position}>{proj.name}</Text>
                  {proj.description && (
                    <Text style={styles.description}>{proj.description}</Text>
                  )}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <View style={{ marginTop: 3, flexDirection: 'row', flexWrap: 'wrap', gap: 3 }}>
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

            {section.type === 'custom' && (
              <View>
                {section.items.map((item, idx) => (
                  <Text key={idx} style={styles.description}>
                    {typeof item === 'string' ? item : JSON.stringify(item)}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ))}
    </View>
  );
};

