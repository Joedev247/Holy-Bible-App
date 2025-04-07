import VerseOfTheDay from '../components/bible/VerseOfTheDay';
import QuickAccessVerses from '../components/bible/QuickAccessVerses';
import BibleBooksList from '../components/bible/BibleBooksList';
import { Link } from 'react-router-dom';
import { Book, Search } from 'lucide-react';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#8B0000] mb-4">
          Bible Study App
        </h1>
        <p className="text-gray-600 max-w-lg mx-auto">
          Read, study, and explore the Holy Bible with our easy-to-use interface.
          Search, bookmark verses, and discover God's word daily.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="md:col-span-2">
          <VerseOfTheDay />
        </div>
        
        <Link to="/bible" className="block p-6 bg-[#8B0000] text-white rounded-lg shadow-md hover:bg-opacity-90 transition-colors">
          <div className="flex items-center mb-2">
            <Book className="w-6 h-6 mr-2" />
            <h2 className="text-xl font-semibold">Bible Reader</h2>
          </div>
          <p>Access all 66 books of the Bible organized by Old and New Testament.</p>
        </Link>
        
        <Link to="/search" className="block p-6 bg-[#8B0000] text-white rounded-lg shadow-md hover:bg-opacity-90 transition-colors">
          <div className="flex items-center mb-2">
            <Search className="w-6 h-6 mr-2" />
            <h2 className="text-xl font-semibold">Search the Bible</h2>
          </div>
          <p>Search for specific verses, topics, or keywords throughout scripture.</p>
        </Link>
      </div>

      <div className="mb-8">
        <QuickAccessVerses />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-[#8B0000]">Bible Books</h2>
        <BibleBooksList />
      </div>
    </div>
  );
};

export default Home;