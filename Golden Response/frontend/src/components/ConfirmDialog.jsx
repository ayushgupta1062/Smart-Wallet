import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', type = 'danger' }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center gap-4">
        {/* Warning Icon Badge */}
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
          type === 'danger' 
            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/15' 
            : 'bg-amber-500/10 text-amber-400 border border-amber-500/15'
        }`}>
          <AlertTriangle size={24} />
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <p className="text-sm text-slate-300 font-medium leading-relaxed">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full mt-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold text-white transition duration-200 ${
              type === 'danger' 
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-lg shadow-rose-600/10' 
                : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-lg shadow-amber-600/10'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
