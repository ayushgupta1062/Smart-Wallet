import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, Bell, Calendar } from 'lucide-react';

const Navbar = ({ mobileOpen, setMobileOpen }) => {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Overview Dashboard';
      case '/expenses':
        return 'Expense Management';
      case '/incomes':
        return 'Income Management';
      case '/categories':
        return 'Category Settings';
      case '/analytics':
        return 'Financial Analytics';
      case '/profile':
        return 'My Profile';
      default:
        return 'Smart Wallet';
    }
  };

  const getFormattedDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950/75 px-4 backdrop-blur-md md:px-8">
      {/* Left items: Mobile toggle & Page Title */}
      <div className="flex items-center gap-4">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Menu size={20} />
        </button>
        <div>
          <h2 className="text-base font-bold text-white md:text-xl tracking-tight leading-none">
            {getPageTitle()}
          </h2>
        </div>
      </div>

      {/* Right items: Date, Notification Bell, User name */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* Date Display */}
        <div className="hidden items-center gap-2 text-xs font-semibold text-slate-400 sm:flex md:text-sm">
          <Calendar size={15} className="text-indigo-400" />
          <span>{getFormattedDate()}</span>
        </div>

        {/* Notifications Icon (Decorative, looks very premium) */}
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white">
          <Bell size={18} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-slate-950"></span>
        </button>

        {/* User Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden flex-col items-end leading-none md:flex">
            <span className="text-xs font-semibold text-indigo-400">Welcome,</span>
            <span className="text-sm font-bold text-white mt-0.5">{user?.name || 'Guest'}</span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition duration-200 cursor-pointer">
            <span className="text-sm font-extrabold text-indigo-400">
              {user?.name?.charAt(0).toUpperCase() || 'G'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
