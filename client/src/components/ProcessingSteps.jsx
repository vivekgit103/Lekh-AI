import React from 'react';
import { Check, Loader2, Sparkles, ShieldCheck, FileSearch, Calendar, ListChecks, Brain } from 'lucide-react';

export const STAGES = [
  { id: 1, label: 'UPLOAD DOCUMENT', desc: 'Secure in-memory binary transmission', icon: FileSearch },
  { id: 2, label: 'UNDERSTAND MEANING', desc: 'Multimodal semantic classification & language audit', icon: Brain },
  { id: 3, label: 'EXTRACT PARAMETERS', desc: 'Key fields, amounts, identifiers, and entities', icon: Sparkles },
  { id: 4, label: 'RUN ARITHMETIC AUDIT', desc: 'Deterministic mathematical parity & reference validation', icon: ShieldCheck },
  { id: 5, label: 'ANALYZE LEGAL RISK', desc: 'Statutory penalties, traps, and interest exposure', icon: ShieldCheck },
  { id: 6, label: 'DETECT DEADLINES', desc: 'Calendar timeline and urgency prioritization', icon: Calendar },
  { id: 7, label: 'BUILD ACTION PLAN', desc: 'Actionable sequential roadmap for recipient', icon: ListChecks },
];

export default function ProcessingSteps({ currentStep = 1 }) {
  const progressPercent = Math.min(100, Math.round(((currentStep - 1) / (STAGES.length - 1)) * 100));

  return (
    <div className="space-y-6">
      {/* Dynamic Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#9BA6B5] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#5B8CFF] animate-pulse" />
            PIPELINE EXECUTION IN PROGRESS
          </span>
          <span className="text-[#5B8CFF] font-bold">{progressPercent}% COMPLETED</span>
        </div>
        <div className="w-full h-2 rounded-full bg-[#111722] border border-white/05 overflow-hidden p-[1px]">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-[#5B8CFF] via-[#7C5CFF] to-[#25D9B5] transition-all duration-500 shadow-[0_0_12px_#5B8CFF]"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          />
        </div>
      </div>

      {/* Holographic Step Rows */}
      <div className="rounded-2xl border border-white/08 bg-[#111722]/80 backdrop-blur-xl divide-y divide-white/05 overflow-hidden shadow-2xl">
        {STAGES.map((stage) => {
          const isDone = currentStep > stage.id;
          const isCurrent = currentStep === stage.id;
          const Icon = stage.icon;

          return (
            <div
              key={stage.id}
              className={`px-5 py-3.5 flex items-center justify-between transition-all duration-300 ${
                isCurrent
                  ? 'bg-gradient-to-r from-[#5B8CFF]/15 via-[#7C5CFF]/10 to-transparent border-l-4 border-l-[#5B8CFF]'
                  : isDone
                  ? 'bg-transparent hover:bg-white/[0.02]'
                  : 'opacity-40'
              }`}
            >
              <div className="flex items-center gap-4">
                <div 
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                    isDone 
                      ? 'bg-[#25D9B5]/15 border border-[#25D9B5]/30 text-[#25D9B5]' 
                      : isCurrent
                      ? 'bg-[#5B8CFF]/20 border border-[#5B8CFF]/40 text-[#5B8CFF] shadow-[0_0_12px_rgba(91,140,255,0.4)]'
                      : 'bg-white/05 border border-white/05 text-[#9BA6B5]'
                  }`}
                >
                  {isDone ? (
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#5B8CFF]" />
                  ) : (
                    <Icon className="w-4 h-4 opacity-60" />
                  )}
                </div>

                <div className="space-y-0.5">
                  <span
                    className={`font-display text-sm font-semibold tracking-wide block ${
                      isCurrent ? 'text-white' : isDone ? 'text-[#F5F7FA]' : 'text-[#9BA6B5]'
                    }`}
                  >
                    {stage.label}
                  </span>
                  <span className="text-xs text-[#9BA6B5] block">
                    {stage.desc}
                  </span>
                </div>
              </div>

              <div className="font-mono text-xs">
                {isCurrent && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#5B8CFF]/15 text-[#5B8CFF] border border-[#5B8CFF]/30 font-semibold shadow-[0_0_8px_rgba(91,140,255,0.3)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5B8CFF] animate-ping" />
                    RUNNING
                  </span>
                )}
                {isDone && (
                  <span className="text-[#25D9B5] font-semibold text-[11px] flex items-center gap-1">
                    ✓ DONE
                  </span>
                )}
                {!isCurrent && !isDone && (
                  <span className="text-[#657182] text-[11px]">
                    WAITING
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

