import React from 'react';
import { formatDate } from '../utils/formatters';

export default function DeadlineCard({ deadline }) {
  if (!deadline) return null;

  const title = deadline.title || 'Compliance Obligation';
  const dateStr = deadline.date || '';
  const priority = (deadline.priority || 'LOW').toUpperCase();
  const status = (deadline.status || 'UPCOMING').toUpperCase();

  const parsed = new Date(dateStr);
  const isValidDate = !isNaN(parsed.getTime());
  const day = isValidDate ? parsed.getDate() : '--';
  const month = isValidDate ? parsed.toLocaleString('en-US', { month: 'short' }).toUpperCase() : 'DATE';
  const year = isValidDate ? parsed.getFullYear() : '';

  const isOverdue = status === 'OVERDUE' || (isValidDate && parsed < new Date());

  return (
    <div className={`p-4 border border-[#D5CEC1] transition-colors ${isOverdue ? 'bg-[#8B2626]/5 border-[#8B2626]/40' : 'bg-[#FAF8F2] hover:bg-[#E8E0D2]'}`}>
      <div className="flex items-start gap-4">
        {/* Large Editorial Date Display */}
        <div className="text-center shrink-0 border-r border-[#D5CEC1] pr-4 min-w-[65px]">
          <div className="font-serif text-3xl font-bold leading-none text-[#101B2D]">
            {day}
          </div>
          <div className="font-mono text-[11px] font-semibold tracking-widest text-[#3158A8] uppercase mt-1">
            {month}
          </div>
          {year && (
            <div className="font-mono text-[10px] text-[#70716D]">
              {year}
            </div>
          )}
        </div>

        {/* Obligation Content */}
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-wider">
            <span className={`px-2 py-0.5 border ${
              priority === 'HIGH'
                ? 'text-[#8B2626] border-[#8B2626]/40'
                : priority === 'MEDIUM'
                ? 'text-[#9A6B2F] border-[#9A6B2F]/40'
                : 'text-[#70716D] border-[#D5CEC1]'
            }`}>
              {priority} PRIORITY
            </span>

            {isOverdue ? (
              <span className="text-[#8B2626] font-bold">
                [ OVERDUE ]
              </span>
            ) : status === 'COMPLETED' ? (
              <span className="text-[#2D6A4F] font-bold">
                [ COMPLETED ]
              </span>
            ) : (
              <span className="text-[#3158A8] font-bold">
                [ UPCOMING ]
              </span>
            )}
          </div>

          <p className="font-serif text-sm font-bold text-[#101B2D] leading-snug">
            {title}
          </p>

          <p className="font-mono text-[11px] text-[#70716D]">
            Target: {formatDate(dateStr)}
          </p>
        </div>
      </div>
    </div>
  );
}

