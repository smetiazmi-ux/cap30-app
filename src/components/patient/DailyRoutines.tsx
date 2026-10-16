import React from 'react';
import { Patient } from '../../types';
import { useRecovery } from '../../context/RecoveryContext';
import { Activity, Droplet, Pill, MessageSquare, CheckCircle2, Circle } from 'lucide-react';

interface DailyRoutinesProps {
  patient: Patient;
}

export const DailyRoutines: React.FC<DailyRoutinesProps> = ({ patient }) => {
  const { toggleRoutine } = useRecovery();

  const completedCount = patient.dailyRoutines.filter((r) => r.completed).length;
  const totalCount = patient.dailyRoutines.length;
  const isAllCompleted = completedCount === totalCount;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sport':
        return <Activity className="w-4 h-4 text-emerald-400" />;
      case 'bien-etre':
        return <Droplet className="w-4 h-4 text-cyan-400" />;
      case 'sante':
        return <Pill className="w-4 h-4 text-indigo-400" />;
      case 'contact':
        return <MessageSquare className="w-4 h-4 text-teal-400" />;
      default:
        return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>Routines du Jour</span>
            {isAllCompleted && (
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                100% Validé
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-400">Valide tes piliers quotidiens pour ancrer ton rétablissement</p>
        </div>

        <div className="text-right">
          <span className="text-sm font-bold text-teal-400">
            {completedCount}/{totalCount}
          </span>
          <span className="text-xs text-slate-500 block">actions</span>
        </div>
      </div>

      {/* Mini Progress Bar */}
      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mb-4 border border-slate-800">
        <div
          className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
          style={{ width: `${(completedCount / totalCount) * 100}%` }}
        />
      </div>

      {/* Routine items */}
      <div className="space-y-2.5">
        {patient.dailyRoutines.map((routine) => (
          <div
            key={routine.id}
            onClick={() => toggleRoutine(patient.id, routine.id)}
            className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
              routine.completed
                ? 'bg-slate-950/40 border-teal-800/40 opacity-80'
                : 'bg-slate-950 border-slate-800/90 hover:border-slate-700 hover:bg-slate-950/80'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {routine.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-semibold transition-all ${
                    routine.completed ? 'line-through text-slate-500' : 'text-slate-200'
                  }`}
                >
                  {routine.title}
                </span>
                {routine.timeLabel && (
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    {routine.timeLabel}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{routine.description}</p>
            </div>

            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
              {getCategoryIcon(routine.category)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
