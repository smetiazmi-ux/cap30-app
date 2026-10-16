import React, { useState } from 'react';
import { Patient, MoodType } from '../../types';
import { useRecovery } from '../../context/RecoveryContext';
import { Smile, Frown, Meh, ShieldCheck, Heart, Save, Check } from 'lucide-react';

interface MoodTrackerProps {
  patient: Patient;
}

export const MoodTracker: React.FC<MoodTrackerProps> = ({ patient }) => {
  const { setMood, setTodayNote } = useRecovery();
  const [noteInput, setNoteInput] = useState(patient.todayNote || '');
  const [isSaved, setIsSaved] = useState(false);

  const moods: Array<{ type: MoodType; label: string; icon: React.ReactNode; color: string; desc: string }> = [
    {
      type: 'serene',
      label: 'Serein',
      icon: <Heart className="w-5 h-5" />,
      color: 'hover:border-emerald-500 text-emerald-400',
      desc: 'Esprit calme et apaisé',
    },
    {
      type: 'good',
      label: 'En forme',
      icon: <Smile className="w-5 h-5" />,
      color: 'hover:border-teal-500 text-teal-400',
      desc: 'Bonne énergie',
    },
    {
      type: 'neutral',
      label: 'Neutre',
      icon: <Meh className="w-5 h-5" />,
      color: 'hover:border-slate-500 text-slate-300',
      desc: 'Stable, journée normale',
    },
    {
      type: 'vulnerable',
      label: 'Fragile',
      icon: <Frown className="w-5 h-5" />,
      color: 'hover:border-amber-500 text-amber-400',
      desc: 'Stress ou fatigue',
    },
    {
      type: 'craving_overcome',
      label: 'Victoire',
      icon: <ShieldCheck className="w-5 h-5" />,
      color: 'hover:border-indigo-500 text-indigo-400',
      desc: 'Envie surmontée !',
    },
  ];

  const handleSaveNote = () => {
    setTodayNote(patient.id, noteInput);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
      <div className="mb-3">
        <h3 className="text-base font-bold text-slate-100">Humeur & Journal du Jour</h3>
        <p className="text-xs text-slate-400">Exprimer ton ressenti aide à désamorcer l'anxiété</p>
      </div>

      {/* Mood Selector Buttons */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {moods.map((m) => {
          const isSelected = patient.currentMood === m.type;
          return (
            <button
              key={m.type}
              onClick={() => setMood(patient.id, m.type)}
              title={m.desc}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                isSelected
                  ? 'bg-slate-800 border-teal-500 ring-2 ring-teal-500/30'
                  : 'bg-slate-950 border-slate-800/80 hover:bg-slate-900'
              } ${m.color}`}
            >
              <div className="mb-1">{m.icon}</div>
              <span className="text-[11px] font-semibold text-slate-200 leading-tight">{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Personal Note Box */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-300 block">
          Pensée ou ressenti du jour (confidentiel) :
        </label>
        <textarea
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          placeholder="Comment te sens-tu aujourd'hui ? Une envie surmontée, une fierté..."
          rows={2}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-colors resize-none"
        />

        <div className="flex justify-end">
          <button
            onClick={handleSaveNote}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-700 text-white text-xs font-semibold transition-colors"
          >
            {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Enregistré' : 'Enregistrer la note'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
