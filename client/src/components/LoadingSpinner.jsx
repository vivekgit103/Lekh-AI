import React from 'react';

export default function LoadingSpinner({ text = 'RETRIEVING DATA...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-3 font-mono">
      <div className="w-5 h-5 border border-[#101B2D] border-t-transparent animate-spin" />
      <p className="text-xs uppercase tracking-widest text-[#70716D]">{text}</p>
    </div>
  );
}
