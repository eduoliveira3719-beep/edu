import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Truck,
  MessageCircle,
  Video,
  Lightbulb,
} from 'lucide-react';
import { Header } from './components/Header';
import { DifferentialsBanner } from './components/DifferentialsBanner';
import { SimulationWizard } from './components/SimulationWizard';
import { QuoteResultCard } from './components/QuoteResultCard';
import { AdminDashboard } from './components/AdminDashboard';
import { FloatingWhatsAppChat } from './components/FloatingWhatsAppChat';
import { VideoTipsModal } from './components/VideoTipsModal';
import { QuoteResult, SavedQuote, SimulationData } from './types';
import { buildMoveQuoteSummary, getWhatsAppUrl } from './utils/calculator';
import { DEFAULT_MOVE_ITEMS } from './data/defaultItems';

const INITIAL_SIMULATION: SimulationData = {
  originCity: 'São Paulo',
  originState: 'SP',
  originZip: '',
  originAddress: '',
  destinationCity: 'Rio de Janeiro',
  destinationState: 'RJ',
  destinationZip: '',
  destinationAddress: '',
  originPropertyType: 'Apartamento',
  destinationPropertyType: 'Apartamento',
  originHasElevator: true,
  destinationHasElevator: true,
  originStairsFlights: 0,
  destinationStairsFlights: 0,
  items: DEFAULT_MOVE_ITEMS.map((item) => ({
    ...item,
    quantity: item.id === 'sofa_3l' || item.id === 'geladeira' || item.id === 'cama_casal' ? 1 : item.id === 'caixa_padrao' ? 6 : 0,
  })),
  needDisassembly: true,
  needAssembly: true,
  packingService: 'Parcial',
  packSpecificItems: {
    dishes: true,
    kitchen: false,
    decor: false,
    clothes: true,
    paintings: false,
    fragile: true,
  },
  preferredDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  preferredShift: 'Manhã',
  moveType: 'Exclusiva',
  clientNotes: '',
};

const SEED_QUOTES: SavedQuote[] = [
  {
    id: 'TNK-9841',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    simulation: {
      originCity: 'São Paulo',
      originState: 'SP',
      destinationCity: 'Rio de Janeiro',
      destinationState: 'RJ',
      originPropertyType: 'Apartamento',
      destinationPropertyType: 'Apartamento',
      originHasElevator: true,
      destinationHasElevator: true,
      originStairsFlights: 0,
      destinationStairsFlights: 0,
      items: [],
      needDisassembly: true,
      needAssembly: true,
      packingService: 'Parcial',
      packSpecificItems: { dishes: true, kitchen: false, decor: false, clothes: true, paintings: false, fragile: true },
      preferredDate: '2026-11-20',
      moveType: 'Exclusiva',
      clientName: 'Eduardo Oliveira',
      clientPhone: '(38) 98765-4321',
      videoAttachment: {
        name: 'tour_apartamento_moema.mp4',
        size: 14500000,
        uploadedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
    },
    quote: buildMoveQuoteSummary({
      originCity: 'São Paulo',
      originState: 'SP',
      destinationCity: 'Rio de Janeiro',
      destinationState: 'RJ',
      originPropertyType: 'Apartamento',
      destinationPropertyType: 'Apartamento',
      originHasElevator: true,
      destinationHasElevator: true,
      originStairsFlights: 0,
      destinationStairsFlights: 0,
      items: [],
      needDisassembly: true,
      needAssembly: true,
      packingService: 'Parcial',
      packSpecificItems: { dishes: true, kitchen: false, decor: false, clothes: true, paintings: false, fragile: true },
      preferredDate: '2026-11-20',
      moveType: 'Exclusiva',
    }),
    status: 'Vídeo Recebido',
  },
  {
    id: 'TNK-9820',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    simulation: {
      originCity: 'Curitiba',
      originState: 'PR',
      destinationCity: 'Florianópolis',
      destinationState: 'SC',
      originPropertyType: 'Casa',
      destinationPropertyType: 'Apartamento',
      originHasElevator: false,
      destinationHasElevator: true,
      originStairsFlights: 2,
      destinationStairsFlights: 0,
      items: [],
      needDisassembly: false,
      needAssembly: false,
      packingService: 'Nenhuma',
      packSpecificItems: { dishes: false, kitchen: false, decor: false, clothes: false, paintings: false, fragile: false },
      preferredDate: '2026-11-25',
      moveType: 'Compartilhada',
      clientName: 'Mariana Silveira',
      clientPhone: '(41) 99123-8877',
    },
    quote: buildMoveQuoteSummary({
      originCity: 'Curitiba',
      originState: 'PR',
      destinationCity: 'Florianópolis',
      destinationState: 'SC',
      originPropertyType: 'Casa',
      destinationPropertyType: 'Apartamento',
      originHasElevator: false,
      destinationHasElevator: true,
      originStairsFlights: 2,
      destinationStairsFlights: 0,
      items: [],
      needDisassembly: false,
      needAssembly: false,
      packingService: 'Nenhuma',
      packSpecificItems: { dishes: false, kitchen: false, decor: false, clothes: false, paintings: false, fragile: false },
      preferredDate: '2026-11-25',
      moveType: 'Compartilhada',
    }),
    status: 'Novo',
  },
];

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'simulation' | 'result'>('home');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isVideoTipsOpen, setIsVideoTipsOpen] = useState<boolean>(false);

  // Simulation state
  const [currentSimulation, setCurrentSimulation] = useState<SimulationData>(INITIAL_SIMULATION);
  const [calculatedQuote, setCalculatedQuote] = useState<QuoteResult | null>(null);

  // Quotes history with LocalStorage persistence
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>(() => {
    try {
      const saved = localStorage.getItem('tnk_saved_quotes_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return SEED_QUOTES;
  });

  // Check ?autostart=1 support
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      setCurrentView('simulation');
    }
  }, []);

  // Complete simulation handler
  const handleSimulationComplete = (data: SimulationData) => {
    setCurrentSimulation(data);
    const result = buildMoveQuoteSummary(data);
    setCalculatedQuote(result);

    const newQuote: SavedQuote = {
      id: `TNK-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      simulation: data,
      quote: result,
      status: data.videoAttachment ? 'Vídeo Recebido' : 'Aguardando Vídeo',
    };

    const updated = [newQuote, ...savedQuotes];
    setSavedQuotes(updated);
    try {
      localStorage.setItem('tnk_saved_quotes_v2', JSON.stringify(updated));
    } catch {
      // Ignore
    }

    setCurrentView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save / Update quote from Result Card
  const handleSaveQuoteFromCard = (sim: SimulationData, quote: QuoteResult) => {
    setCurrentSimulation(sim);
    const newQuote: SavedQuote = {
      id: `TNK-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      simulation: sim,
      quote,
      status: sim.videoAttachment ? 'Vídeo Recebido' : 'Enviado no WhatsApp',
    };
    const updated = [newQuote, ...savedQuotes];
    setSavedQuotes(updated);
    try {
      localStorage.setItem('tnk_saved_quotes_v2', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#f0f2f5] flex flex-col font-sans selection:bg-[#ff6a00] selection:text-white">
      {/* Top Header */}
      <Header
        onOpenAdmin={() => setIsAdminOpen(true)}
        onGoHome={() => setCurrentView('home')}
      />

      {/* Differentials Top Marquee / Compact Strip */}
      <DifferentialsBanner compact />

      {/* Main View Router */}
      <main className="flex-1">
        {/* VIEW 1: HOME SCREEN (TELA INICIAL) */}
        {currentView === 'home' && (
          <div className="space-y-12 pb-16">
            {/* Hero Section */}
            <section className="relative pt-10 sm:pt-16 pb-12 sm:pb-20 px-4 max-w-5xl mx-auto text-center">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-[#ff6a00]/10 rounded-full blur-3xl pointer-events-none -z-10" />

              {/* Logo da TNK no topo */}
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-[#ff6a00] p-1 bg-black shadow-2xl glow-orange mb-4 hover:scale-105 transition-transform duration-300">
                  <img
                    src="/logo-tnk.png"
                    alt="TNK Mudanças Transportes & Logística"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff6a00]/15 border border-[#ff6a00]/30 text-[#ff6a00] text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Mais de 10 Anos de Excelência em Mudanças
                </div>
              </div>

              {/* Título Principal */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
                Solicite o orçamento da sua mudança{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff8826] via-[#ff6a00] to-[#ff4500]">
                  em poucos minutos.
                </span>
              </h1>

              {/* Subtítulo */}
              <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto mt-4 leading-relaxed font-normal">
                Preencha os detalhes de forma gratuita, rápida e sem compromisso, e envie direto para o WhatsApp da TNK Mudanças.
              </p>

              {/* Botões Principais */}
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setIsVideoTipsOpen(true)}
                  className="w-full sm:w-auto px-9 py-5 rounded-2xl bg-gradient-to-r from-[#ff751a] to-[#ff6a00] hover:from-[#ff852e] hover:to-[#ff5c00] text-white font-black text-lg sm:text-xl flex items-center justify-center gap-3 shadow-2xl shadow-[#ff6a00]/40 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                >
                  <span>Montar meu orçamento</span>
                  <ArrowRight className="w-6 h-6 stroke-[3]" />
                </button>

                <button
                  onClick={() => {
                    const url = getWhatsAppUrl('Olá! Gostaria de solicitar um orçamento de mudança com a equipe da TNK.');
                    window.open(url, '_blank');
                  }}
                  className="w-full sm:w-auto px-7 py-4.5 rounded-2xl bg-[#171a24] hover:bg-[#222634] text-gray-200 hover:text-white font-extrabold text-base flex items-center justify-center gap-2.5 border border-[#303548] hover:border-[#25d366] transition cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 text-[#25d366]" />
                  <span>Falar no WhatsApp</span>
                </button>
              </div>

              {/* Dica rápida antes da simulação */}
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => setIsVideoTipsOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#171923] hover:bg-[#1f2330] border border-[#ff6a00]/35 hover:border-[#ff6a00] text-xs font-semibold text-gray-300 hover:text-white transition cursor-pointer"
                >
                  <Lightbulb className="w-4 h-4 text-[#ff6a00]" />
                  <span>Dica: Como gravar um vídeo eficiente da sua mudança</span>
                </button>
              </div>

              {/* Trust Badges Bar */}
              <div className="mt-10 pt-8 border-t border-[#202330] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-gray-400">
                <div className="flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#ff6a00]" />
                  <span>Atendimento Personalizado</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#ff6a00]" />
                  <span>Sem Surpresas</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Truck className="w-4 h-4 text-[#ff6a00]" />
                  <span>Frota Rastreada</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-[#ff6a00]" />
                  <span>Resposta Rápida</span>
                </div>
              </div>
            </section>

            {/* Video Guarantee Highlight Section */}
            <section className="px-4 max-w-5xl mx-auto">
              <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#171922] via-[#1d202c] to-[#171922] border border-[#2e3346] shadow-xl flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-[#ff6a00] text-black flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#ff6a00]/30">
                  <Video className="w-8 h-8" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <span className="text-[11px] font-black uppercase text-[#ff6a00] tracking-wider">
                    Mais Agilidade & Transparência
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                    Envie Suas Informações + Vídeo Opcional no WhatsApp
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
                    Ao final do questionário, você pode adicionar comentários e anexar um vídeo rápido de 1 minuto do seu imóvel para nossa equipe preparar um orçamento ainda mais preciso. <strong className="text-white">Não pode gravar vídeo agora? Sem problemas</strong>, você envia tudo mesmo assim!
                  </p>
                </div>
                <button
                  onClick={() => setIsVideoTipsOpen(true)}
                  className="px-6 py-3.5 rounded-xl bg-[#ff6a00] hover:bg-[#e65f00] text-white text-xs font-bold uppercase tracking-wider flex-shrink-0 transition cursor-pointer"
                >
                  Começar Agora
                </button>
              </div>
            </section>

            {/* Complete TNK Differentials Grid */}
            <DifferentialsBanner />

            {/* Steps Preview Section */}
            <section className="py-8 px-4 max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-white">Como funciona seu orçamento</h3>
                <p className="text-xs text-gray-400 mt-1">
                  12 etapas intuitivas e rápidas para não faltar nenhum detalhe
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-6 rounded-2xl bg-[#14161f] border border-[#252836]">
                  <div className="w-8 h-8 rounded-lg bg-[#ff6a00]/20 text-[#ff6a00] font-black flex items-center justify-center mb-3 text-sm">
                    1
                  </div>
                  <h4 className="font-bold text-white text-base">Origem & Destino</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Informe onde os pertences estão, para onde vão e detalhes de acessos como elevador e escadas.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#14161f] border border-[#252836]">
                  <div className="w-8 h-8 rounded-lg bg-[#ff6a00]/20 text-[#ff6a00] font-black flex items-center justify-center mb-3 text-sm">
                    2
                  </div>
                  <h4 className="font-bold text-white text-base">Inventário & Serviços</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Selecione seus móveis, eletrodomésticos, serviços de montagem e nível de embalagem desejado.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#14161f] border border-[#252836]">
                  <div className="w-8 h-8 rounded-lg bg-[#ff6a00]/20 text-[#ff6a00] font-black flex items-center justify-center mb-3 text-sm">
                    3
                  </div>
                  <h4 className="font-bold text-white text-base">Comentários, Vídeo & Envio</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Revise o resumo, comente observações, anexe um vídeo se puder e envie tudo direto para o WhatsApp da TNK.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: SIMULATION WIZARD (13 ETAPAS) */}
        {currentView === 'simulation' && (
          <SimulationWizard
            initialData={currentSimulation}
            onComplete={handleSimulationComplete}
            onCancel={() => setCurrentView('home')}
          />
        )}

        {/* VIEW 3: QUOTE SUMMARY & WHATSAPP DISPATCH CARD */}
        {currentView === 'result' && calculatedQuote && (
          <QuoteResultCard
            simulation={currentSimulation}
            quote={calculatedQuote}
            onRestart={() => setCurrentView('simulation')}
            onSaveQuote={handleSaveQuoteFromCard}
          />
        )}
      </main>

      {/* Video Tips Modal (antes de iniciar a simulação) */}
      <VideoTipsModal
        isOpen={isVideoTipsOpen}
        onClose={() => setIsVideoTipsOpen(false)}
        onContinue={() => {
          setIsVideoTipsOpen(false);
          setCurrentView('simulation');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Admin Dashboard Modal */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        savedQuotes={savedQuotes}
        onUpdateQuotes={setSavedQuotes}
      />

      {/* Footer */}
      <footer className="border-t border-[#1d202b] bg-[#090a0d] py-10 px-4 text-center text-xs text-gray-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-white text-sm">TNK</span>
            <span>•</span>
            <span>Mudanças Transportes & Logística Ltda.</span>
          </div>

          <div className="flex items-center gap-4 text-gray-400">
            <span>Orçamento Transparente</span>
            <span>•</span>
            <span>Sem Surpresas</span>
            <span>•</span>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-[#ff6a00] hover:underline font-bold"
            >
              Área do Administrador
            </button>
          </div>
        </div>
        <p className="mt-4 text-gray-600">
          © {new Date().getFullYear()} TNK Mudanças Transportes & Logística. Todos os direitos reservados.
        </p>
      </footer>

      {/* Floating WhatsApp Quick Chat Button & Pop-up */}
      <FloatingWhatsAppChat />
    </div>
  );
}
