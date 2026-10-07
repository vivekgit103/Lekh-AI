import React from 'react';

export default function MetricCard({ title, value, subtitle }) {
  // Format single digits with leading zero for editorial alignment (e.g., 03)
  const formattedValue = typeof value === 'number' && value < 10 && value >= 0 ? `0${value}` : value;

  return (
    <div className="p-6 bg-[#FAF8F2] border border-[#D5CEC1] flex flex-col justify-between">
      <div className="space-y-2">
        <div className="font-serif text-5xl sm:text-6xl font-bold tracking-tight text-[#101B2D]">
          {formattedValue}
        </div>
        <div className="font-mono text-xs uppercase tracking-widest text-[#70716D] font-semibold">
          {title}
        </div>
      </div>
      {subtitle && (
        <div className="font-mono text-[10px] text-[#70716D] pt-4 mt-4 border-t border-[#D5CEC1]/60">
          {subtitle}
        </div>
      )}
    </div>
  );
}

