import React from 'react';

export default function ValidationList({ validationResults = [] }) {
  if (!validationResults || validationResults.length === 0) {
    return (
      <div className="p-4 border border-[#D5CEC1] bg-[#FAF8F2] font-mono text-xs text-[#70716D] italic">
        No specific automated validation alerts triggered.
      </div>
    );
  }

  return (
    <div className="border border-[#D5CEC1] bg-[#FAF8F2] divide-y divide-[#D5CEC1]">
      {validationResults.map((result, idx) => {
        const isError = !result.passed || result.severity === 'ERROR';
        const isWarning = result.severity === 'WARNING';
        const mark = isError ? '✕' : isWarning ? '⚠' : '✓';
        const color = isError ? 'text-[#8B2626]' : isWarning ? 'text-[#9A6B2F]' : 'text-[#2D6A4F]';

        return (
          <div key={idx} className="p-4 flex items-start gap-3 hover:bg-[#E8E0D2]/30 font-mono text-xs">
            <span className={`font-bold ${color}`}>{mark}</span>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#101B2D] uppercase">{result.rule.replace(/_/g, ' ')}</span>
                <span className={`text-[10px] uppercase ${color}`}>[{result.severity}]</span>
              </div>
              <p className="text-[#70716D]">{result.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

