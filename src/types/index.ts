export type UserRole = 'ADMIN' | 'CLIENT' | 'WORKER';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  token: string;
  is_verified?: boolean;
  email?: string;
}

export interface LocationCoords {
  lat: number;
  lng: number;
}

export interface Worker {
  id: string;
  name: string;
  email: string;
  is_verified: boolean;
  aadhaar_number?: string;
  id_proof_path?: string;
  location?: LocationCoords;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  location?: LocationCoords;
}

export type TaskType = 'NURSING' | 'ELDERLY_CARE' | 'MEDICINE' | 'FOOD' | 'CHECKUP';

export interface MedicalInstruction {
  id: string;
  task_id: string;
  type: string;
  description: string;
  time_slot?: string;
  dosage?: string;
  frequency?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  location: string;
  client_id: string;
  worker_id?: string;
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  qr_token?: string;
  medical_instructions?: MedicalInstruction[];
  created_at: string;
  assigned_at?: string;
  completed_at?: string;
  client_name?: string;
  patient_name?: string;
  patient_age?: number;
  fee?: number;
  documents?: string[];
  location_coords?: LocationCoords;
  reminder_required?: boolean;
  latest_update?: string;
}

export interface Shift {
  id: string;
  task_id: string;
  worker_id: string;
  client_id: string;
  start_time: string;
  end_time?: string;
  status: 'ACTIVE' | 'COMPLETED';
  location_verified: boolean;
  qr_verified: boolean;
}

export interface ActivityLog {
  id: string;
  shift_id: string;
  type: 'MEDICINE' | 'FOOD' | 'ACTIVITY';
  description: string;
  timestamp: string;
  notes?: string;
}

export interface ShiftSummary {
  shift_id: string;
  total_duration: number; // in minutes
  activities_completed: number;
  logs: ActivityLog[];
  report_url?: string;
}

export interface PatientSession {
  patientId: string;
  name: string;
  requiredCoords: LocationCoords;
  tasks: Task[];
}

export interface CareTask {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  timeSlot: string;
}