import axios from 'axios';

// Your Bible API key would be used here
const API_KEY = '36ebed110d7d903f348a800b00415d2f';
const API_BASE_URL = 'https://api.scripture.api.bible/v1';

// Default Bible version - you can change this or make it configurable
const BIBLE_VERSION = 'de4e12af7f28f599-02';

export interface BibleVerse {
  id: string;
  bookId: string;
  chapterId: string;
  reference: string;
  content: string;
}

export interface BibleBook {
  id: string;
  name: string;
  testament?: 'OT' | 'NT';
  chapters?: number;
}

// Bible books data
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

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'api-key': API_KEY
  }
});

export const BibleAPI = {
  apiClient,
  getVerseCount: async (chapterId: string): Promise<number> => {
    const response = await apiClient.get(`/verses/${chapterId}`);
    return response.data.verses.length;
  },

  // Get book information
  getBookInfo: async (bookId: string) => {
    try {
      const response = await BibleAPI.apiClient.get(
        `/bibles/${BIBLE_VERSION}/books/${bookId}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching book info:', error);
      throw error;
    }
  },

  // Get chapter information
  getChapter: async (chapterId: string) => {
    try {
      const response = await BibleAPI.apiClient.get(
        `/bibles/${BIBLE_VERSION}/chapters/${chapterId}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching chapter:', error);
      throw error;
    }
  },

  // Get verses for a chapter
  getChapterVerses: async (chapterId: string): Promise<BibleVerse[]> => {
    try {
      const response = await BibleAPI.apiClient.get(
        `/bibles/${BIBLE_VERSION}/chapters/${chapterId}/verses`
      );
      return response.data.data.map((verse: any) => ({
        id: verse.id,
        bookId: verse.bookId,
        chapterId: verse.chapterId,
        reference: verse.reference,
        content: verse.content
      }));
    } catch (error) {
      console.error('Error fetching chapter verses:', error);
      throw error;
    }
  },

  // Get a specific verse
  getVerse: async (verseId: string): Promise<BibleVerse> => {
    try {
      const response = await BibleAPI.apiClient.get(
        `/bibles/${BIBLE_VERSION}/verses/${verseId}`
      );
      const verse = response.data.data;
      return {
        id: verse.id,
        bookId: verse.bookId,
        chapterId: verse.chapterId,
        reference: verse.reference,
        content: verse.content
      };
    } catch (error) {
      console.error('Error fetching verse:', error);
      throw error;
    }
  },

  // Search the Bible
  searchBible: async (query: string): Promise<BibleVerse[]> => {
    try {
      const response = await BibleAPI.apiClient.get(
        `/bibles/${BIBLE_VERSION}/search`,
        { params: { query } }
      );
      return response.data.data.verses.map((verse: any) => ({
        id: verse.id,
        bookId: verse.bookId,
        chapterId: verse.chapterId,
        reference: verse.reference,
        content: verse.text
      }));
    } catch (error) {
      console.error('Error searching Bible:', error);
      throw error;
    }
  },

  // Advanced search with filters
  advancedSearchBible: async (query: string, filters: { books?: string[], testament?: string }): Promise<BibleVerse[]> => {
    try {
      let params: any = { query };
      
      if (filters.books && filters.books.length > 0) {
        // Add book filters
        params.bookids = filters.books.join(',');
      }
      
      const response = await BibleAPI.apiClient.get(
        `/bibles/${BIBLE_VERSION}/search`,
        { params }
      );
      
      let results = response.data.data.verses.map((verse: any) => ({
        id: verse.id,
        bookId: verse.bookId,
        chapterId: verse.chapterId,
        reference: verse.reference,
        content: verse.text
      }));
      
      // Filter by testament if needed (client-side filtering since the API doesn't support it directly)
      if (filters.testament && filters.testament !== 'all') {
        const testamentBooks = filters.testament === 'old' 
          ? BIBLE_BOOKS.OLD_TESTAMENT.map(book => book.id)
          : BIBLE_BOOKS.NEW_TESTAMENT.map(book => book.id);
        
        results = results.filter((verse: { bookId: string; }) => testamentBooks.includes(verse.bookId));
      }
      
      return results;
    } catch (error) {
      console.error('Error performing advanced search:', error);
      throw error;
    }
  },

  // Get verse of the day
  getVerseOfTheDay: async (): Promise<BibleVerse> => {
    try {
      // Popular verses to choose from
      const popularVerses = [
        'JHN.3.16', 'PSA.23.1', 'ROM.8.28', 'PHP.4.13', 'JER.29.11', 
        'PRO.3.5', 'ISA.40.31', 'MAT.28.19', 'PSA.46.1', 'GAL.5.22'
      ];
      
      // Select a random verse from the list
      const randomVerseId = popularVerses[Math.floor(Math.random() * popularVerses.length)];
      
      // Get the verse
      const verse = await BibleAPI.getVerse(randomVerseId);
      return verse;
    } catch (error) {
      console.error('Error fetching verse of the day:', error);
      throw error;
    }
  },

  // Get chapter count for a book
  getChapterCount: async (bookId: string): Promise<number> => {
    try {
      const response = await BibleAPI.apiClient.get(
        `/bibles/${BIBLE_VERSION}/books/${bookId}/chapters`
      );
      // Subtract 1 to account for the "introduction" chapter that some APIs include
      return response.data.data.length - 1;
    } catch (error) {
      console.error('Error fetching chapter count:', error);
      throw error;
    }
  },

  // Helper to get book name from ID
  getBookNameFromId: (bookId: string): string | undefined => {
    const allBooks = [...BIBLE_BOOKS.OLD_TESTAMENT, ...BIBLE_BOOKS.NEW_TESTAMENT];
    const book = allBooks.find(b => b.id === bookId);
    return book?.name;
  },

  // Helper to get book ID from name
  getBookIdFromName: (bookName: string): string | undefined => {
    const allBooks = [...BIBLE_BOOKS.OLD_TESTAMENT, ...BIBLE_BOOKS.NEW_TESTAMENT];
    const book = allBooks.find(b => b.name.toLowerCase() === bookName.toLowerCase());
    return book?.id;
  },

  // Clean verse content by removing HTML tags
  cleanVerseContent: (content: string): string => {
    return content
      .replace(/<\/?[^>]+(>|$)/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ')           // Normalize whitespace
      .trim();                        // Trim leading/trailing whitespace
  }
};

export default BibleAPI;