import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!email || !password) {
      setFormError('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/');
    } else {
      setFormError(result.error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      {/* Central Glassmorphic Form Card */}
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
        <div className="absolute -right-12 -bottom-12 h-32 w-32 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex flex-col items-center gap-3 text-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20">
            <Wallet size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Welcome Back</h2>
            <p className="text-sm text-slate-400 mt-1 font-medium">Access your premium fintech dashboard</p>
          </div>
        </div>

        {/* Error notification */}
        {formError && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl bg-rose-500/10 border border-rose-500/15 p-4 text-xs font-semibold text-rose-400">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail size={18} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="glass-input w-full rounded-2xl py-3 pl-11 pr-4 text-sm"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="glass-input w-full rounded-2xl py-3 pl-11 pr-4 text-sm"
                required
              />
            </div>
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/25 disabled:opacity-50 disabled:pointer-events-none mt-6"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer info link */}
        <p className="mt-8 text-center text-sm text-slate-400 font-medium">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-400 font-bold hover:text-indigo-300 transition duration-200">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
