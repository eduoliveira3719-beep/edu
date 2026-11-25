import React, { useState } from 'react';
import { Truck, MessageCircle, Download, ShieldCheck, Settings, Phone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  onOpenAdmin: () => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdmin, onGoHome }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  const handleWhatsAppHelp = () => {
    const text = encodeURIComponent('Olá! Estou no aplicativo da TNK Mudanças e gostaria de solicitar um orçamento ou tirar uma dúvida.');
    window.open(`https://wa.me/5538999692413?text=${text}`, '_blank');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0b0c10]/95 backdrop-blur-md border-b border-[#232630]">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo and Brand */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-[#ff6a00] p-0.5 bg-black flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
            <img
              src="/logo-tnk.png"
              alt="TNK Mudanças Logo"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-black tracking-wider text-white">
                TNK<span className="text-[#ff6a00]">.</span>
              </span>
              <span className="bg-[#ff6a00]/20 text-[#ff6a00] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#ff6a00]/30 uppercase tracking-wider">
                Mudanças
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium hidden sm:block">
              Transportes & Logística Inteligente
            </p>
          </div>
        </button>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* PWA Install Button (if applicable) */}
          {!isInstalled && isInstallable && (
            <button
              onClick={install}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#20222a] hover:bg-[#2c303c] text-white text-xs font-semibold border border-[#3b3f4e] transition"
              title="Instalar aplicativo"
            >
              <Download className="w-3.5 h-3.5 text-[#ff6a00]" />
              <span>Instalar App</span>
            </button>
          )}

          {!isInstalled && isIOS && (
            <button
              onClick={() => setShowIOSModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#20222a] hover:bg-[#2c303c] text-white text-xs font-semibold border border-[#3b3f4e] transition"
            >
              <Download className="w-3.5 h-3.5 text-[#ff6a00]" />
              <span>Instalar no iOS</span>
            </button>
          )}

          {/* WhatsApp Direct Button */}
          <button
            onClick={handleWhatsAppHelp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25d366]/15 hover:bg-[#25d366]/25 text-[#25d366] text-xs font-bold border border-[#25d366]/40 transition cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline">Falar no WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </button>

          {/* Admin area button */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#16181f] hover:bg-[#232733] text-gray-300 hover:text-white text-xs font-medium border border-[#2c3140] transition"
            title="Acesso Administrativo"
          >
            <Settings className="w-3.5 h-3.5 text-[#ff6a00]" />
            <span className="hidden sm:inline">Painel Admin</span>
          </button>
        </div>
      </div>

      {/* iOS Safari Installation Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#16181f] border border-[#2e3344] p-6 shadow-2xl text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#ff6a00]/20 flex items-center justify-center text-[#ff6a00]">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Instalar App no iPhone</h3>
            </div>
            <ol className="space-y-3 text-sm text-gray-300 list-decimal pl-4 mb-6">
              <li>
                No Safari, toque no ícone de <strong className="text-white">Compartilhar</strong> (quadrado com seta para cima na barra inferior).
              </li>
              <li>
                Role para baixo e selecione <strong className="text-white">Adicionar à Tela de Início</strong>.
              </li>
              <li>
                Toque em <strong className="text-[#ff6a00]">Adicionar</strong> no canto superior direito.
              </li>
            </ol>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#ff6a00] hover:bg-[#e05d00] text-white text-sm font-bold transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
