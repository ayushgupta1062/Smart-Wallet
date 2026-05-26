import React from 'react';

const StatCard = ({ title, amount, percentage, icon: Icon, color, trend, trendLabel }) => {
  return (
    <div className="glass-card glass-card-hover rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between h-40">
      {/* Background radial accent glow */}
      <div 
        className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 blur-xl pointer-events-none"
        style={{ backgroundColor: color }}
      />
      
      {/* Card Header: Icon and Title */}
      <div className="flex items-center justify-between z-10">
        <span className="text-sm font-semibold text-slate-400 tracking-wide">{title}</span>
        <div 
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-700/40"
          style={{ 
            color: color, 
            backgroundColor: `${color}15`,
            borderColor: `${color}25`
          }}
        >
          <Icon size={20} />
        </div>
      </div>

      {/* Card Value */}
      <div className="mt-4 z-10">
        <h3 className="text-2xl font-black text-white md:text-3xl tracking-tight">
          {amount}
        </h3>
      </div>

      {/* Card Footer: Trend indicators */}
      <div className="mt-2 flex items-center gap-2 z-10">
        {trend !== undefined && (
          <span 
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              trend >= 0 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' 
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/15'
            }`}
          >
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
        {trendLabel && (
          <span className="text-xs font-medium text-slate-400 tracking-wide">{trendLabel}</span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
