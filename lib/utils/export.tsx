"use client";

import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import type { Resume, Experience, Education, Skill, Project } from '@/lib/models/resume';

// PDF Styles
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

// PDF Document Component
const ResumePDFDocument = ({ resume }: { resume: Resume }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{resume.personalInfo.name}</Text>
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
                <View key={proj.id} style={styles.experienceItem}>
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
    </Page>
  </Document>
);

/**
 * Generate PDF blob from resume
 */
export async function generatePDF(resume: Resume): Promise<Blob> {
  const doc = <ResumePDFDocument resume={resume} />;
  const asPdf = pdf(doc);
  const blob = await asPdf.toBlob();
  return blob;
}

/**
 * Generate HTML string from resume
 */
export function generateHTML(resume: Resume): string {
  const sectionsHTML = resume.sections
    .sort((a, b) => a.order - b.order)
    .map((section) => {
      let itemsHTML = '';

      if (section.type === 'experience') {
        itemsHTML = (section.items as Experience[])
          .map(
            (exp) => `
          <div style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <div>
                <strong>${exp.position}</strong><br/>
                <span style="color: #666;">${exp.company}</span>
              </div>
              <div style="text-align: right; color: #666; font-size: 0.9em;">
                ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate || 'Present'}
              </div>
            </div>
            ${exp.description ? `<p style="margin-top: 5px; color: #333;">${exp.description}</p>` : ''}
          </div>
        `
          )
          .join('');
      } else if (section.type === 'education') {
        itemsHTML = (section.items as Education[])
          .map(
            (edu) => `
          <div style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <div>
                <strong>${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</strong><br/>
                <span style="color: #666;">${edu.institution}</span>
              </div>
              ${edu.startDate && edu.endDate ? `<div style="text-align: right; color: #666; font-size: 0.9em;">${edu.startDate} - ${edu.endDate}</div>` : ''}
            </div>
            ${edu.gpa ? `<p style="margin-top: 5px; color: #333;">GPA: ${edu.gpa}</p>` : ''}
          </div>
        `
          )
          .join('');
      } else if (section.type === 'skills') {
        itemsHTML = `<div style="display: flex; flex-wrap: wrap; gap: 5px;">
          ${(section.items as Skill[])
            .map((skill) => `<span style="padding: 3px 8px; background: #f0f0f0; border-radius: 3px; font-size: 0.9em;">${skill.name}</span>`)
            .join('')}
        </div>`;
      } else if (section.type === 'projects') {
        itemsHTML = (section.items as Project[])
          .map(
            (proj) => `
          <div style="margin-bottom: 15px;">
            <strong>${proj.name}</strong>
            ${proj.description ? `<p style="margin-top: 5px; color: #333;">${proj.description}</p>` : ''}
          </div>
        `
          )
          .join('');
      } else if (section.type === 'summary' && section.items[0]) {
        itemsHTML = `<p style="color: #333;">${section.items[0]}</p>`;
      }

      return `
        <section style="margin-bottom: 20px;">
          <h2 style="font-size: 18px; font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 5px; margin-bottom: 10px;">
            ${section.title}
          </h2>
          ${itemsHTML}
        </section>
      `;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resume.title}</title>
  <style>
    @media print {
      body { margin: 0; }
      @page { margin: 1in; }
    }
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #000;
    }
    .header {
      margin-bottom: 30px;
    }
    .name {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .title {
      font-size: 16px;
      color: #666;
      margin-bottom: 10px;
    }
    .contact {
      font-size: 12px;
      color: #666;
    }
    .contact span {
      margin-right: 15px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="name">${resume.personalInfo.name}</h1>
    ${resume.title ? `<div class="title">${resume.title}</div>` : ''}
    <div class="contact">
      ${resume.personalInfo.email ? `<span>${resume.personalInfo.email}</span>` : ''}
      ${resume.personalInfo.phone ? `<span>${resume.personalInfo.phone}</span>` : ''}
      ${resume.personalInfo.location ? `<span>${resume.personalInfo.location}</span>` : ''}
    </div>
  </div>
  ${sectionsHTML}
</body>
</html>`;
}

