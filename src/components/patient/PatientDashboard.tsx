import React, { useState } from 'react';
import { useRecovery } from '../../context/RecoveryContext';
import { ProgressDial } from './ProgressDial';
import { DailyRoutines } from './DailyRoutines';
import { MoodTracker } from './MoodTracker';
import { PatientCalendar } from './PatientCalendar';
import { SosCrisisModal } from './SosCrisisModal';
import { AlertOctagon, Phone, ShieldCheck, HeartPulse, Sparkles } from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const { selectedPatient, triggerSosAlert } = useRecovery();
  const [showSosModal, setShowSosModal] = useState<boolean>(false);

  const isSosActive = selectedPatient.status === 'sos';

  const handleOpenSos = () => {
    if (!isSosActive) {
      triggerSosAlert(selectedPatient.id, 'Craving déclenché par le bénéficiaire');
    }
    setShowSosModal(true);
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Welcome & Reassuring Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Bonjour, {selectedPatient.name.split(' ')[0]}</span>
            <span className="text-xs font-normal text-slate-400">👋</span>
          </h1>
          <p className="text-xs text-slate-400">
            Objectif Cap {selectedPatient.targetDays} · Jour {selectedPatient.currentDay} en cours
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSosActive ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950 border border-rose-800 text-rose-300 text-xs font-semibold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Alerte SOS en cours</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>En bonne voie</span>
            </div>
          )}
        </div>
      </div>

      {/* BIG SOS CRAVING BUTTON */}
      <div>
        {isSosActive ? (
          <div className="bg-gradient-to-r from-rose-950/90 to-red-900/90 border-2 border-rose-500 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-900 border border-rose-600 flex items-center justify-center text-white shrink-0 animate-bounce">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Alerte Craving / SOS Active</h3>
                <p className="text-xs text-rose-200">
                  Ton tuteur a été alerté. Respire calmement et suis l'exercice guidé.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowSosModal(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-rose-950 font-bold text-xs hover:bg-rose-100 shadow-lg transition-all"
            >
              Ouvrir l'Espace SOS & Respiration
            </button>
          </div>
        ) : (
          <button
            onClick={handleOpenSos}
            className="w-full group bg-gradient-to-r from-rose-950/60 via-slate-900 to-rose-950/60 hover:from-rose-900/80 hover:to-rose-900/80 border border-rose-800/60 hover:border-rose-500/80 rounded-2xl p-4 sm:p-5 transition-all shadow-lg flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-rose-950 border border-rose-700/60 flex items-center justify-center text-rose-400 group-hover:text-rose-200 group-hover:scale-105 transition-all shrink-0">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-rose-200 group-hover:text-white">
                    Besoin d'aide immédiat ? (SOS Craving)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-900/80 text-rose-300 border border-rose-700/60 uppercase">
                    1 clic
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Respiration guidée instantanée, gestes d'urgence et contact tuteur
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-900/50 text-rose-300 text-xs font-semibold group-hover:bg-rose-800/80 transition-colors shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Désamorcer</span>
            </div>
          </button>
        )}
      </div>

      {/* Main Counter & Progress */}
      <ProgressDial patient={selectedPatient} />

      {/* Daily Routines Checklist */}
      <DailyRoutines patient={selectedPatient} />

      {/* Mood Tracker & Journal */}
      <MoodTracker patient={selectedPatient} />

      {/* Appointments & Visits */}
      <PatientCalendar patient={selectedPatient} />

      {/* Discreet Sponsor Support Box */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-950 border border-teal-800/60 flex items-center justify-center text-teal-400 shrink-0 font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-300 font-medium">Mon Tuteur Référent : </span>
            <strong className="text-white">{selectedPatient.sponsorContact.name}</strong>
            <p className="text-slate-400 text-[11px] mt-0.5">{selectedPatient.sponsorContact.role}</p>
          </div>
        </div>

        <a
          href={`tel:${selectedPatient.sponsorContact.phone}`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-teal-400 font-semibold transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>{selectedPatient.sponsorContact.phone}</span>
        </a>
      </div>

      {/* SOS Modal Dialog */}
      {showSosModal && (
        <SosCrisisModal patient={selectedPatient} onClose={() => setShowSosModal(false)} />
      )}
    </div>
  );
};
