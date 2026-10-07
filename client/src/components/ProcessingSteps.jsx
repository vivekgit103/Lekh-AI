import React from 'react';

export const STAGES = [
  { id: 1, label: 'UPLOAD', desc: 'Secure in-memory multipart transmission' },
  { id: 2, label: 'UNDERSTAND', desc: 'Multimodal semantic classification & language detection' },
  { id: 3, label: 'EXTRACT', desc: 'Structured entities, identifiers, dates, and amounts' },
  { id: 4, label: 'VALIDATE', desc: 'Deterministic mathematical parity & reference number verification' },
  { id: 5, label: 'IDENTIFY RISK', desc: 'Legal penalties, interest exposure, and non-compliance flags' },
  { id: 6, label: 'FIND DEADLINES', desc: 'Calendar timeline and upcoming/overdue status parsing' },
  { id: 7, label: 'BUILD ACTION PLAN', desc: 'Prioritized sequential next steps for the taxpayer' },
];

export default function ProcessingSteps({ currentStep = 1 }) {
  return (
    <div className="border border-[#D5CEC1] bg-[#FAF8F2] divide-y divide-[#D5CEC1]">
      {STAGES.map((stage) => {
        const isDone = currentStep > stage.id;
        const isCurrent = currentStep === stage.id;
        const stepNum = stage.id < 10 ? `0${stage.id}` : stage.id;

        return (
          <div
            key={stage.id}
            className={`px-6 py-4 flex items-center justify-between transition-colors ${
              isCurrent
                ? 'bg-[#3158A8]/10 text-[#3158A8]'
                : isDone
                ? 'bg-[#FAF8F2] text-[#101B2D]'
                : 'bg-[#FAF8F2]/60 text-[#70716D]/60'
            }`}
          >
            <div className="flex items-center gap-5">
              <span
                className={`font-mono text-sm font-bold tracking-widest ${
                  isCurrent
                    ? 'text-[#3158A8]'
                    : isDone
                    ? 'text-[#101B2D]'
                    : 'text-[#70716D]/50'
                }`}
              >
                {stepNum}
              </span>

              <div className="space-y-0.5">
                <span
                  className={`font-mono text-xs uppercase tracking-widest block font-bold ${
                    isCurrent ? 'text-[#3158A8]' : isDone ? 'text-[#101B2D]' : 'text-[#70716D]/60'
                  }`}
                >
                  {stage.label}
                </span>
                <span className="font-mono text-[11px] text-[#70716D] block">
                  {stage.desc}
                </span>
              </div>
            </div>

            <div className="font-mono text-xs uppercase tracking-widest">
              {isCurrent && (
                <span className="text-[#3158A8] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#3158A8] animate-ping" />
                  ACTIVE
                </span>
              )}
              {isDone && (
                <span className="text-[#2D6A4F] font-semibold">
                  ✓ VERIFIED
                </span>
              )}
              {!isCurrent && !isDone && (
                <span className="text-[#70716D]/40">
                  PENDING
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

