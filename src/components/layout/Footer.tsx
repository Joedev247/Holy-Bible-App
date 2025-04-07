import { Link } from 'react-router-dom';
import { Home as HomeIcon, Book, Search, Settings } from 'lucide-react';

const Footer = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#8B0000] to-[#A52A2A] text-white shadow-lg">
      <div className="flex justify-between items-center px-4 py-3">
        <Link to="/" className="flex flex-col items-center">
          <HomeIcon className="w-6 h-6" />
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/bible" className="flex flex-col items-center">
          <Book className="w-6 h-6" />
          <span className="text-xs">Bible</span>
        </Link>
        <Link to="/search" className="flex flex-col items-center">
          <Search className="w-6 h-6" />
          <span className="text-xs">Search</span>
        </Link>
        <Link to="/settings" className="flex flex-col items-center">
          <Settings className="w-6 h-6" />
          <span className="text-xs">Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default Footer;