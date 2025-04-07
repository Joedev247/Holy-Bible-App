import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import BibleReader from './pages/BibleReader';
import BookView from './pages/BookView';
import ChapterView from './pages/ChapterView';
import VerseView from './pages/VerseView';
import SearchPage from './pages/SearchPage';
import AdvancedSearch from './pages/AdvancedSearch';
import './index.css';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bible" element={<BibleReader />} />
          <Route path="/bible/:bookName" element={<BookView />} />
          <Route path="/bible/:bookName/:chapterNumber" element={<ChapterView />} />
          <Route path="/bible/:bookName/:chapterNumber/:verseNumber" element={<VerseView />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/advanced-search" element={<AdvancedSearch />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
};

// Simple 404 page
const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h1 className="text-3xl font-serif font-bold text-[#8B0000] mb-4">404</h1>
      <p className="text-xl mb-6">Page Not Found</p>
      <a href="/" className="px-4 py-2 bg-[#8B0000] text-white rounded-md hover:bg-opacity-90 transition-colors">
        Return Home
      </a>
    </div>
  );
};

export default App;