
import React from 'react';
import { MapPin, Shield, Building, Globe, Save } from 'lucide-react';

const CompanySettings: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Configurações da Unidade</h1>
        <p className="text-slate-500">Defina os parâmetros de controle para esta unidade de trabalho.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 space-y-8">
          {/* Identificação */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Building size={16} /> Identificação
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Razão Social</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" defaultValue="Minha Empresa S.A." />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">CNPJ</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" defaultValue="00.000.000/0001-00" />
              </div>
            </div>
          </section>

          {/* Localização e Raio */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin size={16} /> Geolocalização (Geofence)
            </h3>
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-4 mb-4">
              <Globe className="text-blue-600" />
              <p className="text-sm text-blue-700 font-medium">O ponto só será permitido dentro do raio configurado abaixo.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Endereço Principal</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" defaultValue="Avenida Paulista, 1000 - São Paulo, SP" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Raio Permitido (Metros)</label>
                <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" defaultValue="200" />
              </div>
            </div>
          </section>

          {/* Segurança */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Shield size={16} /> Protocolos de Segurança
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Obrigar Selfie para todos os colaboradores', enabled: true },
                { label: 'Obrigar GPS em Alta Precisão', enabled: true },
                { label: 'Bloquear registro de ponto se estiver offline', enabled: false },
                { label: 'Permitir registro via QR Code da estação', enabled: true },
              ].map((policy, i) => (
                <label key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <span className="text-sm font-medium text-slate-700">{policy.label}</span>
                  <div className={`w-12 h-6 rounded-full relative transition-colors ${policy.enabled ? 'bg-blue-600' : 'bg-slate-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${policy.enabled ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
            <Save size={20} /> Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanySettings;
