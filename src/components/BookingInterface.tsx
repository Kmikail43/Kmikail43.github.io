import React, { useState, useMemo } from 'react';
import { Calendar, Clock, User, Phone, Mail, Check, ArrowLeft } from 'lucide-react';
import { services } from '../data/mockData';
import { Service, Appointment } from '../types';
import { useAppointments } from '../hooks/useAppointments';

interface BookingInterfaceProps {
  appointmentSystem: ReturnType<typeof useAppointments>;
}

export const BookingInterface: React.FC<BookingInterfaceProps> = ({ appointmentSystem }) => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [isConfirmed, setIsConfirmed] = useState(false);

  const { addAppointment, getAvailableSlots } = appointmentSystem;

  // Générer les dates disponibles (30 prochains jours)
  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Exclure les dimanches
      if (date.getDay() !== 0) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    return dates;
  }, []);

  const availableSlots = useMemo(() => {
    if (!selectedDate) return [];
    return getAvailableSlots(selectedDate);
  }, [selectedDate, getAvailableSlots]);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
    setStep(3);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(4);
  };

  const handleBooking = () => {
    if (!selectedService || !selectedDate || !selectedTime) return;

    const appointment: Omit<Appointment, 'id'> = {
      clientId: '',
      clientName: clientInfo.name,
      clientEmail: clientInfo.email,
      clientPhone: clientInfo.phone,
      date: selectedDate,
      time: selectedTime,
      service: selectedService.name,
      duration: selectedService.duration,
      price: selectedService.price,
      status: 'pending',
      notes: clientInfo.notes
    };

    addAppointment(appointment);
    setIsConfirmed(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const resetBooking = () => {
    setStep(1);
    setSelectedService(null);
    setSelectedDate('');
    setSelectedTime('');
    setClientInfo({ name: '', email: '', phone: '', notes: '' });
    setIsConfirmed(false);
  };

  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Réservation confirmée !
            </h2>
            
            <p className="text-gray-600 mb-8">
              Votre rendez-vous a été enregistré avec succès. Vous recevrez un email de confirmation sous peu.
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">Détails du rendez-vous :</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                  <span>{formatDate(selectedDate)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-600 mr-3" />
                  <span>{selectedTime}</span>
                </div>
                <div className="flex items-center">
                  <User className="w-5 h-5 text-blue-600 mr-3" />
                  <span>{selectedService?.name} - {selectedService?.price}€</span>
                </div>
              </div>
            </div>

            <button
              onClick={resetBooking}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Nouvelle réservation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {[1, 2, 3, 4].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  step >= stepNum
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {stepNum}
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-8 text-sm text-gray-600">
            <span className={step >= 1 ? 'text-blue-600 font-medium' : ''}>Service</span>
            <span className={step >= 2 ? 'text-blue-600 font-medium' : ''}>Date</span>
            <span className={step >= 3 ? 'text-blue-600 font-medium' : ''}>Heure</span>
            <span className={step >= 4 ? 'text-blue-600 font-medium' : ''}>Infos</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Step 1: Service Selection */}
          {step === 1 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Choisissez votre service
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className="border border-gray-200 rounded-xl p-6 cursor-pointer hover:border-blue-300 hover:shadow-lg transition-all duration-200 group"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {service.duration} min
                      </span>
                      <span className="text-blue-600 font-bold text-lg">
                        {service.price}€
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Date Selection */}
          {step === 2 && (
            <div className="p-8">
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setStep(1)}
                  className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold text-gray-900">
                  Choisissez une date
                </h2>
              </div>
              
              <div className="mb-4 p-4 bg-blue-50 rounded-xl">
                <p className="text-blue-800">
                  Service sélectionné : <span className="font-semibold">{selectedService?.name}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {availableDates.slice(0, 15).map((date) => (
                  <button
                    key={date}
                    onClick={() => handleDateSelect(date)}
                    className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-center"
                  >
                    <div className="text-sm text-gray-600 mb-1">
                      {new Date(date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                    </div>
                    <div className="font-semibold text-gray-900">
                      {new Date(date).toLocaleDateString('fr-FR', { 
                        day: 'numeric',
                        month: 'short'
                      })}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Time Selection */}
          {step === 3 && (
            <div className="p-8">
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setStep(2)}
                  className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold text-gray-900">
                  Choisissez un horaire
                </h2>
              </div>

              <div className="mb-4 p-4 bg-blue-50 rounded-xl">
                <p className="text-blue-800">
                  Date sélectionnée : <span className="font-semibold">{formatDate(selectedDate)}</span>
                </p>
              </div>

              {availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {availableSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 font-medium text-center"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">Aucun créneau disponible pour cette date.</p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Client Information */}
          {step === 4 && (
            <div className="p-8">
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setStep(3)}
                  className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold text-gray-900">
                  Vos informations
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      value={clientInfo.name}
                      onChange={(e) => setClientInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Votre nom et prénom"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={clientInfo.email}
                      onChange={(e) => setClientInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="votre.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={clientInfo.phone}
                      onChange={(e) => setClientInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="06 12 34 56 78"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (optionnel)
                    </label>
                    <textarea
                      rows={3}
                      value={clientInfo.notes}
                      onChange={(e) => setClientInfo(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                      placeholder="Précisions particulières..."
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Récapitulatif</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service :</span>
                      <span className="font-medium">{selectedService?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date :</span>
                      <span className="font-medium">{formatDate(selectedDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Heure :</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durée :</span>
                      <span className="font-medium">{selectedService?.duration} min</span>
                    </div>
                    <hr className="my-3" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total :</span>
                      <span className="text-blue-600">{selectedService?.price}€</span>
                    </div>
                  </div>

                  <button
                    onClick={handleBooking}
                    disabled={!clientInfo.name || !clientInfo.email || !clientInfo.phone}
                    className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Confirmer la réservation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};