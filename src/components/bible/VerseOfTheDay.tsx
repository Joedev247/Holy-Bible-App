import { useState, useEffect } from 'react';
import { BibleAPI, BibleVerse } from '../../services/bibleApi';
import { Link } from 'react-router-dom';
import { Sparkles, Copy, Check } from 'lucide-react';

const VerseOfTheDay = () => {
  const [verse, setVerse] = useState<BibleVerse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchVerseOfTheDay = async () => {
      try {
        setLoading(true);
        const verseData = await BibleAPI.getVerseOfTheDay();
        setVerse(verseData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching verse of the day:', err);
        setError('Failed to load verse of the day.');
        setLoading(false);
      }
    };

    fetchVerseOfTheDay();
  }, []);

  const copyToClipboard = () => {
    if (!verse) return;
    
    const verseText = `${verse.reference} - ${BibleAPI.cleanVerseContent(verse.content)}`;
    navigator.clipboard.writeText(verseText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getVerseUrl = () => {
    if (!verse) return '#';

    const parts = verse.reference.split(' ');
    const fullBookName = BibleAPI.getBookNameFromId(verse.bookId);
    
    if (!fullBookName) return '#';
    
    const chapterVerseParts = parts[1].split(':');
    const chapter = chapterVerseParts[0];
    const verseNum = chapterVerseParts[1];
    
    return `/bible/${fullBookName.toLowerCase().replace(/\s+/g, '-')}/${chapter}/${verseNum}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-20 bg-gray-200 rounded mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
      </div>
    );
  }

  if (error || !verse) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-red-600 text-center">{error || 'Verse not available'}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#8B0000] to-[#A52A2A] text-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-center mb-4">
        <Sparkles className="w-5 h-5 mr-2" />
        <h2 className="font-serif text-xl">Verse of the Day</h2>
      </div>

      <blockquote className="text-center mb-6 leading-relaxed">
        "{BibleAPI.cleanVerseContent(verse.content)}"
      </blockquote>

      <p className="text-center mb-6 font-semibold">{verse.reference}</p>

      <div className="flex justify-center space-x-4">
        <button
          onClick={copyToClipboard}
          className="flex items-center px-3 py-1 bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 transition-colors"
        >
          {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
        
        <Link
          to={getVerseUrl()}
          className="px-3 py-1 bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 transition-colors"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default VerseOfTheDay;