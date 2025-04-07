import { BIBLE_BOOKS } from '../services/bibleApi';

export interface ParsedReference {
  valid: boolean;
  bookId: string | null;
  bookName: string | null;
  chapter: number | null;
  verse: number | null;
  endVerse?: number | null;
  endChapter?: number | null;
  isRange: boolean;
}


const ALL_BOOKS = [...BIBLE_BOOKS.OLD_TESTAMENT, ...BIBLE_BOOKS.NEW_TESTAMENT];

const BOOK_ALIASES: Record<string, string> = {
  'gen': 'GEN', 'genesis': 'GEN',
  'ex': 'EXO', 'exo': 'EXO', 'exodus': 'EXO',
  'lev': 'LEV', 'leviticus': 'LEV',
  'num': 'NUM', 'numbers': 'NUM',
  'deut': 'DEU', 'deu': 'DEU', 'deuteronomy': 'DEU',
  'josh': 'JOS', 'jos': 'JOS', 'joshua': 'JOS',
  'judg': 'JDG', 'jdg': 'JDG', 'judges': 'JDG',
  'ru': 'RUT', 'ruth': 'RUT',
  '1sam': '1SA', '1 sam': '1SA', '1 samuel': '1SA', '1st samuel': '1SA',
  '2sam': '2SA', '2 sam': '2SA', '2 samuel': '2SA', '2nd samuel': '2SA',
  '1ki': '1KI', '1 ki': '1KI', '1 kings': '1KI', '1st kings': '1KI',
  '2ki': '2KI', '2 ki': '2KI', '2 kings': '2KI', '2nd kings': '2KI',
  '1chr': '1CH', '1 chr': '1CH', '1 chron': '1CH', '1 chronicles': '1CH', '1st chronicles': '1CH',
  '2chr': '2CH', '2 chr': '2CH', '2 chron': '2CH', '2 chronicles': '2CH', '2nd chronicles': '2CH',
  'ezra': 'EZR',
  'neh': 'NEH', 'nehemiah': 'NEH',
  'est': 'EST', 'esther': 'EST',
  'job': 'JOB',
  'ps': 'PSA', 'psa': 'PSA', 'psalm': 'PSA', 'psalms': 'PSA',
  'prov': 'PRO', 'pro': 'PRO', 'proverbs': 'PRO',
  'eccl': 'ECC', 'ecc': 'ECC', 'ecclesiastes': 'ECC',
  'song': 'SNG', 'sos': 'SNG', 'song of solomon': 'SNG', 'song of songs': 'SNG',
  'isa': 'ISA', 'isaiah': 'ISA',
  'jer': 'JER', 'jeremiah': 'JER',
  'lam': 'LAM', 'lamentations': 'LAM',
  'ezek': 'EZK', 'ezk': 'EZK', 'ezekiel': 'EZK',
  'dan': 'DAN', 'daniel': 'DAN',
  'hos': 'HOS', 'hosea': 'HOS',
  'joel': 'JOL',
  'amos': 'AMO',
  'obad': 'OBA', 'oba': 'OBA', 'obadiah': 'OBA',
  'jonah': 'JON', 'jon': 'JON',
  'mic': 'MIC', 'micah': 'MIC',
  'nah': 'NAM', 'nahum': 'NAM',
  'hab': 'HAB', 'habakkuk': 'HAB',
  'zeph': 'ZEP', 'zep': 'ZEP', 'zephaniah': 'ZEP',
  'hag': 'HAG', 'haggai': 'HAG',
  'zech': 'ZEC', 'zec': 'ZEC', 'zechariah': 'ZEC',
  'mal': 'MAL', 'malachi': 'MAL',
  'matt': 'MAT', 'mat': 'MAT', 'matthew': 'MAT',
  'mk': 'MRK', 'mark': 'MRK',
  'lk': 'LUK', 'luke': 'LUK',
  'jn': 'JHN', 'john': 'JHN',
  'acts': 'ACT',
  'rom': 'ROM', 'romans': 'ROM',
  '1cor': '1CO', '1 cor': '1CO', '1 corinthians': '1CO', '1st corinthians': '1CO',
  '2cor': '2CO', '2 cor': '2CO', '2 corinthians': '2CO', '2nd corinthians': '2CO',
  'gal': 'GAL', 'galatians': 'GAL',
  'eph': 'EPH', 'ephesians': 'EPH',
  'phil': 'PHP', 'php': 'PHP', 'philippians': 'PHP',
  'col': 'COL', 'colossians': 'COL',
  '1thess': '1TH', '1 thess': '1TH', '1 thessalonians': '1TH', '1st thessalonians': '1TH',
  '2thess': '2TH', '2 thess': '2TH', '2 thessalonians': '2TH', '2nd thessalonians': '2TH',
  '1tim': '1TI', '1 tim': '1TI', '1 timothy': '1TI', '1st timothy': '1TI',
  '2tim': '2TI', '2 tim': '2TI', '2 timothy': '2TI', '2nd timothy': '2TI',
  'tit': 'TIT', 'titus': 'TIT',
  'philem': 'PHM', 'phm': 'PHM', 'philemon': 'PHM',
  'heb': 'HEB', 'hebrews': 'HEB',
  'jas': 'JAS', 'james': 'JAS',
  '1pet': '1PE', '1 pet': '1PE', '1 peter': '1PE', '1st peter': '1PE',
  '2pet': '2PE', '2 pet': '2PE', '2 peter': '2PE', '2nd peter': '2PE',
  '1jn': '1JN', '1 jn': '1JN', '1 john': '1JN', '1st john': '1JN',
  '2jn': '2JN', '2 jn': '2JN', '2 john': '2JN', '2nd john': '2JN',
  '3jn': '3JN', '3 jn': '3JN', '3 john': '3JN', '3rd john': '3JN',
  'jude': 'JUD',
  'rev': 'REV', 'revelation': 'REV'
};

export const parseReference = (reference: string): ParsedReference => {
  const defaultResult: ParsedReference = {
    valid: false,
    bookId: null,
    bookName: null,
    chapter: null, 
    verse: null,
    isRange: false
  };
  
  if (!reference || typeof reference !== 'string') {
    return defaultResult;
  }
  
  const normalizedRef = reference.trim().toLowerCase();
  
  
  const basicPattern = /^([\w\s]+)\s+(\d+):(\d+)(?:-(\d+))?$/i;
  
  const verseRangePattern = /^([\w\s]+)\s+(\d+):(\d+)-(\d+)$/i;
  
  const chapterRangePattern = /^([\w\s]+)\s+(\d+)-(\d+)$/i;
  
  let match = normalizedRef.match(verseRangePattern);
  if (match) {
    const [_, bookName, chapter, startVerse, endVerse] = match;
    const bookId = getBookIdFromName(bookName);
    
    if (bookId) {
      return {
        valid: true,
        bookId,
        bookName: getBookNameFromId(bookId),
        chapter: parseInt(chapter, 10),
        verse: parseInt(startVerse, 10),
        endVerse: parseInt(endVerse, 10),
        isRange: true
      };
    }
  }
  
  match = normalizedRef.match(chapterRangePattern);
  if (match) {
    const [_, bookName, startChapter, endChapter] = match;
    const bookId = getBookIdFromName(bookName);
    
    if (bookId) {
      return {
        valid: true,
        bookId,
        bookName: getBookNameFromId(bookId),
        chapter: parseInt(startChapter, 10),
        endChapter: parseInt(endChapter, 10),
        verse: null,
        isRange: true
      };
    }
  }
  
  match = normalizedRef.match(basicPattern);
  if (match) {
    const [_, bookName, chapter, verse, endVerse] = match;
    const bookId = getBookIdFromName(bookName);
    
    if (bookId) {
      return {
        valid: true,
        bookId,
        bookName: getBookNameFromId(bookId),
        chapter: parseInt(chapter, 10),
        verse: parseInt(verse, 10),
        endVerse: endVerse ? parseInt(endVerse, 10) : null,
        isRange: !!endVerse
      };
    }
  }
  
  const bookChapterPattern = /^([\w\s]+)\s+(\d+)$/i;
  match = normalizedRef.match(bookChapterPattern);
  if (match) {
    const [_, bookName, chapter] = match;
    const bookId = getBookIdFromName(bookName);
    
    if (bookId) {
      return {
        valid: true,
        bookId,
        bookName: getBookNameFromId(bookId),
        chapter: parseInt(chapter, 10),
        verse: null,
        isRange: false
      };
    }
  }
  
  const bookId = getBookIdFromName(normalizedRef);
  if (bookId) {
    return {
      valid: true,
      bookId,
      bookName: getBookNameFromId(bookId),
      chapter: null,
      verse: null,
      isRange: false
    };
  }
  
  return defaultResult;
};

export const getBookIdFromName = (name: string): string | null => {
  if (!name) return null;
  
  const normalized = name.trim().toLowerCase();
  
  if (BOOK_ALIASES[normalized]) {
    return BOOK_ALIASES[normalized];
  }
  
  const book = ALL_BOOKS.find(b => 
    b.name.toLowerCase() === normalized
  );
  
  return book ? book.id : null;
};

export const getBookNameFromId = (id: string): string | null => {
  if (!id) return null;
  
  const book = ALL_BOOKS.find(b => b.id === id);
  return book ? book.name : null;
};

export const formatReferenceForApi = (ref: ParsedReference): string | null => {
  if (!ref.valid || !ref.bookId) return null;
  
  if (ref.isRange) {
    if (ref.endChapter) {
      return `${ref.bookId}.${ref.chapter}-${ref.endChapter}`;
    } else if (ref.endVerse) {
      return `${ref.bookId}.${ref.chapter}.${ref.verse}-${ref.endVerse}`;
    }
  }
  
  if (ref.chapter && ref.verse) {
    return `${ref.bookId}.${ref.chapter}.${ref.verse}`;
  } else if (ref.chapter) {
    return `${ref.bookId}.${ref.chapter}`;
  }
  
  return ref.bookId;
};

export const formatReferenceForDisplay = (ref: ParsedReference): string => {
  if (!ref.valid || !ref.bookName) return '';
  
  if (ref.isRange) {
    if (ref.endChapter) {
      return `${ref.bookName} ${ref.chapter}-${ref.endChapter}`;
    } else if (ref.endVerse) {
      return `${ref.bookName} ${ref.chapter}:${ref.verse}-${ref.endVerse}`;
    }
  }
  
  if (ref.chapter && ref.verse) {
    return `${ref.bookName} ${ref.chapter}:${ref.verse}`;
  } else if (ref.chapter) {
    return `${ref.bookName} ${ref.chapter}`;
  }
  
  return ref.bookName;
};