import React from 'react';

export default function RiskBadge({ level, size = 'md', showLabel = true }) {
  const norm = (level || 'LOW').toUpperCase();

  const config = {
    HIGH: {
      text: 'text-[#FF5C6C]',
      bg: 'bg-[#FF5C6C]/10',
      border: 'border-[#FF5C6C]/30',
      dot: 'bg-[#FF5C6C]',
      glow: 'shadow-[0_0_12px_rgba(255,92,108,0.25)]',
    },
    MEDIUM: {
      text: 'text-[#FFB84D]',
      bg: 'bg-[#FFB84D]/10',
      border: 'border-[#FFB84D]/30',
      dot: 'bg-[#FFB84D]',
      glow: 'shadow-[0_0_12px_rgba(255,184,77,0.25)]',
    },
    LOW: {
      text: 'text-[#25D9B5]',
      bg: 'bg-[#25D9B5]/10',
      border: 'border-[#25D9B5]/30',
      dot: 'bg-[#25D9B5]',
      glow: 'shadow-[0_0_12px_rgba(37,217,181,0.25)]',
    },
  };

  const item = config[norm] || config.LOW;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider border rounded-full ${item.text} ${item.bg} ${item.border} ${item.glow} ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : size === 'lg' ? 'px-3.5 py-1.5 text-xs font-semibold' : 'px-2.5 py-1 text-[11px] font-medium'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${item.dot} ${norm === 'HIGH' ? 'animate-pulse' : ''}`} />
      <span>{norm}{showLabel ? ' RISK' : ''}</span>
    </span>
  );
}

