import type { ActivityLog, Task, TaskType, UserRole } from '../types';

export interface MockStatusUpdate {
  id: string;
  taskId: string;
  notes: string;
  imageName?: string;
  createdAt: string;
}

const TASKS_KEY = 'safestay_mock_tasks';
const WORKERS_KEY = 'safestay_mock_workers';
const CLIENTS_KEY = 'safestay_mock_clients';
const UPDATES_KEY = 'safestay_mock_updates';

const initialTasks: Task[] = [
  {
    id: 'task-101',
    title: 'Post-surgery nursing support',
    description: 'Need medication, mobility support, and a calm evening routine for the patient.',
    type: 'NURSING',
    location: 'T. Nagar, Chennai',
    client_id: 'client-1',
    client_name: 'Mrs. Meera Rao',
    patient_name: 'Mr. Suresh Rao',
    patient_age: 72,
    fee: 1800,
    status: 'PENDING',
    qr_token: 'SAFE-101',
    location_coords: { lat: 13.0348, lng: 80.2206 },
    documents: ['Doctor note', 'Diabetes chart'],
    reminder_required: true,
    latest_update: 'Awaiting caregiver confirmation.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'task-102',
    title: 'Elderly companion and meal assistance',
    description: 'Patient needs companionship, meals on time, and light walk support.',
    type: 'ELDERLY_CARE',
    location: 'Velachery, Chennai',
    client_id: 'client-2',
    client_name: 'Mr. Vivek Sharma',
    patient_name: 'Mrs. Lakshmi Sharma',
    patient_age: 69,
    fee: 1400,
    status: 'ACCEPTED',
    worker_id: 'worker-1',
    qr_token: 'SAFE-102',
    location_coords: { lat: 12.9794, lng: 80.2201 },
    documents: ['Care plan', 'Food restrictions'],
    reminder_required: true,
    latest_update: 'Lunch delivered on time.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
  },
];

const initialWorkers = [
  {
    id: 'worker-1',
    full_name: 'Ananya Priya',
    email: 'ananya@safestay.com',
    aadhaar_number: '111122223333',
    id_proof_path: 'uploads/worker-1-aadhaar.png',
    role: 'WORKER' as UserRole,
    is_verified: false,
    location: 'Chennai',
    skills: ['Elderly care', 'Medication support'],
  },
];

const initialClients = [
  {
    id: 'client-1',
    full_name: 'Mrs. Meera Rao',
    email: 'meera@example.com',
    role: 'CLIENT' as UserRole,
    patient_name: 'Mr. Suresh Rao',
    patient_age: 72,
    fee: 1800,
    address: 'T. Nagar, Chennai',
  },
  {
    id: 'client-2',
    full_name: 'Mr. Vivek Sharma',
    email: 'vivek@example.com',
    role: 'CLIENT' as UserRole,
    patient_name: 'Mrs. Lakshmi Sharma',
    patient_age: 69,
    fee: 1400,
    address: 'Velachery, Chennai',
  },
];

const initialUpdates: MockStatusUpdate[] = [
  {
    id: 'update-1',
    taskId: 'task-102',
    notes: 'Lunch delivered on time and patient is resting comfortably.',
    imageName: 'photo-1.jpg',
    createdAt: new Date().toISOString(),
  },
];

function readStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStored<T>(key: string, value: T) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

export function getMockTasks(): Task[] {
  return readStored<Task[]>(TASKS_KEY, initialTasks);
}

export function saveMockTasks(tasks: Task[]) {
  writeStored(TASKS_KEY, tasks);
}

export function getMockWorkers() {
  return readStored(WORKERS_KEY, initialWorkers);
}

export function saveMockWorkers(workers: typeof initialWorkers) {
  writeStored(WORKERS_KEY, workers);
}

export function getMockClients() {
  return readStored(CLIENTS_KEY, initialClients);
}

export function saveMockClients(clients: typeof initialClients) {
  writeStored(CLIENTS_KEY, clients);
}

export function getMockUpdates(): MockStatusUpdate[] {
  return readStored<MockStatusUpdate[]>(UPDATES_KEY, initialUpdates);
}

export function saveMockUpdates(updates: MockStatusUpdate[]) {
  writeStored(UPDATES_KEY, updates);
}

export function addMockStatusUpdate(taskId: string, notes: string, imageName?: string) {
  const updates = getMockUpdates();
  const newUpdate: MockStatusUpdate = {
    id: `update-${Date.now()}`,
    taskId,
    notes,
    imageName,
    createdAt: new Date().toISOString(),
  };
  const next = [newUpdate, ...updates].slice(0, 10);
  saveMockUpdates(next);

  const tasks = getMockTasks().map((task) =>
    task.id === taskId ? { ...task, latest_update: notes, reminder_required: false } : task,
  );
  saveMockTasks(tasks);
  return newUpdate;
}

export function createMockTask(input: Partial<Task> & { title: string; description: string; location: string; type: TaskType; client_name?: string; patient_name?: string; patient_age?: number; fee?: number; documents?: string[] }) {
  const task: Task = {
    id: `task-${Date.now()}`,
    title: input.title,
    description: input.description,
    type: input.type,
    location: input.location,
    client_id: input.client_id || 'client-1',
    client_name: input.client_name || 'Demo Client',
    patient_name: input.patient_name || 'Demo Patient',
    patient_age: input.patient_age || 70,
    fee: input.fee || 1500,
    status: 'PENDING',
    qr_token: `SAFE-${Math.floor(1000 + Math.random() * 9000)}`,
    location_coords: input.location_coords || { lat: 13.035, lng: 80.221 },
    documents: input.documents || [],
    reminder_required: true,
    latest_update: 'Request posted. Awaiting caregiver confirmation.',
    created_at: new Date().toISOString(),
  };
  const tasks = [task, ...getMockTasks()];
  saveMockTasks(tasks);
  return task;
}

export function getDemoUser(role: UserRole) {
  const worker = getMockWorkers()[0];
  return {
    id: role === 'ADMIN' ? 1 : role === 'WORKER' ? 2 : 3,
    name: role === 'ADMIN' ? 'Admin Maya' : role === 'WORKER' ? worker.full_name : 'Meera Rao',
    email: role === 'ADMIN' ? 'admin@safestay.com' : role === 'WORKER' ? worker.email : 'meera@example.com',
    role,
    is_verified: role === 'WORKER' ? worker.is_verified : true,
  };
}

export function getMockAdminStats() {
  const tasks = getMockTasks();
  const workers = getMockWorkers();
  const clients = getMockClients();
  const monthlyEarnings = tasks.reduce((sum, task) => sum + (task.fee || 0), 0);

  return {
    total_users: workers.length + clients.length + 1,
    pending_workers: workers.filter((worker) => !worker.is_verified).length,
    active_tasks: tasks.filter((task) => task.status === 'ACCEPTED' || task.status === 'IN_PROGRESS').length,
    monthly_earnings: monthlyEarnings,
    pending_clients: tasks.filter((task) => task.status === 'PENDING').length,
  };
}

export function getMockActivityLog(taskId: string): ActivityLog[] {
  return [
    {
      id: `log-${taskId}-1`,
      shift_id: `shift-${taskId}`,
      type: 'ACTIVITY',
      description: 'Patient checked and comforted.',
      timestamp: new Date().toISOString(),
    },
  ];
}
