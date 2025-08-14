export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  visitHistory: Appointment[];
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  time: string;
  service: string;
  duration: number;
  price: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  notes?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  appointmentId?: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number; // en minutes
  price: number;
  description: string;
}