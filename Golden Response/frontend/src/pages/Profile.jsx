import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar,
  DollarSign,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [successMsg, setSuccessMsg] = useState('');

  // Local state for profile update (demo/decorative, but premium UI form!)
  const [name, setName] = useState(user?.name || 'Guest User');
  const [email, setEmail] = useState(user?.email || 'guest@example.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setSuccessMsg('Profile settings successfully simulated!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const getMemberSince = () => {
    // Generate static/clean relative date
    return 'May 2026';
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-extrabold text-white md:text-2xl tracking-tight">Account Profile</h1>
        <p className="text-xs text-slate-400 mt-1">Manage credentials, audit security sessions, and view stats</p>
      </div>

      {successMsg && (
        <div className="flex items-start gap-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/15 p-4 text-xs font-semibold text-emerald-400 animate-in fade-in duration-200">
          <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Double Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: Avatar Card */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col items-center text-center gap-4 relative overflow-hidden h-[300px]">
          {/* Radial blur spot */}
          <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-indigo-500/5 blur-xl pointer-events-none" />

          {/* Large Avatar */}
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-xl shadow-indigo-500/20 font-black text-3xl">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>

          <div>
            <h3 className="text-base font-bold text-white tracking-tight">{user?.name || 'Guest User'}</h3>
            <p className="text-xs text-slate-400 mt-1 font-semibold">{user?.email || 'guest@example.com'}</p>
          </div>

          <div className="w-full border-t border-slate-800/80 pt-4 mt-2 space-y-2 text-xs font-semibold text-slate-400">
            <div className="flex items-center justify-between">
              <span>Account Status</span>
              <span className="text-emerald-400">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Member Since</span>
              <span>{getMemberSince()}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Settings Forms */}
        <div className="glass-panel rounded-3xl p-6 md:col-span-2 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Security Configurations</h3>
            <p className="text-xs text-slate-400 mt-1">Simulate updates for your administrative profile metadata</p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            {/* Form Name & Email side-by-side */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="glass-input w-full rounded-2xl py-3 pl-10 pr-4 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input w-full rounded-2xl py-3 pl-10 pr-4 text-sm opacity-60 cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Password simulation */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Current Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Shield size={16} />
                  </span>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="glass-input w-full rounded-2xl py-3 pl-10 pr-4 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">New Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Shield size={16} />
                  </span>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="glass-input w-full rounded-2xl py-3 pl-10 pr-4 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Save Buttons */}
            <div className="flex justify-end pt-4 border-t border-slate-800/60 mt-6">
              <button
                type="submit"
                className="rounded-2xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/15 hover:bg-indigo-500 hover:shadow-indigo-500/20 transition duration-200"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
