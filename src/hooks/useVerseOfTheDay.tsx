import { useState, useEffect } from 'react';
import { BibleAPI, BibleVerse } from '../services/bibleApi';

interface UseVerseOfTheDayReturn {
  verse: BibleVerse | null;
  reference: string;
  text: string;
  isLoading: boolean;
  error: string | null;
  refreshVerse: () => Promise<void>;
}

export const useVerseOfTheDay = (): UseVerseOfTheDayReturn => {
  const [verse, setVerse] = useState<BibleVerse | null>(null);
  const [reference, setReference] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVerseOfTheDay = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedVerse = await BibleAPI.getVerseOfTheDay();
      
      if (fetchedVerse) {
        setVerse(fetchedVerse);
        setReference(fetchedVerse.reference || '');
        setText(BibleAPI.cleanVerseContent(fetchedVerse.content || ''));
      } else {
        const fallbackVerse = await BibleAPI.getVerse('JHN.3.16');
        if (fallbackVerse) {
          setVerse(fallbackVerse);
          setReference(fallbackVerse.reference || 'John 3:16');
          setText(BibleAPI.cleanVerseContent(fallbackVerse.content || ''));
        } else {
          setError('Unable to fetch verse of the day');
        }
      }
    } catch (err) {
      console.error('Error fetching verse of the day:', err);
      setError('Failed to load verse of the day');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVerseOfTheDay();
    
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const msUntilMidnight = midnight.getTime() - new Date().getTime();
    
    const timerId = setTimeout(() => {
      fetchVerseOfTheDay();
    }, msUntilMidnight);
    
    return () => {
      clearTimeout(timerId);
    };
  }, []);

  const refreshVerse = async () => {
    await fetchVerseOfTheDay();
  };

  return {
    verse,
    reference,
    text,
    isLoading,
    error,
    refreshVerse
  };
};