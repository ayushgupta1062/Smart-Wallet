import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      {/* 404 Panel */}
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center flex flex-col items-center gap-5">
        {/* Glow decoration */}
        <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-rose-500/10 blur-2xl pointer-events-none" />
        <div className="absolute -right-12 -bottom-12 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

        {/* Warning Icon Badge */}
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/15">
          <AlertCircle size={28} />
        </div>

        {/* Big visual number */}
        <div>
          <h1 className="text-7xl font-black tracking-tighter bg-gradient-to-tr from-rose-400 to-indigo-400 bg-clip-text text-transparent">
            404
          </h1>
          <h3 className="text-lg font-bold text-white tracking-tight mt-3">Route Not Found</h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto mt-2 font-medium">
            The page you are looking for has been moved, deleted, or does not exist. Let's return back to your secure dashboard.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => navigate('/')}
          className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/10 transition-all duration-300 hover:from-indigo-500 hover:to-purple-500 flex items-center justify-center gap-2 mt-4"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;
