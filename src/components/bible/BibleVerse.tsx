import React, { useState, useEffect } from 'react';
import { BibleAPI } from '../../services/bibleApi';
import { Copy, Check, Share2 } from 'lucide-react';

interface BibleVerseProps {
  bookId: string;
  chapterNumber: string;
  verseNumber: string;
  fullDisplay?: boolean;
}

const BibleVerse = ({ bookId, chapterNumber, verseNumber, fullDisplay = false }: BibleVerseProps) => {
  const [verse, setVerse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchVerse = async () => {
      try {
        setLoading(true);
        const verseId = `${bookId}.${chapterNumber}.${verseNumber}`;
        const verseData = await BibleAPI.getVerse(verseId);
        setVerse(verseData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching verse:', err);
        setError('Failed to load verse. Please try again.');
        setLoading(false);
      }
    };

    fetchVerse();
  }, [bookId, chapterNumber, verseNumber]);

  const copyToClipboard = () => {
    if (!verse) return;
    
    const verseText = `${verse.reference} - ${BibleAPI.cleanVerseContent(verse.content)}`;
    navigator.clipboard.writeText(verseText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareVerse = () => {
    if (!verse) return;
    
    if (navigator.share) {
      navigator.share({
        title: `Bible Verse: ${verse.reference}`,
        text: `${verse.reference} - ${BibleAPI.cleanVerseContent(verse.content)}`,
        url: window.location.href,
      });
    } else {
      copyToClipboard();
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading verse...</div>;
  }

  if (error || !verse) {
    return <div className="text-red-600 text-center py-4">{error || 'Verse not found'}</div>;
  }

  // For compact display (used in search results or quick access)
  if (!fullDisplay) {
    return (
      <div className="bg-[#FFF5E6] p-3 rounded-lg mb-2">
        <p className="text-sm">
          <span className="font-bold text-[#8B0000]">{verse.reference} </span>
          <span>{BibleAPI.cleanVerseContent(verse.content)}</span>
        </p>
      </div>
    );
  }

  // For full display (dedicated verse view)
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-serif mb-6 text-center text-[#8B0000]">
        {verse.reference}
      </h2>

      <div className="text-lg leading-relaxed mb-8 text-center">
        {BibleAPI.cleanVerseContent(verse.content)}
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={copyToClipboard}
          className="flex items-center px-4 py-2 bg-[#FFF5E6] rounded-md hover:bg-[#FFE8CC] transition-colors"
        >
          {copied ? <Check className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
        
        <button
          onClick={shareVerse}
          className="flex items-center px-4 py-2 bg-[#FFF5E6] rounded-md hover:bg-[#FFE8CC] transition-colors"
        >
          <Share2 className="w-5 h-5 mr-2" />
          Share
        </button>
      </div>
    </div>
  );
};

export default BibleVerse;