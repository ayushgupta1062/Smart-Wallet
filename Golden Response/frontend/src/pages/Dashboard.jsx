import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent, 
  Plus, 
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Tag,
  FileText,
  Loader2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const DashboardSkeleton = () => (
  <div className="space-y-8">
    {/* KPI cards skeleton */}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-40 rounded-3xl bg-slate-900/60 border border-slate-800/40 p-6 flex flex-col justify-between animate-skeleton">
          <div className="flex justify-between items-center">
            <div className="h-4 w-24 bg-slate-800 rounded"></div>
            <div className="h-10 w-10 bg-slate-800 rounded-2xl"></div>
          </div>
          <div className="h-8 w-32 bg-slate-800 rounded"></div>
          <div className="h-4 w-40 bg-slate-800 rounded"></div>
        </div>
      ))}
    </div>

    {/* Charts and Feed skeleton */}
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 h-[400px] rounded-3xl bg-slate-900/60 border border-slate-800/40 animate-skeleton"></div>
      <div className="h-[400px] rounded-3xl bg-slate-900/60 border border-slate-800/40 animate-skeleton"></div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();

  // Dashboard state
  const [data, setData] = useState(null);
  const [charts, setCharts] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);

  // Form states
  const [expenseForm, setExpenseForm] = useState({
    title: '', amount: '', date: new Date().toISOString().split('T')[0], categoryId: '', description: ''
  });
  const [incomeForm, setIncomeForm] = useState({
    source: '', amount: '', date: new Date().toISOString().split('T')[0], description: ''
  });
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Load Dashboard datasets
  const fetchDashboardData = async () => {
    try {
      const [summaryRes, chartsRes, catsRes] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/analytics/charts'),
        api.get('/categories')
      ]);

      setData(summaryRes.data);
      setCharts(chartsRes.data);
      setCategories(catsRes.data);
      
      // Auto-set first category inside expense form
      if (catsRes.data.length > 0) {
        setExpenseForm(prev => ({ ...prev, categoryId: catsRes.data[0].id }));
      }
      
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Could not sync financial dashboard. Please retry.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Quick Add Expense handler
  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!expenseForm.title || !expenseForm.amount || !expenseForm.categoryId || !expenseForm.date) {
      setFormError('Please enter all mandatory fields.');
      return;
    }

    setFormSubmitting(true);
    try {
      await api.post('/expenses', expenseForm);
      setExpenseModalOpen(false);
      setExpenseForm({
        title: '', 
        amount: '', 
        date: new Date().toISOString().split('T')[0], 
        categoryId: categories[0]?.id || '', 
        description: ''
      });
      fetchDashboardData(); // Refresh summary values
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to record expense transaction.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Quick Add Income handler
  const handleIncomeSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!incomeForm.source || !incomeForm.amount || !incomeForm.date) {
      setFormError('Please enter all mandatory fields.');
      return;
    }

    setFormSubmitting(true);
    try {
      await api.post('/incomes', incomeForm);
      setIncomeModalOpen(false);
      setIncomeForm({
        source: '', 
        amount: '', 
        date: new Date().toISOString().split('T')[0], 
        description: ''
      });
      fetchDashboardData(); // Refresh summary values
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to record income record.');
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-900/40 rounded-3xl border border-slate-800/60 max-w-lg mx-auto text-center gap-4">
        <AlertCircle size={40} className="text-rose-500" />
        <h3 className="text-lg font-bold text-white">Sync Error</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{error}</p>
        <button 
          onClick={() => { setLoading(true); setError(''); fetchDashboardData(); }}
          className="px-4 py-2 bg-indigo-600 rounded-xl hover:bg-indigo-500 text-white font-bold text-sm"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white md:text-2xl tracking-tight">Financial Overview</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Welcome back, {user?.name}!</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIncomeModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-emerald-600/20 border border-emerald-500/25 px-4 py-2.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition duration-200"
          >
            <Plus size={16} />
            Quick Income
          </button>
          <button
            onClick={() => setExpenseModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/15 hover:bg-indigo-500 hover:shadow-indigo-500/20 transition duration-200"
          >
            <Plus size={16} />
            Quick Expense
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Income"
          amount={formatCurrency(data?.totalIncome || 0)}
          icon={TrendingUp}
          color="#10B981"
          trendLabel="All time earnings"
        />
        <StatCard
          title="Total Expense"
          amount={formatCurrency(data?.totalExpense || 0)}
          icon={TrendingDown}
          color="#EF4444"
          trendLabel="All time expenditures"
        />
        <StatCard
          title="Net Balance"
          amount={formatCurrency(data?.balance || 0)}
          icon={DollarSign}
          color="#6366F1"
          trendLabel="Net cash assets"
        />
        <StatCard
          title="Savings Rate"
          amount={`${data?.savingsRate || 0}%`}
          icon={Percent}
          color="#A855F7"
          trend={data?.savingsRate >= 30 ? 1 : -1}
          trendLabel={data?.savingsRate >= 30 ? "Healthy savings index" : "Needs budget scrutiny"}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Monthly comparative chart */}
        <div className="glass-panel lg:col-span-2 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white tracking-tight">Income vs Expense History</h3>
            <p className="text-xs text-slate-400 mt-1">Aggregated comparison for the past six months</p>
          </div>
          
          <div className="h-[280px] w-full">
            {charts?.monthlyOverview && charts.monthlyOverview.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.monthlyOverview} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px' }}
                    labelStyle={{ color: '#94A3B8', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} />
                  <Bar dataKey="income" name="Income" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={20} />
                  <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[6, 6, 0, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500 font-semibold">
                No transaction records available.
              </div>
            )}
          </div>
        </div>

        {/* Category Share Distribution */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Expense Category Allocation</h3>
            <p className="text-xs text-slate-400 mt-1">Allocation percentage across categories</p>
          </div>

          <div className="h-[200px] w-full mt-4 flex items-center justify-center relative">
            {charts?.categoryBreakdown && charts.categoryBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
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
                No expense entries.
              </div>
            )}
          </div>

          {/* Categories legend list */}
          <div className="mt-4 space-y-2 overflow-y-auto max-h-[120px] pr-1 glass-scroll">
            {charts?.categoryBreakdown && charts.categoryBreakdown.length > 0 ? (
              charts.categoryBreakdown.slice(0, 4).map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-slate-300">{cat.name}</span>
                  </div>
                  <span className="text-slate-400">{cat.percentage}%</span>
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-slate-600 font-semibold">Seeding zero values</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Lists Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Transactions Unified table list */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between min-h-[380px]">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white tracking-tight">Recent Transactions</h3>
            <p className="text-xs text-slate-400 mt-1">Last 5 financial movements logged</p>
          </div>

          <div className="flex-grow space-y-3">
            {data?.recentTransactions && data.recentTransactions.length > 0 ? (
              data.recentTransactions.map((tx, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/30 border border-slate-800/40 hover:border-slate-700/60 transition duration-200"
                >
                  <div className="flex items-center gap-3">
                    {/* Direction Badge */}
                    <div 
                      className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                        tx.type === 'INCOME' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15' 
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/15'
                      }`}
                    >
                      {tx.type === 'INCOME' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                    </div>
                    <div className="overflow-hidden">
                      <p className="truncate text-sm font-semibold text-white max-w-[140px] sm:max-w-[200px]">
                        {tx.title}
                      </p>
                      <span className="text-[10px] text-slate-400 font-semibold tracking-wider flex items-center gap-1.5 mt-0.5">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tx.color }} />
                        {tx.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-sm font-black ${tx.type === 'INCOME' ? 'text-emerald-400' : 'text-slate-200'}`}>
                      {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                    <span className="text-[10px] font-bold text-slate-500 mt-0.5 block">{tx.date}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center gap-2 text-slate-500 py-12">
                <HelpCircle size={32} />
                <p className="text-sm font-semibold">No recorded transactions.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activities text logs */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between min-h-[380px]">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white tracking-tight">Recent Activity Feed</h3>
            <p className="text-xs text-slate-400 mt-1">Audit stream of account modifications</p>
          </div>

          <div className="flex-grow space-y-4">
            {data?.recentActivities && data.recentActivities.length > 0 ? (
              data.recentActivities.map((act, idx) => (
                <div key={idx} className="flex gap-3 text-xs md:text-sm font-medium">
                  <div className="relative flex flex-col items-center shrink-0">
                    <span className="h-2 w-2 rounded-full bg-indigo-500 ring-4 ring-indigo-500/10 mt-1.5" />
                    {idx !== data.recentActivities.length - 1 && (
                      <span className="w-[1px] flex-grow bg-slate-800 my-1" />
                    )}
                  </div>
                  <div className="pb-2">
                    <p className="text-slate-300 leading-relaxed font-semibold">{act}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center gap-2 text-slate-500 py-12">
                <HelpCircle size={32} />
                <p className="text-sm font-semibold">Account feed is currently empty.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QUICK ADD EXPENSE MODAL */}
      <Modal isOpen={expenseModalOpen} onClose={() => { setExpenseModalOpen(false); setFormError(''); }} title="Quick Add Expense">
        <form onSubmit={handleExpenseSubmit} className="space-y-4">
          {formError && (
            <div className="flex items-start gap-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/15 p-4 text-xs font-semibold text-rose-400">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {/* Amount field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Expense Amount ($)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <DollarSign size={16} />
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="25.50"
                className="glass-input w-full rounded-2xl py-3 pl-10 pr-4 text-sm"
                required
              />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Expense Title</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Tag size={16} />
              </span>
              <input
                type="text"
                value={expenseForm.title}
                onChange={(e) => setExpenseForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Grocery shopping"
                className="glass-input w-full rounded-2xl py-3 pl-10 pr-4 text-sm"
                required
              />
            </div>
          </div>

          {/* Date & Category side by side */}
          <div className="grid gap-4 grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Date</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Calendar size={16} />
                </span>
                <input
                  type="date"
                  value={expenseForm.date}
                  onChange={(e) => setExpenseForm(prev => ({ ...prev, date: e.target.value }))}
                  className="glass-input w-full rounded-2xl py-3 pl-10 pr-4 text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Category</label>
              <select
                value={expenseForm.categoryId}
                onChange={(e) => setExpenseForm(prev => ({ ...prev, categoryId: e.target.value }))}
                className="glass-input w-full rounded-2xl py-3 px-4 text-sm focus:ring-indigo-500 focus:border-indigo-500 h-[46px]"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Description (Optional)</label>
            <div className="relative font-semibold">
              <span className="absolute left-3 top-3.5 text-slate-400">
                <FileText size={16} />
              </span>
              <textarea
                value={expenseForm.description}
                onChange={(e) => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Weekly shopping list at Costco"
                className="glass-input w-full rounded-2xl py-3 pl-10 pr-4 text-sm min-h-[80px]"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 mt-6">
            <button
              type="button"
              onClick={() => { setExpenseModalOpen(false); setFormError(''); }}
              className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/60 py-3.5 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formSubmitting}
              className="flex-1 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3.5 text-sm font-bold text-white hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 transition duration-200 flex items-center justify-center gap-1.5"
            >
              {formSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Record Expense'}
            </button>
          </div>
        </form>
      </Modal>

      {/* QUICK ADD INCOME MODAL */}
      <Modal isOpen={incomeModalOpen} onClose={() => { setIncomeModalOpen(false); setFormError(''); }} title="Quick Add Income">
        <form onSubmit={handleIncomeSubmit} className="space-y-4">
          {formError && (
            <div className="flex items-start gap-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/15 p-4 text-xs font-semibold text-rose-400">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {/* Amount field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Income Amount ($)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <DollarSign size={16} />
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={incomeForm.amount}
                onChange={(e) => setIncomeForm(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="2500.00"
                className="glass-input w-full rounded-2xl py-3 pl-10 pr-4 text-sm"
                required
              />
            </div>
          </div>

          {/* Source */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Income Source / Payer</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Tag size={16} />
              </span>
              <input
                type="text"
                value={incomeForm.source}
                onChange={(e) => setIncomeForm(prev => ({ ...prev, source: e.target.value }))}
                placeholder="Monthly Salary / Freelance project"
                className="glass-input w-full rounded-2xl py-3 pl-10 pr-4 text-sm"
                required
              />
            </div>
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Date Received</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Calendar size={16} />
              </span>
              <input
                type="date"
                value={incomeForm.date}
                onChange={(e) => setIncomeForm(prev => ({ ...prev, date: e.target.value }))}
                className="glass-input w-full rounded-2xl py-3 pl-10 pr-4 text-sm"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Description (Optional)</label>
            <div className="relative font-semibold">
              <span className="absolute left-3 top-3.5 text-slate-400">
                <FileText size={16} />
              </span>
              <textarea
                value={incomeForm.description}
                onChange={(e) => setIncomeForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Salary payment for May freelance tasks"
                className="glass-input w-full rounded-2xl py-3 pl-10 pr-4 text-sm min-h-[80px]"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 mt-6">
            <button
              type="button"
              onClick={() => { setIncomeModalOpen(false); setFormError(''); }}
              className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/60 py-3.5 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formSubmitting}
              className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-bold text-white hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 transition duration-200 flex items-center justify-center gap-1.5"
            >
              {formSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Record Income'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
