"use client";

import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer';
import type { BlockResume } from '@/lib/models/resume';
import type { Block, TableBlockData, ImageBlockData, HeaderBlockData, SummaryBlockData, ExperienceBlockData, EducationBlockData, SkillBlockData, ProjectBlockData } from '@/lib/resume/editor/block-types';

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
  tableRow: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
    fontSize: 10,
    padding: 4,
    borderWidth: 1,
    borderColor: '#cccccc',
    flex: 1,
  },
  tableCell: {
    fontSize: 10,
    padding: 4,
    borderWidth: 1,
    borderColor: '#cccccc',
    flex: 1,
  },
  table: {
    marginBottom: 10,
  },
  tableTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  image: {
    marginBottom: 10,
  },
  imageCaption: {
    fontSize: 9,
    color: '#666666',
    textAlign: 'center',
    marginTop: 3,
  },
});

// PDF Document Component


/**
 * Generate PDF blob from block-based resume
 */
export async function generatePDF(resume: BlockResume): Promise<Blob> {
  const doc = <BlockResumePDFDocument resume={resume} />;
  const asPdf = pdf(doc);
  const blob = await asPdf.toBlob();
  return blob;
}

// Block-based PDF Document Component
const BlockResumePDFDocument = ({ resume }: { resume: BlockResume }) => {
  const sortedBlocks = (resume.blocks as Block[]).sort((a, b) => a.order - b.order);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {sortedBlocks.map((block) => {
          switch (block.type) {
            case 'header':
              return <PDFHeaderBlock key={block.id} block={block} />;
            case 'summary':
              return <PDFSummaryBlock key={block.id} block={block} />;
            case 'experience':
              return <PDFExperienceBlock key={block.id} block={block} />;
            case 'education':
              return <PDFEducationBlock key={block.id} block={block} />;
            case 'skill':
              return <PDFSkillBlock key={block.id} block={block} />;
            case 'project':
              return <PDFProjectBlock key={block.id} block={block} />;
            case 'table':
              return <PDFTableBlock key={block.id} block={block} />;
            case 'image':
              return <PDFImageBlock key={block.id} block={block} />;
            case 'section':
              return <PDFSectionBlock key={block.id} block={block} />;
            case 'divider':
              return <View key={block.id} style={{ borderBottomWidth: 1, borderBottomColor: '#cccccc', marginVertical: 10 }} />;
            default:
              return null;
          }
        })}
      </Page>
    </Document>
  );
};

// PDF Block Components
const PDFHeaderBlock = ({ block }: { block: Block }) => {
  const data = block.data as HeaderBlockData;
  return (
    <View style={styles.header}>
      <Text style={styles.name}>{data.name}</Text>
      {data.title && <Text style={styles.title}>{data.title}</Text>}
      <View style={styles.contactInfo}>
        {data.email && <Text style={styles.contactItem}>{data.email}</Text>}
        {data.phone && <Text style={styles.contactItem}>{data.phone}</Text>}
        {data.location && <Text style={styles.contactItem}>{data.location}</Text>}
      </View>
    </View>
  );
};

const PDFSectionBlock = ({ block }: { block: Block }) => {
  const data = block.data as { title: string };
  return <Text style={styles.sectionTitle}>{data.title}</Text>;
};

const PDFSummaryBlock = ({ block }: { block: Block }) => {
  const data = block.data as SummaryBlockData;
  return <Text style={styles.description}>{data.content}</Text>;
};

const PDFExperienceBlock = ({ block }: { block: Block }) => {
  const data = block.data as ExperienceBlockData;
  return (
    <View style={styles.experienceItem}>
      <View style={styles.experienceHeader}>
        <View>
          <Text style={styles.position}>{data.position}</Text>
          <Text style={styles.company}>{data.company}</Text>
        </View>
        <Text style={styles.date}>
          {data.startDate} - {data.current ? 'Present' : data.endDate || 'Present'}
        </Text>
      </View>
      {data.description && <Text style={styles.description}>{data.description}</Text>}
    </View>
  );
};

const PDFEducationBlock = ({ block }: { block: Block }) => {
  const data = block.data as EducationBlockData;
  return (
    <View style={styles.experienceItem}>
      <View style={styles.experienceHeader}>
        <View>
          <Text style={styles.position}>{data.degree} {data.field && `in ${data.field}`}</Text>
          <Text style={styles.company}>{data.institution}</Text>
        </View>
        {data.startDate && data.endDate && (
          <Text style={styles.date}>{data.startDate} - {data.endDate}</Text>
        )}
      </View>
      {data.gpa && <Text style={styles.description}>GPA: {data.gpa}</Text>}
    </View>
  );
};

const PDFSkillBlock = ({ block }: { block: Block }) => {
  const data = block.data as SkillBlockData;
  return (
    <Text style={styles.skillTag}>
      {data.name} {data.level && `(${data.level})`}
    </Text>
  );
};

const PDFProjectBlock = ({ block }: { block: Block }) => {
  const data = block.data as ProjectBlockData;
  return (
    <View style={styles.experienceItem}>
      <Text style={styles.position}>{data.name}</Text>
      {data.description && <Text style={styles.description}>{data.description}</Text>}
    </View>
  );
};

// PDF Table Block Component
const PDFTableBlock = ({ block }: { block: Block }) => {
  const data = block.data as TableBlockData;

  return (
    <View style={styles.table}>
      {data.title && (
        <Text style={styles.tableTitle}>{data.title}</Text>
      )}

      {data.showHeaders && (
        <View style={styles.tableRow}>
          {data.headers.map((header, index) => (
            <Text key={index} style={styles.tableHeader}>
              {header}
            </Text>
          ))}
        </View>
      )}

      {data.rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.tableRow}>
          {row.map((cell, cellIndex) => (
            <Text key={cellIndex} style={styles.tableCell}>
              {cell}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
};



// PDF Image Block Component
const PDFImageBlock = ({ block }: { block: Block }) => {
  const data = block.data as ImageBlockData;

  if (!data.src) return null;

  const imageStyle = {
    ...styles.image,
    width: data.width || 'auto',
    height: data.height || 'auto',
  };

  const containerStyle = {
    alignItems: (data.alignment === 'left' ? 'flex-start' :
      data.alignment === 'right' ? 'flex-end' : 'center') as 'flex-start' | 'flex-end' | 'center',
  };

  return (
    <View style={containerStyle}>
      <Image src={data.src} style={imageStyle} />
      {data.caption && (
        <Text style={styles.imageCaption}>{data.caption}</Text>
      )}
    </View>
  );
};



/**
 * Generate HTML string from block-based resume
 */
export function generateHTML(resume: BlockResume): string {
  const sortedBlocks = (resume.blocks as Block[]).sort((a, b) => a.order - b.order);

  const blocksHTML = sortedBlocks.map((block) => {
    switch (block.type) {
      case 'header':
        const headerData = block.data as HeaderBlockData;
        return `
          <div class="header" style="margin-bottom: 30px;">
            <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 5px;">${headerData.name}</h1>
            ${headerData.title ? `<div style="font-size: 16px; color: #666; margin-bottom: 10px;">${headerData.title}</div>` : ''}
            <div style="font-size: 12px; color: #666;">
              ${headerData.email ? `<span style="margin-right: 15px;">${headerData.email}</span>` : ''}
              ${headerData.phone ? `<span style="margin-right: 15px;">${headerData.phone}</span>` : ''}
              ${headerData.location ? `<span>${headerData.location}</span>` : ''}
            </div>
          </div>
        `;

      case 'section':
        const sectionData = block.data as { title: string };
        return `
          <h2 style="font-size: 18px; font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 5px; margin: 20px 0 10px 0;">
            ${sectionData.title}
          </h2>
        `;

      case 'summary':
        const summaryData = block.data as SummaryBlockData;
        return `<p style="color: #333; margin-bottom: 15px;">${summaryData.content}</p>`;

      case 'experience':
        const expData = block.data as ExperienceBlockData;
        return `
          <div style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <div>
                <strong>${expData.position}</strong><br/>
                <span style="color: #666;">${expData.company}</span>
              </div>
              <div style="text-align: right; color: #666; font-size: 0.9em;">
                ${expData.startDate} - ${expData.current ? 'Present' : expData.endDate || 'Present'}
              </div>
            </div>
            ${expData.description ? `<p style="margin-top: 5px; color: #333;">${expData.description}</p>` : ''}
          </div>
        `;

      case 'education':
        const eduData = block.data as EducationBlockData;
        return `
          <div style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <div>
                <strong>${eduData.degree}${eduData.field ? ` in ${eduData.field}` : ''}</strong><br/>
                <span style="color: #666;">${eduData.institution}</span>
              </div>
              ${eduData.startDate && eduData.endDate ? `<div style="text-align: right; color: #666; font-size: 0.9em;">${eduData.startDate} - ${eduData.endDate}</div>` : ''}
            </div>
            ${eduData.gpa ? `<p style="margin-top: 5px; color: #333;">GPA: ${eduData.gpa}</p>` : ''}
          </div>
        `;

      case 'skill':
        const skillData = block.data as SkillBlockData;
        return `<span style="display: inline-block; padding: 3px 8px; background: #f0f0f0; border-radius: 3px; font-size: 0.9em; margin: 2px;">${skillData.name}${skillData.level ? ` (${skillData.level})` : ''}</span>`;

      case 'project':
        const projData = block.data as ProjectBlockData;
        return `
          <div style="margin-bottom: 15px;">
            <strong>${projData.name}</strong>
            ${projData.description ? `<p style="margin-top: 5px; color: #333;">${projData.description}</p>` : ''}
          </div>
        `;

      case 'table':
        const tableData = block.data as TableBlockData;
        return `
          <div style="margin-bottom: 20px;">
            ${tableData.title ? `<h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">${tableData.title}</h3>` : ''}
            <table style="width: 100%; ${tableData.bordered ? 'border-collapse: collapse; border: 1px solid #ccc;' : ''}">
              ${tableData.showHeaders ? `
                <thead>
                  <tr>
                    ${tableData.headers.map(header => `
                      <th style="padding: 8px; text-align: left; font-weight: bold; ${tableData.bordered ? 'border: 1px solid #ccc;' : ''} background-color: #f0f0f0;">
                        ${header}
                      </th>
                    `).join('')}
                  </tr>
                </thead>
              ` : ''}
              <tbody>
                ${tableData.rows.map(row => `
                  <tr>
                    ${row.map(cell => `
                      <td style="padding: 8px; ${tableData.bordered ? 'border: 1px solid #ccc;' : ''}">
                        ${cell}
                      </td>
                    `).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;

      case 'image':
        const imageData = block.data as ImageBlockData;
        if (!imageData.src) return '';

        const alignmentStyle = {
          left: 'text-align: left;',
          center: 'text-align: center;',
          right: 'text-align: right;',
        }[imageData.alignment || 'center'];

        return `
          <div style="margin-bottom: 20px; ${alignmentStyle}">
            <img 
              src="${imageData.src}" 
              alt="${imageData.alt || 'Image'}"
              style="max-width: 100%; ${imageData.width ? `width: ${imageData.width}px;` : ''} ${imageData.height ? `height: ${imageData.height}px;` : ''}"
            />
            ${imageData.caption ? `<p style="font-size: 12px; color: #666; margin-top: 5px;">${imageData.caption}</p>` : ''}
          </div>
        `;

      case 'divider':
        return '<hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;" />';

      default:
        return '';
    }
  }).join('');

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
  </style>
</head>
<body>
  ${blocksHTML}
</body>
</html>`;
}

