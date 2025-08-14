import React from 'react';
import { Calendar, Users, Home } from 'lucide-react';

interface HeaderProps {
  currentView: 'home' | 'booking' | 'admin';
  onViewChange: (view: 'home' | 'booking' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SalonPro</h1>
              <p className="text-xs text-gray-500">Gestion de rendez-vous</p>
            </div>
          </div>

          <nav className="flex items-center space-x-1">
            <button
              onClick={() => onViewChange('home')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                currentView === 'home'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Accueil</span>
            </button>

            <button
              onClick={() => onViewChange('booking')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                currentView === 'booking'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Réserver</span>
            </button>

            <button
              onClick={() => onViewChange('admin')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                currentView === 'admin'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};