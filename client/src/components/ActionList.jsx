import React from 'react';

export default function ActionList({ actions = [] }) {
  if (!actions || actions.length === 0) {
    return (
      <div className="border border-[#D5CEC1] bg-[#FAF8F2] p-8 text-center">
        <p className="font-mono text-xs text-[#70716D] italic">
          No immediate procedural actions required for this document.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-[#D5CEC1] bg-[#FAF8F2] p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="border-b border-[#D5CEC1] pb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <span className="font-mono text-[11px] text-[#3158A8] uppercase tracking-widest block mb-1">
            11 — ACTION
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B2D]">
            What should you do next?
          </h2>
        </div>
        <span className="font-mono text-xs text-[#70716D] uppercase">
          {actions.length} PRESCRIBED STEP{actions.length > 1 ? 'S' : ''}
        </span>
      </div>

      {/* Numbered Actions List */}
      <div className="divide-y divide-[#D5CEC1]">
        {actions.map((act, idx) => {
          const stepNumber = act.step || idx + 1;
          const formattedStep = stepNumber < 10 ? `0${stepNumber}` : stepNumber;
          const title = typeof act === 'string' ? act : act.title;
          const desc = typeof act === 'object' ? act.description : '';
          const urgency = ((typeof act === 'object' && act.urgency) || 'MEDIUM').toUpperCase();

          return (
            <div
              key={idx}
              className="py-6 flex items-start gap-6 hover:bg-[#E8E0D2]/20 transition-colors"
            >
              {/* Large Editorial Step Number */}
              <div className="font-serif text-3xl sm:text-4xl font-bold text-[#3158A8] shrink-0 leading-none min-w-[45px]">
                {formattedStep}
              </div>

              {/* Action Content */}
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#101B2D]">
                    {title}
                  </h3>
                  <span
                    className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border ${
                      urgency === 'HIGH'
                        ? 'text-[#8B2626] border-[#8B2626]/40'
                        : urgency === 'LOW'
                        ? 'text-[#2D6A4F] border-[#2D6A4F]/40'
                        : 'text-[#9A6B2F] border-[#9A6B2F]/40'
                    }`}
                  >
                    {urgency} URGENCY
                  </span>
                </div>

                {desc && (
                  <p className="font-mono text-xs text-[#70716D] leading-relaxed">
                    {desc}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

