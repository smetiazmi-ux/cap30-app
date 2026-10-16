import React, { useState } from 'react';
import { Patient, Appointment } from '../../types';
import { useRecovery } from '../../context/RecoveryContext';
import {
  Phone,
  ShieldAlert,
  CheckCircle,
  Clock,
  Calendar,
  Plus,
  StickyNote,
  Send,
  MessageCircle,
  Flame,
  Award,
  ChevronLeft,
} from 'lucide-react';

interface PatientDetailViewProps {
  patient: Patient;
  onBack?: () => void;
}

export const PatientDetailView: React.FC<PatientDetailViewProps> = ({ patient, onBack }) => {
  const { resolveSosAlert, addSponsorNote, toggleAppointment, addAppointment } = useRecovery();
  const [newNoteContent, setNewNoteContent] = useState('');
  const [showAddApt, setShowAddApt] = useState(false);
  const [aptTitle, setAptTitle] = useState('');
  const [aptDate, setAptDate] = useState(new Date().toISOString().split('T')[0]);
  const [aptTime, setAptTime] = useState('11:00');
  const [aptType, setAptType] = useState<Appointment['type']>('sponsor_visit');
  const [aptLocation, setAptLocation] = useState('Au cabinet / Téléphone');

  const percentage = Math.min(100, Math.round((patient.currentDay / patient.targetDays) * 100));
  const completedRoutines = patient.dailyRoutines.filter((r) => r.completed).length;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    addSponsorNote(patient.id, newNoteContent.trim());
    setNewNoteContent('');
  };

  const handleCreateApt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aptTitle.trim()) return;
    addAppointment(patient.id, {
      title: aptTitle.trim(),
      date: aptDate,
      time: aptTime,
      type: aptType,
      locationOrFormat: aptLocation,
      notes: 'Planifié par l\'accompagnateur',
    });
    setAptTitle('');
    setShowAddApt(false);
  };

  const getMoodLabel = (m: string | null) => {
    switch (m) {
      case 'serene':
        return '🕊️ Serein & apaisé';
      case 'good':
        return '😊 En forme & motivé';
      case 'neutral':
        return '😐 Neutre / Stable';
      case 'vulnerable':
        return '⚠️ Fragile / Stress ressenti';
      case 'craving_overcome':
        return '🛡️ Victoire / Craving surmonté';
      default:
        return 'Non renseigné aujourd\'hui';
    }
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="sm:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div className="w-12 h-12 rounded-2xl bg-teal-950 border border-teal-800 flex items-center justify-center font-bold text-base text-teal-300">
            {patient.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{patient.name}</h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-teal-400 font-semibold">
                {patient.code}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Protocole {patient.targetDays} jours · Démarré le {patient.startDate} · {patient.lastActive}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${patient.phone}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white text-xs font-semibold transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Appeler ({patient.phone})</span>
          </a>

          <a
            href={`sms:${patient.phone}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
          >
            <MessageCircle className="w-3.5 h-3.5 text-teal-400" />
            <span>SMS d'encouragement</span>
          </a>
        </div>
      </div>

      {/* SOS INTERVENTION CARD IF ACTIVE */}
      {patient.status === 'sos' && (
        <div className="bg-gradient-to-r from-rose-950 to-red-950/90 border-2 border-rose-500 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-rose-900 border border-rose-600 flex items-center justify-center text-white shrink-0 animate-bounce">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">ALERTE SOS DÉCLENCHÉE</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-800 text-rose-200">
                    URGENCE
                  </span>
                </div>
                <p className="text-xs text-rose-200 mt-0.5">
                  Déclenchée à {patient.sosAlert?.triggeredAt || 'l\'instant'}.
                </p>
                <div className="mt-2 p-2.5 rounded-xl bg-rose-900/60 border border-rose-700/60 text-xs text-rose-100">
                  <strong>Motif :</strong> {patient.sosAlert?.reason || 'Besoin d\'assistance immédiate.'}
                </div>
              </div>
            </div>

            <button
              onClick={() => resolveSosAlert(patient.id)}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-rose-50 text-rose-950 font-bold text-xs shadow-xl transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Acquitter l'alerte & Noter l'échange</span>
            </button>
          </div>
        </div>
      )}

      {/* Progress & Quick stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-800/60 flex items-center justify-center text-teal-400 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Progression globale</div>
            <div className="text-sm font-bold text-white">
              Jour {patient.currentDay} sur {patient.targetDays} ({percentage}%)
            </div>
            <div className="w-32 bg-slate-950 h-1.5 rounded-full mt-1.5 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-teal-400 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Routines aujourd'hui</div>
            <div className="text-sm font-bold text-white">
              {completedRoutines}/{patient.dailyRoutines.length} validées
            </div>
            <span className="text-[11px] text-slate-400">
              {completedRoutines === patient.dailyRoutines.length ? 'Toutes faites' : 'En attente'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800/60 flex items-center justify-center text-indigo-400 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Humeur signalée</div>
            <div className="text-sm font-bold text-white">{getMoodLabel(patient.currentMood)}</div>
            <span className="text-[11px] text-slate-400 truncate max-w-[180px] block">
              {patient.todayNote || 'Aucune note aujourd\'hui'}
            </span>
          </div>
        </div>
      </div>

      {/* Routine Inspection & Appointments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Routines Status */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>Routines Quotidiennes du Bénéficiaire</span>
            <span className="text-xs font-normal text-slate-400">Vue de contrôle</span>
          </h3>

          <div className="space-y-2">
            {patient.dailyRoutines.map((routine) => (
              <div
                key={routine.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">{routine.title}</h4>
                  <p className="text-[11px] text-slate-400">{routine.timeLabel || 'Journée'}</p>
                </div>

                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                    routine.completed
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {routine.completed ? 'Validé' : 'Non coché'}
                </span>
              </div>
            ))}
          </div>

          {patient.todayNote && (
            <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-400 block font-medium mb-1">Ressenti noté par le patient :</span>
              <p className="text-slate-200 italic">&ldquo;{patient.todayNote}&rdquo;</p>
            </div>
          )}
        </div>

        {/* Appointments & Visits */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-400" />
              <span>Visites & Rendez-vous Planifiés</span>
            </h3>

            <button
              onClick={() => setShowAddApt(!showAddApt)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-800 hover:bg-teal-700 text-white text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Planifier</span>
            </button>
          </div>

          {/* Form to add appointment */}
          {showAddApt && (
            <form onSubmit={handleCreateApt} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Intitulé :</label>
                <input
                  type="text"
                  required
                  value={aptTitle}
                  onChange={(e) => setAptTitle(e.target.value)}
                  placeholder="Ex: Visite à domicile, Suivi médical..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Date :</label>
                  <input
                    type="date"
                    required
                    value={aptDate}
                    onChange={(e) => setAptDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Heure :</label>
                  <input
                    type="time"
                    required
                    value={aptTime}
                    onChange={(e) => setAptTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Type :</label>
                  <select
                    value={aptType}
                    onChange={(e) => setAptType(e.target.value as Appointment['type'])}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  >
                    <option value="sponsor_visit">Visite de l'accompagnateur</option>
                    <option value="medical">Consultation médicale</option>
                    <option value="sport">Séance de sport</option>
                    <option value="group_meeting">Groupe d'entraide</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Lieu :</label>
                  <input
                    type="text"
                    value={aptLocation}
                    onChange={(e) => setAptLocation(e.target.value)}
                    placeholder="Ex: Cabinet, Téléphone..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddApt(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-700 text-white text-xs font-semibold"
                >
                  Ajouter
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {patient.appointments.map((apt) => (
              <div
                key={apt.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{apt.title}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="font-mono">{apt.date} à {apt.time}</span>
                    <span>·</span>
                    <span>{apt.locationOrFormat}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleAppointment(patient.id, apt.id)}
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded border transition-colors ${
                    apt.completed
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {apt.completed ? 'Effectué' : 'À venir'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confidential Clinical Observations Notebook */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StickyNote className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold text-white">Cahier de Notes Confidentiel (Accompagnateur)</h3>
          </div>
          <span className="text-[11px] text-slate-400">Réservé au tuteur · Non visible par le patient</span>
        </div>

        <form onSubmit={handleAddNote} className="space-y-2">
          <textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Noter une observation clinique, un retour d'appel ou une recommandation pour le suivi..."
            rows={2}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-teal-500 transition-colors resize-none"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newNoteContent.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-semibold transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ajouter la note d'observation</span>
            </button>
          </div>
        </form>

        <div className="space-y-2.5 pt-2">
          {patient.sponsorNotes.map((note) => (
            <div key={note.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span className="font-semibold text-slate-300">{note.author}</span>
                <span className="font-mono">{note.date}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{note.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
