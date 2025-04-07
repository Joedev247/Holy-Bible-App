import BibleBooksList from '../components/bible/BibleBooksList';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const BibleReader = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-[#8B0000] mb-2">
          Bible Reader
        </h1>
        <p className="text-gray-600 mb-4">
          Select a book to begin reading or use the search to find specific passages.
        </p>
        
        <Link 
          to="/search" 
          className="inline-flex items-center px-4 py-2 bg-[#FFF5E6] hover:bg-[#FFE8CC] rounded-md transition-colors"
        >
          <Search className="w-4 h-4 mr-1 text-[#8B0000]" />
          <span>Search the Bible</span>
        </Link>
      </div>

      <div className="mb-6">
        <BibleBooksList />
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4 text-[#8B0000]">Reading Tips</h2>
        <ul className="space-y-2 text-gray-700">
          <li>• Click on any book to view its chapters</li>
          <li>• Tap on a verse number to see the full verse details</li>
          <li>• Use the navigation arrows to move between chapters</li>
          <li>• Bookmark important verses for quick access later</li>
        </ul>
      </div>
    </div>
  );
};

export default BibleReader;