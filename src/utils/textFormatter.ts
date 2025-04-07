/**
 * Utility functions for formatting Bible text and references
 */

// Format verse reference for display
export const formatVerseReference = (book: string, chapter: number, verse?: number): string => {
    return verse ? `${book} ${chapter}:${verse}` : `${book} ${chapter}`;
  };
  
  // Clean HTML tags from verse content
  export const cleanVerseContent = (content: string): string => {
    if (!content) return '';
    
    return content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ')    // Normalize whitespace
      .replace(/^\s+|\s+$/g, '') // Trim whitespace
      .replace(/\d+\s*¶\s*/, '') // Remove verse numbers and paragraph markers
      .trim();
  };
  
  // Format verse text for highlighting search terms
  export const highlightSearchTerms = (text: string, searchTerms: string[]): string => {
    if (!searchTerms.length || !text) return text;
    
    let highlightedText = text;
    searchTerms.forEach(term => {
      if (!term.trim()) return;
      
      const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
    });
    
    return highlightedText;
  };
  
  // Format book name (e.g., "1 Corinthians" from "1CO")
  export const formatBookName = (bookId: string, bookNames: Record<string, string>): string => {
    return bookNames[bookId] || bookId;
  };
  
  // Create a short reference (e.g., "John 3:16" instead of "The Gospel according to John, chapter 3, verse 16")
  export const createShortReference = (reference: string): string => {
    // Handle various reference formats
    const simpleRef = reference
      .replace(/The .* according to /i, '')
      .replace(/The Book of /i, '')
      .replace(/The /i, '')
      .replace(/Chapter /i, '')
      .replace(/Verse /i, '')
      .replace(/Psalm /i, 'Psalm ');
      
    return simpleRef;
  };
  
  // Add paragraph breaks to long text
  export const addParagraphBreaks = (text: string): string => {
    // Split at sentence endings followed by space, making sure not to break after abbreviations
    // This is a simple approach and might need refinement for perfect results
    const sentences = text.split(/(\.\s)(?![a-z])/g);
    
    // Group sentences into paragraphs (here we'll use 3-5 sentences per paragraph)
    const paragraphs: string[] = [];
    let currentParagraph = '';
    
    sentences.forEach((sentence, index) => {
      currentParagraph += sentence;
      
      // Every 3-5 sentences or at the end, create a new paragraph
      const paragraphSize = Math.floor(Math.random() * 3) + 3;
      if ((index + 1) % paragraphSize === 0 || index === sentences.length - 1) {
        paragraphs.push(currentParagraph.trim());
        currentParagraph = '';
      }
    });
    
    return paragraphs.join('\n\n');
  };