
import React from 'react';
import { UserProfile, PointRecord } from '../types';
import { Calendar, FileText, ChevronRight, MapPin, CheckCircle2 } from 'lucide-react';

interface HistoryPageProps {
  user: UserProfile;
  records: PointRecord[];
}

const HistoryPage: React.FC<HistoryPageProps> = ({ user, records }) => {
  // Agrupar registros por data
  const grouped = records.reduce((acc, curr) => {
    const date = new Date(curr.timestamp).toLocaleDateString('pt-BR');
    if (!acc[date]) acc[date] = [];
    acc[date].push(curr);
    return acc;
  }, {} as Record<string, PointRecord[]>);

  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Meu Histórico</h1>
          <p className="text-slate-500">Visualize seus registros mensais</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-2 text-slate-600 font-medium">
            <Calendar size={18} /> {new Date().toLocaleDateString('pt-BR', {month: 'long', year: 'numeric'})}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Registros</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {dates.map((date) => (
                <tr key={date} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-800">{date}</p>
                  </td>
                  <td className="px-6 py-5 flex gap-2">
                    {grouped[date].map(r => (
                      <span key={r.id} className="text-[10px] font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-lg">
                        {new Date(r.timestamp).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})} ({r.type})
                      </span>
                    ))}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full">VALIDADO</span>
                  </td>
                </tr>
              ))}
              {dates.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-slate-400 italic">Nenhum registro encontrado nesta sessão.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
