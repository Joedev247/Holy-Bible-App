import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BIBLE_BOOKS } from '../services/bibleApi';

interface BibleNavigationContextType {
  selectedBook: string;
  selectedChapter: string;
  selectedVerse: string;
  bookName: string;
  setSelection: (book: string, chapter: string, verse?: string) => void;
}

const BibleNavigationContext = createContext<BibleNavigationContextType | undefined>(undefined);

export const useBibleNavigation = () => {
  const context = useContext(BibleNavigationContext);
  if (!context) {
    throw new Error('useBibleNavigation must be used within a BibleNavigationProvider');
  }
  return context;
};

export const BibleNavigationProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [selectedBook, setSelectedBook] = useState('GEN');
  const [selectedChapter, setSelectedChapter] = useState('1');
  const [selectedVerse, setSelectedVerse] = useState('1');
  const [bookName, setBookName] = useState('Genesis');
  const navigate = useNavigate();
  const location = useLocation();

  const getBookIdFromName = (name: string): string => {
    const formattedName = name.replace(/-/g, ' ');
    
    const allBooks = [
      ...BIBLE_BOOKS.OLD_TESTAMENT,
      ...BIBLE_BOOKS.NEW_TESTAMENT
    ];
    
    const book = allBooks.find(
      b => b.name.toLowerCase() === formattedName.toLowerCase()
    );
    
    return book ? book.id : 'GEN';
  };

  const getBookNameFromId = (id: string): string => {
    const allBooks = [
      ...BIBLE_BOOKS.OLD_TESTAMENT,
      ...BIBLE_BOOKS.NEW_TESTAMENT
    ];
    
    const book = allBooks.find(b => b.id === id);
    return book ? book.name : 'Genesis';
  };

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    
    if (pathParts[1] === 'bible' && pathParts.length >= 3) {
      const bookNameFromUrl = pathParts[2];
      const chapterFromUrl = pathParts[3] || '1';
      const verseFromUrl = pathParts[4] || '1';
      
      if (bookNameFromUrl) {
        const bookId = getBookIdFromName(bookNameFromUrl);
        const bookDisplayName = getBookNameFromId(bookId);
        
        setSelectedBook(bookId);
        setBookName(bookDisplayName);
        setSelectedChapter(chapterFromUrl);
        setSelectedVerse(verseFromUrl);
      }
    }
  }, [location]);

  const setSelection = (book: string, chapter: string, verse?: string) => {
    setSelectedBook(book);
    setSelectedChapter(chapter);
    if (verse) setSelectedVerse(verse);
    
    const bookDisplayName = getBookNameFromId(book);
    setBookName(bookDisplayName);
    
    const bookNameForUrl = bookDisplayName.toLowerCase().replace(/\s+/g, '-');
    
    if (verse && verse !== '1') {
      navigate(`/bible/${bookNameForUrl}/${chapter}/${verse}`);
    } else {
      navigate(`/bible/${bookNameForUrl}/${chapter}`);
    }
  };

  const value = {
    selectedBook,
    selectedChapter,
    selectedVerse,
    bookName,
    setSelection
  };

  return (
    <BibleNavigationContext.Provider value={value}>
      {children}
    </BibleNavigationContext.Provider>
  );
};