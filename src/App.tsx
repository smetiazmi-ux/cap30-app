import { useState, useEffect } from 'react';
import { RecoveryProvider } from './context/RecoveryContext';
import { LandingPage } from './components/LandingPage';
import { SponsorDashboard } from './components/sponsor/SponsorDashboard';
import { PatientDashboard } from './components/patient/PatientDashboard';
import { Header } from './components/Header';
import { DeviceFrame } from './components/DeviceFrame';

export function App() {
  const [role, setRole] = useState<'sponsor' | 'patient' | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'patients' | 'calendar'>('dashboard');

  // Vérifier si un patientId est présent dans l'URL (ex: ?patientId=p_123)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const patientIdParam = params.get('patientId');
    if (patientIdParam) {
      setRole('patient');
    }
  }, []);

  const handleSelectRole = (selectedRole: 'sponsor' | 'patient') => {
    setRole(selectedRole);
  };

  if (!role) {
    return <LandingPage onSelectRole={handleSelectRole} />;
  }

  return (
    <RecoveryProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header role={role} onLogout={() => {
          setRole(null);
          window.history.replaceState({}, '', window.location.pathname);
        }} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {role === 'sponsor' ? (
            <SponsorDashboard activeTab={activeTab} />
          ) : (
            <DeviceFrame>
              <PatientDashboard />
            </DeviceFrame>
          )}
        </main>
      </div>
    </RecoveryProvider>
  );
}

export default App;
