import React from 'react';
import { RecoveryProvider, useRecovery } from './context/RecoveryContext';
import { Header } from './components/Header';
import { DeviceFrame } from './components/DeviceFrame';
import { PatientDashboard } from './components/patient/PatientDashboard';
import { SponsorDashboard } from './components/sponsor/SponsorDashboard';
import { ShieldCheck, Info } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeRole, isMobileView } = useRecovery();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Header />

      {/* Simulator info strip */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-2 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>
              <strong>Simulateur interactif bivalent :</strong> Basculez librement entre la{' '}
              <span className="text-teal-300 font-medium">Vue Patient</span> (compteur, routines, SOS) et la{' '}
              <span className="text-emerald-300 font-medium">Vue Accompagnateur</span> (cohorte de 5 personnes, alertes en direct).
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span>Données locales persistantes</span>
            <span aria-hidden="true">·</span>
            <span>Format : {isMobileView ? 'Smartphone Mockup' : 'Plein Écran'}</span>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1">
        <DeviceFrame>
          {activeRole === 'patient' ? <PatientDashboard /> : <SponsorDashboard />}
        </DeviceFrame>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-4 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span className="text-slate-400 font-semibold">Cap 30</span>
            <span>· Parcours de Rétablissement & Sevrage</span>
          </div>
          <p className="text-[11px]">
            Conçu pour la dignité, la discrétion et la bienveillance des usagers et de leurs accompagnateurs.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <RecoveryProvider>
      <AppContent />
    </RecoveryProvider>
  );
}
