import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, AlertCircle, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
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

  // Calculate days remaining
  let diffDays = null;
  let countdownText = '';
  if (isValidDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(parsed);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      countdownText = `${Math.abs(diffDays)}d overdue`;
    } else if (diffDays === 0) {
      countdownText = 'Due today';
    } else {
      countdownText = `${diffDays}d remaining`;
    }
  }

  const isOverdue = status === 'OVERDUE' || (diffDays !== null && diffDays < 0);

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative overflow-hidden rounded-2xl border p-5 transition-all group ${
        isOverdue
          ? 'bg-[#FF5C6C]/05 border-[#FF5C6C]/30 shadow-lg shadow-[#FF5C6C]/05'
          : priority === 'HIGH'
          ? 'bg-[#111722] border-[#FF5C6C]/25 hover:border-[#FF5C6C]/50 hover:shadow-glow-red/20'
          : 'bg-[#111722] border-white/10 hover:border-[#5B8CFF]/40 hover:shadow-glow-blue/20'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Large Futuristic Date Display */}
        <div className="flex flex-col items-center justify-center min-w-[70px] px-2 py-3 rounded-xl bg-[#070A0F]/80 border border-white/05 text-center shrink-0">
          <span className="font-display text-3xl font-extrabold leading-none text-[#F5F7FA] tracking-tight">
            {day}
          </span>
          <span className="font-mono text-[11px] font-bold tracking-widest text-[#5B8CFF] uppercase mt-1">
            {month}
          </span>
          {year && (
            <span className="font-mono text-[10px] text-[#9BA6B5]/60 mt-0.5">
              {year}
            </span>
          )}
        </div>

        {/* Obligation Content */}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* Priority Pill */}
            <span
              className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                priority === 'HIGH'
                  ? 'text-[#FF5C6C] bg-[#FF5C6C]/10 border-[#FF5C6C]/30'
                  : priority === 'MEDIUM'
                  ? 'text-[#FFB84D] bg-[#FFB84D]/10 border-[#FFB84D]/30'
                  : 'text-[#25D9B5] bg-[#25D9B5]/10 border-[#25D9B5]/30'
              }`}
            >
              {priority} PRIORITY
            </span>

            {/* Countdown Badge */}
            {countdownText && (
              <span
                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  isOverdue
                    ? 'text-[#FF5C6C] bg-[#FF5C6C]/15 font-semibold'
                    : 'text-[#5B8CFF] bg-[#5B8CFF]/10'
                }`}
              >
                <Clock className="w-3 h-3" />
                {countdownText}
              </span>
            )}
          </div>

          <h3 className="font-sans font-semibold text-sm sm:text-base text-[#F5F7FA] group-hover:text-white transition-colors line-clamp-2">
            {title}
          </h3>

          <div className="flex items-center justify-between text-[11px] font-mono text-[#9BA6B5] pt-1">
            <span>Cutoff: {formatDate(dateStr)}</span>
            <ChevronRight className="w-4 h-4 text-[#9BA6B5]/40 group-hover:text-[#5B8CFF] group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
