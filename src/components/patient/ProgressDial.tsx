import React, { useState } from 'react';
import { Patient } from '../../types';
import { Award, Check, Copy, Flame, Calendar } from 'lucide-react';

interface ProgressDialProps {
  patient: Patient;
}

export const ProgressDial: React.FC<ProgressDialProps> = ({ patient }) => {
  const [copied, setCopied] = useState(false);

  const percentage = Math.min(100, Math.round((patient.currentDay / patient.targetDays) * 100));
  const remainingDays = Math.max(0, patient.targetDays - patient.currentDay);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(patient.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // SVG circular gauge math
  const radius = 80;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Milestone logic
  const nextMilestone =
    patient.currentDay < 7
      ? { day: 7, label: '1ère Semaine' }
      : patient.currentDay < 15
      ? { day: 15, label: 'Mi-parcours' }
      : patient.currentDay < 21
      ? { day: 21, label: '3 Semaines d\'ancrage' }
      : { day: patient.targetDays, label: `Objectif ${patient.targetDays} Jours` };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm relative overflow-hidden">
      {/* Background soft ambient glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top bar with confidentiality badge & access code */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-medium text-slate-300">Protocole Actif</span>
          <span aria-hidden="true">·</span>
          <span>{patient.targetDays} jours</span>
        </div>

        <button
          onClick={handleCopyCode}
          title="Copier mon code confidentiel"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors"
        >
          <span>Code:</span>
          <span className="font-mono font-semibold text-teal-400">{patient.code}</span>
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>

      {/* Circular dial and big count */}
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-2">
        <div className="relative w-44 h-44 flex items-center justify-center">
          <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
            {/* Background track */}
            <circle
              stroke="rgb(30, 41, 59)"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Progress track */}
            <circle
              stroke="url(#progressGradient)"
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0d9488" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>

          {/* Inner content */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">Progression</span>
            <div className="flex items-baseline gap-1 my-0.5">
              <span className="text-3xl font-extrabold text-white tracking-tight">{patient.currentDay}</span>
              <span className="text-xs text-slate-400 font-medium">/{patient.targetDays}</span>
            </div>
            <span className="text-xs font-semibold text-emerald-400">{percentage}% franchis</span>
          </div>
        </div>

        {/* Stats & Milestones details */}
        <div className="flex flex-col gap-3 w-full sm:w-auto">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-950 border border-teal-800/50 flex items-center justify-center text-teal-400 shrink-0">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Série consécutive</div>
              <div className="text-sm font-bold text-slate-100">
                {patient.currentDay} {patient.currentDay > 1 ? 'jours sobres' : 'jour sobre'}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-800/50 flex items-center justify-center text-emerald-400 shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Prochain jalon</div>
              <div className="text-sm font-bold text-emerald-300">
                {nextMilestone.label} <span className="text-xs font-normal text-slate-400">(J-{nextMilestone.day - patient.currentDay})</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-950 border border-blue-800/50 flex items-center justify-center text-blue-400 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Jours restants</div>
              <div className="text-sm font-bold text-slate-200">
                {remainingDays} jours vers la consolidation
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Motivational quiet kicker */}
      <div className="mt-3 pt-3 border-t border-slate-800/60 text-center">
        <p className="text-xs text-slate-400 italic">
          &ldquo;Chaque journée validée renforce ton indépendance et ton avenir.&rdquo;
        </p>
      </div>
    </div>
  );
};
