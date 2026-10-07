import React from 'react';
import { formatCurrency } from '../utils/formatters';

export default function ExtractedDataCard({ keyFields = {}, amounts = [] }) {
  const fields = Object.entries(keyFields || {});

  return (
    <div className="space-y-6">
      <div className="border border-[#D5CEC1] bg-[#FAF8F2]">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-[#D5CEC1] flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-widest text-[#101B2D] font-bold">
            STRUCTURED ENTITY DATA
          </span>
          <span className="font-mono text-[10px] text-[#70716D] uppercase">
            {fields.length + amounts.length} PARAMETERS RECORDED
          </span>
        </div>

        {/* Ruled Data Rows */}
        <div className="divide-y divide-[#D5CEC1]">
          {/* Key Fields Rows */}
          {fields.map(([key, val], idx) => (
            <div
              key={`field-${idx}`}
              className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#E8E0D2]/40 transition-colors"
            >
              <span className="font-mono text-xs uppercase tracking-wider text-[#70716D]">
                {key.replace(/_/g, ' ')}
              </span>
              <span className="font-mono text-xs font-semibold text-[#101B2D] text-left sm:text-right max-w-full sm:max-w-[60%] break-all">
                {val === null || val === undefined ? '—' : String(val)}
              </span>
            </div>
          ))}

          {/* Extracted Amounts Rows */}
          {amounts.map((item, idx) => (
            <div
              key={`amount-${idx}`}
              className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#F1EBDD]/50 hover:bg-[#E8E0D2]/40 transition-colors"
            >
              <span className="font-mono text-xs uppercase tracking-wider text-[#3158A8] font-medium">
                AMOUNT / {item.label || 'FIGURE'}
              </span>
              <span className="font-mono text-sm font-bold text-[#101B2D] text-left sm:text-right">
                {formatCurrency(item.value, item.currency || 'INR')}
              </span>
            </div>
          ))}

          {fields.length === 0 && amounts.length === 0 && (
            <div className="p-8 text-center font-mono text-xs text-[#70716D] italic">
              No structured parameters extracted.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

