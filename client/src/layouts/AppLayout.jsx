import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F1EBDD] text-[#101B2D] selection:bg-[#3158A8] selection:text-[#F1EBDD] font-mono">
      <Navbar />
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}
