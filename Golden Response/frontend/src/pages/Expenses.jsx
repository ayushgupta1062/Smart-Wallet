import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import CategoryIcon from '../components/CategoryIcon';
import { 
  Search, 
  Filter, 
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
  ChevronRight
} from 'lucide-react';

const Expenses = () => {
  // Datasets state
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    startDate: '',
    endDate: ''
  });

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // Active transaction in focus for Edit/Delete
  const [activeExpense, setActiveExpense] = useState(null);

  // Forms state
  const [form, setForm] = useState({
    title: '', amount: '', date: new Date().toISOString().split('T')[0], categoryId: '', description: ''
  });
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Fetch expenses with active filter state
  const fetchExpenses = async () => {
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const res = await api.get('/expenses', { params });
      setExpenses(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Could not fetch expense items. Please refresh.');
      setLoading(false);
    }
  };

  // Fetch categories list
  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
      if (res.data.length > 0) {
        setForm(prev => ({ ...prev, categoryId: res.data[0].id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [filters]);

  // Create Expense submit
  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.title || !form.amount || !form.categoryId || !form.date) {
      setFormError('Please enter all mandatory fields.');
      return;
    }

    setFormSubmitting(true);
    try {
      await api.post('/expenses', form);
      setIsAddOpen(false);
      resetForm();
      fetchExpenses();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to record expense.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Update Expense submit
  const handleUpdate = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.title || !form.amount || !form.categoryId || !form.date) {
      setFormError('Please enter all mandatory fields.');
      return;
    }

    setFormSubmitting(true);
    try {
      await api.put(`/expenses/${activeExpense.id}`, form);
      setIsEditOpen(false);
      resetForm();
      fetchExpenses();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to edit expense.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete Expense confirm
  const handleDelete = async () => {
    try {
      await api.delete(`/expenses/${activeExpense.id}`);
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (expense) => {
    setActiveExpense(expense);
    setForm({
      title: expense.title,
      amount: expense.amount,
      date: expense.date,
      categoryId: expense.category.id,
      description: expense.description || ''
    });
    setIsEditOpen(true);
  };

  const openDeleteModal = (expense) => {
    setActiveExpense(expense);
    setIsDeleteOpen(true);
  };

  const resetForm = () => {
    setForm({
      title: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      categoryId: categories[0]?.id || '',
      description: ''
    });
    setFormError('');
    setActiveExpense(null);
  };

  const resetFilters = () => {
    setFilters({ search: '', categoryId: '', startDate: '', endDate: '' });
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white md:text-2xl tracking-tight">Expenses Ledger</h1>
          <p className="text-xs text-slate-400 mt-1">Audit, edit, and filter your outgoing expenditure logs</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsAddOpen(true); }}
          className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/15 hover:bg-indigo-500 hover:shadow-indigo-500/20 transition duration-200"
        >
          <Plus size={16} />
          Record New Expense
        </button>
      </div>

      {/* Filters Section Panel */}
      <div className="glass-panel rounded-3xl p-5 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 items-end">
        {/* Search */}
        <div className="space-y-1.5 lg:col-span-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Search Keywords</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search size={15} />
            </span>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Filter by title (e.g. coffee)"
              className="glass-input w-full rounded-xl py-2 pl-9 pr-4 text-xs"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
          <select
            value={filters.categoryId}
            onChange={(e) => setFilters(prev => ({ ...prev, categoryId: e.target.value }))}
            className="glass-input w-full rounded-xl py-2 px-3 text-xs h-[34px]"
          >
            <option value="" className="bg-slate-900 text-slate-400">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">
                {cat.name}
              </option>
            ))}
          </select>
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
        {(filters.search || filters.categoryId || filters.startDate || filters.endDate) && (
          <button
            onClick={resetFilters}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 py-2 px-4 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition duration-200 h-[34px] sm:col-span-2 lg:col-span-1"
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
      ) : expenses.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center flex flex-col items-center gap-3 text-slate-500 max-w-lg mx-auto">
          <HelpCircle size={40} className="text-slate-600" />
          <h3 className="text-base font-bold text-white tracking-tight">No Expenses Found</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We couldn't locate any expense logs matching your search filters. Record a new expense to get started.
          </p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE VIEW */}
          <div className="hidden lg:block glass-panel rounded-3xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900/30">
                  <th className="py-4 px-6">Title / Merchant</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Description</th>
                  <th className="py-4 px-6 text-right">Amount</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-900/10 transition duration-150">
                    <td className="py-4 px-6 font-semibold text-white">{expense.title}</td>
                    <td className="py-4 px-6 text-xs text-slate-400 font-semibold">{expense.date}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-white" style={{ backgroundColor: `${expense.category.color}15`, border: `1px solid ${expense.category.color}25`, color: expense.category.color }}>
                        <CategoryIcon name={expense.category.icon} size={12} />
                        {expense.category.name}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-400 max-w-[200px] truncate" title={expense.description}>
                      {expense.description || <span className="text-slate-600 italic">No notes</span>}
                    </td>
                    <td className="py-4 px-6 text-right font-black text-rose-400">{formatCurrency(expense.amount)}</td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center items-center gap-2">
                        <button 
                          onClick={() => openEditModal(expense)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition duration-150"
                          title="Edit transaction"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(expense)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition duration-150"
                          title="Delete transaction"
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
            {expenses.map((expense) => (
              <div 
                key={expense.id} 
                className="glass-panel rounded-2xl p-4 relative overflow-hidden flex flex-col justify-between gap-3 border-l-4"
                style={{ borderLeftColor: expense.category.color }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white text-sm">{expense.title}</h4>
                    <span className="text-[10px] text-slate-500 font-bold block mt-0.5">{expense.date}</span>
                  </div>
                  <p className="font-black text-rose-400 text-sm">{formatCurrency(expense.amount)}</p>
                </div>

                {expense.description && (
                  <p className="text-xs text-slate-400 bg-slate-900/40 rounded-xl p-2 border border-slate-800/40 leading-relaxed font-semibold">
                    {expense.description}
                  </p>
                )}

                <div className="flex items-center justify-between border-t border-slate-800/60 pt-3 mt-1">
                  <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ backgroundColor: `${expense.category.color}15`, border: `1px solid ${expense.category.color}25`, color: expense.category.color }}>
                    <CategoryIcon name={expense.category.icon} size={10} />
                    {expense.category.name}
                  </span>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(expense)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(expense)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-rose-400"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* RECORD NEW EXPENSE MODAL */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Record New Expense">
        <form onSubmit={handleCreate} className="space-y-4">
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
                value={form.amount}
                onChange={(e) => setForm(prev => ({ ...prev, amount: e.target.value }))}
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
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Rent payment / Dinner bill"
                className="glass-input w-full rounded-2xl py-3 pl-10 pr-4 text-sm"
                required
              />
            </div>
          </div>

          {/* Date & Category */}
          <div className="grid gap-4 grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Date</label>
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

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Category</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm(prev => ({ ...prev, categoryId: e.target.value }))}
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
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Details of expense"
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
              className="flex-1 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3.5 text-sm font-bold text-white hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 transition duration-200 flex items-center justify-center gap-1.5"
            >
              {formSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Record Expense'}
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT EXPENSE MODAL */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Expense Transaction">
        <form onSubmit={handleUpdate} className="space-y-4">
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
                value={form.amount}
                onChange={(e) => setForm(prev => ({ ...prev, amount: e.target.value }))}
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
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Title"
                className="glass-input w-full rounded-2xl py-3 pl-10 pr-4 text-sm"
                required
              />
            </div>
          </div>

          {/* Date & Category */}
          <div className="grid gap-4 grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Date</label>
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

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Category</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm(prev => ({ ...prev, categoryId: e.target.value }))}
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
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Details of expense"
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
              className="flex-1 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3.5 text-sm font-bold text-white hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 transition duration-200 flex items-center justify-center gap-1.5"
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
        title="Delete Expense Transaction"
        message={`Are you sure you want to permanently delete the expense "${activeExpense?.title}" of ${activeExpense ? formatCurrency(activeExpense.amount) : ''}? This action is irreversible.`}
        confirmText="Yes, Delete Expense"
        type="danger"
      />
    </div>
  );
};

export default Expenses;
