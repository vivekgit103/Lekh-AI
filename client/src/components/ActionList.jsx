import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

export default function ActionList({ actions = [] }) {
  const [completedSteps, setCompletedSteps] = useState({});

  if (!actions || actions.length === 0) {
    return (
      <div className="glass-panel p-8 text-center rounded-2xl border border-white/05">
        <Sparkles className="w-6 h-6 text-[#25D9B5] mx-auto mb-2 opacity-80" />
        <p className="font-mono text-xs text-[#9BA6B5]">
          No immediate procedural actions required for this document.
        </p>
      </div>
    );
  }

  const toggleComplete = (idx) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#5B8CFF] shadow-glow-blue" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#5B8CFF]">
              PRESCRIBED PROTOCOL
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F7FA]">
            Here's what to do next.
          </h2>
        </div>
        <span className="font-mono text-xs text-[#9BA6B5] uppercase px-3 py-1 rounded-full bg-white/05 border border-white/05 self-start sm:self-auto">
          {actions.length} ACTION{actions.length > 1 ? 'S' : ''} DETECTED
        </span>
      </div>

      {/* Numbered Sequential Actions */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {actions.map((act, idx) => {
          const stepNumber = act.step || idx + 1;
          const formattedStep = stepNumber < 10 ? `0${stepNumber}` : stepNumber;
          const title = typeof act === 'string' ? act : act.title;
          const desc = typeof act === 'object' ? act.description : '';
          const urgency = ((typeof act === 'object' && act.urgency) || 'MEDIUM').toUpperCase();
          const isDone = !!completedSteps[idx];

          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -2 }}
              onClick={() => toggleComplete(idx)}
              className={`cursor-pointer rounded-2xl border p-5 sm:p-6 transition-all relative overflow-hidden group ${
                isDone
                  ? 'bg-[#111722]/40 border-white/05 opacity-60'
                  : urgency === 'HIGH'
                  ? 'bg-[#111722] border-[#FF5C6C]/25 hover:border-[#FF5C6C]/50 hover:shadow-glow-red/10'
                  : 'bg-[#111722] border-white/10 hover:border-[#5B8CFF]/40 hover:shadow-glow-blue/10'
              }`}
            >
              <div className="flex items-start gap-4 sm:gap-6">
                {/* Step Number Badge */}
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-display font-bold text-lg transition-all ${
                      isDone
                        ? 'bg-[#25D9B5]/10 text-[#25D9B5] border border-[#25D9B5]/30'
                        : 'bg-[#070A0F] text-[#5B8CFF] border border-white/10 group-hover:border-[#5B8CFF]/50 group-hover:text-white'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-[#25D9B5]" />
                    ) : (
                      formattedStep
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3
                      className={`font-sans text-base sm:text-lg font-semibold transition-colors ${
                        isDone
                          ? 'line-through text-[#9BA6B5]'
                          : 'text-[#F5F7FA] group-hover:text-white'
                      }`}
                    >
                      {title}
                    </h3>

                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        urgency === 'HIGH'
                          ? 'text-[#FF5C6C] bg-[#FF5C6C]/10 border-[#FF5C6C]/30'
                          : urgency === 'LOW'
                          ? 'text-[#25D9B5] bg-[#25D9B5]/10 border-[#25D9B5]/30'
                          : 'text-[#FFB84D] bg-[#FFB84D]/10 border-[#FFB84D]/30'
                      }`}
                    >
                      {urgency} PRIORITY
                    </span>
                  </div>

                  {desc && (
                    <p className="text-xs sm:text-sm text-[#9BA6B5] leading-relaxed">
                      {desc}
                    </p>
                  )}
                </div>

                {/* Check status button */}
                <div className="shrink-0 self-center hidden sm:block">
                  <button
                    type="button"
                    aria-label="Toggle task completion"
                    className="p-1 rounded-full text-[#9BA6B5] hover:text-[#25D9B5] transition-colors"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-[#25D9B5]" />
                    ) : (
                      <Circle className="w-5 h-5 opacity-40 group-hover:opacity-100" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
