import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BibleAPI, BibleVerse } from '../../services/bibleApi';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BibleChapterProps {
  bookId: string;
  chapterNumber: string;
  bookName: string;
}

const BibleChapter = ({ bookId, chapterNumber, bookName }: BibleChapterProps) => {
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chapterCount, setChapterCount] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        setLoading(true);
        const chapterId = `${bookId}.${chapterNumber}`;
        const chapterData = await BibleAPI.getChapter(chapterId);
        
        if (chapterData) {
          const chapterVerses = await BibleAPI.getChapterVerses(chapterId);
          setVerses(chapterVerses);
        }
        
        const chapCount = await BibleAPI.getChapterCount(bookId);
        setChapterCount(chapCount);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching chapter:', err);
        setError('Failed to load chapter. Please try again.');
        setLoading(false);
      }
    };

    fetchChapter();
  }, [bookId, chapterNumber]);

  const handleVerseClick = (verseNumber: string) => {
    navigate(`/bible/${bookName.toLowerCase().replace(/\s+/g, '-')}/${chapterNumber}/${verseNumber}`);
  };

  const navigateToChapter = (newChapter: number) => {
    navigate(`/bible/${bookName.toLowerCase().replace(/\s+/g, '-')}/${newChapter}`);
  };

  if (loading) {
    return <div className="text-center py-12">Loading chapter...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-12">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-2xl font-serif mb-6 text-center text-[#8B0000]">
        {bookName} {chapterNumber}
      </h2>

      <div className="space-y-4">
        {verses.map((verse) => (
          <div 
            key={verse.id} 
            className="leading-relaxed cursor-pointer hover:bg-[#FFF5E6] p-2 rounded transition-colors"
            onClick={() => handleVerseClick(verse.reference.split(':')[1])}
          >
            <span className="text-[#8B0000] font-bold mr-2">{verse.reference.split(':')[1]}</span>
            <span>{BibleAPI.cleanVerseContent(verse.content)}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8 border-t pt-4">
        <button
          onClick={() => navigateToChapter(parseInt(chapterNumber) - 1)}
          disabled={chapterNumber === '1'}
          className={`flex items-center ${
            chapterNumber === '1'
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-[#8B0000] hover:underline'
          }`}
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Previous Chapter
        </button>
        
        <button
          onClick={() => navigateToChapter(parseInt(chapterNumber) + 1)}
          disabled={parseInt(chapterNumber) >= chapterCount}
          className={`flex items-center ${
            parseInt(chapterNumber) >= chapterCount
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-[#8B0000] hover:underline'
          }`}
        >
          Next Chapter
          <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default BibleChapter;