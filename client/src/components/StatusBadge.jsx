import React from 'react';

export default function StatusBadge({ status }) {
  const norm = (status || 'completed').toLowerCase();

  if (norm === 'processing') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[#5B8CFF] border border-[#5B8CFF]/30 bg-[#5B8CFF]/10 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-[#5B8CFF] animate-ping" />
        PROCESSING
      </span>
    );
  }

  if (norm === 'failed') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[#FF5C6C] border border-[#FF5C6C]/30 bg-[#FF5C6C]/10 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C6C]" />
        FAILED
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[#25D9B5] border border-[#25D9B5]/30 bg-[#25D9B5]/10 rounded-full shadow-[0_0_10px_rgba(37,217,181,0.2)]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#25D9B5]" />
      ANALYZED
    </span>
  );
}

