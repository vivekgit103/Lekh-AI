import React from 'react';

export default function LoadingSpinner({ text = 'ANALYZING DOCUMENT INTELLIGENCE...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 space-y-4 font-mono">
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Outer glowing pulsing ring */}
        <div className="absolute inset-0 rounded-full border border-[#5B8CFF]/20 animate-ping" />
        {/* Main spinning gradient ring */}
        <div className="w-10 h-10 rounded-full border-2 border-transparent border-t-[#5B8CFF] border-r-[#7C5CFF] animate-spin" />
        {/* Inner pulsing orb */}
        <div className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-[#5B8CFF] to-[#7C5CFF] shadow-[0_0_12px_#5B8CFF]" />
      </div>
      <p className="text-xs uppercase tracking-widest text-[#9BA6B5] animate-pulse">{text}</p>
    </div>
  );
}
