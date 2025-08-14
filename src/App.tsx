import React, { useState } from 'react';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { BookingInterface } from './components/BookingInterface';
import { AdminDashboard } from './components/AdminDashboard';
import { useAppointments } from './hooks/useAppointments';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'booking' | 'admin'>('home');
  const appointmentSystem = useAppointments();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <Home onViewChange={setCurrentView} />;
      case 'booking':
        return <BookingInterface appointmentSystem={appointmentSystem} />;
      case 'admin':
        return <AdminDashboard appointmentSystem={appointmentSystem} />;
      default:
        return <Home onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      <main>
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;