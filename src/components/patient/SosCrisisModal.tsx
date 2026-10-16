import React, { useState } from 'react';
import { Patient } from '../../types';
import { useRecovery } from '../../context/RecoveryContext';
import { BreathingExercise } from './BreathingExercise';
import { AlertCircle, Phone, X, CheckCircle, ShieldAlert, Sparkles, Footprints, GlassWater } from 'lucide-react';

interface SosCrisisModalProps {
  patient: Patient;
  onClose: () => void;
}

export const SosCrisisModal: React.FC<SosCrisisModalProps> = ({ patient, onClose }) => {
  const { resolveSosAlert } = useRecovery();
  const [activeTab, setActiveTab] = useState<'breathing' | 'tips' | 'contact'>('breathing');
  const [hasResolved, setHasResolved] = useState<boolean>(false);

  const handleResolve = () => {
    resolveSosAlert(patient.id);
    setHasResolved(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-rose-900/40 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden relative my-auto">
        {/* Top Emergency Banner */}
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 px-5 py-4 border-b border-rose-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-900/60 border border-rose-700/60 flex items-center justify-center text-rose-300 shrink-0 animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Espace d'Urgence & Craving</span>
              </h3>
              <p className="text-xs text-rose-300/80">Tu n'es pas seul(e). Cette envie dure en moyenne 7 minutes.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status notification */}
        <div className="px-5 py-2.5 bg-rose-950/40 border-b border-rose-900/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-rose-300">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            <span>Alerte notifiée sur le tableau de bord de ton tuteur</span>
          </div>
          <span className="font-mono text-rose-400 text-[11px]">EN DIRECT</span>
        </div>

        {/* Tab switchers */}
        <div className="px-5 pt-4">
          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('breathing')}
              className={`py-2 px-2 rounded-lg transition-colors ${
                activeTab === 'breathing'
                  ? 'bg-teal-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1. Respiration
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`py-2 px-2 rounded-lg transition-colors ${
                activeTab === 'tips'
                  ? 'bg-teal-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2. Gestes Clés
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`py-2 px-2 rounded-lg transition-colors ${
                activeTab === 'contact'
                  ? 'bg-teal-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              3. Parrain
            </button>
          </div>
        </div>

        {/* Content body based on tab */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {activeTab === 'breathing' && (
            <div className="space-y-4">
              <BreathingExercise />
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                💡 <strong>Pourquoi ça marche :</strong> Le craving provoque une accélération involontaire du cœur. En imposant des expirations longues, tu forces ton système nerveux parasympathique à reprendre le contrôle.
              </div>
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400 shrink-0">
                  <GlassWater className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">1. Bois un grand verre d'eau très fraîche</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    La sensation thermique froide dans la gorge crée une rupture sensorielle instantanée qui coupe le réflexe automatique de l'envie.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400 shrink-0">
                  <Footprints className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">2. Change d'endroit et marche 10 minutes</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Quitte immédiatement la pièce où tu te trouves. Sors dehors, change d'angle de vue, bouge tes jambes pour libérer l'énergie.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-400 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">3. La règle des 15 minutes</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Dis-toi : &laquo; Je ne cède pas pendant les 15 prochaines minutes &raquo;. Dans 90% des cas, l'intensité maximale chute naturellement après ce délai.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-teal-900/60">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400 text-lg font-bold">
                    Dr
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{patient.sponsorContact.name}</h4>
                    <p className="text-xs text-teal-400">{patient.sponsorContact.role}</p>
                    <p className="text-xs text-slate-400">{patient.sponsorContact.phone}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 italic mb-4">
                  &ldquo;{patient.sponsorContact.supportMessage}&rdquo;
                </div>

                <a
                  href={`tel:${patient.sponsorContact.phone}`}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold text-sm shadow-lg shadow-teal-950 transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>Appeler mon accompagnateur maintenant</span>
                </a>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-400">
                <AlertCircle className="w-4 h-4 text-teal-400 shrink-0" />
                <span>En cas d'urgence médicale vitale, contacte le 190 (SAMU) ou les urgences locales.</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3">
          {hasResolved ? (
            <div className="w-full flex items-center justify-center gap-2 py-2.5 text-emerald-400 font-bold text-sm bg-emerald-950/70 rounded-xl border border-emerald-800">
              <CheckCircle className="w-5 h-5" />
              <span>Bravo ! Crise maîtrisée avec succès.</span>
            </div>
          ) : (
            <>
              <button
                onClick={handleResolve}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950"
              >
                <CheckCircle className="w-4 h-4" />
                <span>La crise est apaisée / Je vais mieux</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold transition-colors"
              >
                Garder la veille ouverte
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
