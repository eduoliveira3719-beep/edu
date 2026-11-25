import React, { useState } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Clock,
  ShieldCheck,
  CheckCheck,
  ArrowRight,
  PhoneCall,
} from 'lucide-react';

export const FloatingWhatsAppChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [customMessage, setCustomMessage] = useState<string>('');
  const [unreadBadge, setUnreadBadge] = useState<boolean>(true);

  const quickQuestions = [
    'Gostaria de solicitar um orçamento para minha mudança.',
    'Quero enviar o vídeo do meu imóvel para agilizar o orçamento.',
    'Preciso de uma mudança com data urgente.',
    'Como funciona a mudança compartilhada?',
  ];

  const handleOpenChat = () => {
    setIsOpen(!isOpen);
    setUnreadBadge(false);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || customMessage).trim() || 'Olá! Gostaria de falar com um consultor da TNK Mudanças.';
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/5538999692413?text=${encoded}`, '_blank');
    setCustomMessage('');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
        {/* Animated Tooltip (visible when closed) */}
        {!isOpen && unreadBadge && (
          <div
            onClick={handleOpenChat}
            className="mb-2 px-3.5 py-1.5 rounded-full bg-[#1b1e28] border border-[#ff6a00]/50 text-white text-xs font-semibold shadow-xl cursor-pointer hover:border-[#ff6a00] transition flex items-center gap-2 group animate-bounce glow-orange-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#25d366] animate-pulse" />
            <span className="text-[#ff6a00] font-bold">Fale com a TNK no WhatsApp</span>
          </div>
        )}

        <button
          onClick={handleOpenChat}
          aria-label="Abrir chat no WhatsApp"
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#20ba59] to-[#25d366] text-white shadow-2xl shadow-[#25d366]/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          {isOpen ? (
            <X className="w-7 h-7 stroke-[2.5]" />
          ) : (
            <>
              <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
              {/* Online pulse dot */}
              <span className="absolute top-0 right-0 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#ff6a00] border-2 border-black"></span>
              </span>
            </>
          )}
        </button>
      </div>

      {/* Styled Chat Pop-up Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-40 w-[92vw] sm:w-[380px] rounded-3xl bg-[#13151c] border border-[#2c3040] shadow-2xl overflow-hidden flex flex-col animate-fadeIn">
          {/* Pop-up Header */}
          <div className="p-4 bg-gradient-to-r from-[#171a24] to-[#121319] border-b border-[#252837] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-full border-2 border-[#ff6a00] p-0.5 bg-black overflow-hidden flex-shrink-0">
                  <img
                    src="/logo-tnk.png"
                    alt="Consultor TNK"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25d366] border-2 border-[#13151c]" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  Consultor TNK Mudanças
                </h3>
                <p className="text-[11px] text-green-400 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Online agora • Resposta rápida
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-[#1e212c] hover:bg-[#2c3142] text-gray-400 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Pop-up Body / Conversation Area */}
          <div className="p-4 space-y-3.5 max-h-[380px] overflow-y-auto text-xs bg-[#0f1015]">
            {/* Agent Welcome Message */}
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#ff6a00] text-black font-black text-[10px] flex items-center justify-center flex-shrink-0 mt-1">
                TNK
              </div>
              <div className="bg-[#1b1e28] border border-[#2b3042] rounded-2xl rounded-tl-sm p-3 text-gray-200 space-y-1.5 shadow-sm max-w-[85%]">
                <p className="font-semibold text-white">
                  Olá! Bem-vindo à TNK Mudanças 👋
                </p>
                <p className="text-gray-300 leading-relaxed text-[11px]">
                  Posso te ajudar a montar seu orçamento de mudança, receber o vídeo do seu imóvel ou tirar qualquer dúvida direto pelo <strong className="text-[#ff6a00]">WhatsApp</strong>.
                </p>
                <div className="flex items-center justify-end gap-1 text-[10px] text-gray-500 pt-1">
                  <span>Agora</span>
                  <CheckCheck className="w-3.5 h-3.5 text-[#25d366]" />
                </div>
              </div>
            </div>

            {/* Quick Action Chips */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Assuntos frequentes:
              </p>
              <div className="flex flex-col gap-1.5">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="w-full text-left p-2.5 rounded-xl bg-[#181a24] hover:bg-[#ff6a00]/15 border border-[#292d3e] hover:border-[#ff6a00] text-gray-300 hover:text-white text-[11px] font-medium transition flex items-center justify-between group"
                  >
                    <span>{q}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#ff6a00] transition flex-shrink-0 ml-1" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pop-up Footer & Input */}
          <div className="p-3 bg-[#151720] border-t border-[#252837] space-y-2">
            <div className="relative flex items-center">
              <input
                type="text"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder="Escreva sua mensagem aqui..."
                className="w-full bg-[#0d0e14] border border-[#2a2e3e] rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#25d366]"
              />
              <button
                onClick={() => handleSendMessage()}
                className="absolute right-1.5 p-2 rounded-lg bg-[#25d366] hover:bg-[#20ba59] text-white transition flex items-center justify-center shadow"
                title="Enviar no WhatsApp"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => handleSendMessage()}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#20ba59] to-[#25d366] hover:from-[#1ea750] hover:to-[#22bf5c] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#25d366]/20 transition"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Iniciar conversa no WhatsApp</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
