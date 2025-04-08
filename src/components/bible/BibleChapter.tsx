import { useState, useEffect } from 'react';
import { BibleAPI, BibleVerse } from '../../services/bibleApi';
import { useBibleNavigation } from '../../contexts/BibleNavigationContext';

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
  
  const { setSelection } = useBibleNavigation();
  
  useEffect(() => {
    setSelection(bookId, chapterNumber, '1');
  }, [bookId, chapterNumber, setSelection]);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        setLoading(true);
        const chapterId = `${bookId}.${chapterNumber}`;
        
        try {
          const chapterData = await BibleAPI.getChapter(chapterId);
          
          if (chapterData) {
            try {
              const chapterVerses = await BibleAPI.getChapterVerses(chapterId);
              
              const hasValidVerses = chapterVerses && chapterVerses.length > 0 && 
                                   chapterVerses.some(v => v && v.content);
                                   
              if (hasValidVerses) {
                setVerses(chapterVerses);
              } else {
                console.log('No valid verses found, attempting individual verse fetch');
                
                const verseCount = estimateVerseCount(bookId, parseInt(chapterNumber));
                const individualVerses = [];
                
                for (let i = 1; i <= verseCount; i++) {
                  try {
                    const verseId = `${bookId}.${chapterNumber}.${i}`;
                    const verse = await BibleAPI.getVerse(verseId);
                    
                    if (verse && verse.content) {
                      individualVerses.push(verse);
                    }
                  } catch (verseErr) {
                    console.error(`Error fetching individual verse ${i}:`, verseErr);
                  }
                }
                
                if (individualVerses.length > 0) {
                  setVerses(individualVerses);
                } else {
                  setError('Unable to load verse content. Please check your connection.');
                  const placeholders = Array.from({ length: verseCount }, (_, i) => ({
                    id: `placeholder-${i+1}`,
                    reference: `${bookName} ${chapterNumber}:${i+1}`,
                    content: '', 
                    bookId: bookId,
                    chapterId: `${bookId}.${chapterNumber}`
                  }));
                  setVerses(placeholders);
                }
              }
            } catch (verseErr) {
              console.error('Error fetching chapter verses:', verseErr);
              setError('Failed to load verses. Please check your connection.');
              
              const placeholders = Array.from({ length: 30 }, (_, i) => ({
                id: `placeholder-${i+1}`,
                reference: `${bookName} ${chapterNumber}:${i+1}`,
                content: '',  
                bookId: bookId,
                chapterId: `${bookId}.${chapterNumber}`
              }));
              setVerses(placeholders);
            }
          }
        } catch (chapterErr) {
          console.error('Error fetching chapter data:', chapterErr);
          setError('Failed to load chapter. Please check your connection.');
        }
        
        try {
          const chapCount = await BibleAPI.getChapterCount(bookId);
          setChapterCount(chapCount || 1);
        } catch (countErr) {
          console.error('Error fetching chapter count:', countErr);
          if (bookId === 'GEN') setChapterCount(50);
          else if (bookId === 'PSA') setChapterCount(150);
          else setChapterCount(30);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error in fetch operation:', err);
        setError('Failed to load chapter. Please try again.');
        setLoading(false);
      }
    };

    fetchChapter();
  }, [bookId, chapterNumber, bookName]);

  const estimateVerseCount = (bookId: string, chapter: number): number => {
    const verseCounts: Record<string, number[]> = {
      'GEN': [31, 25, 24, 26, 32, 22, 24, 22, 29, 32], 
      'EXO': [22, 25, 22, 31, 23, 30, 29, 28, 35, 29], 
      'LEV': [17, 16, 17, 35, 26, 23, 38, 36, 24, 20], 
      'PSA': [6, 12, 8, 8, 12, 10, 17, 9, 20, 18],     
    };
    
    if (verseCounts[bookId] && chapter <= verseCounts[bookId].length) {
      return verseCounts[bookId][chapter - 1];
    }
    
    if (bookId === 'PSA') return 20; 
    if (['PRO', 'ISA', 'JER'].includes(bookId)) return 25;  
    if (['JON', 'JUD', 'RUT'].includes(bookId)) return 15;  
    
    return 30; 
  };

  const handleVerseClick = (verseNumber: string) => {
    setSelection(bookId, chapterNumber, verseNumber);
  };

  const navigateToChapter = (newChapter: number) => {
    setSelection(bookId, newChapter.toString(), '1');
  };

  if (loading) {
    return <div className="text-center py-12">Loading chapter...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="bg-[#8B0000] p-4 rounded-t-lg">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <button
            onClick={() => navigateToChapter(parseInt(chapterNumber) - 1)}
            disabled={chapterNumber === '1'}
            className={`text-white bg-transparent border border-white rounded-md px-3 py-1 text-sm w-full sm:w-auto mb-2 sm:mb-0 ${
              chapterNumber === '1' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:bg-opacity-20'
            }`}
          >
            &lt; Previous Chapter
          </button>
          
          <div className="text-center">
            <div className="text-sm font-normal text-white uppercase tracking-wide">
              {bookName}
            </div>
            <div className="text-white text-2xl font-serif">
              CHAPTER {chapterNumber}
            </div>
          </div>
          
          <button
            onClick={() => navigateToChapter(parseInt(chapterNumber) + 1)}
            disabled={parseInt(chapterNumber) >= chapterCount}
            className={`text-white bg-transparent border border-white rounded-md px-3 py-1 text-sm w-full sm:w-auto mt-2 sm:mt-0 ${
              parseInt(chapterNumber) >= chapterCount ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:bg-opacity-20'
            }`}
          >
            Next Chapter &gt;
          </button>
        </div>
      </div>

      <div className="p-6 bg-[#FFF9E9]">
        <div className="space-y-0">
          {verses.map((verse, index) => {
            const verseNum = verse?.reference?.split(':')[1] || (index + 1).toString();
            
            let verseContent = "Verse content unavailable";
            
            if (verse && verse.content) {
              verseContent = BibleAPI.cleanVerseContent(verse.content);
            }
            
            return (
              <div 
                key={verse?.id || `verse-${index}`} 
                className="flex py-2 cursor-pointer hover:bg-[#FFF5E6] rounded transition-colors"
                onClick={() => handleVerseClick(verseNum)}
              >
                <span className="text-[#8B0000] font-bold mr-3 w-8 text-right flex-shrink-0">
                  {verseNum}
                </span>
                <span className="flex-grow text-gray-800">
                  {verseContent}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-2 bg-gray-100 rounded-b-lg flex flex-col sm:flex-row justify-between items-center">
        <button
          onClick={() => navigateToChapter(parseInt(chapterNumber) - 1)}
          disabled={chapterNumber === '1'}
          className={`text-[#8B0000] bg-transparent border border-[#8B0000] rounded-md px-3 py-1 text-sm w-full sm:w-auto mb-2 sm:mb-0 ${
            chapterNumber === '1' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#8B0000] hover:text-white'
          }`}
        >
          &lt; Previous Chapter
        </button>
        
        <button
          onClick={() => navigateToChapter(parseInt(chapterNumber) + 1)}
          disabled={parseInt(chapterNumber) >= chapterCount}
          className={`text-[#8B0000] bg-transparent border border-[#8B0000] rounded-md px-3 py-1 text-sm w-full sm:w-auto ${
            parseInt(chapterNumber) >= chapterCount ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#8B0000] hover:text-white'
          }`}
        >
          Next Chapter &gt;
        </button>
      </div>
    </div>
  );
};

export default BibleChapter;