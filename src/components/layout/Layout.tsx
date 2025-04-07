import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-[#FFF8E8]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8 pb-20">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;