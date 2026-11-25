import React from 'react';
import {
  Globe2,
  Users,
  PackageCheck,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  Award,
  Sparkles,
} from 'lucide-react';

export const DIFFERENTIALS = [
  {
    icon: Globe2,
    title: 'Mudanças para todo o Brasil',
    description: 'Rotas exclusivas e compartilhadas em todos os estados.',
  },
  {
    icon: Users,
    title: 'Equipe especializada',
    description: 'Profissionais experientes, uniformizados e treinados.',
  },
  {
    icon: PackageCheck,
    title: 'Embalagem profissional',
    description: 'Mantas térmicas, plástico bolha e caixas reforçadas.',
  },
  {
    icon: Wrench,
    title: 'Desmontagem e montagem',
    description: 'Montadores capacitados para móveis convencionais e planejados.',
  },
  {
    icon: ShieldCheck,
    title: 'Seguro da mudança',
    description: 'Sua carga 100% protegida contra qualquer imprevisto.',
  },
  {
    icon: Sparkles,
    title: 'Orçamento transparente',
    description: 'Atendimento direto pelo WhatsApp, rápido e sem surpresas.',
    highlight: true,
  },
  {
    icon: MessageSquare,
    title: 'Atendimento pelo WhatsApp',
    description: 'Suporte humanizado e ágil direto na palma da sua mão.',
  },
  {
    icon: Award,
    title: 'Mais de 10 anos de experiência',
    description: 'Tradição, pontualidade e satisfação comprovada.',
  },
];

export const DifferentialsBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="w-full bg-[#12141a] border-y border-[#232733] py-3 px-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-6 text-xs text-gray-300 font-medium whitespace-nowrap max-w-6xl mx-auto">
          <span className="flex items-center gap-1.5 text-[#ff6a00] font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 fill-[#ff6a00]/20" /> Mudanças para todo o Brasil
          </span>
          <span className="text-gray-600">•</span>
          <span className="flex items-center gap-1.5 text-white">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#ff6a00]" /> Orçamento Rápido & Sem Surpresas
          </span>
          <span className="text-gray-600">•</span>
          <span className="flex items-center gap-1.5 text-gray-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#ff6a00]" /> Seguro Completo
          </span>
          <span className="text-gray-600">•</span>
          <span className="flex items-center gap-1.5 text-gray-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#ff6a00]" /> Montagem e Desmontagem
          </span>
          <span className="text-gray-600">•</span>
          <span className="flex items-center gap-1.5 text-gray-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#ff6a00]" /> 10+ anos de experiência
          </span>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff6a00]/15 text-[#ff6a00] text-xs font-bold uppercase tracking-wider mb-3 border border-[#ff6a00]/30">
          Por que escolher a TNK?
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Diferenciais que garantem sua tranquilidade
        </h2>
        <p className="text-sm text-gray-400 max-w-xl mx-auto mt-2">
          Cuidamos de cada detalhe com segurança jurídica, equipe própria e rastreamento constante.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DIFFERENTIALS.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border transition-all duration-200 ${
                item.highlight
                  ? 'bg-gradient-to-br from-[#1c1712] to-[#14151a] border-[#ff6a00]/50 glow-orange-sm'
                  : 'bg-[#15171e] border-[#252834] hover:border-[#383d4f]'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3.5 ${
                  item.highlight
                    ? 'bg-[#ff6a00] text-white shadow-lg shadow-[#ff6a00]/30'
                    : 'bg-[#ff6a00]/15 text-[#ff6a00]'
                }`}
              >
                <IconComponent className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
