import React from 'react';

export default function RiskBadge({ level, size = 'md' }) {
  const norm = (level || 'LOW').toUpperCase();

  const styles = {
    HIGH: 'text-[#8B2626] border-[#8B2626]/40 bg-[#8B2626]/5',
    MEDIUM: 'text-[#9A6B2F] border-[#9A6B2F]/40 bg-[#9A6B2F]/5',
    LOW: 'text-[#2D6A4F] border-[#2D6A4F]/40 bg-[#2D6A4F]/5',
  };

  const style = styles[norm] || styles.LOW;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-widest border rounded-none ${style} ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-none bg-current opacity-80" />
      <span>{norm} RISK</span>
    </span>
  );
}

