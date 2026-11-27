import React, { useEffect } from 'react';
import { X, Activity } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
      {/* Darkened Blur Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity animate-fadeIn" 
      />

      {/* Full-Width Centered 2-Column Virtual Lab Frame */}
      <div className="relative w-[95vw] max-w-7xl h-[88vh] bg-[#070b14]/98 border border-slate-800 rounded-2xl shadow-2xl flex flex-col z-10 overflow-hidden animate-fadeIn">
        
        {/* Lab Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-slate-800/80 bg-[#060910] shrink-0">
          <div className="flex items-center space-x-3 truncate">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
            {badge && (
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-cyan-950 text-cyan-400 border border-cyan-800/60 shrink-0">
                {badge}
              </span>
            )}
            <h2 className="text-sm sm:text-base font-bold text-white font-mono tracking-wide truncate">
              {title}
            </h2>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <span className="hidden sm:inline text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              ESC TO EXIT
            </span>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-all border border-slate-700/50"
              title="Close Virtual Lab (Esc)"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Virtual Lab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7">
          {children}
        </div>

      </div>
    </div>
  );
}
