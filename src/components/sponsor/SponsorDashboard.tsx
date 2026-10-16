import React, { useState } from 'react';
import { Plus, Users, Calendar as CalendarIcon, Activity } from 'lucide-react';
import { useRecovery, Patient } from '../../context/RecoveryContext';
import { PatientCard } from './PatientCard';
import { AddPatientModal } from './AddPatientModal';
import { PatientQrModal } from './PatientQrModal';

interface SponsorDashboardProps {
  activeTab: 'dashboard' | 'patients' | 'calendar';
}

export const SponsorDashboard: React.FC<SponsorDashboardProps> = () => {
  const { patients } = useRecovery();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [qrModalData, setQrModalData] = useState<{ isOpen: boolean; name: string; id: string }>({
    isOpen: false,
    name: '',
    id: ''
  });

  const handlePatientCreated = (patientName: string, patientId: string) => {
    setQrModalData({
      isOpen: true,
      name: patientName,
      id: patientId
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Accompagnateur</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez le suivi et le parcours de vos patients</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4"/> Ajouter un patient
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6"/>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Patients suivis</p>
            <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Activity className="w-6 h-6"/>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Taux de suivi</p>
            <p className="text-2xl font-bold text-gray-900">100 %</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <CalendarIcon className="w-6 h-6"/>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Rendez-vous à venir</p>
            <p className="text-2xl font-bold text-gray-900">3</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Liste des patients</h2>
        
        {patients.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3"/>
            <p className="text-gray-500 text-sm">Aucun patient inscrit pour le moment.</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-3 text-sm text-indigo-600 font-semibold hover:underline"
            >
              + Ajouter votre premier patient
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients.map((patient: Patient) => (
              <PatientCard 
                key={patient.id} 
                patient={patient} 
                onShowQr={(p) => setQrModalData({ isOpen: true, name: p.name, id: p.id })}
              />
            ))}
          </div>
        )}
      </div>

      <AddPatientModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onPatientCreated={handlePatientCreated}
      />

      <PatientQrModal 
        isOpen={qrModalData.isOpen} 
        onClose={() => setQrModalData({ isOpen: false, name: '', id: '' })}
        patientName={qrModalData.name}
        patientId={qrModalData.id}
      />
    </div>
  );
};
