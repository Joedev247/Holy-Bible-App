import React, { useState } from 'react';
import { BibleAPI, BibleVerse, BIBLE_BOOKS } from '../services/bibleApi';
import SearchResults from '../components/search/SearchResults';
import { ChevronLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdvancedSearch = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [testament, setTestament] = useState<'all' | 'old' | 'new'>('all');
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTestamentChange = (value: 'all' | 'old' | 'new') => {
    setTestament(value);
    setSelectedBooks([]);
  };

  const toggleBookSelection = (bookId: string) => {
    if (selectedBooks.includes(bookId)) {
      setSelectedBooks(selectedBooks.filter(id => id !== bookId));
    } else {
      setSelectedBooks([...selectedBooks, bookId]);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!searchTerm.trim()) {
        setSearchResults([]);
        setLoading(false);
        return;
      }
      
      const results = await BibleAPI.searchBible(searchTerm);
      
      setSearchResults(results);
      setLoading(false);
    } catch (err) {
      console.error('Error during advanced search:', err);
      setError('Failed to perform search. Please try again.');
      setLoading(false);
    }
  };

  const getBooksList = () => {
    if (testament === 'old') {
      return BIBLE_BOOKS.OLD_TESTAMENT;
    } else if (testament === 'new') {
      return BIBLE_BOOKS.NEW_TESTAMENT;
    } else {
      return [...BIBLE_BOOKS.OLD_TESTAMENT, ...BIBLE_BOOKS.NEW_TESTAMENT];
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/search')}
        className="flex items-center text-[#8B0000] hover:underline mb-6"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to Basic Search
      </button>

      <h1 className="text-2xl font-serif font-bold text-[#8B0000] mb-6">
        Advanced Bible Search
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4">
          <label htmlFor="searchTerm" className="block text-gray-700 font-medium mb-2">
            Search Term
          </label>
          <input
            type="text"
            id="searchTerm"
            value={searchTerm}
            onChange={handleSearchTermChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
            placeholder="Enter keywords, phrases, or references"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Testament
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded-md ${
                testament === 'all'
                  ? 'bg-[#8B0000] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleTestamentChange('all')}
            >
              All
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                testament === 'old'
                  ? 'bg-[#8B0000] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleTestamentChange('old')}
            >
              Old Testament
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                testament === 'new'
                  ? 'bg-[#8B0000] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleTestamentChange('new')}
            >
              New Testament
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Select Books (Optional)
          </label>
          <div className="max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-md">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {getBooksList().map((book) => (
                <label 
                  key={book.id}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedBooks.includes(book.id)}
                    onChange={() => toggleBookSelection(book.id)}
                    className="rounded text-[#8B0000] focus:ring-[#8B0000]"
                  />
                  <span className="text-sm">{book.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="w-full py-3 bg-[#8B0000] text-white rounded-md hover:bg-opacity-90 transition-colors flex items-center justify-center"
          disabled={loading}
        >
          <Search className="w-5 h-5 mr-2" />
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Searching...</div>
      ) : error ? (
        <div className="text-red-600 text-center py-12">{error}</div>
      ) : searchResults.length > 0 ? (
        <div>
          <div className="mb-4">
            <p className="text-gray-600">
              Found {searchResults.length} results for "{searchTerm}"
            </p>
          </div>
          <SearchResults results={searchResults} query={''} isLoading={false} totalResults={0} currentPage={0} onPageChange={function (_newPage: number): void {
                throw new Error('Function not implemented.');
              } } />
        </div>
      ) : searchTerm ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No results found for "{searchTerm}"</p>
          <p className="text-gray-500 text-sm mt-2">Try different keywords or adjust your filters</p>
        </div>
      ) : null}
    </div>
  );
};

export default AdvancedSearch;