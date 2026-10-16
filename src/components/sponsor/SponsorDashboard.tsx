import React, { useState } from 'react';
import { useRecovery } from '../../context/RecoveryContext';
import { PatientCard } from './PatientCard';
import { PatientDetailView } from './PatientDetailView';
import { AddPatientModal } from './AddPatientModal';
import {
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
  UserPlus,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

export const SponsorDashboard: React.FC = () => {
  const { patients, selectedPatientId, setSelectedPatientId, selectedPatient } = useRecovery();
  const [filter, setFilter] = useState<'all' | 'sos' | 'inactive' | 'active'>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [viewingDetailId, setViewingDetailId] = useState<string | null>(selectedPatientId);

  const sosList = patients.filter((p) => p.status === 'sos');
  const inactiveList = patients.filter((p) => p.status === 'inactive');
  const activeList = patients.filter((p) => p.status === 'active');

  const filteredPatients = patients.filter((p) => {
    if (filter === 'sos') return p.status === 'sos';
    if (filter === 'inactive') return p.status === 'inactive';
    if (filter === 'active') return p.status === 'active';
    return true;
  });

  const activePatientForDetail = patients.find((p) => p.id === viewingDetailId) || selectedPatient;

  const handleSelectPatient = (id: string) => {
    setSelectedPatientId(id);
    setViewingDetailId(id);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Top Header & Enrolment Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Tableau de Bord Accompagnateur</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-400 border border-teal-800">
              Cohorte Active
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Supervision confidentielle des parcours de rétablissement (Dr. Youssef K.)
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-md shadow-teal-950 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Inscrire un Bénéficiaire</span>
        </button>
      </div>

      {/* PRIORITY SOS BANNER IF ANY ALERT EXISTS */}
      {sosList.length > 0 && (
        <div className="bg-gradient-to-r from-rose-950 via-red-950/80 to-rose-950 border-2 border-rose-500 rounded-2xl p-4 sm:p-5 shadow-2xl animate-pulse">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-900 border border-rose-500 flex items-center justify-center text-white shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{sosList.length} ALERTE SOS EN COURS DE TRAITEMENT</span>
                </h3>
                <p className="text-xs text-rose-200">
                  {sosList.map((p) => p.name).join(', ')} nécessite un contact d'urgence immédiat.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setFilter('sos');
                if (sosList[0]) handleSelectPatient(sosList[0].id);
              }}
              className="px-4 py-2 rounded-xl bg-white text-rose-950 font-bold text-xs hover:bg-rose-100 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Traiter en priorité</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          onClick={() => setFilter('all')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-slate-900 border-teal-500 ring-1 ring-teal-500/20'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Total Suivis</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{patients.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Bénéficiaires actifs</div>
        </div>

        <div
          onClick={() => setFilter('sos')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            filter === 'sos'
              ? 'bg-rose-950/40 border-rose-500 ring-1 ring-rose-500/30'
              : 'bg-slate-900/60 border-slate-800 hover:border-rose-900/50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-rose-400 font-semibold">Alertes SOS</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-rose-300">{sosList.length}</div>
          <div className="text-[11px] text-rose-400/80 mt-0.5">
            {sosList.length > 0 ? 'Intervention requise' : 'Aucune alerte'}
          </div>
        </div>

        <div
          onClick={() => setFilter('inactive')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            filter === 'inactive'
              ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500/30'
              : 'bg-slate-900/60 border-slate-800 hover:border-amber-900/50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-amber-400 font-semibold">Inactifs 24h+</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-300">{inactiveList.length}</div>
          <div className="text-[11px] text-amber-400/80 mt-0.5">Relance conseillée</div>
        </div>

        <div
          onClick={() => setFilter('active')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            filter === 'active'
              ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/30'
              : 'bg-slate-900/60 border-slate-800 hover:border-emerald-900/50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-emerald-400 font-semibold">En bonne voie</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-300">{activeList.length}</div>
          <div className="text-[11px] text-emerald-400/80 mt-0.5">Régularité tenue</div>
        </div>
      </div>

      {/* Cohort Grid & Detail Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Patient List (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-white">
              Bénéficiaires ({filteredPatients.length})
            </h3>
            <span className="text-xs text-slate-400">Cliquez pour inspecter</span>
          </div>

          <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
            {filteredPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                isSelected={patient.id === viewingDetailId}
                onSelect={() => handleSelectPatient(patient.id)}
                onCall={(e) => {
                  e.stopPropagation();
                  window.location.href = `tel:${patient.phone}`;
                }}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Active Patient Detail Inspector (7 cols on lg) */}
        <div className="lg:col-span-7">
          <PatientDetailView patient={activePatientForDetail} />
        </div>
      </div>

      {/* Enrolment Modal */}
      {showAddModal && <AddPatientModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
};
