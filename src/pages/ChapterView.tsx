import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BibleAPI } from '../services/bibleApi';
import BibleChapter from '../components/bible/BibleChapter';
import { ChevronLeft, Book } from 'lucide-react';

const ChapterView = () => {
  const { bookName, chapterNumber } = useParams<{ bookName: string; chapterNumber: string }>();
  const [bookId, setBookId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formattedBookName, setFormattedBookName] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true);
        if (!bookName || !chapterNumber) {
          setError('Invalid book or chapter');
          setLoading(false);
          return;
        }

        const formatted = bookName
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        setFormattedBookName(formatted);

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
        setError('Failed to load chapter. Please try again.');
        setLoading(false);
      }
    };

    fetchBookData();
  }, [bookName, chapterNumber]);

  const navigateToBook = () => {
    if (bookName) {
      navigate(`/bible/${bookName}`);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading chapter...</div>;
  }

  if (error || !bookId) {
    return <div className="text-red-600 text-center py-12">{error || 'Chapter not found'}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={navigateToBook}
        className="flex items-center text-[#8B0000] hover:underline mb-6"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to {formattedBookName}
      </button>

      <div className="flex items-center justify-center mb-6">
        <Book className="w-6 h-6 text-[#8B0000] mr-2" />
        <h1 className="text-2xl font-serif font-bold text-[#8B0000]">
          {formattedBookName} {chapterNumber}
        </h1>
      </div>

      <BibleChapter 
        bookId={bookId} 
        chapterNumber={chapterNumber || '1'} 
        bookName={formattedBookName} 
      />
    </div>
  );
};

export default ChapterView;