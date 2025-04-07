import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BibleAPI } from '../../services/bibleApi';
import { Star } from 'lucide-react';

const QuickAccessVerses = () => {
  const navigate = useNavigate();

  // Popular verses for quick access
  const popularVerses = [
    { id: 'JHN.3.16', reference: 'John 3:16' },
    { id: 'PSA.23.1', reference: 'Psalm 23:1' },
    { id: 'ROM.8.28', reference: 'Romans 8:28' },
    { id: 'PHP.4.13', reference: 'Philippians 4:13' },
    { id: 'JER.29.11', reference: 'Jeremiah 29:11' },
    { id: 'PRO.3.5', reference: 'Proverbs 3:5' }
  ];

  const navigateToVerse = (verseId: string) => {
    const parts = verseId.split('.');
    const bookId = parts[0];
    const chapter = parts[1];
    const verse = parts[2];
    
    const bookName = BibleAPI.getBookNameFromId(bookId);
    if (bookName) {
      navigate(`/bible/${bookName.toLowerCase().replace(/\s+/g, '-')}/${chapter}/${verse}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center mb-4">
        <Star className="w-5 h-5 text-[#8B0000] mr-2" />
        <h2 className="font-semibold text-lg">Popular Verses</h2>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {popularVerses.map((verse) => (
          <button
            key={verse.id}
            onClick={() => navigateToVerse(verse.id)}
            className="p-2 bg-[#FFF5E6] rounded text-left hover:bg-[#FFE8CC] transition-colors"
          >
            {verse.reference}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickAccessVerses;