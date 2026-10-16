import React, { useState, useEffect } from 'react';
import { RecoveryProvider, useRecovery } from './context/RecoveryContext';
import { LandingPage } from './components/LandingPage';
import { Header } from './components/Header';
import { SponsorDashboard } from './components/sponsor/SponsorDashboard';
import { PatientDashboard } from './components/patient/PatientDashboard';

const AppContent: React.FC = () => {
  const { currentRole, setCurrentRole, setSelectedPatientId } = useRecovery();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'patients' | 'calendar'>('dashboard');

  // Détecter si un ID patient est présent dans l'URL (ex: via un QR code)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const patientIdFromUrl = params.get('patientId');
    if (patientIdFromUrl) {
      setSelectedPatientId(patientIdFromUrl);
      setCurrentRole('patient');
    }
  }, [setCurrentRole, setSelectedPatientId]);

  const handleSelectRole = (role: 'sponsor' | 'patient', patientId?: string) => {
    if (patientId) {
      setSelectedPatientId(patientId);
    }
    setCurrentRole(role);
  };

  // 1. Si aucun rôle n'est sélectionné, afficher la Landing Page
  if (!currentRole) {
    return <LandingPage onSelectRole={handleSelectRole} />;
  }

  // 2. Sinon, afficher l'application selon le rôle
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={() => setCurrentRole(null)} 
      />
      
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        {currentRole === 'sponsor' ? (
          <SponsorDashboard activeTab={activeTab} />
        ) : (
          <PatientDashboard />
        )}
      </main>
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
