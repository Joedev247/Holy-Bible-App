// import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import { Search } from 'lucide-react';
import BibleReader from './pages/BibleReader';
import AdvancedSearch from './pages/AdvancedSearch';
import ChapterView from './pages/ChapterView';
import SearchPage from './pages/SearchPage';
import VerseView from './pages/VerseView';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bible" element={<BibleReader />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/advanced-search" element={<AdvancedSearch />} />
            <Route path="/bible/:bookId" element={<ChapterView />} />
            <Route path="/bible/:bookId/:chapter" element={<ChapterView />} />
            <Route path="/bible/:bookId/:chapter/:verse" element={<VerseView />} />
            <Route path="/search/:query" element={<SearchPage />} />
            <Route path="/search/:query/:page" element={<SearchPage />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;