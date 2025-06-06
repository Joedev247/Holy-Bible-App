import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BibleAPI, BIBLE_BOOKS, VERSE_COUNTS } from '../../services/bibleApi';
import { useBibleNavigation } from '../../contexts/BibleNavigationContext';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [chapterCount, setChapterCount] = useState(50);
  const [verseCount, setVerseCount] = useState(31); 
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const { 
    selectedBook, 
    selectedChapter, 
    selectedVerse, 
    setSelection 
  } = useBibleNavigation();

  useEffect(() => {
    const fetchChapterCount = async () => {
      setIsLoading(true);
      try {
        const count = await BibleAPI.getChapterCount(selectedBook);
        setChapterCount(count || 1);
        
      } catch (error) {
        console.error('Error fetching chapter count:', error);
        const fallbackCounts: Record<string, number> = {
          'GEN': 50, 'PSA': 150, 'MAT': 28, 'JHN': 21, 'ROM': 16
        };
        setChapterCount(fallbackCounts[selectedBook] || 1);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChapterCount();
  }, [selectedBook]);

  useEffect(() => {
    const fetchVerseCount = async () => {
      setIsLoading(true);
      try {
        if (selectedBook && selectedChapter) {
          const chapterId = `${selectedBook}.${selectedChapter}`;
          
          if (VERSE_COUNTS[chapterId]) {
            setVerseCount(VERSE_COUNTS[chapterId]);
          } else {
            try {
              const count = await BibleAPI.getVerseCount(chapterId);
              setVerseCount(count || 1);
            } catch (apiError) {
              console.error('API error fetching verse count:', apiError);
              if (selectedBook === 'PSA') setVerseCount(20);
              else if (['PRO', 'ISA', 'JER'].includes(selectedBook)) setVerseCount(25);
              else setVerseCount(30); 
            }
          }
          
        }
      } catch (error) {
        console.error('Error in verse count logic:', error);
        setVerseCount(30); 
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVerseCount();
  }, [selectedBook, selectedChapter]);

  const handleSearch = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleGoToVerse = () => {
    setSelection(selectedBook, selectedChapter, selectedVerse);
  };

  const handleBookChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBook = e.target.value;
    setSelection(newBook, '1', '1'); 
  };

  const handleChapterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newChapter = e.target.value;
    setSelection(selectedBook, newChapter, '1'); 
  };

  const handleVerseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVerse = e.target.value;
    setSelection(selectedBook, selectedChapter, newVerse);
  };

  return (
    <header className="bg-gradient-to-r from-[#8B0000] to-[#A52A2A] text-white">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/images (1).jpg" 
              alt="King James Bible"
              className="w-12 h-12"
            />
            <div>
              <h1 className="text-2xl font-serif">KING JAMES BIBLE</h1>
              <p className="text-xs text-gray-200">THE PRESERVED AND LIVING WORD OF GOD</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mt-6 flex space-x-2">
          <div className="flex-1 flex space-x-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search words or verses..."
                className="w-full px-4 py-2 rounded bg-[#FFF5E6] text-gray-800 placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search the Bible"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#8B0000]"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
            <button 
              type="button" 
              className="px-3 py-2 bg-[#6B0000] rounded hover:bg-[#8B0000] transition-colors"
              onClick={() => navigate('/advanced-search')}
            >
              Advanced
            </button>
          </div>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          <select
            value={selectedBook}
            onChange={handleBookChange}
            className="px-4 py-2 rounded bg-[#FFF5E6] text-gray-800"
            aria-label="Select book"
            disabled={isLoading}
          >
            <optgroup label="Old Testament">
              {BIBLE_BOOKS.OLD_TESTAMENT.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="New Testament">
              {BIBLE_BOOKS.NEW_TESTAMENT.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.name}
                </option>
              ))}
            </optgroup>
          </select>
          
          <select
            value={selectedChapter}
            onChange={handleChapterChange}
            className="px-4 py-2 rounded bg-[#FFF5E6] text-gray-800 w-20"
            aria-label="Select chapter"
            disabled={isLoading}
          >
            {Array.from({ length: chapterCount }, (_, i) => (i + 1).toString()).map((chapter) => (
              <option key={chapter} value={chapter}>
                {chapter}
              </option>
            ))}
          </select>
          
          <select
            value={selectedVerse}
            onChange={handleVerseChange}
            className="px-4 py-2 rounded bg-[#FFF5E6] text-gray-800 w-20"
            aria-label="Select verse"
            disabled={isLoading}
          >
            {Array.from({ length: verseCount }, (_, i) => (i + 1).toString()).map((verse) => (
              <option key={verse} value={verse}>
                {verse}
              </option>
            ))}
          </select>
          
          <button 
            onClick={handleGoToVerse}
            className="px-4 py-2 bg-[#6B0000] rounded hover:bg-[#8B0000] transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Go"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;