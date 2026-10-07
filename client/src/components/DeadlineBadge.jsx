import React from 'react';
import { formatDate } from '../utils/formatters';

export default function DeadlineBadge({ date, priority = 'LOW' }) {
  const normPriority = (priority || 'LOW').toUpperCase();
  const parsedDate = new Date(date);
  const isPast = !isNaN(parsedDate.getTime()) && parsedDate < new Date();

  if (isPast) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#8B2626] border border-[#8B2626]/40 bg-[#8B2626]/5">
        <span>OVERDUE ({formatDate(date)})</span>
      </span>
    );
  }

  const priorityStyles = {
    HIGH: 'text-[#8B2626] border-[#8B2626]/40',
    MEDIUM: 'text-[#9A6B2F] border-[#9A6B2F]/40',
    LOW: 'text-[#70716D] border-[#D5CEC1]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider border ${
        priorityStyles[normPriority] || priorityStyles.LOW
      }`}
    >
      <span>{formatDate(date)}</span>
      <span className="opacity-80">[{normPriority}]</span>
    </span>
  );
}

