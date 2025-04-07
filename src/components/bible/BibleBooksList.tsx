import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BibleAPI, BIBLE_BOOKS } from '../../services/bibleApi';
import { Book } from 'lucide-react';

const BibleBooksList = () => {
  const [activeTestament, setActiveTestament] = useState<'old' | 'new'>('old');
  const navigate = useNavigate();

  const navigateToBook = (bookId: string) => {
    const bookName = BibleAPI.getBookNameFromId(bookId);
    if (bookName) {
      navigate(`/bible/${bookName.toLowerCase().replace(/\s+/g, '-')}/1`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between mb-4 border-b pb-2">
        <button
          className={`px-4 py-2 font-semibold ${
            activeTestament === 'old'
              ? 'text-[#8B0000] border-b-2 border-[#8B0000]'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTestament('old')}
        >
          Old Testament
        </button>
        <button
          className={`px-4 py-2 font-semibold ${
            activeTestament === 'new'
              ? 'text-[#8B0000] border-b-2 border-[#8B0000]'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTestament('new')}
        >
          New Testament
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {(activeTestament === 'old'
          ? BIBLE_BOOKS.OLD_TESTAMENT
          : BIBLE_BOOKS.NEW_TESTAMENT
        ).map((book) => (
          <button
            key={book.id}
            className="flex items-center p-2 hover:bg-[#FFF5E6] rounded transition-colors"
            onClick={() => navigateToBook(book.id)}
          >
            <Book className="w-4 h-4 text-[#8B0000] mr-2" />
            <span className="text-sm">{book.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BibleBooksList;