import React, { useState } from 'react';
import { UserCheck, Heart, ArrowRight, QrCode, Lock } from 'lucide-react';

interface LandingPageProps {
  onSelectRole: (role: 'sponsor' | 'patient', patientId?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectRole }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [patientCode, setPatientCode] = useState('');

  const handleSponsorAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation de connexion/inscription accompagnateur
    if (email && password) {
      onSelectRole('sponsor');
    }
  };

  const handlePatientAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (patientCode.trim()) {
      onSelectRole('patient', patientCode.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-px">
        <div className="flex justify-center items-center gap-3">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg text-white">
            <Heart className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Cap30 App</h1>
        </div>
        <p className="mt-2 text-center text-sm text-gray-600">
          Plateforme d'accompagnement et de suivi personnalisé
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          
          {/* Section Accompagnateur */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
              <UserCheck className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-gray-800">Espace Accompagnateur</h2>
            </div>

            <form onSubmit={handleSponsorAuth} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Adresse E-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="praticien@exemple.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                {isLogin ? 'Se connecter' : "S'inscrire"} <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <button
              onClick={() => setIsLogin(!isLogin)}
              className="mt-2 text-xs text-indigo-600 hover:underline w-full text-center"
            >
              {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-400 font-semibold">Ou</span>
            </div>
          </div>

          {/* Section Patient */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
              <QrCode className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-gray-800">Espace Patient</h2>
            </div>

            <form onSubmit={handlePatientAccess} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Code Patient
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={patientCode}
                    onChange={(e) => setPatientCode(e.target.value)}
                    placeholder="Entrez votre code personnalisé"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
              >
                Accéder à mon espace <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
