import React from 'react';
import { useRecovery } from '../context/RecoveryContext';
import { Wifi, Battery, Signal } from 'lucide-react';

export const DeviceFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isMobileView } = useRecovery();

  if (!isMobileView) {
    return (
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    );
  }

  // Mobile Frame Simulator
  return (
    <div className="py-6 px-3 flex justify-center items-start min-h-[calc(100vh-65px)] bg-slate-950">
      <div className="w-full max-w-[420px] bg-slate-950 rounded-[44px] p-3 border-4 border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
        {/* Smartphone top camera island */}
        <div className="w-28 h-5 bg-slate-900 rounded-full mx-auto mb-2 flex items-center justify-center gap-1.5 z-20">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
        </div>

        {/* Mobile status bar */}
        <div className="flex items-center justify-between px-6 py-1 text-[11px] text-slate-400 font-semibold mb-2">
          <span>09:41</span>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Inner Phone Screen Content */}
        <div className="bg-slate-900/95 rounded-[34px] p-4 sm:p-5 max-h-[820px] overflow-y-auto border border-slate-800/80 shadow-inner">
          {children}
        </div>

        {/* Bottom home bar indicator */}
        <div className="w-32 h-1 bg-slate-700 rounded-full mx-auto mt-3 mb-1" />
      </div>
    </div>
  );
};
