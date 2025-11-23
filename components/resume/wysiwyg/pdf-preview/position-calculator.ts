/**
 * Position Calculator Utility
 * Maps PDF coordinates to screen coordinates for overlay positioning
 */

export interface PDFPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ScreenPosition {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface PDFDimensions {
  width: number; // PDF width in points (A4 = 595.28 points)
  height: number; // PDF height in points (A4 = 841.89 points)
}

export interface ViewportDimensions {
  width: number; // Viewport width in pixels
  height: number; // Viewport height in pixels
  zoom: number; // Zoom level (1.0 = 100%)
}

// A4 dimensions in points (1 point = 1/72 inch)
export const A4_DIMENSIONS: PDFDimensions = {
  width: 595.28,
  height: 841.89,
};

/**
 * Convert PDF coordinates to screen coordinates
 */
export function pdfToScreen(
  pdfPos: PDFPosition,
  pdfDims: PDFDimensions,
  viewport: ViewportDimensions
): ScreenPosition {
  // Calculate scale factor
  const scaleX = viewport.width / pdfDims.width;
  const scaleY = viewport.height / pdfDims.height;
  const scale = Math.min(scaleX, scaleY) * viewport.zoom;

  // Calculate offset to center the PDF
  const scaledPdfWidth = pdfDims.width * scale;
  const scaledPdfHeight = pdfDims.height * scale;
  const offsetX = (viewport.width - scaledPdfWidth) / 2;
  const offsetY = (viewport.height - scaledPdfHeight) / 2;

  return {
    left: offsetX + pdfPos.x * scale,
    top: offsetY + pdfPos.y * scale,
    width: pdfPos.width * scale,
    height: pdfPos.height * scale,
  };
}

/**
 * Convert screen coordinates to PDF coordinates
 */
export function screenToPdf(
  screenPos: ScreenPosition,
  pdfDims: PDFDimensions,
  viewport: ViewportDimensions
): PDFPosition {
  // Calculate scale factor
  const scaleX = viewport.width / pdfDims.width;
  const scaleY = viewport.height / pdfDims.height;
  const scale = Math.min(scaleX, scaleY) * viewport.zoom;

  // Calculate offset to center the PDF
  const scaledPdfWidth = pdfDims.width * scale;
  const scaledPdfHeight = pdfDims.height * scale;
  const offsetX = (viewport.width - scaledPdfWidth) / 2;
  const offsetY = (viewport.height - scaledPdfHeight) / 2;

  return {
    x: (screenPos.left - offsetX) / scale,
    y: (screenPos.top - offsetY) / scale,
    width: screenPos.width / scale,
    height: screenPos.height / scale,
  };
}

/**
 * Calculate bounding box for text element
 */
export function calculateTextBounds(
  text: string,
  fontSize: number,
  fontFamily: string = 'Helvetica',
  maxWidth?: number
): { width: number; height: number } {
  // Create a temporary canvas to measure text
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    // Fallback estimation
    return {
      width: text.length * fontSize * 0.6,
      height: fontSize * 1.2,
    };
  }

  context.font = `${fontSize}pt ${fontFamily}`;
  const metrics = context.measureText(text);
  
  return {
    width: maxWidth ? Math.min(metrics.width, maxWidth) : metrics.width,
    height: fontSize * 1.2, // Line height
  };
}

/**
 * Calculate position for multi-line text
 */
export function calculateMultiLineTextBounds(
  text: string,
  fontSize: number,
  fontFamily: string = 'Helvetica',
  maxWidth: number
): { width: number; height: number; lines: number } {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    const lines = Math.ceil(text.length / (maxWidth / (fontSize * 0.6)));
    return {
      width: maxWidth,
      height: lines * fontSize * 1.2,
      lines,
    };
  }

  context.font = `${fontSize}pt ${fontFamily}`;
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = context.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }

  return {
    width: maxWidth,
    height: lines.length * fontSize * 1.2,
    lines: lines.length,
  };
}

/**
 * Get viewport dimensions from container element
 */
export function getViewportDimensions(
  container: HTMLElement,
  zoom: number = 1.0
): ViewportDimensions {
  return {
    width: container.clientWidth,
    height: container.clientHeight,
    zoom,
  };
}

