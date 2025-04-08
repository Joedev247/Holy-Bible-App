import axios from 'axios';

const API_KEY = '36ebed110d7d903f348a800b00415d2f';
const API_BASE_URL = 'https://api.scripture.api.bible/v1';
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

export const VERSE_COUNTS: Record<string, number> = {
  'GEN.1': 31, 'GEN.2': 25, 'GEN.3': 24, 'GEN.4': 26, 'GEN.5': 32,
  'GEN.6': 22, 'GEN.7': 24, 'GEN.8': 22, 'GEN.9': 29, 'GEN.10': 32,
  'PSA.1': 6, 'PSA.23': 6, 'PSA.119': 176,
  'JHN.1': 51, 'JHN.3': 36, 'JHN.14': 31,
  'MAT.5': 48, 'MAT.6': 34, 'MAT.7': 29,
  'ROM.8': 39, 'ROM.12': 21,
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'api-key': API_KEY,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(config => {
  config.withCredentials = false;
  return config;
});

export const BibleAPI = {
  apiClient,

  getVerseCount: async (chapterId: string): Promise<number> => {
    if (VERSE_COUNTS[chapterId]) {
      return VERSE_COUNTS[chapterId];
    }

    try {
      const response = await apiClient.get(
        `/bibles/${BIBLE_VERSION}/chapters/${chapterId}/verses`
      );
      return response.data.data.length;
    } catch (error) {
      console.error('Error fetching verse count:', error);
      
      const bookId = chapterId.split('.')[0];
      
      if (bookId === 'PSA') return 20; 
      if (['PRO', 'ISA', 'JER'].includes(bookId)) return 25; 
      if (['JON', 'JUD', '2JN', '3JN', 'PHM'].includes(bookId)) return 15; 
      
      return 30; 
    }
  },

  getBookInfo: async (bookId: string) => {
    try {
      const response = await apiClient.get(
        `/bibles/${BIBLE_VERSION}/books/${bookId}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching book info:', error);
      throw error;
    }
  },

  getChapter: async (chapterId: string) => {
    try {
      const response = await apiClient.get(
        `/bibles/${BIBLE_VERSION}/chapters/${chapterId}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching chapter:', error);
      throw error;
    }
  },

  getChapterVerses: async (chapterId: string): Promise<BibleVerse[]> => {
    try {
      const response = await apiClient.get(
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

  getVerse: async (verseId: string): Promise<BibleVerse> => {
    try {
      const response = await apiClient.get(
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

  searchBible: async (query: string): Promise<BibleVerse[]> => {
    try {
      const response = await apiClient.get(
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

  advancedSearchBible: async (query: string, filters: { books?: string[], testament?: string }): Promise<BibleVerse[]> => {
    try {
      let params: any = { query };
      
      if (filters.books && filters.books.length > 0) {
        params.bookids = filters.books.join(',');
      }
      
      const response = await apiClient.get(
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

  getVerseOfTheDay: async (): Promise<BibleVerse> => {
    try {
      const popularVerses = [
        'JHN.3.16', 'PSA.23.1', 'ROM.8.28', 'PHP.4.13', 'JER.29.11', 
        'PRO.3.5', 'ISA.40.31', 'MAT.28.19', 'PSA.46.1', 'GAL.5.22'
      ];
      
      const randomVerseId = popularVerses[Math.floor(Math.random() * popularVerses.length)];
      
      const verse = await BibleAPI.getVerse(randomVerseId);
      return verse;
    } catch (error) {
      console.error('Error fetching verse of the day:', error);
      throw error;
    }
  },

  getChapterCount: async (bookId: string): Promise<number> => {
    try {
      const response = await apiClient.get(
        `/bibles/${BIBLE_VERSION}/books/${bookId}/chapters`
      );
      return response.data.data.length - 1;
    } catch (error) {
      console.error('Error fetching chapter count:', error);
      
      const chapterCounts: Record<string, number> = {
        'GEN': 50, 'EXO': 40, 'LEV': 27, 'NUM': 36, 'DEU': 34,
        'JOS': 24, 'JDG': 21, 'RUT': 4, '1SA': 31, '2SA': 24,
        '1KI': 22, '2KI': 25, '1CH': 29, '2CH': 36, 'EZR': 10,
        'NEH': 13, 'EST': 10, 'JOB': 42, 'PSA': 150, 'PRO': 31,
        'ECC': 12, 'SNG': 8, 'ISA': 66, 'JER': 52, 'LAM': 5,
        'EZK': 48, 'DAN': 12, 'HOS': 14, 'JOL': 3, 'AMO': 9,
        'OBA': 1, 'JON': 4, 'MIC': 7, 'NAM': 3, 'HAB': 3,
        'ZEP': 3, 'HAG': 2, 'ZEC': 14, 'MAL': 4,
        'MAT': 28, 'MRK': 16, 'LUK': 24, 'JHN': 21, 'ACT': 28,
        'ROM': 16, '1CO': 16, '2CO': 13, 'GAL': 6, 'EPH': 6,
        'PHP': 4, 'COL': 4, '1TH': 5, '2TH': 3, '1TI': 6,
        '2TI': 4, 'TIT': 3, 'PHM': 1, 'HEB': 13, 'JAS': 5,
        '1PE': 5, '2PE': 3, '1JN': 5, '2JN': 1, '3JN': 1,
        'JUD': 1, 'REV': 22
      };
      
      return chapterCounts[bookId] || 1;
    }
  },

  getBookNameFromId: (bookId: string): string | undefined => {
    const allBooks = [...BIBLE_BOOKS.OLD_TESTAMENT, ...BIBLE_BOOKS.NEW_TESTAMENT];
    const book = allBooks.find(b => b.id === bookId);
    return book?.name;
  },

  getBookIdFromName: (bookName: string): string | undefined => {
    const allBooks = [...BIBLE_BOOKS.OLD_TESTAMENT, ...BIBLE_BOOKS.NEW_TESTAMENT];
    const book = allBooks.find(b => b.name.toLowerCase() === bookName.toLowerCase());
    return book?.id;
  },

cleanVerseContent: (content: string | undefined | null): string => {
  if (!content) return '';
  
  return content
    .replace(/<\/?[^>]+(>|$)/g, '') 
    .replace(/\s+/g, ' ')          
    .trim();                     
}
};

export default BibleAPI;