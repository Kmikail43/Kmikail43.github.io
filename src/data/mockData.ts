import { Appointment, Client, Service } from '../types';

export const services: Service[] = [
  {
    id: '1',
    name: 'Coupe Femme',
    duration: 45,
    price: 35,
    description: 'Coupe et brushing personnalisés'
  },
  {
    id: '2',
    name: 'Coupe Homme',
    duration: 30,
    price: 25,
    description: 'Coupe masculine avec finition'
  },
  {
    id: '3',
    name: 'Coloration',
    duration: 120,
    price: 80,
    description: 'Coloration complète avec soin'
  },
  {
    id: '4',
    name: 'Mèches',
    duration: 90,
    price: 60,
    description: 'Mèches et balayage'
  },
  {
    id: '5',
    name: 'Brushing',
    duration: 30,
    price: 20,
    description: 'Brushing et mise en pli'
  }
];

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    phone: '06 12 34 56 78',
    visitHistory: []
  },
  {
    id: '2',
    name: 'Jean Martin',
    email: 'jean.martin@email.com',
    phone: '06 87 65 43 21',
    visitHistory: []
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'Marie Dubois',
    clientEmail: 'marie.dubois@email.com',
    clientPhone: '06 12 34 56 78',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // demain
    time: '09:00',
    service: 'Coupe Femme',
    duration: 45,
    price: 35,
    status: 'confirmed',
    notes: 'Coupe courte moderne'
  },
  {
    id: '2',
    clientId: '2',
    clientName: 'Jean Martin',
    clientEmail: 'jean.martin@email.com',
    clientPhone: '06 87 65 43 21',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // demain
    time: '14:30',
    service: 'Coupe Homme',
    duration: 30,
    price: 25,
    status: 'confirmed'
  }
];