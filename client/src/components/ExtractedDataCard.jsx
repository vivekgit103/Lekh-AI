import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import { Hash, DollarSign, Copy, Check } from 'lucide-react';

export default function ExtractedDataCard({ keyFields = {}, amounts = [] }) {
  const fields = Object.entries(keyFields || {});
  const [copiedKey, setCopiedKey] = useState(null);

  const copyToClipboard = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(String(text));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <div className="space-y-6">
      {/* Highlight Amounts Cards */}
      {amounts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {amounts.map((item, idx) => (
            <div
              key={`amount-${idx}`}
              className="p-5 rounded-2xl bg-[#111722]/90 border border-white/08 hover:border-[#5B8CFF]/40 transition-all duration-300 hover:-translate-y-0.5 shadow-lg relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#5B8CFF]/10 rounded-full blur-xl pointer-events-none group-hover:bg-[#5B8CFF]/20 transition-colors" />
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#9BA6B5] flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-[#5B8CFF]" />
                  <span>{item.label || 'Amount'}</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/05 text-[#9BA6B5]">
                  {item.currency || 'INR'}
                </span>
              </div>
              <div className="font-display text-2xl sm:text-3xl font-bold text-[#F5F7FA]">
                {formatCurrency(item.value, item.currency || 'INR')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Structured Key Fields Grid */}
      <div className="rounded-2xl border border-white/08 bg-[#111722]/80 backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-white/05 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-[#7C5CFF]" />
            <span className="font-display text-sm font-semibold text-[#F5F7FA]">
              Extracted Parameters & Identifiers
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#9BA6B5]">
            {fields.length} RECORDED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 divide-white/05 sm:divide-x sm:divide-x-white/05">
          <div className="divide-y divide-white/05">
            {fields.slice(0, Math.ceil(fields.length / 2)).map(([key, val], idx) => (
              <div
                key={`field-left-${idx}`}
                className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors group"
              >
                <span className="text-xs font-mono uppercase tracking-wide text-[#9BA6B5]">
                  {key.replace(/_/g, ' ')}
                </span>
                <div className="flex items-center gap-2 text-right">
                  <span className="text-xs font-semibold text-[#F5F7FA] font-mono break-all">
                    {val === null || val === undefined ? '—' : String(val)}
                  </span>
                  {val && (
                    <button
                      onClick={() => copyToClipboard(val, key)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#9BA6B5] hover:text-[#5B8CFF] transition-all"
                      title="Copy value"
                    >
                      {copiedKey === key ? <Check className="w-3.5 h-3.5 text-[#25D9B5]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="divide-y divide-white/05">
            {fields.slice(Math.ceil(fields.length / 2)).map(([key, val], idx) => (
              <div
                key={`field-right-${idx}`}
                className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors group"
              >
                <span className="text-xs font-mono uppercase tracking-wide text-[#9BA6B5]">
                  {key.replace(/_/g, ' ')}
                </span>
                <div className="flex items-center gap-2 text-right">
                  <span className="text-xs font-semibold text-[#F5F7FA] font-mono break-all">
                    {val === null || val === undefined ? '—' : String(val)}
                  </span>
                  {val && (
                    <button
                      onClick={() => copyToClipboard(val, key)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#9BA6B5] hover:text-[#5B8CFF] transition-all"
                      title="Copy value"
                    >
                      {copiedKey === key ? <Check className="w-3.5 h-3.5 text-[#25D9B5]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {fields.length === 0 && amounts.length === 0 && (
          <div className="p-10 text-center text-xs font-mono text-[#9BA6B5] italic">
            No structured parameters detected in this document.
          </div>
        )}
      </div>
    </div>
  );
}

