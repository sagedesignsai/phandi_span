import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { Resume } from '@/lib/models/resume';
import type { Experience, Education, Skill, Project } from '@/lib/models/resume';

/**
 * Base PDF Components for Resume Rendering
 */

// Register fonts if needed (optional)
// Font.register({
//   family: 'Roboto',
//   src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf',
// });

/**
 * PDF StyleSheet factory
 */
export function createPDFStyles(template: string = 'default') {
  const baseStyles = {
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
      fontWeight: 'bold' as const,
      marginBottom: 5,
    },
    title: {
      fontSize: 14,
      marginBottom: 10,
      color: '#666666',
    },
    contactInfo: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
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
      fontWeight: 'bold' as const,
      marginBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#000000',
      paddingBottom: 3,
    },
    experienceItem: {
      marginBottom: 10,
    },
    experienceHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      marginBottom: 3,
    },
    position: {
      fontSize: 12,
      fontWeight: 'bold' as const,
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
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      gap: 5,
    },
    skillTag: {
      fontSize: 10,
      padding: 3,
      backgroundColor: '#f0f0f0',
      borderRadius: 3,
    },
  };

  // Template-specific overrides
  switch (template) {
    case 'modern':
      return StyleSheet.create({
        ...baseStyles,
        name: {
          ...baseStyles.name,
          fontSize: 28,
        },
        sectionTitle: {
          ...baseStyles.sectionTitle,
          borderBottomWidth: 2,
          borderBottomColor: '#0066cc',
        },
      });
    
    case 'classic':
      return StyleSheet.create({
        ...baseStyles,
        name: {
          ...baseStyles.name,
          fontSize: 22,
        },
        sectionTitle: {
          ...baseStyles.sectionTitle,
          fontSize: 13,
        },
      });
    
    case 'minimalist':
      return StyleSheet.create({
        ...baseStyles,
        name: {
          ...baseStyles.name,
          fontSize: 20,
        },
        sectionTitle: {
          ...baseStyles.sectionTitle,
          borderBottomWidth: 0.5,
          borderBottomColor: '#cccccc',
        },
      });
    
    default:
      return StyleSheet.create(baseStyles);
  }
}

/**
 * Header Component
 */
export function PDFHeader({ personalInfo, title, styles }: {
  personalInfo: Resume['personalInfo'];
  title?: string;
  styles: ReturnType<typeof createPDFStyles>;
}) {
  return (
    <View style={styles.header}>
      <Text style={styles.name}>{personalInfo.name}</Text>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.contactInfo}>
        {personalInfo.email && (
          <Text style={styles.contactItem}>{personalInfo.email}</Text>
        )}
        {personalInfo.phone && (
          <Text style={styles.contactItem}>{personalInfo.phone}</Text>
        )}
        {personalInfo.location && (
          <Text style={styles.contactItem}>{personalInfo.location}</Text>
        )}
        {personalInfo.linkedin && (
          <Text style={styles.contactItem}>LinkedIn</Text>
        )}
        {personalInfo.github && (
          <Text style={styles.contactItem}>GitHub</Text>
        )}
      </View>
    </View>
  );
}

/**
 * Experience Item Component
 */
export function PDFExperienceItem({ experience, styles }: {
  experience: Experience;
  styles: ReturnType<typeof createPDFStyles>;
}) {
  return (
    <View style={styles.experienceItem}>
      <View style={styles.experienceHeader}>
        <View>
          <Text style={styles.position}>{experience.position}</Text>
          <Text style={styles.company}>{experience.company}</Text>
        </View>
        <Text style={styles.date}>
          {experience.startDate} - {experience.current ? 'Present' : experience.endDate || 'Present'}
        </Text>
      </View>
      {experience.description && (
        <Text style={styles.description}>{experience.description}</Text>
      )}
      {experience.achievements && experience.achievements.length > 0 && (
        <View style={{ marginTop: 5 }}>
          {experience.achievements.map((achievement, idx) => (
            <Text key={idx} style={styles.description}>
              • {achievement}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

/**
 * Education Item Component
 */
export function PDFEducationItem({ education, styles }: {
  education: Education;
  styles: ReturnType<typeof createPDFStyles>;
}) {
  return (
    <View style={styles.experienceItem}>
      <View style={styles.experienceHeader}>
        <View>
          <Text style={styles.position}>
            {education.degree}
            {education.field && ` in ${education.field}`}
          </Text>
          <Text style={styles.company}>{education.institution}</Text>
        </View>
        {education.startDate && education.endDate && (
          <Text style={styles.date}>
            {education.startDate} - {education.endDate}
          </Text>
        )}
      </View>
      {education.gpa && (
        <Text style={styles.description}>GPA: {education.gpa}</Text>
      )}
      {education.honors && education.honors.length > 0 && (
        <View style={{ marginTop: 5 }}>
          <Text style={styles.description}>Honors:</Text>
          {education.honors.map((honor, idx) => (
            <Text key={idx} style={styles.description}>
              • {honor}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

/**
 * Skills Component
 */
export function PDFSkills({ skills, styles }: {
  skills: Skill[];
  styles: ReturnType<typeof createPDFStyles>;
}) {
  const grouped = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <View>
      {Object.entries(grouped).map(([category, categorySkills]) => (
        <View key={category} style={{ marginBottom: 5 }}>
          {category !== 'Other' && (
            <Text style={styles.description}>{category}:</Text>
          )}
          <View style={styles.skillsContainer}>
            {categorySkills.map((skill) => (
              <Text key={skill.id} style={styles.skillTag}>
                {skill.name}
                {skill.level && ` (${skill.level})`}
              </Text>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

/**
 * Project Item Component
 */
export function PDFProjectItem({ project, styles }: {
  project: Project;
  styles: ReturnType<typeof createPDFStyles>;
}) {
  return (
    <View style={styles.experienceItem}>
      <Text style={styles.position}>{project.name}</Text>
      {project.description && (
        <Text style={styles.description}>{project.description}</Text>
      )}
      {project.technologies && project.technologies.length > 0 && (
        <View style={styles.skillsContainer}>
          {project.technologies.map((tech, idx) => (
            <Text key={idx} style={styles.skillTag}>
              {tech}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

/**
 * Main Resume PDF Document
 */
export function ResumePDFDocument({ resume }: { resume: Resume }) {
  const styles = createPDFStyles(resume.template);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PDFHeader 
          personalInfo={resume.personalInfo} 
          title={resume.title}
          styles={styles}
        />

        {resume.sections
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <View key={section.id} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>

              {section.type === 'experience' &&
                (section.items as Experience[]).map((exp) => (
                  <PDFExperienceItem key={exp.id} experience={exp} styles={styles} />
                ))}

              {section.type === 'education' &&
                (section.items as Education[]).map((edu) => (
                  <PDFEducationItem key={edu.id} education={edu} styles={styles} />
                ))}

              {section.type === 'skills' && (
                <PDFSkills skills={section.items as Skill[]} styles={styles} />
              )}

              {section.type === 'projects' &&
                (section.items as Project[]).map((proj) => (
                  <PDFProjectItem key={proj.id} project={proj} styles={styles} />
                ))}

              {section.type === 'summary' && section.items[0] && (
                <Text style={styles.description}>{section.items[0] as string}</Text>
              )}
            </View>
          ))}
      </Page>
    </Document>
  );
}



