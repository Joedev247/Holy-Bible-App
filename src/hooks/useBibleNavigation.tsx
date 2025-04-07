import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BibleAPI, BIBLE_BOOKS } from '../services/bibleApi';

interface UseBibleNavigationReturn {
  navigateToBook: (bookId: string) => void;
  navigateToChapter: (bookId: string, chapter: number) => void;
  navigateToVerse: (bookId: string, chapter: number, verse: number) => void;
  navigateToNextChapter: (currentBookId: string, currentChapter: number) => void;
  navigateToPreviousChapter: (currentBookId: string, currentChapter: number) => void;
  getNextChapterInfo: (currentBookId: string, currentChapter: number) => Promise<{bookId: string, chapter: number, bookName: string} | null>;
  getPreviousChapterInfo: (currentBookId: string, currentChapter: number) => Promise<{bookId: string, chapter: number, bookName: string} | null>;
  booksList: typeof BIBLE_BOOKS.OLD_TESTAMENT | typeof BIBLE_BOOKS.NEW_TESTAMENT;
  testament: 'old' | 'new';
  setTestament: (testament: 'old' | 'new') => void;
}

export const useBibleNavigation = (): UseBibleNavigationReturn => {
  const navigate = useNavigate();
  const [testament, setTestament] = useState<'old' | 'new'>('new');
  const [booksList, setBooksList] = useState<typeof BIBLE_BOOKS.OLD_TESTAMENT | typeof BIBLE_BOOKS.NEW_TESTAMENT>(
    testament === 'old' ? BIBLE_BOOKS.OLD_TESTAMENT : BIBLE_BOOKS.NEW_TESTAMENT
  );

  useEffect(() => {
    setBooksList(testament === 'old' ? BIBLE_BOOKS.OLD_TESTAMENT : BIBLE_BOOKS.NEW_TESTAMENT);
  }, [testament]);

  const navigateToBook = (bookId: string) => {
    navigate(`/bible/book/${bookId}`);
  };

  const navigateToChapter = (bookId: string, chapter: number) => {
    navigate(`/bible/book/${bookId}/${chapter}`);
  };

  const navigateToVerse = (bookId: string, chapter: number, verse: number) => {
    navigate(`/bible/book/${bookId}/${chapter}/${verse}`);
  };

  const getNextChapterInfo = async (currentBookId: string, currentChapter: number) => {
    // Get the chapter count for the current book
    const chapterCount = await BibleAPI.getChapterCount(currentBookId);
    
    // If there are more chapters in this book
    if (currentChapter < chapterCount) {
      return {
        bookId: currentBookId,
        chapter: currentChapter + 1,
        bookName: BibleAPI.getBookNameFromId(currentBookId) || ''
      };
    }
    
    // If we're at the last chapter of the book, find the next book
    const allBooks = [...BIBLE_BOOKS.OLD_TESTAMENT, ...BIBLE_BOOKS.NEW_TESTAMENT];
    const currentBookIndex = allBooks.findIndex(book => book.id === currentBookId);
    
    // If we found the current book and it's not the last book
    if (currentBookIndex >= 0 && currentBookIndex < allBooks.length - 1) {
      const nextBook = allBooks[currentBookIndex + 1];
      return {
        bookId: nextBook.id,
        chapter: 1, // Start at chapter 1 of the next book
        bookName: nextBook.name
      };
    }
    
    // If we're at the last chapter of the last book
    return null;
  };

  const getPreviousChapterInfo = async (currentBookId: string, currentChapter: number) => {
    // If we're not at the first chapter of the book
    if (currentChapter > 1) {
      return {
        bookId: currentBookId,
        chapter: currentChapter - 1,
        bookName: BibleAPI.getBookNameFromId(currentBookId) || ''
      };
    }
    
    // If we're at the first chapter of the book, find the previous book
    const allBooks = [...BIBLE_BOOKS.OLD_TESTAMENT, ...BIBLE_BOOKS.NEW_TESTAMENT];
    const currentBookIndex = allBooks.findIndex(book => book.id === currentBookId);
    
    // If we found the current book and it's not the first book
    if (currentBookIndex > 0) {
      const prevBook = allBooks[currentBookIndex - 1];
      
      // Get the chapter count for the previous book
      const chapterCount = await BibleAPI.getChapterCount(prevBook.id);
      
      return {
        bookId: prevBook.id,
        chapter: chapterCount, // Go to last chapter of previous book
        bookName: prevBook.name
      };
    }
    
    // If we're at the first chapter of the first book
    return null;
  };

  const navigateToNextChapter = async (currentBookId: string, currentChapter: number) => {
    const nextChapterInfo = await getNextChapterInfo(currentBookId, currentChapter);
    if (nextChapterInfo) {
      navigateToChapter(nextChapterInfo.bookId, nextChapterInfo.chapter);
    }
  };

  const navigateToPreviousChapter = async (currentBookId: string, currentChapter: number) => {
    const prevChapterInfo = await getPreviousChapterInfo(currentBookId, currentChapter);
    if (prevChapterInfo) {
      navigateToChapter(prevChapterInfo.bookId, prevChapterInfo.chapter);
    }
  };

  return {
    navigateToBook,
    navigateToChapter,
    navigateToVerse,
    navigateToNextChapter,
    navigateToPreviousChapter,
    getNextChapterInfo,
    getPreviousChapterInfo,
    booksList,
    testament,
    setTestament
  };
};