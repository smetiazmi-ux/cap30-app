import React from 'react';
import { X, QrCode, Copy, Check } from 'lucide-react';

interface PatientQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientId: string;
}

export const PatientQrModal: React.FC<PatientQrModalProps> = ({ isOpen, onClose, patientName, patientId }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  // URL directe de l'application avec l'ID du patient
  const patientUrl = `${window.location.origin}/?patientId=${patientId}`;
  
  // Utilisation d'une API gratuite pour générer le QR Code instantanément sans installer de package lourd
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(patientUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(patientUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative animate-fadeIn">
        
        {/* Bouton de fermeture */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 mb-4 text-emerald-600">
            <QrCode className="w-6 h-6" />
          </div>
          
          <h3 className="text-lg font-bold text-gray-900">Accès Patient</h3>
          <p className="text-sm text-gray-600 mt-1">
            QR Code pour <span className="font-semibold text-indigo-600">{patientName}</span>
          </p>

          {/* Affichage du QR Code */}
          <div className="my-6 p-4 bg-gray-50 border border-gray-100 rounded-xl inline-block shadow-inner">
            <img src={qrCodeUrl} alt="QR Code Patient" className="w-48 h-48 mx-auto" />
          </div>

          <p className="text-xs text-gray-500 mb-4">
            Demandez au patient de scanner ce code avec son téléphone pour accéder directement à son espace.
          </p>

          {/* Bouton de copie du lien */}
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? "Lien copié !" : "Copier le lien d'accès"}
          </button>
        </div>

      </div>
    </div>
  );
};
