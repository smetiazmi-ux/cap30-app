import React, { useState } from 'react';
import { useRecovery } from '../../context/RecoveryContext';
import { UserPlus, X, Shield, KeyRound, Check } from 'lucide-react';

interface AddPatientModalProps {
  onClose: () => void;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({ onClose }) => {
  const { addNewPatient } = useRecovery();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+216 ');
  const [targetDays, setTargetDays] = useState<number>(30);
  const [createdCode, setCreatedCode] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newP = addNewPatient(name.trim(), phone.trim(), targetDays);
    setCreatedCode(newP.code);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Nouveau Bénéficiaire</h3>
              <p className="text-xs text-slate-400">Générer un code d'accès confidentiel</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form or Success View */}
        {createdCode ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-400 mx-auto flex items-center justify-center">
              <KeyRound className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-white">Dossier créé avec succès !</h4>
              <p className="text-xs text-slate-400 mt-1">
                Donne ce code d'accès personnel au bénéficiaire pour qu'il se connecte à son interface :
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border-2 border-teal-500/50 flex flex-col items-center">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Code d'accès sécurisé</span>
              <span className="text-3xl font-extrabold font-mono text-teal-300 tracking-wider my-1">
                {createdCode}
              </span>
              <span className="text-xs text-emerald-400 font-medium">Protocole {targetDays} jours prêt</span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs transition-colors"
            >
              Fermer et consulter le dossier
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Nom ou Alias (Discret) :
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Mourad K., Karim..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Numéro de téléphone :
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+216 98 000 000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Durée du protocole :
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetDays(30)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    targetDays === 30
                      ? 'bg-slate-950 border-teal-500 ring-1 ring-teal-500/30'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-sm text-white">30 Jours</div>
                  <div className="text-[11px] text-slate-400">Programme Standard</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetDays(40)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    targetDays === 40
                      ? 'bg-slate-950 border-teal-500 ring-1 ring-teal-500/30'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-sm text-white">40 Jours</div>
                  <div className="text-[11px] text-slate-400">Consolidation Renforcée</div>
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
              <Shield className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>
                Un code d'accès unique sera généré automatiquement. Le bénéficiaire n'aura pas besoin de créer de compte complexe.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs transition-colors"
              >
                Créer et Générer le code
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
