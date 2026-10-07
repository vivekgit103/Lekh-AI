import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#070A0F] text-[#F5F7FA] font-sans relative selection:bg-[#5B8CFF]/30 selection:text-[#FFFFFF] overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-right electric blue glow */}
        <div className="absolute -top-[20%] -right-[10%] w-[650px] h-[650px] rounded-full bg-[#5B8CFF]/10 blur-[130px]" />
        {/* Top-left violet glow */}
        <div className="absolute top-[15%] -left-[15%] w-[600px] h-[600px] rounded-full bg-[#7C5CFF]/08 blur-[140px]" />
        {/* Center-bottom subtle teal accent */}
        <div className="absolute bottom-[5%] right-[20%] w-[500px] h-[500px] rounded-full bg-[#25D9B5]/05 blur-[120px]" />
        {/* Subtle dot matrix grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)', 
            backgroundSize: '32px 32px' 
          }} 
        />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
