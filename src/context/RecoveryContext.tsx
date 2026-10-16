import React, { createContext, useContext, useState, useEffect } from 'react';
import { Patient, ActiveRole, MoodType, Appointment, SponsorNote } from '../types';
import { INITIAL_PATIENTS } from '../data/initialData';

const STORAGE_KEY = 'cap30_recovery_cohort_v1';
const ROLE_KEY = 'cap30_active_role_v1';
const PATIENT_ID_KEY = 'cap30_selected_patient_v1';

interface RecoveryContextType {
  patients: Patient[];
  activeRole: ActiveRole;
  selectedPatientId: string;
  selectedPatient: Patient;
  isMobileView: boolean;
  isSosModalOpen: boolean;
  setActiveRole: (role: ActiveRole) => void;
  setSelectedPatientId: (id: string) => void;
  setIsMobileView: (isMobile: boolean) => void;
  setIsSosModalOpen: (isOpen: boolean) => void;
  toggleRoutine: (patientId: string, routineId: string) => void;
  setMood: (patientId: string, mood: MoodType) => void;
  setTodayNote: (patientId: string, note: string) => void;
  triggerSosAlert: (patientId: string, reason?: string) => void;
  resolveSosAlert: (patientId: string) => void;
  addAppointment: (patientId: string, appointment: Omit<Appointment, 'id' | 'completed'>) => void;
  toggleAppointment: (patientId: string, appointmentId: string) => void;
  addSponsorNote: (patientId: string, content: string) => void;
  addNewPatient: (name: string, phone: string, targetDays: number) => Patient;
  resetToDefaults: () => void;
}

const RecoveryContext = createContext<RecoveryContextType | undefined>(undefined);

export const RecoveryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading saved patients from storage:', e);
    }
    return INITIAL_PATIENTS;
  });

  const [activeRole, setActiveRole] = useState<ActiveRole>(() => {
    try {
      const saved = localStorage.getItem(ROLE_KEY);
      if (saved === 'patient' || saved === 'sponsor') return saved;
    } catch (e) {}
    return 'patient';
  });

  const [selectedPatientId, setSelectedPatientId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(PATIENT_ID_KEY);
      if (saved) return saved;
    } catch (e) {}
    return 'p_sami';
  });

  const [isMobileView, setIsMobileView] = useState<boolean>(true);
  const [isSosModalOpen, setIsSosModalOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }, [patients]);

  useEffect(() => {
    try {
      localStorage.setItem(ROLE_KEY, activeRole);
    } catch (e) {}
  }, [activeRole]);

  useEffect(() => {
    try {
      localStorage.setItem(PATIENT_ID_KEY, selectedPatientId);
    } catch (e) {}
  }, [selectedPatientId]);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0] || INITIAL_PATIENTS[0];

  const toggleRoutine = (patientId: string, routineId: string) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        const updatedRoutines = p.dailyRoutines.map((r) =>
          r.id === routineId ? { ...r, completed: !r.completed } : r
        );
        // If all or some routines completed, update status if not sos
        const anyCompleted = updatedRoutines.some((r) => r.completed);
        const newStatus = p.status === 'sos' ? 'sos' : anyCompleted ? 'active' : 'inactive';
        return {
          ...p,
          dailyRoutines: updatedRoutines,
          status: newStatus,
          lastActive: 'À l\'instant',
        };
      })
    );
  };

  const setMood = (patientId: string, mood: MoodType) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          currentMood: mood,
          lastActive: 'À l\'instant',
        };
      })
    );
  };

  const setTodayNote = (patientId: string, note: string) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          todayNote: note,
          lastActive: 'À l\'instant',
        };
      })
    );
  };

  const triggerSosAlert = (patientId: string, reason?: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          status: 'sos',
          lastActive: `Il y a 1 min (SOS à ${timeStr})`,
          sosAlert: {
            active: true,
            triggeredAt: `Aujourd'hui à ${timeStr}`,
            reason: reason || 'Besoin d\'assistance immédiat - Craving aigu ressenti',
          },
        };
      })
    );
  };

  const resolveSosAlert = (patientId: string) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          status: 'active',
          lastActive: 'À l\'instant (Alerte désamorcée)',
          sosAlert: null,
          currentMood: 'craving_overcome',
          sponsorNotes: [
            {
              id: `sn_${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              author: p.sponsorContact.name,
              content: 'Alerte SOS prise en charge avec succès. Échange rassurant effectué avec le bénéficiaire.',
              isPrivate: true,
            },
            ...p.sponsorNotes,
          ],
        };
      })
    );
  };

  const addAppointment = (patientId: string, item: Omit<Appointment, 'id' | 'completed'>) => {
    const newApt: Appointment = {
      ...item,
      id: `apt_${Date.now()}`,
      completed: false,
    };
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          appointments: [...p.appointments, newApt].sort((a, b) => a.date.localeCompare(b.date)),
        };
      })
    );
  };

  const toggleAppointment = (patientId: string, appointmentId: string) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          appointments: p.appointments.map((a) =>
            a.id === appointmentId ? { ...a, completed: !a.completed } : a
          ),
        };
      })
    );
  };

  const addSponsorNote = (patientId: string, content: string) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        const newNote: SponsorNote = {
          id: `sn_${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          author: p.sponsorContact.name,
          content,
          isPrivate: true,
        };
        return {
          ...p,
          sponsorNotes: [newNote, ...p.sponsorNotes],
        };
      })
    );
  };

  const addNewPatient = (name: string, phone: string, targetDays: number): Patient => {
    const randomCode = `CAP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newId = `p_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;
    const newP: Patient = {
      id: newId,
      code: randomCode,
      name,
      targetDays: targetDays || 30,
      currentDay: 1,
      startDate: new Date().toISOString().split('T')[0],
      status: 'active',
      lastActive: 'À l\'instant (Nouveau profil créé)',
      phone: phone || '+216 -- --- ---',
      sosAlert: null,
      currentMood: 'neutral',
      todayNote: 'Premier jour d\'intégration dans le programme de rétablissement.',
      sponsorContact: {
        name: 'Dr. Youssef K.',
        role: 'Addictologue & Accompagnateur référent',
        phone: '+216 71 890 123',
        supportMessage: `Bienvenue ${name}. Un pas après l\'autre, nous sommes là pour t\'épauler.`,
      },
      dailyRoutines: [
        {
          id: 'r_sport',
          title: 'Marche active ou sport (30 min)',
          description: 'Aérer l\'esprit et stimuler la dopamine naturelle par l\'activité physique.',
          category: 'sport',
          completed: false,
          timeLabel: 'Matin',
        },
        {
          id: 'r_hydration',
          title: 'Hydratation & Repos régulier',
          description: 'Boire 2 litres d\'eau et respecter une sieste ou pause calme de 20 min.',
          category: 'bien-etre',
          completed: false,
          timeLabel: 'Journée',
        },
        {
          id: 'r_med',
          title: 'Traitement de substitution prescrit',
          description: 'Prise de traitement à heure fixe selon le protocole médical convenu.',
          category: 'sante',
          completed: false,
          timeLabel: '18:00',
        },
        {
          id: 'r_checkin',
          title: 'Bilan quotidien avec l\'accompagnateur',
          description: 'Point d\'étape par message ou appel court pour valider la journée.',
          category: 'contact',
          completed: false,
          timeLabel: 'Soir',
        },
      ],
      routineHistory: {},
      appointments: [
        {
          id: `apt_init_${Date.now()}`,
          title: 'Entretien initial et calage des routines',
          date: new Date().toISOString().split('T')[0],
          time: '14:00',
          type: 'sponsor_visit',
          locationOrFormat: 'Au cabinet médical',
          notes: 'Remise du code d\'accès et explications du fonctionnement.',
          completed: true,
        },
      ],
      sponsorNotes: [
        {
          id: `sn_init_${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          author: 'Dr. Youssef K.',
          content: `Création du dossier. Objectif fixé à ${targetDays} jours avec code d\'accès ${randomCode}.`,
          isPrivate: true,
        },
      ],
    };

    setPatients((prev) => [newP, ...prev]);
    setSelectedPatientId(newId);
    return newP;
  };

  const resetToDefaults = () => {
    setPatients(INITIAL_PATIENTS);
    setSelectedPatientId('p_sami');
    setActiveRole('patient');
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ROLE_KEY);
      localStorage.removeItem(PATIENT_ID_KEY);
    } catch (e) {}
  };

  return (
    <RecoveryContext.Provider
      value={{
        patients,
        activeRole,
        selectedPatientId,
        selectedPatient,
        isMobileView,
        isSosModalOpen,
        setActiveRole,
        setSelectedPatientId,
        setIsMobileView,
        setIsSosModalOpen,
        toggleRoutine,
        setMood,
        setTodayNote,
        triggerSosAlert,
        resolveSosAlert,
        addAppointment,
        toggleAppointment,
        addSponsorNote,
        addNewPatient,
        resetToDefaults,
      }}
    >
      {children}
    </RecoveryContext.Provider>
  );
};

export const useRecovery = () => {
  const context = useContext(RecoveryContext);
  if (!context) {
    throw new Error('useRecovery must be used within a RecoveryProvider');
  }
  return context;
};
