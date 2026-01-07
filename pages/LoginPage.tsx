
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ShieldCheck, Mail, Lock, Loader2, Bot } from 'lucide-react';
import AIChatBot from '../components/AIChatBot';

interface LoginPageProps {
  onLogin: (user: UserProfile) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent, role: 'admin' | 'employee') => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulação de login
    setTimeout(() => {
      const mockUser: UserProfile = {
        uid: Math.random().toString(36).substr(2, 9),
        email: email || (role === 'admin' ? 'admin@empresa.com' : 'joao@empresa.com'),
        displayName: role === 'admin' ? 'Administrador Senior' : 'João Silva',
        role: role,
        companyId: 'company_123',
        department: role === 'admin' ? 'Diretoria' : 'Vendas',
        createdAt: new Date()
      };
      onLogin(mockUser);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl mb-4 shadow-xl shadow-blue-200">
            <ShieldCheck className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">GeoPonto<span className="text-blue-600">Pro</span></h1>
          <p className="text-slate-500 mt-2 text-lg">Sistema Inteligente de Gestão de Jornada</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100">
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="exemplo@empresa.com.br"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-4">
              <button 
                onClick={(e) => handleSubmit(e, 'employee')}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center shadow-lg shadow-blue-100 disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Entrar (Colaborador)'}
              </button>
              <button 
                onClick={(e) => handleSubmit(e, 'admin')}
                disabled={isLoading}
                className="w-full bg-slate-800 text-white py-3.5 rounded-xl font-bold hover:bg-slate-900 transition-all flex items-center justify-center shadow-lg shadow-slate-200 disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Entrar (Admin)'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-400 text-sm">
              Problemas com o acesso? 
              <button 
                onClick={() => setIsChatOpen(true)}
                className="ml-1 text-blue-600 font-bold hover:underline inline-flex items-center gap-1"
              >
                <Bot size={14} /> Falar com IA de Suporte
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-slate-400 text-xs mt-8">
          Em conformidade com a LGPD e Portaria 671 MTP.
        </p>
      </div>

      {/* AI ChatBot Component */}
      {isChatOpen && <AIChatBot onClose={() => setIsChatOpen(false)} />}
    </div>
  );
};

export default LoginPage;
