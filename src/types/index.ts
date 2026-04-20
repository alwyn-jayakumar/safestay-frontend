export type UserRole = 'ADMIN' | 'CLIENT' | 'WORKER';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  token: string;
}

export interface LocationCoords {
  lat: number;
  lng: number;
}

export interface Task {
  id: string;
  title: string;
  time: string;
  isCompleted: boolean;
  type: 'MEDICINE' | 'CHECKUP' | 'FOOD';
}

export interface PatientSession {
  patientId: string;
  name: string;
  requiredCoords: LocationCoords;
  tasks: Task[];
}