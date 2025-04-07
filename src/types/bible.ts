export interface Bible {
    id: string;
    name: string;
    language: {
      id: string;
      name: string;
    };
  }
  
  export interface Chapter {
    id: string;
    bibleId: string;
    number: string;
    content: string;
  }
  
  export interface SearchResult {
    verses: Array<{
      id: string;
      text: string;
      reference: string;
    }>;
  }
  