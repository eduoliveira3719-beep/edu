import React from 'react';
import {
  Video,
  X,
  ArrowRight,
  Lightbulb,
  DoorOpen,
  Sun,
  Home,
  PackageOpen,
  CheckCircle2,
} from 'lucide-react';

interface VideoTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  continueLabel?: string;
}

const VIDEO_TIPS = [
  {
    icon: Home,
    title: '1. Faça um tour por todos os cômodos',
    description:
      'Passe pela sala, cozinha, quartos, banheiros e área externa mostrando todos os móveis e eletrodomésticos que serão transportados.',
  },
  {
    icon: PackageOpen,
    title: '2. Mostre volumes, caixas e itens frágeis',
    description:
      'Dê um giro devagar destacando móveis grandes, itens que precisam de desmontagem, objetos delicados e a quantidade aproximada de caixas.',
  },
  {
    icon: DoorOpen,
    title: '3. Filme os acessos do imóvel',
    description:
      'Mostre portas, corredores, elevadores, lances de escada e a entrada da rua/prédio. Isso facilita o dimensionamento da equipe e do caminhão.',
  },
  {
    icon: Sun,
    title: '4. Vídeo curto (30s a 60s) com boa luz',
    description:
      'Acenda as luzes do ambiente e grave em movimento lento e contínuo. Não precisa editar nem falar nada se não quiser.',
  },
];

export const VideoTipsModal: React.FC<VideoTipsModalProps> = ({
  isOpen,
  onClose,
  onContinue,
  continueLabel = 'Entendido, Iniciar Orçamento',
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-5 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-tips-modal-title"
    >
      <div className="w-full max-w-2xl max-h-[90vh] bg-[#13151c] border-2 border-[#ff6a00]/60 rounded-3xl shadow-2xl flex flex-col overflow-hidden glow-orange">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#252837] bg-gradient-to-r from-[#181b25] to-[#13151c] flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#ff6a00] text-black flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#ff6a00]/30">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#ff6a00]">
                <Lightbulb className="w-3.5 h-3.5" />
                Dica Rápida Antes de Começar
              </span>
              <h2
                id="video-tips-modal-title"
                className="text-lg sm:text-xl font-black text-white mt-0.5"
              >
                Como gravar um vídeo eficiente da sua mudança
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar dicas de vídeo"
            className="w-9 h-9 rounded-xl bg-[#202432] hover:bg-[#2c3244] text-gray-400 hover:text-white flex items-center justify-center flex-shrink-0 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Ao final do orçamento, você poderá enviar um vídeo curto pelo WhatsApp para facilitar a avaliação exata pela equipe da <strong className="text-white">TNK Mudanças</strong>. Confira 4 dicas simples para gravar com eficiência:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {VIDEO_TIPS.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-[#191c26] border border-[#2a2e3f] flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#ff6a00]/15 text-[#ff6a00] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-white leading-snug">
                      {tip.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Optional reassurance */}
          <div className="p-3.5 rounded-2xl bg-[#171c24] border border-green-500/30 flex items-start gap-3 text-xs">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">O envio do vídeo é opcional:</strong> se não puder gravar agora, sem problemas! Você pode preencher todas as etapas normalmente e enviar seu orçamento direto no WhatsApp.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 sm:p-6 border-t border-[#252837] bg-[#101218] flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#1c202c] hover:bg-[#262b3b] text-gray-300 font-bold text-xs sm:text-sm transition cursor-pointer"
          >
            Voltar
          </button>

          <button
            type="button"
            onClick={onContinue}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#ff751a] to-[#ff6a00] hover:from-[#ff852e] hover:to-[#ff5c00] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#ff6a00]/30 transition hover:scale-[1.02] cursor-pointer"
          >
            <span>{continueLabel}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
