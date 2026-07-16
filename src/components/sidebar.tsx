// components/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Layers,
  ClipboardList,
  LogOut,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { logout } from '../utils/auth';
import { authApi } from '../api/auth.api';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Estado para saber si el sidebar está expandido (true) o colapsado (false)
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const [studentName, setStudentName] = useState<string | null>(null);

  useEffect(() => {
    authApi.me()
      .then((user) => setStudentName(user.name))
      .catch((error) => console.error('Error al obtener el usuario:', error));
  }, []);

  // Lista de opciones del menú basadas en los módulos de tu proyecto
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Mis Salas', icon: Users, path: '/mis-salas' },
    { name: 'Flashcards', icon: Layers, path: '/flashcards' },
    { name: 'Exámenes', icon: ClipboardList, path: '/examenes' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = studentName ?? 'Estudiante';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div 
      className={`h-screen sticky top-0 bg-gray-900 text-white flex flex-col transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* LOGO Y BOTÓN DE COLAPSAR */}
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        {isOpen && (
          <span className="text-xl font-bold text-indigo-400 flex items-center gap-2">
            <GraduationCap className="w-6 h-6" />
            Estudy with IA
          </span>
        )}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-800 rounded-lg focus:outline-none transition-colors ml-auto"
          title={isOpen ? "Colapsar menú" : "Expandir menú"}
        >
          {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>

      {/* PERFIL DEL ESTUDIANTE */}
      <div className="p-4 border-b border-gray-800 flex items-center space-x-3 overflow-hidden">
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold shrink-0 text-white shadow-inner">
          {initial}
        </div>
        {isOpen && (
          <div className="truncate">
            <h4 className="text-sm font-semibold truncate uppercase">{displayName}</h4>
          </div>
        )}
      </div>

      {/* ENLACES DE NAVEGACIÓN */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {isOpen && <span className="text-sm tracking-wide">{item.name}</span>}
            </button>
          );
        })}
      </nav>
      
      {/* BOTÓN DE CERRAR SESIÓN */}
      <div className="p-3 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl font-medium text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all"
          title="Cerrar sesión"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {isOpen && <span className="text-sm tracking-wide">Cerrar Sesión</span>}
        </button>
      </div>

      {/* PIE DE PÁGINA DEL SIDEBAR */}
      <div className="p-4 border-t border-gray-800 text-xs text-center text-gray-500 overflow-hidden whitespace-nowrap">
        {isOpen ? '© 2026 EduRAG Platform' : 'v1.0'}
      </div>
    </div>
  );
};