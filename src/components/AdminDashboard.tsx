import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Phone, 
  Mail, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Plus,
  Filter,
  Search,
  Edit,
  Trash2
} from 'lucide-react';
import { useAppointments } from '../hooks/useAppointments';
import { Appointment } from '../types';

interface AdminDashboardProps {
  appointmentSystem: ReturnType<typeof useAppointments>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ appointmentSystem }) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCalendarView, setShowCalendarView] = useState(true);

  const { 
    appointments, 
    clients, 
    updateAppointment, 
    cancelAppointment, 
    getAppointmentsForDate 
  } = appointmentSystem;

  // Statistiques du jour
  const todayAppointments = getAppointmentsForDate(selectedDate);
  const todayStats = useMemo(() => {
    const confirmed = todayAppointments.filter(app => app.status === 'confirmed').length;
    const pending = todayAppointments.filter(app => app.status === 'pending').length;
    const completed = todayAppointments.filter(app => app.status === 'completed').length;
    const cancelled = todayAppointments.filter(app => app.status === 'cancelled').length;
    const totalRevenue = todayAppointments
      .filter(app => app.status === 'completed')
      .reduce((sum, app) => sum + app.price, 0);
    
    return { confirmed, pending, completed, cancelled, totalRevenue };
  }, [todayAppointments]);

  // Filtrage des rendez-vous
  const filteredAppointments = useMemo(() => {
    let filtered = todayAppointments;
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(app => app.status === filterStatus);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.service.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => a.time.localeCompare(b.time));
  }, [todayAppointments, filterStatus, searchTerm]);

  const handleStatusChange = (appointmentId: string, newStatus: Appointment['status']) => {
    updateAppointment(appointmentId, { status: newStatus });
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-50 border-green-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'completed': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Génération des créneaux horaires pour la vue calendrier
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tableau de bord administrateur
          </h1>
          <p className="text-gray-600">
            Gérez vos rendez-vous et suivez votre activité
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Confirmés</p>
                <p className="text-2xl font-bold text-gray-900">{todayStats.confirmed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">{todayStats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Terminés</p>
                <p className="text-2xl font-bold text-gray-900">{todayStats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Annulés</p>
                <p className="text-2xl font-bold text-gray-900">{todayStats.cancelled}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-green-600">€</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Chiffre d'affaires</p>
                <p className="text-2xl font-bold text-gray-900">{todayStats.totalRevenue}€</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-600" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowCalendarView(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    showCalendarView 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Vue calendrier
                </button>
                <button
                  onClick={() => setShowCalendarView(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !showCalendarView 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Vue liste
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmés</option>
                <option value="completed">Terminés</option>
                <option value="cancelled">Annulés</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">
              Rendez-vous du {formatDate(selectedDate)}
            </h2>
          </div>

          {showCalendarView ? (
            /* Calendar View */
            <div className="p-6">
              <div className="grid grid-cols-1 gap-2">
                {timeSlots.map((timeSlot) => {
                  const appointment = filteredAppointments.find(app => app.time === timeSlot);
                  
                  return (
                    <div key={timeSlot} className="flex border-b border-gray-100 py-3">
                      <div className="w-20 text-sm font-medium text-gray-600 pt-1">
                        {timeSlot}
                      </div>
                      
                      <div className="flex-1">
                        {appointment ? (
                          <div className={`p-4 rounded-lg border ${getStatusColor(appointment.status)}`}>
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  {getStatusIcon(appointment.status)}
                                  <span className="font-semibold">{appointment.clientName}</span>
                                  <span className="text-sm">- {appointment.service}</span>
                                </div>
                                
                                <div className="text-sm space-x-4">
                                  <span className="flex items-center inline">
                                    <Phone className="w-3 h-3 mr-1" />
                                    {appointment.clientPhone}
                                  </span>
                                  <span className="flex items-center inline">
                                    <Mail className="w-3 h-3 mr-1" />
                                    {appointment.clientEmail}
                                  </span>
                                </div>
                                
                                {appointment.notes && (
                                  <p className="text-sm mt-2 text-gray-600">
                                    Note: {appointment.notes}
                                  </p>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-900">
                                  {appointment.price}€
                                </span>
                                
                                <select
                                  value={appointment.status}
                                  onChange={(e) => handleStatusChange(appointment.id, e.target.value as Appointment['status'])}
                                  className="text-sm border border-gray-300 rounded px-2 py-1"
                                >
                                  <option value="pending">En attente</option>
                                  <option value="confirmed">Confirmé</option>
                                  <option value="completed">Terminé</option>
                                  <option value="cancelled">Annulé</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 text-gray-400 text-sm border border-dashed border-gray-200 rounded-lg">
                            Créneau disponible
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* List View */
            <div className="divide-y divide-gray-100">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(appointment.status)}`}>
                            {getStatusIcon(appointment.status)}
                            <span className="ml-2 capitalize">{appointment.status}</span>
                          </span>
                          
                          <span className="text-lg font-semibold text-gray-900">
                            {appointment.clientName}
                          </span>
                          
                          <span className="text-gray-600">
                            {appointment.time} - {appointment.service}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Phone className="w-4 h-4 mr-2" />
                            {appointment.clientPhone}
                          </span>
                          <span className="flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            {appointment.clientEmail}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {appointment.duration} min
                          </span>
                        </div>
                        
                        {appointment.notes && (
                          <p className="mt-2 text-sm text-gray-600">
                            <strong>Note:</strong> {appointment.notes}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <span className="text-xl font-bold text-gray-900">
                          {appointment.price}€
                        </span>
                        
                        <select
                          value={appointment.status}
                          onChange={(e) => handleStatusChange(appointment.id, e.target.value as Appointment['status'])}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="pending">En attente</option>
                          <option value="confirmed">Confirmé</option>
                          <option value="completed">Terminé</option>
                          <option value="cancelled">Annulé</option>
                        </select>
                        
                        <button
                          onClick={() => cancelAppointment(appointment.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Aucun rendez-vous trouvé pour cette date.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Clients Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Clients ({clients.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {clients.map((client) => (
              <div key={client.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{client.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {client.email}
                      </span>
                      <span className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {client.phone}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-600">
                      {client.visitHistory.length} visite{client.visitHistory.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};