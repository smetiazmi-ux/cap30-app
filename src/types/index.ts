export type PatientStatus = 'active' | 'inactive' | 'sos';

export type MoodType = 'serene' | 'good' | 'neutral' | 'vulnerable' | 'craving_overcome';

export interface RoutineItem {
  id: string;
  title: string;
  description: string;
  category: 'sport' | 'sante' | 'bien-etre' | 'contact';
  completed: boolean;
  timeLabel?: string;
}

export interface Appointment {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  type: 'medical' | 'sport' | 'sponsor_visit' | 'group_meeting';
  locationOrFormat: string;
  notes?: string;
  completed: boolean;
}

export interface SponsorNote {
  id: string;
  date: string;
  author: string;
  content: string;
  isPrivate: boolean;
}

export interface Patient {
  id: string;
  code: string; // e.g. "CAP-8492"
  name: string;
  targetDays: number; // 30 or 40
  currentDay: number;
  startDate: string;
  status: PatientStatus;
  lastActive: string;
  sosAlert: {
    active: boolean;
    triggeredAt?: string;
    reason?: string;
    acknowledgedBy?: string;
  } | null;
  dailyRoutines: RoutineItem[];
  routineHistory: Record<string, { completedCount: number; totalCount: number; mood?: MoodType; note?: string }>;
  currentMood: MoodType | null;
  todayNote: string;
  appointments: Appointment[];
  sponsorNotes: SponsorNote[];
  phone: string;
  sponsorContact: {
    name: string;
    role: string;
    phone: string;
    supportMessage: string;
  };
}

export type ActiveRole = 'patient' | 'sponsor';
