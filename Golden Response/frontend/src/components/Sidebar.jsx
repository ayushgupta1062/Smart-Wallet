import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  CreditCard, 
  TrendingUp, 
  Tag, 
  BarChart3, 
  User, 
  LogOut, 
  X,
  Wallet
} from 'lucide-react';

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Expenses', path: '/expenses', icon: CreditCard },
    { name: 'Incomes', path: '/incomes', icon: TrendingUp },
    { name: 'Categories', path: '/categories', icon: Tag },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Sidebar Backdrop overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-slate-900/80 p-5 transition-transform duration-300 lg:static lg:translate-x-0 glass-panel
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20">
              <Wallet size={20} />
            </div>
            <div>
              <h1 className="font-bold text-white tracking-wide text-lg">Smart Wallet</h1>
              <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase">Fintech SaaS</span>
            </div>
          </div>
          {/* Close button on mobile */}
          <button 
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X size={16} />
          </button>
        </div>

        {/* User Card */}
        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-slate-800/40 p-3 border border-slate-800/40">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-400 font-semibold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="truncate text-sm font-semibold text-white">{user?.name || 'Guest User'}</p>
            <p className="truncate text-xs text-slate-400">{user?.email || 'guest@example.com'}</p>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="mt-8 flex-grow space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/20 text-white border-l-4 border-indigo-500 shadow-md shadow-indigo-600/5' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }
                `}
              >
                <Icon size={18} className="shrink-0" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Footer Section */}
        <div className="mt-auto pt-4 border-t border-slate-800/60">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium text-rose-400 transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-300"
          >
            <LogOut size={18} className="shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
