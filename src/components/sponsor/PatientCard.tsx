import React from 'react';
import { Patient } from '../../types';
import { AlertCircle, CheckCircle, Clock, ChevronRight, Phone, ShieldAlert, Sparkles } from 'lucide-react';

interface PatientCardProps {
  patient: Patient;
  isSelected: boolean;
  onSelect: () => void;
  onCall: (e: React.MouseEvent) => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient, isSelected, onSelect, onCall }) => {
  const percentage = Math.min(100, Math.round((patient.currentDay / patient.targetDays) * 100));
  const completedRoutines = patient.dailyRoutines.filter((r) => r.completed).length;
  const totalRoutines = patient.dailyRoutines.length;

  const getStatusBadge = () => {
    switch (patient.status) {
      case 'sos':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950 border border-rose-700/80 text-rose-300 text-xs font-bold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>ALERTE SOS</span>
          </span>
        );
      case 'inactive':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-800/80 text-amber-300 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Inactif 24h</span>
          </span>
        );
      case 'active':
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 text-xs font-medium">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>En bonne voie</span>
          </span>
        );
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
        patient.status === 'sos'
          ? 'bg-rose-950/30 border-rose-600/80 shadow-lg shadow-rose-950/30 ring-1 ring-rose-500/30'
          : isSelected
          ? 'bg-slate-900 border-teal-500 shadow-md ring-1 ring-teal-500/20'
          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
              patient.status === 'sos'
                ? 'bg-rose-900 text-white border border-rose-500'
                : 'bg-slate-800 text-teal-300 border border-slate-700'
            }`}
          >
            {patient.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">{patient.name}</h4>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                {patient.code}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Dernière activité : {patient.lastActive}</p>
          </div>
        </div>

        {getStatusBadge()}
      </div>

      {/* SOS Alert details if active */}
      {patient.status === 'sos' && patient.sosAlert && (
        <div className="mb-3 p-2.5 rounded-xl bg-rose-950/80 border border-rose-800/80 flex items-start gap-2 text-xs text-rose-200">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong>Besoin d'aide immédiat :</strong> {patient.sosAlert.reason}
          </div>
        </div>
      )}

      {/* Progress & Routines row */}
      <div className="space-y-2 mt-3 pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Jour <strong>{patient.currentDay}</strong> sur {patient.targetDays}
          </span>
          <span className="font-semibold text-teal-400">{percentage}%</span>
        </div>

        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-500 ${
              patient.status === 'sos'
                ? 'bg-rose-500'
                : 'bg-gradient-to-r from-teal-500 to-emerald-400'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>
            Routines : <strong>{completedRoutines}/{totalRoutines}</strong> validées
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <span>Rendez-vous :</span>
            <strong className="text-slate-200">{patient.appointments.length}</strong>
          </span>
        </div>
      </div>

      {/* Action footer */}
      <div className="mt-3.5 flex items-center justify-between pt-2">
        <button
          onClick={onCall}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-teal-400" />
          <span>{patient.phone}</span>
        </button>

        <span className="flex items-center gap-1 text-xs font-semibold text-teal-400 hover:text-teal-300">
          <span>Consulter</span>
          <ChevronRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
};
