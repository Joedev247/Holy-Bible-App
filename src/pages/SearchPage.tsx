import React, { useState } from 'react';
import { BibleAPI, BibleVerse } from '../services/bibleApi';
import SearchBar from '../components/search/SearchBar';
import SearchResults from '../components/search/SearchResults';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearch = async (query: string) => {
    try {
      setSearchTerm(query);
      setLoading(true);
      setError(null);
      
      if (!query.trim()) {
        setSearchResults([]);
        setLoading(false);
        return;
      }
      
      const results = await BibleAPI.searchBible(query);
      setSearchResults(results);
      setLoading(false);
    } catch (err) {
      console.error('Error during search:', err);
      setError('Failed to perform search. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-serif font-bold text-[#8B0000] mb-6">
        Search the Bible
      </h1>

      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          {searchTerm && !loading && (
            <p className="text-gray-600">
              Found {searchResults.length} results for "{searchTerm}"
            </p>
          )}
        </div>
        <Link 
          to="/advanced-search" 
          className="flex items-center text-sm text-[#8B0000] hover:underline"
        >
          <Filter className="w-4 h-4 mr-1" />
          Advanced Search
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">Searching...</div>
      ) : error ? (
        <div className="text-red-600 text-center py-12">{error}</div>
      ) : searchResults.length > 0 ? (
        <SearchResults results={searchResults} query={''} isLoading={false} totalResults={0} currentPage={0} onPageChange={function (newPage: number): void {
                          throw new Error('Function not implemented.');
                      } } />
      ) : searchTerm ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No results found for "{searchTerm}"</p>
          <p className="text-gray-500 text-sm mt-2">Try different keywords or check your spelling</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 text-[#8B0000]">Search Tips</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• Use specific keywords for better results (e.g., "love", "faith")</li>
            <li>• Include book names for targeted searches (e.g., "John love")</li>
            <li>• Use exact verse references (e.g., "John 3:16")</li>
            <li>• Try the Advanced Search for filtering by book or testament</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchPage;