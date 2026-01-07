
import React from 'react';
import { 
  Layers, 
  Database, 
  Lock, 
  Smartphone, 
  CheckCircle,
  FileCode,
  Map as MapIcon,
  ShieldAlert
} from 'lucide-react';

const DocumentationPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Guia do Arquiteto Senior</h1>
        <p className="text-xl text-slate-500">Visão Técnica e Passo-a-passo para o GeoPonto Pro</p>
      </div>

      {/* 1. Visão Geral */}
      <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-blue-600 mb-4 flex items-center gap-2">
          <Layers size={28} /> 1. Visão Geral do Sistema
        </h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          O GeoPonto Pro é uma solução SaaS B2B focada em conformidade com a Portaria 671 do Ministério do Trabalho. 
          O sistema utiliza o navegador para capturar dados biométricos (selfie) e geográficos (GPS), garantindo que o colaborador está fisicamente presente no local de trabalho sem necessidade de hardware dedicado.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-2">Pilar Funcional</h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Registro Offline com Sync (opcional)</li>
              <li>• Comprovante PDF assinado digitalmente</li>
              <li>• Painel de Auditoria para RH</li>
            </ul>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-2">Pilar Segurança</h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Detecção de Mock Location (Falso GPS)</li>
              <li>• Captura de IP e User-Agent</li>
              <li>• Criptografia em repouso no Firestore</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 2. Arquitetura */}
      <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-blue-600 mb-4 flex items-center gap-2">
          <FileCode size={28} /> 2. Arquitetura Firebase
        </h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
              <Database size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Cloud Firestore</h3>
              <p className="text-sm text-slate-500">Base NoSQL para armazenamento de dados e perfis em tempo real.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 flex-shrink-0">
              <Lock size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Firebase Auth</h3>
              <p className="text-sm text-slate-500">Gerenciamento de acesso via e-mail/senha com Custom Claims para Roles.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
              <Layers size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Cloud Functions</h3>
              <p className="text-sm text-slate-500">Lógica de servidor para calcular distâncias e gerar relatórios PDF.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Banco de Dados */}
      <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 flex items-center gap-2">
          <Database size={28} /> 3. Estrutura do Firestore
        </h2>
        
        <div className="space-y-6">
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <h3 className="font-bold text-slate-800">Coleção: <code className="bg-slate-100 px-2 py-0.5 rounded text-blue-700">companies</code></h3>
            <p className="text-xs text-slate-500 mb-2">Campos: id, name, cnpj, config: {'{ radius, geofence: { lat, lng } }'}</p>
          </div>
          <div className="border-l-4 border-emerald-500 pl-4 py-2">
            <h3 className="font-bold text-slate-800">Coleção: <code className="bg-slate-100 px-2 py-0.5 rounded text-emerald-700">users</code></h3>
            <p className="text-xs text-slate-500 mb-2">Campos: uid, displayName, role (admin|employee), companyId, email</p>
          </div>
          <div className="border-l-4 border-amber-500 pl-4 py-2">
            <h3 className="font-bold text-slate-800">Coleção: <code className="bg-slate-100 px-2 py-0.5 rounded text-amber-700">records</code></h3>
            <p className="text-xs text-slate-500 mb-2">Campos: userId, companyId, type, timestamp, location (geopoint), selfieUrl, metadata (ip, device)</p>
          </div>
        </div>
      </section>

      {/* 4. Segurança */}
      <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-blue-600 mb-4 flex items-center gap-2">
          <Lock size={28} /> 4. Regras de Segurança (Firestore Rules)
        </h2>
        <div className="bg-slate-900 rounded-2xl p-6 overflow-x-auto">
          <pre className="text-emerald-400 text-xs leading-relaxed">
{`service cloud.firestore {
  match /databases/{database}/documents {
    match /companies/{companyId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.role == 'admin';
    }
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /records/{recordId} {
      allow create: if request.auth != null;
      allow read: if request.auth.token.role == 'admin' 
                  || request.auth.uid == resource.data.userId;
    }
  }
}`}
          </pre>
        </div>
      </section>

      {/* 5. Antifraude */}
      <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 flex items-center gap-2">
          <ShieldAlert size={28} /> 5. Lógica Antifraude
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
              <MapIcon size={28} />
            </div>
            <h4 className="font-bold text-slate-800 mb-1">Cerca Geográfica</h4>
            <p className="text-xs text-slate-500">Bloqueio automático se o colaborador estiver fora do raio permitido da empresa.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Smartphone size={28} />
            </div>
            <h4 className="font-bold text-slate-800 mb-1">Fingerprinting</h4>
            <p className="text-xs text-slate-500">Registramos IP, Versão do Navegador e Bateria para evitar troca de dispositivos.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-4">
              <Lock size={28} />
            </div>
            <h4 className="font-bold text-slate-800 mb-1">Logs Imutáveis</h4>
            <p className="text-xs text-slate-500">Uma vez registrado, o ponto não pode ser editado pelo colaborador nem pelo admin.</p>
          </div>
        </div>
      </section>

      {/* 6. PWA e APK */}
      <section className="bg-blue-600 p-8 rounded-[2rem] text-white">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Smartphone size={28} /> 6. Transformando em App (PWA & APK)
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">Modo PWA (Instalável via Browser)</h3>
            <p className="text-sm text-blue-100 leading-relaxed">
              Adicione um arquivo <code className="bg-white/10 px-1 rounded">manifest.json</code> e um Service Worker. 
              Isso permite que o usuário adicione um ícone na tela inicial e o app abra em tela cheia (Standalone), parecendo um app nativo.
            </p>
          </div>
          <div className="pt-4 border-t border-white/20">
            <h3 className="font-bold text-lg mb-2">Gerando APK (Android)</h3>
            <p className="text-sm text-blue-100 leading-relaxed">
              Utilize o <strong>Capacitor.js</strong> ou <strong>TWA (Trusted Web Activity)</strong> da Google. 
              TWA é o recomendado para apps que já são PWAs, pois permite publicar na Play Store mantendo o código web.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-500 p-3 rounded-2xl text-white">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="font-bold text-slate-800">Checklist Final de Publicação</p>
            <p className="text-xs text-slate-500">Configurar Domínio SSL + Firebase Hosting + Regras de Produção</p>
          </div>
        </div>
        <button className="bg-slate-800 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-slate-200">
          Baixar Checklist
        </button>
      </div>
    </div>
  );
};

export default DocumentationPage;
