import React, { useEffect } from 'react';
import { X, Sparkles, Layers } from 'lucide-react';

export default function SlideOverDrawer({ isOpen, onClose, title, badge, children }) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-fadeIn" 
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-3xl h-full bg-[#090d16]/95 border-l border-slate-800 shadow-2xl flex flex-col z-10 animate-slideLeft overflow-hidden">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80 bg-[#070a12]">
          <div className="flex items-center space-x-3">
            {badge && (
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                {badge}
              </span>
            )}
            <h3 className="text-base font-bold text-white font-mono">
              {title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-all border border-slate-700/50"
            title="Close Drawer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {children}
        </div>

      </div>
    </div>
  );
}
