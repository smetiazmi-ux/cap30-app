import React from 'react';
import { useRecovery } from '../context/RecoveryContext';
import { Shield, User, Smartphone, Monitor, AlertTriangle, RotateCcw } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    patients,
    selectedPatientId,
    setSelectedPatientId,
    isMobileView,
    setIsMobileView,
    resetToDefaults,
  } = useRecovery();

  const sosPatientsCount = patients.filter((p) => p.status === 'sos').length;

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-teal-900/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-slate-100 text-lg">Cap 30</span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                  Rétablissement
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal">Suivi confidentiel & accompagnement humain</p>
            </div>
          </div>

          {/* Quick indicator for mobile screens */}
          {sosPatientsCount > 0 && activeRole === 'patient' && (
            <button
              onClick={() => setActiveRole('sponsor')}
              className="sm:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950 text-rose-300 border border-rose-800/80 text-xs animate-pulse"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>{sosPatientsCount} SOS</span>
            </button>
          )}
        </div>

        {/* Center: Role Switcher (Segmented Control) */}
        <div className="flex items-center gap-2 bg-slate-950/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveRole('patient')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeRole === 'patient'
                ? 'bg-teal-700 text-white shadow-md shadow-teal-900/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Vue Patient</span>
          </button>

          <button
            onClick={() => setActiveRole('sponsor')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all relative ${
              activeRole === 'sponsor'
                ? 'bg-slate-800 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Vue Accompagnateur</span>
            {sosPatientsCount > 0 && (
              <span className="flex h-2 w-2 relative ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            )}
          </button>
        </div>

        {/* Right: Controls & Patient Switcher */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* Patient Switcher */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="hidden md:inline">Bénéficiaire:</span>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-teal-500 font-medium cursor-pointer"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (J{p.currentDay}/{p.targetDays}) {p.status === 'sos' ? '⚠️ SOS' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Device Mockup Toggle */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setIsMobileView(true)}
              title="Affichage format Smartphone"
              className={`p-1.5 rounded-md transition-colors ${
                isMobileView ? 'bg-slate-800 text-teal-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsMobileView(false)}
              title="Affichage Plein Écran (Desktop)"
              className={`p-1.5 rounded-md transition-colors ${
                !isMobileView ? 'bg-slate-800 text-teal-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reset button */}
          <button
            onClick={() => {
              if (window.confirm('Voulez-vous réinitialiser les données de démonstration ?')) {
                resetToDefaults();
              }
            }}
            title="Réinitialiser les données"
            className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
