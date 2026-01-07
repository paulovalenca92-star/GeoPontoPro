
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { UserProfile } from '../types';
import { 
  Home, 
  History, 
  Settings, 
  BookOpen, 
  LogOut, 
  Bell, 
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';

interface LayoutProps {
  user: UserProfile;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout }) => {
  const location = useLocation();

  const navItems = [
    { label: 'Início', path: '/', icon: Home },
    { label: 'Histórico', path: '/history', icon: History },
    ...(user.role === 'admin' ? [{ label: 'Empresa', path: '/settings', icon: Settings }] : []),
    { label: 'Guia Arquiteto', path: '/docs', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
        <div className="p-6 flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">GeoPonto<span className="text-blue-600">Pro</span></span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
              <UserIcon className="text-slate-500" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user.displayName}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-blue-600 w-6 h-6" />
          <span className="font-bold text-lg">GeoPontoPro</span>
        </div>
        <button onClick={onLogout} className="text-red-600">
          <LogOut size={22} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 z-10 shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 ${isActive ? 'text-blue-600' : 'text-slate-400'}`}
            >
              <Icon size={22} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
