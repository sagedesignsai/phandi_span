import { google } from '@ai-sdk/google';

// Configure Google provider instance
// API key is read from GOOGLE_GENERATIVE_AI_API_KEY environment variable
export const googleProvider = google;

// Model instances for different use cases
export const chatModel = googleProvider('gemini-2.5-flash');
export const imageModel = googleProvider('gemini-2.5-flash-image-preview');

