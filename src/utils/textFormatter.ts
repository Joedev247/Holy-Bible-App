
export const formatVerseReference = (book: string, chapter: number, verse?: number): string => {
    return verse ? `${book} ${chapter}:${verse}` : `${book} ${chapter}`;
  };
  
  export const cleanVerseContent = (content: string): string => {
    if (!content) return '';
    
    return content
      .replace(/<[^>]*>/g, '') 
      .replace(/\s+/g, ' ')    
      .replace(/^\s+|\s+$/g, '') 
      .replace(/\d+\s*¶\s*/, '') 
      .trim();
  };
  
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
  
  export const formatBookName = (bookId: string, bookNames: Record<string, string>): string => {
    return bookNames[bookId] || bookId;
  };
  
  export const createShortReference = (reference: string): string => {
    const simpleRef = reference
      .replace(/The .* according to /i, '')
      .replace(/The Book of /i, '')
      .replace(/The /i, '')
      .replace(/Chapter /i, '')
      .replace(/Verse /i, '')
      .replace(/Psalm /i, 'Psalm ');
      
    return simpleRef;
  };
  
  export const addParagraphBreaks = (text: string): string => {
    const sentences = text.split(/(\.\s)(?![a-z])/g);
    
    const paragraphs: string[] = [];
    let currentParagraph = '';
    
    sentences.forEach((sentence, index) => {
      currentParagraph += sentence;
      
      const paragraphSize = Math.floor(Math.random() * 3) + 3;
      if ((index + 1) % paragraphSize === 0 || index === sentences.length - 1) {
        paragraphs.push(currentParagraph.trim());
        currentParagraph = '';
      }
    });
    
    return paragraphs.join('\n\n');
  };