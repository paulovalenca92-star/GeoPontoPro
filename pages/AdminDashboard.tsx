
import React, { useState } from 'react';
import { UserProfile, PointRecord } from '../types';
import { 
  Users, 
  Clock, 
  MapPin, 
  Download, 
  CheckCircle, 
  X, 
  Filter,
  TrendingUp,
  AlertTriangle,
  Loader2,
  Plus,
  Mail,
  Briefcase
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

interface AdminDashboardProps {
  user: UserProfile;
  records: PointRecord[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, records }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const todayPoints = records.filter(r => new Date(r.timestamp).toDateString() === new Date().toDateString()).length;

  const chartData = [
    { name: 'Seg', total: 42, atrasos: 2 },
    { name: 'Ter', total: 45, atrasos: 5 },
    { name: 'Qua', total: 40, atrasos: 1 },
    { name: 'Qui', total: 44, atrasos: 3 },
    { name: 'Sex', total: 38 + todayPoints, atrasos: 8 },
  ];

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 2000);
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="space-y-8 relative">
      {showToast && (
        <div className="fixed top-8 right-8 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-slate-800 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700">
            <CheckCircle className="text-emerald-400" size={20} />
            <span className="font-medium">Operação realizada com sucesso!</span>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Painel de Controle RH</h1>
          <p className="text-slate-500">Gestão em tempo real da jornada da equipe</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} disabled={isExporting} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-all disabled:opacity-50">
            {isExporting ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
            {isExporting ? 'Processando...' : 'Exportar Relatório'}
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 px-4 py-2.5 rounded-xl text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95">
            <Plus size={18} /> Novo Colaborador
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Colaboradores Ativos', value: '45', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pontos Hoje', value: todayPoints > 0 ? todayPoints.toString() : '128', icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Alertas Fraude', value: '3', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Atrasos na Semana', value: '12%', icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-hover hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}><stat.icon size={24} /></div>
              <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">LIVE</span>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-8">Assiduidade Semanal</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="atrasos" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Atividade Recente</h3>
          <div className="space-y-6">
            {records.length > 0 ? records.slice(0, 5).map((point) => (
              <div key={point.id} className="flex gap-4 group">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50 transition-colors">
                  <Users className="text-slate-400 group-hover:text-blue-500" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{point.userName}</p>
                  <p className="text-xs text-slate-500 uppercase">{point.type} às {new Date(point.timestamp).toLocaleTimeString()}</p>
                </div>
                <CheckCircle className="text-emerald-500" size={18} />
              </div>
            )) : (
              <p className="text-slate-400 text-sm italic">Nenhum registro hoje.</p>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in">
             <h2 className="text-2xl font-bold mb-4">Novo Colaborador</h2>
             <button onClick={() => setIsModalOpen(false)} className="bg-blue-600 text-white w-full py-3 rounded-xl font-bold">Salvar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
