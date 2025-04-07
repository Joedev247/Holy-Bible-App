import axios from 'axios';

// API Configuration
const API_CONFIG = {
  API_KEY: '36ebed110d7d903f348a800b00415d2f', // Replace with your actual API key
  // Using API.Bible service as an example
  BASE_URL: 'https://api.scripture.api.bible/v1',
  BIBLE_ID: 'de4e12af7f28f599-02' // This is the ID for KJV on API.Bible
};

// Type definitions
export interface BibleVerse {
  id: string;
  orgId: string;
  bookId: string;
  chapterId: string;
  bibleId: string;
  reference: string;
  content: string;
}

export interface BibleChapter {
  id: string;
  bibleId: string;
  number: string;
  bookId: string;
  reference: string;
  content: string;
  verseCount: number;
  verses: BibleVerse[];
}

export interface BibleBook {
  id: string;
  name: string;
  nameLong: string;
  chapters: number[];
  testament?: string;
  abbreviation?: string;
}

export interface SearchResult {
  verses: {
    id: string;
    reference: string;
    text: string;
    bookId: string;
    chapterId: string;
  }[];
  total: number;
}

// Main Bible API Service
export const BibleAPI = {
  // Helper method for API calls
  private: {
    async fetchWithAuth(endpoint: string, options: any = {}) {
      try {
        const finalOptions = {
          ...options,
          headers: {
            'api-key': API_CONFIG.API_KEY,
            'Content-Type': 'application/json',
            ...options.headers,
          },
        };
        
        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, finalOptions);

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error('API Request Failed:', error);
        throw error;
      }
    },
    
    async axiosWithAuth(endpoint: string, options: any = {}) {
      try {
        const response = await axios({
          url: `${API_CONFIG.BASE_URL}${endpoint}`,
          headers: {
            'api-key': API_CONFIG.API_KEY,
            'Content-Type': 'application/json',
            ...options.headers,
          },
          ...options
        });
        
        return response.data;
      } catch (error) {
        console.error('API Request Failed:', error);
        throw error;
      }
    }
  },

  // Get all books of the Bible
  getBooks: async (): Promise<BibleBook[]> => {
    try {
      const data = await BibleAPI.private.fetchWithAuth(
        `/bibles/${API_CONFIG.BIBLE_ID}/books`
      );
      
      // Map testament to each book
      const enrichedBooks = data.data.map((book: BibleBook) => {
        // Check if book is in Old Testament or New Testament
        const isOldTestament = BIBLE_BOOKS.OLD_TESTAMENT.some(oldBook => oldBook.id === book.id);
        return {
          ...book,
          testament: isOldTestament ? 'old' : 'new'
        };
      });
      
      return enrichedBooks || [];
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  },

  // Get a specific book
  getBook: async (bookId: string): Promise<BibleBook | null> => {
    try {
      const data = await BibleAPI.private.fetchWithAuth(
        `/bibles/${API_CONFIG.BIBLE_ID}/books/${bookId}`
      );
      return data.data || null;
    } catch (error) {
      console.error('Error fetching book:', error);
      return null;
    }
  },

  // Get chapters for a specific book
  getBookChapters: async (bookId: string): Promise<any[]> => {
    try {
      const data = await BibleAPI.private.fetchWithAuth(
        `/bibles/${API_CONFIG.BIBLE_ID}/books/${bookId}/chapters`
      );
      return data.data || [];
    } catch (error) {
      console.error('Error fetching chapters:', error);
      return [];
    }
  },

  // Get the count of chapters for a specific book
  getChapterCount: async (bookId: string): Promise<number> => {
    try {
      const chapters = await BibleAPI.getBookChapters(bookId);
      // Subtract 1 to account for the "intro" chapter that comes with some APIs
      return chapters.length > 1 ? chapters.length - 1 : chapters.length;
    } catch (error) {
      console.error('Error getting chapter count:', error);
      return 0;
    }
  },

  // Get a specific chapter with verses
  getChapter: async (chapterId: string): Promise<BibleChapter | null> => {
    try {
      const data = await BibleAPI.private.fetchWithAuth(
        `/bibles/${API_CONFIG.BIBLE_ID}/chapters/${chapterId}?content-type=json&include-notes=false&include-titles=true&include-chapter-numbers=true&include-verse-numbers=true&include-verse-spans=true`
      );
      return data.data || null;
    } catch (error) {
      console.error('Error fetching chapter:', error);
      return null;
    }
  },

  // Get verses for a specific chapter
  getChapterVerses: async (chapterId: string): Promise<BibleVerse[]> => {
    try {
      const data = await BibleAPI.private.fetchWithAuth(
        `/bibles/${API_CONFIG.BIBLE_ID}/chapters/${chapterId}/verses`
      );
      return data.data || [];
    } catch (error) {
      console.error('Error fetching verses:', error);
      return [];
    }
  },

  // Get verse count for a specific chapter
  getVerseCount: async (chapterId: string): Promise<number> => {
    try {
      const verses = await BibleAPI.getChapterVerses(chapterId);
      return verses.length;
    } catch (error) {
      console.error('Error getting verse count:', error);
      return 0;
    }
  },

  // Get a specific verse
  getVerse: async (verseId: string): Promise<BibleVerse | null> => {
    try {
      const data = await BibleAPI.private.fetchWithAuth(
        `/bibles/${API_CONFIG.BIBLE_ID}/verses/${verseId}?content-type=json&include-notes=false&include-titles=true&include-verse-numbers=true&include-verse-spans=true`
      );
      return data.data || null;
    } catch (error) {
      console.error('Error fetching verse:', error);
      return null;
    }
  },

  // Search the Bible
  search: async (query: string, offset: number = 0, limit: number = 20): Promise<SearchResult> => {
    try {
      const data = await BibleAPI.private.fetchWithAuth(
        `/bibles/${API_CONFIG.BIBLE_ID}/search?query=${encodeURIComponent(query)}&offset=${offset}&limit=${limit}`
      );
      return {
        verses: data.data.verses || [],
        total: data.data.total || 0
      };
    } catch (error) {
      console.error('Error searching Bible:', error);
      return {
        verses: [],
        total: 0
      };
    }
  },

  // Get a random verse (for Verse of the Day)
  getRandomVerse: async (): Promise<BibleVerse | null> => {
    try {
      // List of popular verses to use for verse of the day
      const popularVerses = [
        'JHN.3.16', 'PSA.23.1', 'ROM.8.28', 'PHP.4.13', 'JER.29.11',
        'PRO.3.5', 'ISA.40.31', 'MAT.28.19', 'PSA.46.10', 'GAL.5.22',
        'HEB.11.1', '2TI.1.7', '1CO.13.4', 'ROM.12.2', 'PHP.4.6'
      ];
      
      // Choose a random verse from the popular verses list
      const randomIndex = Math.floor(Math.random() * popularVerses.length);
      const randomVerseId = popularVerses[randomIndex];
      
      const data = await BibleAPI.private.fetchWithAuth(
        `/bibles/${API_CONFIG.BIBLE_ID}/verses/${randomVerseId}`
      );
      return data.data || null;
    } catch (error) {
      console.error('Error fetching random verse:', error);
      return null;
    }
  },

  // Get verse of the day
  getVerseOfTheDay: async (): Promise<BibleVerse | null> => {
    try {
      // Implement a proper verse of the day strategy
      // For now, we'll alternate between John 3:16 and a random verse
      const today = new Date();
      const usePredefined = today.getDate() % 2 === 0;
      
      if (usePredefined) {
        // On even days, use John 3:16
        const data = await BibleAPI.private.fetchWithAuth(
          `/bibles/${API_CONFIG.BIBLE_ID}/verses/JHN.3.16`
        );
        return data.data || null;
      } else {
        // On odd days, use a random verse
        return await BibleAPI.getRandomVerse();
      }
    } catch (error) {
      console.error('Error fetching verse of the day:', error);
      return null;
    }
  },

  // Get passage by reference
  getPassageByReference: async (reference: string): Promise<BibleVerse[]> => {
    try {
      const data = await BibleAPI.private.fetchWithAuth(
        `/bibles/${API_CONFIG.BIBLE_ID}/passages/${encodeURIComponent(reference)}?content-type=json&include-notes=false&include-titles=true&include-verse-numbers=true&include-verse-spans=true`
      );
      return data.data || [];
    } catch (error) {
      console.error('Error fetching passage:', error);
      return [];
    }
  },

  // Get available versions (though we're focusing on KJV)
  getBibleVersions: async () => {
    try {
      const data = await BibleAPI.private.fetchWithAuth('/bibles');
      return data.data || [];
    } catch (error) {
      console.error('Error fetching Bible versions:', error);
      return [];
    }
  },

  // Helper method to format references
  formatReference: (bookId: string, chapter: number, verse?: number) => {
    return verse 
      ? `${bookId}.${chapter}.${verse}`
      : `${bookId}.${chapter}`;
  },
  
  // Convert between book name and ID
  getBookIdFromName: (bookName: string): string | null => {
    // Combine both testaments into a single array
    const allBooks = [...BIBLE_BOOKS.OLD_TESTAMENT, ...BIBLE_BOOKS.NEW_TESTAMENT];
    
    // Find the book by name
    const book = allBooks.find(b => 
      b.name.toLowerCase() === bookName.toLowerCase()
    );
    
    return book ? book.id : null;
  },
  
  getBookNameFromId: (bookId: string): string | null => {
    // Combine both testaments into a single array
    const allBooks = [...BIBLE_BOOKS.OLD_TESTAMENT, ...BIBLE_BOOKS.NEW_TESTAMENT];
    
    // Find the book by ID
    const book = allBooks.find(b => b.id === bookId);
    
    return book ? book.name : null;
  },
  
  // Clean verse content from HTML tags
  cleanVerseContent: (content: string): string => {
    // Remove HTML tags and clean up the verse
    const cleanedContent = content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ')    // Normalize whitespace
      .replace(/^\s+|\s+$/g, '') // Trim whitespace
      .replace(/\d+\s*¶\s*/, '') // Remove verse numbers and paragraph markers
      .trim();
    
    return cleanedContent;
  }
};

// Constants for Bible books (useful for reference)
export const BIBLE_BOOKS = {
  OLD_TESTAMENT: [
    { id: 'GEN', name: 'Genesis' },
    { id: 'EXO', name: 'Exodus' },
    { id: 'LEV', name: 'Leviticus' },
    { id: 'NUM', name: 'Numbers' },
    { id: 'DEU', name: 'Deuteronomy' },
    { id: 'JOS', name: 'Joshua' },
    { id: 'JDG', name: 'Judges' },
    { id: 'RUT', name: 'Ruth' },
    { id: '1SA', name: '1 Samuel' },
    { id: '2SA', name: '2 Samuel' },
    { id: '1KI', name: '1 Kings' },
    { id: '2KI', name: '2 Kings' },
    { id: '1CH', name: '1 Chronicles' },
    { id: '2CH', name: '2 Chronicles' },
    { id: 'EZR', name: 'Ezra' },
    { id: 'NEH', name: 'Nehemiah' },
    { id: 'EST', name: 'Esther' },
    { id: 'JOB', name: 'Job' },
    { id: 'PSA', name: 'Psalms' },
    { id: 'PRO', name: 'Proverbs' },
    { id: 'ECC', name: 'Ecclesiastes' },
    { id: 'SNG', name: 'Song of Solomon' },
    { id: 'ISA', name: 'Isaiah' },
    { id: 'JER', name: 'Jeremiah' },
    { id: 'LAM', name: 'Lamentations' },
    { id: 'EZK', name: 'Ezekiel' },
    { id: 'DAN', name: 'Daniel' },
    { id: 'HOS', name: 'Hosea' },
    { id: 'JOL', name: 'Joel' },
    { id: 'AMO', name: 'Amos' },
    { id: 'OBA', name: 'Obadiah' },
    { id: 'JON', name: 'Jonah' },
    { id: 'MIC', name: 'Micah' },
    { id: 'NAM', name: 'Nahum' },
    { id: 'HAB', name: 'Habakkuk' },
    { id: 'ZEP', name: 'Zephaniah' },
    { id: 'HAG', name: 'Haggai' },
    { id: 'ZEC', name: 'Zechariah' },
    { id: 'MAL', name: 'Malachi' }
  ],
  NEW_TESTAMENT: [
    { id: 'MAT', name: 'Matthew' },
    { id: 'MRK', name: 'Mark' },
    { id: 'LUK', name: 'Luke' },
    { id: 'JHN', name: 'John' },
    { id: 'ACT', name: 'Acts' },
    { id: 'ROM', name: 'Romans' },
    { id: '1CO', name: '1 Corinthians' },
    { id: '2CO', name: '2 Corinthians' },
    { id: 'GAL', name: 'Galatians' },
    { id: 'EPH', name: 'Ephesians' },
    { id: 'PHP', name: 'Philippians' },
    { id: 'COL', name: 'Colossians' },
    { id: '1TH', name: '1 Thessalonians' },
    { id: '2TH', name: '2 Thessalonians' },
    { id: '1TI', name: '1 Timothy' },
    { id: '2TI', name: '2 Timothy' },
    { id: 'TIT', name: 'Titus' },
    { id: 'PHM', name: 'Philemon' },
    { id: 'HEB', name: 'Hebrews' },
    { id: 'JAS', name: 'James' },
    { id: '1PE', name: '1 Peter' },
    { id: '2PE', name: '2 Peter' },
    { id: '1JN', name: '1 John' },
    { id: '2JN', name: '2 John' },
    { id: '3JN', name: '3 John' },
    { id: 'JUD', name: 'Jude' },
    { id: 'REV', name: 'Revelation' }
  ]
};