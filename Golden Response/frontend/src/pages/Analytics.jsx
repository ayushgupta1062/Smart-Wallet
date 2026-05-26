import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CategoryIcon from '../components/CategoryIcon';
import { 
  Percent, 
  DollarSign, 
  TrendingUp, 
  HelpCircle,
  TrendingDown, 
  AlertCircle,
  Loader2,
  Calendar,
  Sparkles,
  Award
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  CartesianGrid
} from 'recharts';

const Analytics = () => {
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchChartsData = async () => {
    try {
      const res = await api.get('/analytics/charts');
      setCharts(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve visual chart data. Please retry.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartsData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 size={32} className="animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-900/40 rounded-3xl border border-slate-800/60 max-w-lg mx-auto text-center gap-4">
        <AlertCircle size={40} className="text-rose-500" />
        <h3 className="text-lg font-bold text-white">Sync Error</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{error}</p>
        <button 
          onClick={() => { setLoading(true); setError(''); fetchChartsData(); }}
          className="px-4 py-2 bg-indigo-600 rounded-xl hover:bg-indigo-500 text-white font-bold text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  // Derive deep-dive stats
  const calculateDerivedStats = () => {
    if (!charts) return {};
    
    // Average monthly expense over past 6 months
    const monthlyPoints = charts.monthlyOverview || [];
    const totalExpSum = monthlyPoints.reduce((acc, curr) => acc + (curr.expense || 0), 0);
    const avgMonthlyExp = monthlyPoints.length > 0 ? totalExpSum / monthlyPoints.length : 0;

    // Total income sum in past 6 months
    const totalIncSum = monthlyPoints.reduce((acc, curr) => acc + (curr.income || 0), 0);
    
    // Savings Index (historical)
    const netBalance = totalIncSum - totalExpSum;
    const savingsIndex = totalIncSum > 0 ? (netBalance / totalIncSum) * 100 : 0;
    
    // Expense Ratio
    const expenseRatio = totalIncSum > 0 ? (totalExpSum / totalIncSum) * 100 : 0;

    // Top Category
    const categories = charts.categoryBreakdown || [];
    const topCategory = categories.length > 0 ? categories[0] : null;

    return {
      avgMonthlyExp,
      savingsIndex: savingsIndex.toFixed(1),
      expenseRatio: expenseRatio.toFixed(1),
      topCategory
    };
  };

  const stats = calculateDerivedStats();

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-extrabold text-white md:text-2xl tracking-tight flex items-center gap-2">
          <Sparkles size={24} className="text-indigo-400" />
          Financial Intelligence
        </h1>
        <p className="text-xs text-slate-400 mt-1">Deep dive analytical insights, spending ratios, and category heatmaps</p>
      </div>

      {/* Advanced Statistical Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Savings Rate Card */}
        <div className="glass-card rounded-3xl p-6 flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 tracking-wide">Historical Savings Ratio</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
              <Percent size={18} />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-white">{stats.savingsIndex}%</h3>
            <span className="text-[10px] text-slate-400 font-bold block mt-1">Net savings efficiency</span>
          </div>
        </div>

        {/* Expense-to-Income Ratio */}
        <div className="glass-card rounded-3xl p-6 flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 tracking-wide">Expense-to-Income Index</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/15">
              <TrendingDown size={18} />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-white">{stats.expenseRatio}%</h3>
            <span className="text-[10px] text-slate-400 font-bold block mt-1">Percentage of income consumed</span>
          </div>
        </div>

        {/* Average Monthly Expense */}
        <div className="glass-card rounded-3xl p-6 flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 tracking-wide">Avg. Monthly Expenditure</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-white">{formatCurrency(stats.avgMonthlyExp)}</h3>
            <span className="text-[10px] text-slate-400 font-bold block mt-1">6-month average timeline</span>
          </div>
        </div>

        {/* Top Expense Category */}
        <div className="glass-card rounded-3xl p-6 flex flex-col justify-between h-36 relative overflow-hidden">
          {stats.topCategory && (
            <div 
              className="absolute -right-6 -top-6 w-20 h-20 rounded-full opacity-5 blur-xl pointer-events-none"
              style={{ backgroundColor: stats.topCategory.color }}
            />
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 tracking-wide">Primary Expenditure Spike</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/15">
              <Award size={18} />
            </div>
          </div>
          <div className="mt-2">
            {stats.topCategory ? (
              <>
                <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-1.5 mt-1">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: stats.topCategory.color }} />
                  {stats.topCategory.name}
                </h3>
                <span className="text-[10px] text-slate-400 font-bold block mt-1">
                  Consumes {stats.topCategory.percentage}% of budgets
                </span>
              </>
            ) : (
              <>
                <h3 className="text-sm font-black text-slate-500">No records</h3>
                <span className="text-[10px] text-slate-600 block mt-1">Record expenses to log spikes</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Area Chart for comparative analysis */}
      <div className="glass-panel rounded-3xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Timeline Gradient Analytics</h3>
            <p className="text-xs text-slate-400 mt-1">Detailed dual-area timeline measuring earnings against expenditures</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
            <Calendar size={13} className="text-indigo-400" />
            Last 6 Months
          </span>
        </div>

        <div className="h-[320px] w-full">
          {charts?.monthlyOverview && charts.monthlyOverview.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.monthlyOverview} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  {/* Green income gradient */}
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  {/* Red expense gradient */}
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area type="monotone" dataKey="income" name="Earnings" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#incomeGrad)" />
                <Area type="monotone" dataKey="expense" name="Expenditures" stroke="#EF4444" strokeWidth={2.5} fillOpacity={1} fill="url(#expenseGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-500 font-semibold">
              No historical data logs recorded.
            </div>
          )}
        </div>
      </div>

      {/* Categories Breakdown Double Panel */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Category Share List table */}
        <div className="glass-panel lg:col-span-2 rounded-3xl p-6 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white tracking-tight">Category Expenditure Audit</h3>
            <p className="text-xs text-slate-400 mt-1">Breakdown analysis sorted by expenditure size</p>
          </div>

          <div className="flex-grow overflow-x-auto">
            {charts?.categoryBreakdown && charts.categoryBreakdown.length > 0 ? (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-900/30">
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Color theme</th>
                    <th className="py-3 px-4 text-right">Budget Share</th>
                    <th className="py-3 px-4 text-right">Total Spent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {charts.categoryBreakdown.map((cat, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/10">
                      <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2.5">
                        <div 
                          className="flex h-7 w-7 items-center justify-center rounded-lg border"
                          style={{ 
                            color: cat.color, 
                            backgroundColor: `${cat.color}15`,
                            borderColor: `${cat.color}25`
                          }}
                        >
                          <CategoryIcon name={cat.icon} size={14} />
                        </div>
                        {cat.name}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                          {cat.color}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-indigo-400">{cat.percentage}%</td>
                      <td className="py-3.5 px-4 text-right font-black text-white">{formatCurrency(cat.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-500 py-12">
                No categorical details logged.
              </div>
            )}
          </div>
        </div>

        {/* Visual category donut panel */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between h-[360px]">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Budgets Allocation Chart</h3>
            <p className="text-xs text-slate-400 mt-1">Donut chart of budget allocations</p>
          </div>

          <div className="h-[200px] w-full flex items-center justify-center relative">
            {charts?.categoryBreakdown && charts.categoryBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {charts.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-sm text-slate-500 font-semibold">
                No visual entries logged.
              </div>
            )}
          </div>

          <div className="text-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Financial heat map distribution</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
