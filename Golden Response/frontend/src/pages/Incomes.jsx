import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { 
  Search, 
  Calendar, 
  Plus, 
  Edit2, 
  Trash2, 
  DollarSign, 
  Tag, 
  FileText, 
  AlertCircle,
  HelpCircle,
  Loader2,
  XCircle,
  TrendingUp
} from 'lucide-react';

const Incomes = () => {
  // Datasets state
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    startDate: '',
    endDate: ''
  });

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // Active income in focus
  const [activeIncome, setActiveIncome] = useState(null);

  // Forms state
  const [form, setForm] = useState({
    source: '', amount: '', date: new Date().toISOString().split('T')[0], description: ''
  });
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Fetch incomes with active filters
  const fetchIncomes = async () => {
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const res = await api.get('/incomes', { params });
      setIncomes(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve income records. Please retry.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, [filters]);

  // Create Income submit
  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.source || !form.amount || !form.date) {
      setFormError('Please enter all mandatory fields.');
      return;
    }

    setFormSubmitting(true);
    try {
      await api.post('/incomes', form);
      setIsAddOpen(false);
      resetForm();
      fetchIncomes();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to record income record.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Update Income submit
  const handleUpdate = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.source || !form.amount || !form.date) {
      setFormError('Please enter all mandatory fields.');
      return;
    }

    setFormSubmitting(true);
    try {
      await api.put(`/incomes/${activeIncome.id}`, form);
      setIsEditOpen(false);
      resetForm();
      fetchIncomes();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to edit income record.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete Income confirm
  const handleDelete = async () => {
    try {
      await api.delete(`/incomes/${activeIncome.id}`);
      fetchIncomes();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (income) => {
    setActiveIncome(income);
    setForm({
      source: income.source,
      amount: income.amount,
      date: income.date,
      description: income.description || ''
    });
    setIsEditOpen(true);
  };

  const openDeleteModal = (income) => {
    setActiveIncome(income);
    setIsDeleteOpen(true);
  };

  const resetForm = () => {
    setForm({
      source: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
    setFormError('');
    setActiveIncome(null);
  };

  const resetFilters = () => {
    setFilters({ search: '', startDate: '', endDate: '' });
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white md:text-2xl tracking-tight">Incomes Ledger</h1>
          <p className="text-xs text-slate-400 mt-1">Audit, edit, and filter your incoming salary or Freelance logs</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsAddOpen(true); }}
          className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/15 hover:bg-indigo-500 hover:shadow-indigo-500/20 transition duration-200"
        >
          <Plus size={16} />
          Record New Income
        </button>
      </div>

      {/* Filters Section Panel */}
      <div className="glass-panel rounded-3xl p-5 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-end">
        {/* Search */}
        <div className="space-y-1.5 lg:col-span-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Search Sources</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search size={15} />
            </span>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Filter by source (e.g. Salary, Client)"
              className="glass-input w-full rounded-xl py-2 pl-9 pr-4 text-xs"
            />
          </div>
        </div>

        {/* Start Date */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Start Date</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
            className="glass-input w-full rounded-xl py-2 px-3 text-xs h-[34px]"
          />
        </div>

        {/* End Date */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">End Date</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
            className="glass-input w-full rounded-xl py-2 px-3 text-xs h-[34px]"
          />
        </div>

        {/* Reset Filter Button */}
        {(filters.search || filters.startDate || filters.endDate) && (
          <button
            onClick={resetFilters}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 py-2 px-4 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition duration-200 h-[34px] sm:col-span-2 lg:col-span-4"
          >
            <XCircle size={14} />
            Reset Filters
          </button>
        )}
      </div>

      {/* Main Ledger Contents */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={32} className="animate-spin text-indigo-500" />
        </div>
      ) : incomes.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center flex flex-col items-center gap-3 text-slate-500 max-w-lg mx-auto">
          <HelpCircle size={40} className="text-slate-600" />
          <h3 className="text-base font-bold text-white tracking-tight">No Incomes Found</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We couldn't locate any income logs matching your search filters. Record a new income to get started.
          </p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE VIEW */}
          <div className="hidden lg:block glass-panel rounded-3xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900/30">
                  <th className="py-4 px-6">Income Source</th>
                  <th className="py-4 px-6">Date Received</th>
                  <th className="py-4 px-6">Description</th>
                  <th className="py-4 px-6 text-right">Amount</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {incomes.map((income) => (
                  <tr key={income.id} className="hover:bg-slate-900/10 transition duration-150">
                    <td className="py-4 px-6 font-semibold text-white">
                      <span className="flex items-center gap-2">
                        <span className="p-1 rounded bg-emerald-500/10 border border-emerald-500/15 text-emerald-400">
                          <TrendingUp size={12} />
                        </span>
                        {income.source}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-400 font-semibold">{income.date}</td>
                    <td className="py-4 px-6 text-xs text-slate-400 max-w-[200px] truncate" title={income.description}>
                      {income.description || <span className="text-slate-600 italic">No notes</span>}
                    </td>
                    <td className="py-4 px-6 text-right font-black text-emerald-400">{formatCurrency(income.amount)}</td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center items-center gap-2">
                        <button 
                          onClick={() => openEditModal(income)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition duration-150"
                          title="Edit record"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(income)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition duration-150"
                          title="Delete record"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS LIST VIEW */}
          <div className="grid gap-4 lg:hidden">
            {incomes.map((income) => (
              <div 
                key={income.id} 
                className="glass-panel rounded-2xl p-4 relative overflow-hidden flex flex-col justify-between gap-3 border-l-4 border-emerald-500"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white text-sm">{income.source}</h4>
                    <span className="text-[10px] text-slate-500 font-bold block mt-0.5">{income.date}</span>
                  </div>
                  <p className="font-black text-emerald-400 text-sm">{formatCurrency(income.amount)}</p>
                </div>

                {income.description && (
                  <p className="text-xs text-slate-400 bg-slate-900/40 rounded-xl p-2 border border-slate-800/40 leading-relaxed font-semibold">
                    {income.description}
                  </p>
                )}

                <div className="flex items-center justify-end border-t border-slate-800/60 pt-3 mt-1 gap-2">
                  <button
                    onClick={() => openEditModal(income)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(income)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-rose-400"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* RECORD NEW INCOME MODAL */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Record New Income">
        <form onSubmit={handleCreate} className="space-y-4">
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
                value={form.amount}
                onChange={(e) => setForm(prev => ({ ...prev, amount: e.target.value }))}
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
                value={form.source}
                onChange={(e) => setForm(prev => ({ ...prev, source: e.target.value }))}
                placeholder="Salary payment / Freelance client"
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
                value={form.date}
                onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
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
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Notes about income"
                className="glass-input w-full rounded-2xl py-3 pl-10 pr-4 text-sm min-h-[80px]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
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

      {/* EDIT INCOME MODAL */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Income Record">
        <form onSubmit={handleUpdate} className="space-y-4">
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
                value={form.amount}
                onChange={(e) => setForm(prev => ({ ...prev, amount: e.target.value }))}
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
                value={form.source}
                onChange={(e) => setForm(prev => ({ ...prev, source: e.target.value }))}
                placeholder="Source"
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
                value={form.date}
                onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
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
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Notes about income"
                className="glass-input w-full rounded-2xl py-3 pl-10 pr-4 text-sm min-h-[80px]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/60 py-3.5 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formSubmitting}
              className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-bold text-white hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 transition duration-200 flex items-center justify-center gap-1.5"
            >
              {formSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Income Record"
        message={`Are you sure you want to permanently delete the income record "${activeIncome?.source}" of ${activeIncome ? formatCurrency(activeIncome.amount) : ''}? This action is irreversible.`}
        confirmText="Yes, Delete Income"
        type="danger"
      />
    </div>
  );
};

export default Incomes;
