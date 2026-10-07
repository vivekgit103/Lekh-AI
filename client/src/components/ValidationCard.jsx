import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export default function ValidationCard({ validation }) {
  const status = validation?.status || (Array.isArray(validation) ? 'PASS' : 'PASS');
  const checks = validation?.checks || (Array.isArray(validation) ? validation : []);

  const statusConfig = {
    PASS: {
      text: 'text-[#25D9B5]',
      bg: 'bg-[#25D9B5]/10',
      border: 'border-[#25D9B5]/30',
      glow: 'shadow-[0_0_15px_rgba(37,217,181,0.2)]',
    },
    WARNING: {
      text: 'text-[#FFB84D]',
      bg: 'bg-[#FFB84D]/10',
      border: 'border-[#FFB84D]/30',
      glow: 'shadow-[0_0_15px_rgba(255,184,77,0.2)]',
    },
    FAIL: {
      text: 'text-[#FF5C6C]',
      bg: 'bg-[#FF5C6C]/10',
      border: 'border-[#FF5C6C]/30',
      glow: 'shadow-[0_0_15px_rgba(255,92,108,0.2)]',
    },
  };

  const currentStatus = statusConfig[status] || statusConfig.PASS;

  return (
    <div className="rounded-2xl border border-white/08 bg-[#111722]/80 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/05">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#25D9B5]" />
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#F5F7FA]">
              Verified by DocuSaathi
            </h2>
          </div>
          <p className="text-xs text-[#9BA6B5]">
            Deterministic mathematical assertions executed independently of AI hallucinations.
          </p>
        </div>

        <div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 font-mono text-xs uppercase tracking-wider rounded-full border ${currentStatus.text} ${currentStatus.bg} ${currentStatus.border} ${currentStatus.glow}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            <span>AUDIT: {status}</span>
          </span>
        </div>
      </div>

      {/* Checks List */}
      {checks.length === 0 ? (
        <p className="text-xs font-mono text-[#9BA6B5] italic">
          No automated deterministic checks recorded.
        </p>
      ) : (
        <div className="space-y-3">
          {checks.map((check, idx) => {
            const checkStatus = (check.status || check.severity || 'PASS').toUpperCase();
            const isPass = checkStatus === 'PASS' || checkStatus === 'INFO' || check.passed;
            const isWarning = checkStatus === 'WARNING';
            const isFail = checkStatus === 'FAIL' || checkStatus === 'ERROR';

            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-white/05 bg-white/[0.02] hover:bg-white/[0.04] transition-all flex items-start gap-3.5"
              >
                <div className="shrink-0 mt-0.5">
                  {isPass && <CheckCircle2 className="w-4 h-4 text-[#25D9B5]" />}
                  {isWarning && <AlertTriangle className="w-4 h-4 text-[#FFB84D]" />}
                  {isFail && <XCircle className="w-4 h-4 text-[#FF5C6C]" />}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#F5F7FA]">
                      {check.name || check.rule || 'Validation Assertion'}
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                        isPass
                          ? 'text-[#25D9B5] bg-[#25D9B5]/10'
                          : isWarning
                          ? 'text-[#FFB84D] bg-[#FFB84D]/10'
                          : 'text-[#FF5C6C] bg-[#FF5C6C]/10'
                      }`}
                    >
                      {checkStatus}
                    </span>
                  </div>
                  <p className="text-xs text-[#9BA6B5] leading-relaxed">
                    {check.message || check.description || 'Check completed successfully.'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

