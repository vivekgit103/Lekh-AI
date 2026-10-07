import React from 'react';
import { Link } from 'react-router-dom';
import RiskBadge from './RiskBadge';
import StatusBadge from './StatusBadge';
import { formatDate } from '../utils/formatters';
import { ArrowLeft, Trash2, FileCheck, Building2, Calendar, Sparkles, MessageSquare } from 'lucide-react';

export default function DocumentHeader({ document, onDelete, activeTab, onTabChange }) {
  if (!document) return null;

  const title = document.document_title || document.documentTitle || document.original_file_name;
  const docType = (document.document_type || document.documentType || 'General Document').toUpperCase();
  const issuer = (document.issuer || 'Unknown Issuer').toUpperCase();
  const createdDate = document.created_at;

  const highestRisk = document.overallRisk ||
    ((document.risks || []).find((r) => r.level === 'HIGH')
      ? 'HIGH'
      : (document.risks || []).find((r) => r.level === 'MEDIUM')
      ? 'MEDIUM'
      : 'LOW');

  return (
    <div className="space-y-6">
      {/* Top Navigation & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/05">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#9BA6B5] hover:text-[#5B8CFF] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Overview</span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Modern Tab Switcher */}
          <div className="flex bg-[#0D1117] border border-white/08 rounded-xl p-1">
            <button
              onClick={() => onTabChange('analysis')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'analysis'
                  ? 'bg-gradient-to-r from-[#5B8CFF] to-[#7C5CFF] text-white shadow-glow-blue/40'
                  : 'text-[#9BA6B5] hover:text-white hover:bg-white/05'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Audit Report</span>
            </button>

            <button
              onClick={() => onTabChange('chat')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-[#5B8CFF] to-[#7C5CFF] text-white shadow-glow-blue/40'
                  : 'text-[#9BA6B5] hover:text-white hover:bg-white/05'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask AI</span>
            </button>
          </div>

          {onDelete && (
            <button
              onClick={onDelete}
              title="Delete Document"
              className="p-2.5 rounded-xl border border-white/08 hover:border-[#FF5C6C]/40 text-[#9BA6B5] hover:text-[#FF5C6C] hover:bg-[#FF5C6C]/05 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Prominent Demo Notice if Sample */}
      {document.is_demo && (
        <div className="p-4 rounded-xl border border-[#FFB84D]/30 bg-[#FFB84D]/08 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#FFB84D]">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span className="font-semibold uppercase tracking-wider font-mono">
              [ SAMPLE / DEMO DATA ]
            </span>
            <span className="text-[#F5F7FA]">Pre-computed scenario for reliable live demonstration.</span>
          </div>
          <span className="text-[10px] font-mono text-[#9BA6B5] uppercase">
            NOT REAL-TIME GEMINI RUN
          </span>
        </div>
      )}

      {/* Main Document Hero Glass Card */}
      <div className="relative rounded-2xl border border-white/10 bg-[#111722]/80 backdrop-blur-xl p-6 sm:p-10 shadow-2xl overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#5B8CFF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5B8CFF]/10 border border-[#5B8CFF]/25 text-[11px] font-mono uppercase tracking-wider text-[#5B8CFF] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B8CFF] animate-pulse" />
              DOCUMENT ANALYZED ✓
            </span>

            <div className="flex items-center gap-2.5">
              <RiskBadge level={highestRisk} size="lg" />
              <StatusBadge status={document.processing_status} />
            </div>
          </div>

          <div>
            <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#F5F7FA] leading-tight">
              {title}
            </h1>
          </div>

          {/* Metadata Chips Bar */}
          <div className="pt-4 border-t border-white/05 flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-[#9BA6B5]">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/05 border border-white/05">
              <span className="text-[#657182] font-mono uppercase text-[10px]">CATEGORY:</span>
              <strong className="text-[#F5F7FA]">{docType}</strong>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/05 border border-white/05">
              <Building2 className="w-3.5 h-3.5 text-[#5B8CFF]" />
              <span className="text-[#657182] font-mono uppercase text-[10px]">ISSUER:</span>
              <strong className="text-[#F5F7FA]">{issuer}</strong>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/05 border border-white/05">
              <Calendar className="w-3.5 h-3.5 text-[#7C5CFF]" />
              <span className="text-[#657182] font-mono uppercase text-[10px]">PROCESSED:</span>
              <strong className="text-[#F5F7FA]">{formatDate(createdDate)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

