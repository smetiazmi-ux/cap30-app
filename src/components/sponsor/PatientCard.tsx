import React from 'react';
import { User, QrCode, Calendar, ArrowRight } from 'lucide-react';
import { Patient, useRecovery } from '../../context/RecoveryContext';

interface PatientCardProps {
  patient: Patient;
  onShowQr: (patient: Patient) => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient, onShowQr }) => {
  const { setSelectedPatientId } = useRecovery();

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{patient.name}</h3>
              <p className="text-xs text-gray-400">ID: {patient.id}</p>
            </div>
          </div>
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
            patient.status === 'Actif' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
          }`}>
            {patient.status || 'Actif'}
          </span>
        </div>

        <div className="mt-4 space-y-2 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>Inscrit le : {patient.startDate || 'Récemment'}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onShowQr(patient)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
          title="Afficher le QR Code du patient"
        >
          <QrCode className="w-4 h-4" /> QR Code
        </button>

        <button
          onClick={() => setSelectedPatientId(patient.id)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Fiche <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
