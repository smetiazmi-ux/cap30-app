import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { useRecovery } from '../../context/RecoveryContext';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientCreated: (patientName: string, patientId: string) => void;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({ isOpen, onClose, onPatientCreated }) => {
  const { addPatient } = useRecovery();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Création d'un ID unique basé sur la date et le nom
    const newPatientId = 'p_' + Date.now();
    
    // Ajout du patient via le contexte
    addPatient({
      id: newPatientId,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      status: 'Actif',
      progress: 0,
      startDate: new Date().toISOString().split('T')[0]
    });

    // Réinitialisation du formulaire
    setName('');
    setEmail('');
    setPhone('');
    
    // Fermeture du modal d'ajout et déclenchement de l'affichage du QR Code
    onClose();
    onPatientCreated(name.trim(), newPatientId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-fadeIn">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Ajouter un nouveau patient</h3>
            <p className="text-xs text-gray-500">Renseignez les informations pour créer son accès</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Nom complet du patient
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Thomas Martin"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              E-mail (Optionnel)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="patient@exemple.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
              Téléphone (Optionnel)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+33 6 00 00 00 00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
            >
              Créer et générer le QR Code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
