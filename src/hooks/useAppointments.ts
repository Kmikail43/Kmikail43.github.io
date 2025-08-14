import { useState, useEffect } from 'react';
import { Appointment, Client } from '../types';
import { mockAppointments, mockClients } from '../data/mockData';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [clients, setClients] = useState<Client[]>(mockClients);

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment = {
      ...appointment,
      id: Date.now().toString()
    };
    setAppointments(prev => [...prev, newAppointment]);
    
    // Ajouter le client s'il n'existe pas
    const existingClient = clients.find(c => c.email === appointment.clientEmail);
    if (!existingClient) {
      const newClient: Client = {
        id: Date.now().toString(),
        name: appointment.clientName,
        email: appointment.clientEmail,
        phone: appointment.clientPhone,
        visitHistory: [newAppointment]
      };
      setClients(prev => [...prev, newClient]);
    } else {
      // Mettre à jour l'historique du client existant
      setClients(prev => prev.map(client => 
        client.email === appointment.clientEmail 
          ? { ...client, visitHistory: [...client.visitHistory, newAppointment] }
          : client
      ));
    }

    return newAppointment;
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, ...updates } : app
    ));
  };

  const cancelAppointment = (id: string) => {
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, status: 'cancelled' as const } : app
    ));
  };

  const getAppointmentsForDate = (date: string) => {
    return appointments.filter(app => 
      app.date === date && app.status !== 'cancelled'
    );
  };

  const getAvailableSlots = (date: string) => {
    const businessHours = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
    ];

    const dayAppointments = getAppointmentsForDate(date);
    
    return businessHours.filter(slot => {
      return !dayAppointments.some(app => {
        const appTime = app.time;
        const appEndTime = addMinutesToTime(appTime, app.duration);
        const slotEndTime = addMinutesToTime(slot, 30);
        
        return (slot >= appTime && slot < appEndTime) || 
               (slotEndTime > appTime && slotEndTime <= appEndTime);
      });
    });
  };

  const addMinutesToTime = (time: string, minutes: number): string => {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
  };

  return {
    appointments,
    clients,
    addAppointment,
    updateAppointment,
    cancelAppointment,
    getAppointmentsForDate,
    getAvailableSlots
  };
};