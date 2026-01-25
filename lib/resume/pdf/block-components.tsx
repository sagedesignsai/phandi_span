import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import type { Block, TableBlockData, ImageBlockData } from '@/lib/resume/editor/block-types';

/**
 * Block-based PDF Components for Resume Rendering
 */

export function createBlockPDFStyles() {
  return StyleSheet.create({
    page: {
      padding: 40,
      fontSize: 11,
      fontFamily: 'Helvetica',
      color: '#000000',
    },
    block: {
      marginBottom: 10,
    },
    table: {
      marginBottom: 10,
    },
    tableTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 5,
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
}

/**
 * Table Block PDF Component
 */
export function PDFTableBlock({ block, styles }: {
  block: Block;
  styles: ReturnType<typeof createBlockPDFStyles>;
}) {
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
}

/**
 * Image Block PDF Component
 */
export function PDFImageBlock({ block, styles }: {
  block: Block;
  styles: ReturnType<typeof createBlockPDFStyles>;
}) {
  const data = block.data as ImageBlockData;

  if (!data.src) return null;

  const imageStyle = {
    ...styles.image,
    width: data.width || 'auto',
    height: data.height || 'auto',
    maxWidth: '100%',
  };

  const containerStyle = {
    alignItems: data.alignment === 'left' ? 'flex-start' : 
                data.alignment === 'right' ? 'flex-end' : 'center',
  };

  return (
    <View style={containerStyle}>
      <Image src={data.src} style={imageStyle} />
      {data.caption && (
        <Text style={styles.imageCaption}>{data.caption}</Text>
      )}
    </View>
  );
}

/**
 * Block PDF Document Component
 */
export function BlockPDFDocument({ blocks }: { blocks: Block[] }) {
  const styles = createBlockPDFStyles();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {blocks
          .sort((a, b) => a.order - b.order)
          .map((block) => {
            switch (block.type) {
              case 'table':
                return <PDFTableBlock key={block.id} block={block} styles={styles} />;
              
              case 'image':
                return <PDFImageBlock key={block.id} block={block} styles={styles} />;
              
              default:
                return null; // Other blocks handled by existing system
            }
          })}
      </Page>
    </Document>
  );
}
