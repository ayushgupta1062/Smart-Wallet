import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import CategoryIcon from '../components/CategoryIcon';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Tag, 
  Palette, 
  Smile, 
  AlertCircle,
  HelpCircle,
  Loader2,
  Lock,
  Globe
} from 'lucide-react';

const COLORS = [
  { name: 'Amber', hex: '#F59E0B' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Violet', hex: '#8B5CF6' },
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Sky', hex: '#0EA5E9' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Rose', hex: '#F43F5E' },
  { name: 'Teal', hex: '#14B8A6' },
];

const ICONS = [
  'Utensils', 'Plane', 'ShoppingBag', 'CreditCard', 'Film', 'Activity', 
  'Home', 'Heart', 'Smile', 'Car', 'Gift', 'Briefcase', 'BookOpen', 'Globe', 
  'Settings', 'Wifi', 'Coffee', 'Scissors'
];

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  // Forms
  const [form, setForm] = useState({
    name: '', color: COLORS[0].hex, icon: ICONS[0]
  });
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve categories list.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.name || !form.color || !form.icon) {
      setFormError('Please enter all mandatory fields.');
      return;
    }

    setFormSubmitting(true);
    try {
      await api.post('/categories', form);
      setIsAddOpen(false);
      resetForm();
      fetchCategories();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create category.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.name || !form.color || !form.icon) {
      setFormError('Please enter all mandatory fields.');
      return;
    }

    setFormSubmitting(true);
    try {
      await api.put(`/categories/${activeCategory.id}`, form);
      setIsEditOpen(false);
      resetForm();
      fetchCategories();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to edit category.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/categories/${activeCategory.id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (cat) => {
    setActiveCategory(cat);
    setForm({
      name: cat.name,
      color: cat.color,
      icon: cat.icon
    });
    setIsEditOpen(true);
  };

  const openDeleteModal = (cat) => {
    setActiveCategory(cat);
    setIsDeleteOpen(true);
  };

  const resetForm = () => {
    setForm({
      name: '',
      color: COLORS[0].hex,
      icon: ICONS[0]
    });
    setFormError('');
    setActiveCategory(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white md:text-2xl tracking-tight">Category Settings</h1>
          <p className="text-xs text-slate-400 mt-1">Configure system defaults and build custom category filters</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsAddOpen(true); }}
          className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/15 hover:bg-indigo-500 hover:shadow-indigo-500/20 transition duration-200"
        >
          <Plus size={16} />
          Create Custom Category
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/15 p-4 text-xs font-semibold text-rose-400 max-w-lg mx-auto">
          <AlertCircle size={15} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={32} className="animate-spin text-indigo-500" />
        </div>
      ) : (
        /* Categories Grid */
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="glass-panel rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[150px] border-l-4"
              style={{ borderLeftColor: cat.color }}
            >
              {/* Colored blur spot */}
              <div 
                className="absolute -right-8 -top-8 w-24 h-24 rounded-full opacity-5 blur-xl pointer-events-none"
                style={{ backgroundColor: cat.color }}
              />

              <div className="flex justify-between items-start z-10">
                {/* Category Identity */}
                <div className="flex items-center gap-3">
                  <div 
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border"
                    style={{ 
                      color: cat.color, 
                      backgroundColor: `${cat.color}15`,
                      borderColor: `${cat.color}25`
                    }}
                  >
                    <CategoryIcon name={cat.icon} size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm tracking-tight">{cat.name}</h3>
                    {cat.custom ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-indigo-400 mt-0.5">
                        <Lock size={10} className="shrink-0" />
                        Custom
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-500 mt-0.5">
                        <Globe size={10} className="shrink-0" />
                        Preset
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action row at bottom */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-800/60 pt-3 z-10">
                <span className="text-[10px] font-bold text-slate-500" style={{ color: cat.color }}>
                  {cat.color}
                </span>

                {cat.custom ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
                      title="Edit Category"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(cat)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-rose-400"
                      title="Delete Category"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] font-extrabold text-slate-500 select-none">System Locked</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE CATEGORY MODAL */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Create Custom Category">
        <form onSubmit={handleCreate} className="space-y-5">
          {formError && (
            <div className="flex items-start gap-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/15 p-4 text-xs font-semibold text-rose-400">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Category Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Tag size={16} />
              </span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Subscriptions / Coffee"
                className="glass-input w-full rounded-2xl py-3 pl-10 pr-4 text-sm"
                required
              />
            </div>
          </div>

          {/* Color Selection Bubble Grid */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Theme Color</label>
            <div className="flex flex-wrap gap-2.5 bg-slate-900/40 rounded-2xl p-4 border border-slate-800/40 justify-center">
              {COLORS.map((col) => (
                <button
                  type="button"
                  key={col.hex}
                  onClick={() => setForm(prev => ({ ...prev, color: col.hex }))}
                  className={`h-7 w-7 rounded-full transition duration-150 transform hover:scale-110 relative ${
                    form.color === col.hex ? 'ring-4 ring-indigo-500/30 border border-white' : ''
                  }`}
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                />
              ))}
            </div>
          </div>

          {/* Icon Selector Grid */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Select Lucide Icon</label>
            <div className="grid grid-cols-6 gap-2 bg-slate-900/40 rounded-2xl p-4 border border-slate-800/40 max-h-[160px] overflow-y-auto glass-scroll justify-items-center">
              {ICONS.map((ic) => (
                <button
                  type="button"
                  key={ic}
                  onClick={() => setForm(prev => ({ ...prev, icon: ic }))}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border text-slate-400 hover:text-white transition duration-150 ${
                    form.icon === ic 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/10' 
                      : 'bg-slate-900 border-slate-800'
                  }`}
                  title={ic}
                >
                  <CategoryIcon name={ic} size={18} />
                </button>
              ))}
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
              {formSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT CATEGORY MODAL */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Category Settings">
        <form onSubmit={handleUpdate} className="space-y-5">
          {formError && (
            <div className="flex items-start gap-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/15 p-4 text-xs font-semibold text-rose-400">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Category Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Tag size={16} />
              </span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Subscriptions / Coffee"
                className="glass-input w-full rounded-2xl py-3 pl-10 pr-4 text-sm"
                required
              />
            </div>
          </div>

          {/* Color Selection Bubble Grid */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Theme Color</label>
            <div className="flex flex-wrap gap-2.5 bg-slate-900/40 rounded-2xl p-4 border border-slate-800/40 justify-center">
              {COLORS.map((col) => (
                <button
                  type="button"
                  key={col.hex}
                  onClick={() => setForm(prev => ({ ...prev, color: col.hex }))}
                  className={`h-7 w-7 rounded-full transition duration-150 transform hover:scale-110 relative ${
                    form.color === col.hex ? 'ring-4 ring-indigo-500/30 border border-white' : ''
                  }`}
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                />
              ))}
            </div>
          </div>

          {/* Icon Selector Grid */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Select Lucide Icon</label>
            <div className="grid grid-cols-6 gap-2 bg-slate-900/40 rounded-2xl p-4 border border-slate-800/40 max-h-[160px] overflow-y-auto glass-scroll justify-items-center">
              {ICONS.map((ic) => (
                <button
                  type="button"
                  key={ic}
                  onClick={() => setForm(prev => ({ ...prev, icon: ic }))}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border text-slate-400 hover:text-white transition duration-150 ${
                    form.icon === ic 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/10' 
                      : 'bg-slate-900 border-slate-800'
                  }`}
                  title={ic}
                >
                  <CategoryIcon name={ic} size={18} />
                </button>
              ))}
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
        title="Delete Custom Category"
        message={`Are you sure you want to permanently delete the custom category "${activeCategory?.name}"? Warning: deleting a category will affect transaction reports associated with it.`}
        confirmText="Yes, Delete Category"
        type="danger"
      />
    </div>
  );
};

export default Categories;
