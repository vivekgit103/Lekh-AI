import React from 'react';

export default function MetricCard({ title, value, subtitle, icon: Icon, color = 'blue' }) {
  const formattedValue = typeof value === 'number' && value < 10 && value >= 0 ? `0${value}` : value;

  const colorStyles = {
    blue: 'from-[#5B8CFF]/20 to-transparent text-[#5B8CFF] border-[#5B8CFF]/30',
    violet: 'from-[#7C5CFF]/20 to-transparent text-[#7C5CFF] border-[#7C5CFF]/30',
    red: 'from-[#FF5C6C]/20 to-transparent text-[#FF5C6C] border-[#FF5C6C]/30',
    amber: 'from-[#FFB84D]/20 to-transparent text-[#FFB84D] border-[#FFB84D]/30',
    teal: 'from-[#25D9B5]/20 to-transparent text-[#25D9B5] border-[#25D9B5]/30',
  };

  const activeColor = colorStyles[color] || colorStyles.blue;

  return (
    <div className="group relative p-6 bg-[#111722]/80 hover:bg-[#151C29]/90 border border-white/08 hover:border-white/20 rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-2xl overflow-hidden">
      {/* Background radial glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-bl ${activeColor} opacity-20 blur-2xl pointer-events-none group-hover:opacity-35 transition-opacity`} />

      <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-[#9BA6B5]">
            {title}
          </span>
          {Icon && (
            <div className={`p-2 rounded-xl bg-white/05 border border-white/05 text-[#9BA6B5] group-hover:text-[#F5F7FA] transition-colors`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#F5F7FA] group-hover:text-white transition-colors">
          {formattedValue}
        </div>

        {subtitle && (
          <div className="text-[11px] font-mono text-[#657182] pt-2 border-t border-white/05">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

