import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BibleAPI } from '../../services/bibleApi';
import { ChevronRight } from 'lucide-react';

interface SearchResultsProps {
  results: any[];
  query: string;
  isLoading: boolean;
  totalResults: number;
  currentPage: number;
  onPageChange: (newPage: number) => void;
}

const SearchResults = ({
  results,
  query,
  isLoading,
  totalResults,
  currentPage,
  onPageChange
}: SearchResultsProps) => {
  const navigate = useNavigate();
  const resultsPerPage = 20;
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  const navigateToVerse = (result: any) => {
    const bookId = result.bookId;
    const chapter = result.chapterId.split('.')[1];
    const verse = result.id.split('.')[2];
    
    const bookName = BibleAPI.getBookNameFromId(bookId);
    if (bookName) {
      navigate(`/bible/${bookName.toLowerCase().replace(/\s+/g, '-')}/${chapter}/${verse}`);
    }
  };

  const highlightMatches = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    // Simple highlighting logic (can be improved with regex)
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const parts = [];
    let lastIndex = 0;
    
    let index = lowerText.indexOf(lowerQuery, lastIndex);
    while (index !== -1) {
      // Add text before match
      parts.push(text.substring(lastIndex, index));
      
      // Add highlighted match
      parts.push(
        <span key={index} className="bg-yellow-200">
          {text.substring(index, index + query.length)}
        </span>
      );
      
      lastIndex = index + query.length;
      index = lowerText.indexOf(lowerQuery, lastIndex);
    }
    
    // Add remaining text
    parts.push(text.substring(lastIndex));
    
    return <>{parts}</>;
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#8B0000] border-t-transparent"></div>
        <p className="mt-4">Searching the Bible...</p>
      </div>
    );
  }

  if (results.length === 0 && query) {
    return (
      <div className="text-center py-8">
        <p className="text-lg">No results found for "{query}"</p>
        <p className="text-gray-500 mt-2">Try using different keywords or check your spelling.</p>
      </div>
    );
  }

  return (
    <div>
      {query && (
        <p className="mb-4">
          Found {totalResults} results for "{query}"
        </p>
      )}

      <div className="space-y-4">
        {results.map((result) => (
          <div
            key={result.id}
            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigateToVerse(result)}
          >
            <div className="flex justify-between items-start">
              <p className="font-semibold text-[#8B0000]">{result.reference}</p>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            <p className="mt-2">
              {highlightMatches(BibleAPI.cleanVerseContent(result.text), query)}
            </p>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-[#8B0000] text-white hover:bg-[#6B0000]'
            }`}
          >
            Previous
          </button>
          
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-[#8B0000] text-white hover:bg-[#6B0000]'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;