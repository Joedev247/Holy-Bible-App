import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BibleAPI } from '../services/bibleApi';
import BibleVerse from '../components/bible/BibleVerse';
import { ChevronLeft, BookOpen } from 'lucide-react';

const VerseView = () => {
  const { bookName, chapterNumber, verseNumber } = useParams<{ 
    bookName: string; 
    chapterNumber: string;
    verseNumber: string;
  }>();
  const [bookId, setBookId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formattedBookName, setFormattedBookName] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true);
        if (!bookName || !chapterNumber || !verseNumber) {
          setError('Invalid reference');
          setLoading(false);
          return;
        }

        // Convert URL-friendly book name to proper format
        const formatted = bookName
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        setFormattedBookName(formatted);

        // Get book ID from name
        const id = BibleAPI.getBookIdFromName(formatted);
        
        if (!id) {
          setError('Book not found');
          setLoading(false);
          return;
        }

        setBookId(id);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching book data:', err);
        setError('Failed to load verse. Please try again.');
        setLoading(false);
      }
    };

    fetchBookData();
  }, [bookName, chapterNumber, verseNumber]);

  const navigateToChapter = () => {
    if (bookName && chapterNumber) {
      navigate(`/bible/${bookName}/${chapterNumber}`);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading verse...</div>;
  }

  if (error || !bookId) {
    return <div className="text-red-600 text-center py-12">{error || 'Verse not found'}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={navigateToChapter}
        className="flex items-center text-[#8B0000] hover:underline mb-6"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to {formattedBookName} {chapterNumber}
      </button>

      <div className="flex items-center justify-center mb-6">
        <BookOpen className="w-6 h-6 text-[#8B0000] mr-2" />
        <h1 className="text-2xl font-serif font-bold text-[#8B0000]">
          {formattedBookName} {chapterNumber}:{verseNumber}
        </h1>
      </div>

      <BibleVerse 
        bookId={bookId} 
        chapterNumber={chapterNumber || '1'} 
        verseNumber={verseNumber || '1'} 
        fullDisplay={true}
      />

      <div className="mt-8 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4 text-[#8B0000]">Context</h2>
        <p className="text-gray-700 mb-4">
          Scripture is best understood within its proper context. Consider exploring:
        </p>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={navigateToChapter}
            className="px-4 py-2 bg-[#FFF5E6] hover:bg-[#FFE8CC] rounded-md transition-colors"
          >
            Read Full Chapter
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerseView;