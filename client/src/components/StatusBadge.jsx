import React from 'react';

export default function StatusBadge({ status }) {
  const norm = (status || 'completed').toLowerCase();

  if (norm === 'processing') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-[#3158A8] border border-[#3158A8]/40 bg-[#3158A8]/5">
        <span className="w-1.5 h-1.5 bg-[#3158A8] animate-pulse" />
        PROCESSING
      </span>
    );
  }

  if (norm === 'failed') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-[#8B2626] border border-[#8B2626]/40 bg-[#8B2626]/5">
        <span className="w-1.5 h-1.5 bg-[#8B2626]" />
        FAILED
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-[#2D6A4F] border border-[#2D6A4F]/40 bg-[#2D6A4F]/5">
      <span className="w-1.5 h-1.5 bg-[#2D6A4F]" />
      ANALYZED
    </span>
  );
}

