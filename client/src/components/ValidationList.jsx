import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';

export default function ValidationList({ validationResults = [] }) {
  if (!validationResults || validationResults.length === 0) {
    return (
      <div className="p-4 rounded-xl border border-white/05 bg-[#0D1117] font-mono text-xs text-[#9BA6B5] italic flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-[#25D9B5]" />
        <span>No automated integrity flags triggered.</span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111722] divide-y divide-white/05 overflow-hidden">
      {validationResults.map((result, idx) => {
        const isError = !result.passed || result.severity === 'ERROR';
        const isWarning = result.severity === 'WARNING';

        return (
          <div key={idx} className="p-4 flex items-start gap-3 hover:bg-white/02 transition-colors">
            {isError ? (
              <XCircle className="w-5 h-5 text-[#FF5C6C] shrink-0 mt-0.5" />
            ) : isWarning ? (
              <AlertTriangle className="w-5 h-5 text-[#FFB84D] shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-[#25D9B5] shrink-0 mt-0.5" />
            )}

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold text-[#F5F7FA] uppercase tracking-wide">
                  {result.rule ? result.rule.replace(/_/g, ' ') : 'Integrity Rule'}
                </span>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                    isError
                      ? 'text-[#FF5C6C] bg-[#FF5C6C]/10'
                      : isWarning
                      ? 'text-[#FFB84D] bg-[#FFB84D]/10'
                      : 'text-[#25D9B5] bg-[#25D9B5]/10'
                  }`}
                >
                  {result.severity || (result.passed ? 'PASSED' : 'FLAGGED')}
                </span>
              </div>
              <p className="text-xs text-[#9BA6B5] leading-relaxed">{result.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
