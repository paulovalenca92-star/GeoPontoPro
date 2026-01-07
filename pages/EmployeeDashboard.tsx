
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, RecordType, PointRecord } from '../types';
import { 
  Camera, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowRightLeft,
  Loader2,
  ScanQrCode,
  X,
  Scan
} from 'lucide-react';

interface EmployeeDashboardProps {
  user: UserProfile;
  onRecordComplete: (record: PointRecord) => void;
  lastRecords: PointRecord[];
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ user, onRecordComplete, lastRecords }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [step, setStep] = useState<'idle' | 'scanning' | 'camera' | 'confirming'>('idle');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const requestLocation = () => {
    return new Promise<{lat: number, lng: number}>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('GPS não suportado');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => reject('Acesso ao GPS negado'),
        { enableHighAccuracy: true }
      );
    });
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const startPointFlow = async (useScanner: boolean = false) => {
    setError(null);
    setLoading(true);
    try {
      const loc = await requestLocation();
      setLocation(loc);
      
      if (useScanner) {
        setStep('scanning');
      } else {
        setStep('camera');
      }
      
      setTimeout(async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: useScanner ? 'environment' : 'user' } 
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setLoading(false);

          if (useScanner) {
            setTimeout(() => {
              handleQRCodeDetected();
            }, 3000);
          }
        } catch (e) {
          setError("Erro ao acessar a câmera. Verifique as permissões.");
          setLoading(false);
          setStep('idle');
        }
      }, 100);
    } catch (err: any) {
      setError(err);
      setLoading(false);
      setStep('idle');
    }
  };

  const handleQRCodeDetected = () => {
    stopCamera();
    setStep('camera');
    setTimeout(async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }, 100);
  };

  const takeSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setSelfie(dataUrl);
        stopCamera();
        setStep('confirming');
      }
    }
  };

  const finalizeRecord = async (type: RecordType) => {
    setLoading(true);
    const newRecord: PointRecord = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.uid,
      userName: user.displayName,
      companyId: user.companyId,
      timestamp: new Date().toISOString(),
      type: type,
      location: location || { lat: 0, lng: 0 },
      selfieUrl: selfie || '',
      ip: '189.120.x.x',
      deviceInfo: navigator.userAgent,
      status: 'valid',
      distanceFromOffice: Math.floor(Math.random() * 50)
    };

    setTimeout(() => {
      onRecordComplete(newRecord);
      setIsSuccess(true);
      setLoading(false);
      setStep('idle');
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1500);
  };

  const cancelFlow = () => {
    stopCamera();
    setStep('idle');
    setError(null);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const getRecordForType = (type: RecordType) => {
    return lastRecords.find(r => r.type === type && new Date(r.timestamp).toDateString() === new Date().toDateString());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Olá, {user.displayName}</h1>
          <p className="text-slate-500 capitalize">{formatDate(currentTime)}</p>
        </div>
        <div className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <Clock className="text-blue-600" size={28} />
          <span className="text-4xl font-mono font-bold text-slate-800 tracking-wider">
            {formatTime(currentTime)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {step === 'idle' && (
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center justify-center text-center min-h-[400px]">
              {isSuccess ? (
                <div className="animate-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <CheckCircle2 className="text-green-600 w-12 h-12" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Ponto Registrado!</h2>
                  <p className="text-slate-500">Comprovante atualizado no seu histórico.</p>
                </div>
              ) : (
                <>
                  <div className="p-4 bg-blue-50 rounded-3xl mb-8">
                    <MapPin className="text-blue-600 w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-4 px-4">Pronto para registrar sua jornada?</h2>
                  <p className="text-slate-500 mb-10 max-w-sm text-sm">
                    Sua localização atual será validada contra o perímetro da empresa.
                  </p>
                  
                  <button 
                    onClick={() => startPointFlow(false)}
                    disabled={loading}
                    className="group relative w-full max-w-xs h-64 bg-blue-600 hover:bg-blue-700 text-white rounded-[3rem] transition-all flex flex-col items-center justify-center gap-4 shadow-2xl shadow-blue-200 active:scale-95 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin w-12 h-12" /> : (
                      <>
                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <CheckCircle2 size={48} />
                        </div>
                        <span className="text-2xl font-bold">Bater Ponto</span>
                      </>
                    )}
                  </button>
                </>
              )}
              {error && (
                <div className="mt-6 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-xl">
                  <AlertCircle size={18} />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}
            </div>
          )}

          {(step === 'scanning' || step === 'camera') && (
            <div className="bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl relative min-h-[450px]">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover aspect-video" />
              <button onClick={cancelFlow} className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors"><X size={24} /></button>
              {step === 'scanning' ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-64 h-64 border-4 border-blue-500 rounded-3xl relative animate-pulse">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Buscando QR Code</div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col items-center bg-gradient-to-t from-black/80 to-transparent">
                  <button onClick={takeSelfie} className="w-20 h-20 bg-white rounded-full p-1 border-4 border-blue-500 shadow-lg active:scale-90 transition-transform"><div className="w-full h-full bg-white rounded-full flex items-center justify-center"><Camera className="text-blue-600" size={32} /></div></button>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}

          {step === 'confirming' && selfie && (
            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Confirmar Registro</h2>
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <img src={selfie} alt="Selfie" className="w-full md:w-48 h-48 object-cover rounded-2xl border-2 border-blue-100 shadow-md" />
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => finalizeRecord('entry')} className="bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700">Entrada</button>
                    <button onClick={() => finalizeRecord('exit')} className="bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-900">Saída</button>
                    <button onClick={() => finalizeRecord('pause_start')} className="bg-amber-500 text-white py-3 rounded-xl font-bold hover:bg-amber-600">Pausa</button>
                    <button onClick={() => finalizeRecord('pause_end')} className="bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700">Retorno</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Jornada de Hoje</h3>
            <div className="space-y-4">
              {[
                { type: 'entry' as RecordType, label: 'Entrada', color: 'border-blue-500 bg-blue-50/50' },
                { type: 'pause_start' as RecordType, label: 'Pausa Almoço', color: 'border-amber-500 bg-amber-50/50' },
                { type: 'pause_end' as RecordType, label: 'Retorno Almoço', color: 'border-emerald-500 bg-emerald-50/50' },
                { type: 'exit' as RecordType, label: 'Saída', color: 'border-slate-800 bg-slate-50' },
              ].map(item => {
                const rec = getRecordForType(item.type);
                return (
                  <div key={item.type} className={`flex items-center justify-between p-3 border-l-4 ${rec ? item.color : 'border-slate-200 bg-slate-50 opacity-50'} rounded-r-xl`}>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{item.label}</p>
                      <p className={`font-bold ${rec ? 'text-slate-700' : 'text-slate-400'}`}>
                        {rec ? new Date(rec.timestamp).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'}) : '--:--'}
                      </p>
                    </div>
                    {rec && <CheckCircle2 className="text-blue-500" size={18} />}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-200">
            <ScanQrCode className="mb-4" size={32} />
            <h3 className="text-lg font-bold mb-2">QR Code Estação</h3>
            <button onClick={() => startPointFlow(true)} disabled={loading || step !== 'idle'} className="w-full bg-white/20 hover:bg-white/30 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2">
              <Scan size={18} /> Abrir Scanner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
