import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

interface SearchBarProps {
  defaultQuery?: string;
  standalone?: boolean;
}

const SearchBar = ({ defaultQuery = '', standalone = true }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState(defaultQuery);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={standalone ? "mb-6" : ""}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search words, verses, or topics..."
          className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button 
          type="submit" 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8B0000]"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
      {standalone && (
        <p className="text-sm text-gray-500 mt-2">
          Search the Bible for words, phrases, or references (e.g., "love", "in the beginning", "John 3:16")
        </p>
      )}
    </form>
  );
};

export default SearchBar;