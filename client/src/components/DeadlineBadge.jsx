import React from 'react';
import { formatDate } from '../utils/formatters';

export default function DeadlineBadge({ date, priority = 'LOW' }) {
  const normPriority = (priority || 'LOW').toUpperCase();
  const parsedDate = new Date(date);
  const isPast = !isNaN(parsedDate.getTime()) && parsedDate < new Date();

  if (isPast) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#FF5C6C] border border-[#FF5C6C]/30 bg-[#FF5C6C]/10 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C6C] animate-pulse" />
        <span>OVERDUE ({formatDate(date)})</span>
      </span>
    );
  }

  const priorityStyles = {
    HIGH: 'text-[#FF5C6C] border-[#FF5C6C]/30 bg-[#FF5C6C]/10',
    MEDIUM: 'text-[#FFB84D] border-[#FFB84D]/30 bg-[#FFB84D]/10',
    LOW: 'text-[#9BA6B5] border-white/10 bg-white/05',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider border rounded-full ${
        priorityStyles[normPriority] || priorityStyles.LOW
      }`}
    >
      <span>{formatDate(date)}</span>
      <span className="opacity-70 font-bold">[{normPriority}]</span>
    </span>
  );
}

