import React, { useState } from 'react';
import { Patient, Appointment } from '../../types';
import { useRecovery } from '../../context/RecoveryContext';
import { Calendar as CalendarIcon, Clock, MapPin, CheckCircle2, Circle, Plus } from 'lucide-react';

interface PatientCalendarProps {
  patient: Patient;
}

export const PatientCalendar: React.FC<PatientCalendarProps> = ({ patient }) => {
  const { toggleAppointment, addAppointment } = useRecovery();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('15:00');
  const [newType, setNewType] = useState<Appointment['type']>('sport');
  const [newLocation, setNewLocation] = useState('Extérieur / Parc');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addAppointment(patient.id, {
      title: newTitle.trim(),
      date: newDate,
      time: newTime,
      type: newType,
      locationOrFormat: newLocation,
      notes: 'Ajouté par le bénéficiaire',
    });
    setNewTitle('');
    setShowAddForm(false);
  };

  const getTypeBadge = (type: Appointment['type']) => {
    switch (type) {
      case 'medical':
        return { label: 'Médical', color: 'bg-indigo-950 text-indigo-300 border-indigo-800' };
      case 'sport':
        return { label: 'Sport', color: 'bg-emerald-950 text-emerald-300 border-emerald-800' };
      case 'sponsor_visit':
        return { label: 'Accompagnateur', color: 'bg-teal-950 text-teal-300 border-teal-800' };
      case 'group_meeting':
        return { label: 'Groupe d\'entraide', color: 'bg-cyan-950 text-cyan-300 border-cyan-800' };
      default:
        return { label: 'Rendez-vous', color: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-teal-400" />
            <span>Mon Calendrier & Visites</span>
          </h3>
          <p className="text-xs text-slate-400">Suivi des consultations médicales et créneaux sportifs</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-teal-400 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter</span>
        </button>
      </div>

      {/* Add Appointment mini-form */}
      {showAddForm && (
        <form onSubmit={handleAdd} className="mb-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1">Intitulé du rendez-vous :</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ex: Séance de marche, Point médecin..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Date :</label>
              <input
                type="date"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Heure :</label>
              <input
                type="time"
                required
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Type :</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as Appointment['type'])}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
              >
                <option value="sport">Sport / Activité</option>
                <option value="medical">Consultation médicale</option>
                <option value="sponsor_visit">Visite accompagnateur</option>
                <option value="group_meeting">Groupe de soutien</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Lieu / Format :</label>
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Ex: Cabinet, Téléphone..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-700 text-white text-xs font-semibold"
            >
              Enregistrer
            </button>
          </div>
        </form>
      )}

      {/* Appointment list */}
      <div className="space-y-2.5">
        {patient.appointments.length === 0 ? (
          <p className="text-xs text-slate-500 py-3 text-center">Aucun rendez-vous planifié pour le moment.</p>
        ) : (
          patient.appointments.map((apt) => {
            const badge = getTypeBadge(apt.type);
            return (
              <div
                key={apt.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  apt.completed
                    ? 'bg-slate-950/40 border-slate-800/40 opacity-70'
                    : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <button
                      onClick={() => toggleAppointment(patient.id, apt.id)}
                      className="mt-0.5 text-slate-500 hover:text-teal-400 transition-colors"
                      title={apt.completed ? 'Marquer comme à venir' : 'Marquer comme effectué'}
                    >
                      {apt.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                    <div>
                      <h4
                        className={`text-xs font-bold ${
                          apt.completed ? 'line-through text-slate-500' : 'text-slate-200'
                        }`}
                      >
                        {apt.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{apt.date} à {apt.time}</span>
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{apt.locationOrFormat}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded border shrink-0 ${badge.color}`}
                  >
                    {badge.label}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
