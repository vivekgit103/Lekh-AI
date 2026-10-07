import React from 'react';

export default function ValidationCard({ validation }) {
  const status = validation?.status || (Array.isArray(validation) ? 'PASS' : 'PASS');
  const checks = validation?.checks || (Array.isArray(validation) ? validation : []);

  return (
    <div className="border border-[#D5CEC1] bg-[#FAF8F2] p-6 sm:p-8 space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-[#D5CEC1] pb-4">
        <div>
          <span className="font-mono text-[11px] text-[#3158A8] uppercase tracking-widest block mb-1">
            08 — VALIDATION
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B2D]">
            Checked, not just extracted.
          </h2>
          <p className="font-mono text-xs text-[#70716D] mt-1">
            Deterministic rule assertions executed independently of AI hallucinations.
          </p>
        </div>

        <div>
          <span
            className={`font-mono text-xs uppercase tracking-widest px-3 py-1 border ${
              status === 'FAIL'
                ? 'text-[#8B2626] border-[#8B2626]/40 bg-[#8B2626]/5'
                : status === 'WARNING'
                ? 'text-[#9A6B2F] border-[#9A6B2F]/40 bg-[#9A6B2F]/5'
                : 'text-[#2D6A4F] border-[#2D6A4F]/40 bg-[#2D6A4F]/5'
            }`}
          >
            STATUS: {status}
          </span>
        </div>
      </div>

      {/* Checks List */}
      {checks.length === 0 ? (
        <p className="font-mono text-xs text-[#70716D] italic">
          No automated deterministic checks recorded.
        </p>
      ) : (
        <div className="divide-y divide-[#D5CEC1]">
          {checks.map((check, idx) => {
            const checkStatus = (check.status || check.severity || 'PASS').toUpperCase();
            const isPass = checkStatus === 'PASS' || checkStatus === 'INFO' || check.passed;
            const isWarning = checkStatus === 'WARNING';
            const isFail = checkStatus === 'FAIL' || checkStatus === 'ERROR';

            const mark = isPass ? '✓' : isWarning ? '⚠' : '✕';
            const markColor = isPass ? 'text-[#2D6A4F]' : isWarning ? 'text-[#9A6B2F]' : 'text-[#8B2626]';

            return (
              <div
                key={idx}
                className="py-3.5 flex items-start gap-4 hover:bg-[#E8E0D2]/30 transition-colors"
              >
                <span className={`font-mono text-base font-bold shrink-0 ${markColor}`}>
                  {mark}
                </span>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#101B2D]">
                      {check.name || check.rule || 'Check'}
                    </span>
                    <span className={`font-mono text-[10px] uppercase tracking-wider ${markColor}`}>
                      [{checkStatus}]
                    </span>
                  </div>
                  {check.message && (
                    <p className="font-mono text-xs text-[#70716D] leading-relaxed">
                      {check.message}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

