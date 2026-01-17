"use client";

import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import type { CoverLetter } from '@/lib/models/cover-letter';

const styles = StyleSheet.create({
  page: {
    padding: 60,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#000000',
    lineHeight: 1.6,
  },
  header: {
    marginBottom: 30,
  },
  date: {
    fontSize: 10,
    marginBottom: 20,
    color: '#666666',
  },
  recipient: {
    fontSize: 11,
    marginBottom: 20,
  },
  paragraph: {
    marginBottom: 12,
    textAlign: 'justify',
  },
  signature: {
    marginTop: 30,
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    fontSize: 9,
    color: '#666666',
  },
});

const CoverLetterPDFDocument = ({ coverLetter }: { coverLetter: CoverLetter }) => {
  const paragraphs = coverLetter.content.split('\n\n').filter(p => p.trim());

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Date */}
        <View style={styles.date}>
          <Text>
            {new Date(coverLetter.metadata.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Recipient */}
        {(coverLetter.recipientName || coverLetter.companyName) && (
          <View style={styles.recipient}>
            {coverLetter.recipientName && <Text>{coverLetter.recipientName}</Text>}
            {coverLetter.companyName && <Text>{coverLetter.companyName}</Text>}
          </View>
        )}

        {/* Greeting */}
        <View style={styles.paragraph}>
          <Text>Dear {coverLetter.recipientName || 'Hiring Manager'},</Text>
        </View>

        {/* Content Paragraphs */}
        {paragraphs.map((paragraph, index) => (
          <View key={index} style={styles.paragraph}>
            <Text>{paragraph}</Text>
          </View>
        ))}

        {/* Signature */}
        <View style={styles.signature}>
          <Text>Sincerely,</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Generated on {new Date().toLocaleDateString()} • {coverLetter.metadata.wordCount || 0} words
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export async function generateCoverLetterPDF(coverLetter: CoverLetter): Promise<Blob> {
  const doc = <CoverLetterPDFDocument coverLetter={coverLetter} />;
  const blob = await pdf(doc).toBlob();
  return blob;
}

export function generateCoverLetterTXT(coverLetter: CoverLetter): string {
  const date = new Date(coverLetter.metadata.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let txt = `${date}\n\n`;

  if (coverLetter.recipientName || coverLetter.companyName) {
    if (coverLetter.recipientName) txt += `${coverLetter.recipientName}\n`;
    if (coverLetter.companyName) txt += `${coverLetter.companyName}\n`;
    txt += '\n';
  }

  txt += `Dear ${coverLetter.recipientName || 'Hiring Manager'},\n\n`;
  txt += coverLetter.content;
  txt += '\n\nSincerely,';

  return txt;
}
