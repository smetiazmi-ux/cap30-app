import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Wind } from 'lucide-react';

export const BreathingExercise: React.FC = () => {
  const [isActive, setIsActive] = useState<boolean>(true);
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(4);
  const [cycleCount, setCycleCount] = useState<number>(0);

  // Box breathing phases: Inspire (4s), Retiens (4s), Expire (4s), Pause (4s)
  const phases = [
    { name: 'Inspirez lentement', instruction: 'Remplissez vos poumons par le nez', duration: 4, scale: 'scale-125' },
    { name: 'Retenez votre souffle', instruction: 'Gardez l\'air en toute sérénité', duration: 4, scale: 'scale-125' },
    { name: 'Expirez à fond', instruction: 'Videz tout l\'air par la bouche', duration: 4, scale: 'scale-90' },
    { name: 'Pause poumons vides', instruction: 'Détendez les épaules et la mâchoire', duration: 4, scale: 'scale-90' },
  ];

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Advance phase
          setPhaseIndex((currentPhase) => {
            const nextPhase = (currentPhase + 1) % phases.length;
            if (nextPhase === 0) {
              setCycleCount((c) => c + 1);
            }
            return nextPhase;
          });
          return phases[(phaseIndex + 1) % phases.length].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phaseIndex, phases]);

  const handleReset = () => {
    setIsActive(false);
    setPhaseIndex(0);
    setSecondsLeft(4);
    setCycleCount(0);
  };

  const currentPhase = phases[phaseIndex];

  return (
    <div className="bg-slate-950/80 border border-teal-900/50 rounded-2xl p-6 flex flex-col items-center text-center">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-400 mb-1">
        <Wind className="w-4 h-4" />
        <span>Respiration Carrée Anti-Craving</span>
      </div>
      <p className="text-xs text-slate-400 max-w-xs mb-5">
        Ralentit instantanément le rythme cardiaque et désamorce le pic d'adrénaline
      </p>

      {/* Visual Breathing Bubble */}
      <div className="relative w-48 h-48 flex items-center justify-center my-3">
        {/* Outer aura */}
        <div
          className={`absolute inset-0 rounded-full bg-teal-500/10 blur-xl transition-transform duration-[4000ms] ease-in-out ${
            phaseIndex === 0 || phaseIndex === 1 ? 'scale-125 bg-emerald-500/20' : 'scale-90 bg-cyan-500/10'
          }`}
        />

        {/* Outer ring */}
        <div
          className={`absolute w-40 h-40 rounded-full border-2 border-teal-500/30 transition-transform duration-[4000ms] ease-in-out ${
            phaseIndex === 0 || phaseIndex === 1 ? 'scale-110 border-emerald-400/50' : 'scale-95'
          }`}
        />

        {/* Central pulsating sphere */}
        <div
          className={`w-32 h-32 rounded-full bg-gradient-to-tr from-teal-700 via-emerald-600 to-cyan-500 flex flex-col items-center justify-center text-white shadow-2xl transition-transform duration-[4000ms] ease-in-out ${
            phaseIndex === 0 || phaseIndex === 1 ? 'scale-110 shadow-emerald-500/40' : 'scale-90 shadow-teal-900/30'
          }`}
        >
          <span className="text-3xl font-extrabold tracking-tight">{secondsLeft}s</span>
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">
            {phaseIndex === 0 ? 'Inspirer' : phaseIndex === 1 ? 'Retenir' : phaseIndex === 2 ? 'Expirer' : 'Pause'}
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="my-3 min-h-[44px]">
        <h4 className="text-sm font-bold text-slate-100">{currentPhase.name}</h4>
        <p className="text-xs text-teal-300/80">{currentPhase.instruction}</p>
      </div>

      {/* Cycle counter & controls */}
      <div className="flex items-center gap-4 mt-2">
        <button
          onClick={() => setIsActive(!isActive)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white text-xs font-semibold transition-colors"
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isActive ? 'Pause' : 'Reprendre'}</span>
        </button>

        <button
          onClick={handleReset}
          title="Recommencer"
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <span className="text-xs text-slate-400 border-l border-slate-800 pl-4">
          <strong className="text-slate-200">{cycleCount}</strong> cycles réussis
        </span>
      </div>
    </div>
  );
};
