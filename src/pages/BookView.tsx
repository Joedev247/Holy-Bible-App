import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BibleAPI } from '../services/bibleApi';
import { Book, ChevronLeft } from 'lucide-react';

const BookView = () => {
  const { bookName } = useParams<{ bookName: string }>();
  const [bookId, setBookId] = useState<string>('');
  const [bookData, setBookData] = useState<any>(null);
  const [chapterCount, setChapterCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true);
        if (!bookName) {
          setError('Invalid book name');
          setLoading(false);
          return;
        }

        // Convert URL-friendly book name to proper format
        const formattedBookName = bookName
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        // Get book ID from name
        const id = BibleAPI.getBookIdFromName(formattedBookName);
        
        if (!id) {
          setError('Book not found');
          setLoading(false);
          return;
        }

        setBookId(id);
        
        // Get book data
        const data = await BibleAPI.getBookInfo(id);
        setBookData(data);
        
        // Get chapter count
        const count = await BibleAPI.getChapterCount(id);
        setChapterCount(count);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching book data:', err);
        setError('Failed to load book data. Please try again.');
        setLoading(false);
      }
    };

    fetchBookData();
  }, [bookName]);

  const navigateToChapter = (chapterNumber: number) => {
    if (bookName) {
      navigate(`/bible/${bookName}/${chapterNumber}`);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading book details...</div>;
  }

  if (error || !bookData) {
    return <div className="text-red-600 text-center py-12">{error || 'Book not found'}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/bible')}
        className="flex items-center text-[#8B0000] hover:underline mb-6"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to Bible
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-center mb-4">
          <Book className="w-8 h-8 text-[#8B0000] mr-2" />
          <h1 className="text-2xl font-serif font-bold text-[#8B0000]">
            {bookData.name}
          </h1>
        </div>

        {bookData.description && (
          <p className="text-gray-700 mb-6 text-center">
            {bookData.description}
          </p>
        )}

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Chapters</h2>
          <div className="grid grid-cols-5 md:grid-cols-8 gap-2">
            {Array.from({ length: chapterCount }, (_, i) => i + 1).map((chapter) => (
              <button
                key={chapter}
                onClick={() => navigateToChapter(chapter)}
                className="p-2 bg-[#FFF5E6] hover:bg-[#FFE8CC] rounded text-center transition-colors"
              >
                {chapter}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-[#8B0000]">About {bookData.name}</h2>
        <div className="space-y-4 text-gray-700">
          {bookData.author && (
            <p><span className="font-semibold">Author:</span> {bookData.author}</p>
          )}
          {bookData.category && (
            <p><span className="font-semibold">Category:</span> {bookData.category}</p>
          )}
          {bookData.testament && (
            <p><span className="font-semibold">Testament:</span> {bookData.testament}</p>
          )}
          {bookData.chapters && (
            <p><span className="font-semibold">Chapters:</span> {bookData.chapters}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookView;