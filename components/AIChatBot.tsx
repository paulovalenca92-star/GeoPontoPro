
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { X, Send, Bot, User, Loader2, ShieldCheck, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AIChatBotProps {
  onClose: () => void;
}

const AIChatBot: React.FC<AIChatBotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Olá! Sou o assistente inteligente da GeoPonto Pro. Como posso ajudar você hoje com seu acesso ou dúvidas de RH?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-3-flash-preview';
      
      const chat = ai.chats.create({
        model,
        config: {
          systemInstruction: `Você é o assistente virtual de RH e Suporte Técnico da GeoPonto Pro. 
          Seu objetivo é ajudar colaboradores e administradores com:
          1. Problemas de login (esqueci a senha, e-mail não cadastrado).
          2. Erros de localização (GPS desativado, fora do raio da empresa).
          3. Dúvidas sobre a selfie (iluminação, câmera não abre).
          4. Legislação: Portaria 671 e LGPD (explicar que os dados são seguros e usados apenas para fins jurídicos trabalhistas).
          5. Como bater ponto pelo QR Code.
          
          Seja extremamente profissional, empático e use português do Brasil. 
          Se não souber algo técnico específico da conta do usuário, oriente-o a procurar o gestor direto ou o RH físico da empresa.
          Mantenha as respostas concisas e organizadas.`,
        },
      });

      const result = await chat.sendMessageStream({ message: userMessage });
      
      let fullResponse = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of result) {
        const textChunk = chunk.text;
        fullResponse += textChunk;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          const rest = prev.slice(0, -1);
          return [...rest, { role: 'model', text: fullResponse }];
        });
      }
    } catch (error) {
      console.error('AI Chat Error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Desculpe, tive um problema técnico ao processar sua dúvida. Por favor, tente novamente ou contate seu RH.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-end p-4 md:p-8 pointer-events-none">
      <div className="bg-white w-full max-w-md h-[80vh] md:h-[600px] rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col pointer-events-auto overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
        
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
              <Bot size={24} />
            </div>
            <div>
              <h3 className="font-bold flex items-center gap-2">
                Suporte IA <Sparkles size={14} className="text-blue-200" />
              </h3>
              <p className="text-xs text-blue-100">Sempre online para ajudar</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50"
        >
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-blue-600 shadow-sm'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                }`}>
                  {msg.text || (isLoading && i === messages.length - 1 ? <Loader2 size={16} className="animate-spin" /> : '')}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Input */}
        <div className="p-6 bg-white border-t border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={12} className="text-emerald-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Atendimento Seguro & Criptografado</span>
          </div>
          <div className="relative">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua dúvida aqui..."
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatBot;
