import React, { useState } from 'react';
import {
  Truck,
  Users,
  Clock,
  MapPin,
  CheckCircle2,
  Video,
  UploadCloud,
  FileCheck,
  Sparkles,
  MessageCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  MessageSquarePlus,
  RotateCcw,
  Share2,
} from 'lucide-react';
import { QuoteResult, SimulationData } from '../types';
import {
  buildWhatsAppQuoteMessage,
  getWhatsAppUrl,
  TNK_WHATSAPP_DISPLAY,
} from '../utils/calculator';

interface QuoteResultCardProps {
  simulation: SimulationData;
  quote: QuoteResult;
  onRestart: () => void;
  onSaveQuote: (simulation: SimulationData, quote: QuoteResult) => void;
}

const SPECIFIC_PACKING_NAMES: Array<{ key: keyof SimulationData['packSpecificItems']; label: string }> = [
  { key: 'dishes', label: 'Louças e Porcelanas' },
  { key: 'kitchen', label: 'Utensílios de Cozinha' },
  { key: 'decor', label: 'Itens de Decoração' },
  { key: 'clothes', label: 'Roupas em Cabideiro' },
  { key: 'paintings', label: 'Quadros e Espelhos' },
  { key: 'fragile', label: 'Objetos Frágeis Diversos' },
];

export const QuoteResultCard: React.FC<QuoteResultCardProps> = ({
  simulation,
  quote,
  onRestart,
  onSaveQuote,
}) => {
  const [showFullSummary, setShowFullSummary] = useState<boolean>(true);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [sentConfirmation, setSentConfirmation] = useState<boolean>(false);

  // Client contact & comment fields
  const [clientName, setClientName] = useState<string>(simulation.clientName || '');
  const [clientPhone, setClientPhone] = useState<string>(simulation.clientPhone || '');
  const [clientNotes, setClientNotes] = useState<string>(simulation.clientNotes || '');

  // Video upload state
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(simulation.videoAttachment?.url || null);
  const [isVideoUploading, setIsVideoUploading] = useState<boolean>(false);
  const [videoUploadSuccess, setVideoUploadSuccess] = useState<boolean>(!!simulation.videoAttachment);
  const [videoError, setVideoError] = useState<string>('');

  const buildUpdatedSimulation = (): SimulationData => ({
    ...simulation,
    clientName: clientName.trim() || undefined,
    clientPhone: clientPhone.trim() || undefined,
    clientNotes: clientNotes.trim() || undefined,
    videoAttachment: videoFile
      ? {
          name: videoFile.name,
          size: videoFile.size,
          url: videoUrl || undefined,
          uploadedAt: new Date().toISOString(),
        }
      : simulation.videoAttachment || null,
  });

  // Handle Video Selection
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoError('');
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setVideoError('Por favor, selecione um arquivo de vídeo válido (MP4, WebM ou MOV).');
        return;
      }
      setIsVideoUploading(true);
      const url = URL.createObjectURL(file);
      setVideoFile(file);
      setVideoUrl(url);

      setTimeout(() => {
        setIsVideoUploading(false);
        setVideoUploadSuccess(true);
        const updatedSim: SimulationData = {
          ...simulation,
          clientName: clientName.trim() || undefined,
          clientPhone: clientPhone.trim() || undefined,
          clientNotes: clientNotes.trim() || undefined,
          videoAttachment: {
            name: file.name,
            size: file.size,
            url,
            uploadedAt: new Date().toISOString(),
          },
        };
        onSaveQuote(updatedSim, quote);
      }, 600);
    }
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
    setVideoUrl(null);
    setVideoUploadSuccess(false);
  };

  // Send everything to TNK WhatsApp (38 99969-2413)
  const handleSendAllToWhatsApp = () => {
    const updatedSim = buildUpdatedSimulation();
    onSaveQuote(updatedSim, quote);

    const message = buildWhatsAppQuoteMessage(updatedSim, quote, {
      hasVideoAttached: videoUploadSuccess,
      videoFileName: videoFile?.name || updatedSim.videoAttachment?.name,
    });

    const url = getWhatsAppUrl(message);
    window.open(url, '_blank');
    setSentConfirmation(true);
  };

  // Native Web Share for mobile devices when video file is attached
  const canUseWebShareWithFile =
    typeof navigator !== 'undefined' &&
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function' &&
    !!videoFile &&
    navigator.canShare({ files: [videoFile] });

  const handleShareVideoAndText = async () => {
    if (!videoFile || !canUseWebShareWithFile) {
      handleSendAllToWhatsApp();
      return;
    }

    const updatedSim = buildUpdatedSimulation();
    onSaveQuote(updatedSim, quote);

    const message = buildWhatsAppQuoteMessage(updatedSim, quote, {
      hasVideoAttached: true,
      videoFileName: videoFile.name,
    });

    try {
      await navigator.share({
        title: 'Orçamento TNK Mudanças',
        text: message,
        files: [videoFile],
      });
      setSentConfirmation(true);
    } catch {
      // Fallback to standard WhatsApp link if user cancels or share fails
      window.open(getWhatsAppUrl(message), '_blank');
    }
  };

  const handleCopySummary = async () => {
    const updatedSim = buildUpdatedSimulation();
    const message = buildWhatsAppQuoteMessage(updatedSim, quote, {
      hasVideoAttached: videoUploadSuccess,
      videoFileName: videoFile?.name || updatedSim.videoAttachment?.name,
    });
    try {
      await navigator.clipboard.writeText(message);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 3000);
    } catch {
      // Ignore clipboard failure
    }
  };

  const selectedSpecificPacking = SPECIFIC_PACKING_NAMES.filter(
    (entry) => simulation.packSpecificItems?.[entry.key]
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-8 animate-fadeIn">
      {/* Top Banner: Quote Summary Ready */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff6a00]/20 border border-[#ff6a00]/40 text-[#ff6a00] text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-4 h-4 fill-current" />
          Orçamento Organizado com Sucesso!
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          Resumo do Seu Orçamento
        </h1>
        <p className="text-gray-400 text-sm max-w-xl mx-auto">
          Confira as informações da sua mudança, adicione comentários se desejar e envie tudo direto para o WhatsApp da TNK Mudanças.
        </p>
      </div>

      {/* Hero Quote Card (Budget Request Format - Zero Prices) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#181a24] to-[#12131a] border-2 border-[#ff6a00] p-6 sm:p-8 shadow-2xl glow-orange space-y-6">
        <div className="absolute top-0 right-0">
          <div className="bg-[#ff6a00] text-black text-[11px] font-black uppercase px-6 py-1.5 rounded-bl-2xl shadow-md tracking-wider">
            {simulation.moveType === 'Compartilhada' ? 'Mudança Compartilhada' : 'Mudança Exclusiva'}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#292c3d] pb-6 pt-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#ff6a00]">
              Solicitação de Orçamento • TNK Mudanças
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {simulation.originCity} ({simulation.originState}) ➔ {simulation.destinationCity} ({simulation.destinationState})
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-1.5">
              Atendimento direto no WhatsApp <strong className="text-white">{TNK_WHATSAPP_DISPLAY}</strong> • {quote.totalItemsCount} volume(s) (~{quote.totalVolumeM3} m³)
            </p>
          </div>
        </div>

        {/* Client Details & Comments Box ("Comentar as informações") */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <MessageSquarePlus className="w-5 h-5 text-[#ff6a00]" />
            <span>Identifique-se e comente suas informações (opcional)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="quote-client-name" className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Seu Nome
              </label>
              <input
                id="quote-client-name"
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ex: Maria Souza"
                className="w-full bg-[#11131a] border border-[#2f3548] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6a00]"
              />
            </div>
            <div>
              <label htmlFor="quote-client-phone" className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                Seu WhatsApp para Contato
              </label>
              <input
                id="quote-client-phone"
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="(38) 99999-9999"
                className="w-full bg-[#11131a] border border-[#2f3548] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6a00]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="quote-client-notes" className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Comentários / Observações da Mudança
            </label>
            <textarea
              id="quote-client-notes"
              rows={3}
              value={clientNotes}
              onChange={(e) => setClientNotes(e.target.value)}
              placeholder="Comente aqui detalhes extras: horários do condomínio, dificuldade de acesso, objetos especiais ou qualquer observação que queira enviar no orçamento..."
              className="w-full bg-[#11131a] border border-[#2f3548] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6a00] resize-y"
            />
          </div>
        </div>
      </div>

      {/* VIDEO UPLOAD / INCENTIVE SECTION */}
      <div className="bg-[#151720] border-2 border-dashed border-[#ff6a00]/50 rounded-3xl p-6 sm:p-8 relative overflow-hidden space-y-5">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#ff6a00] text-black flex items-center justify-center shadow-lg shadow-[#ff6a00]/30 flex-shrink-0">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-black text-white">Vídeo Curto do Imóvel</h3>
              <span className="text-[10px] bg-[#ff6a00]/20 text-[#ff6a00] px-2.5 py-0.5 rounded-full font-bold uppercase border border-[#ff6a00]/30">
                Opcional • Altamente Recomendado
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 leading-relaxed">
              Enviar um vídeo rápido (30 a 60 segundos) passando pelos cômodos ajuda muito nossa equipe a ver os acessos e preparar o orçamento ideal para você com muito mais agilidade!
            </p>
          </div>
        </div>

        {/* Incentive & Zero-Pressure Reassurance Banner */}
        <div className="p-4 rounded-2xl bg-[#1a1d29] border border-[#2d3246] flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs">
          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
          <div className="text-gray-200 leading-relaxed">
            <strong className="text-white">Não consegue gravar ou enviar o vídeo agora? Sem problemas!</strong> Você pode enviar normalmente todas as informações preenchidas clicando no botão do WhatsApp abaixo — nossa equipe atende você da mesma forma.
          </div>
        </div>

        {/* Informative value-prop box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#1c1e29] border border-[#2c3041] flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#ff6a00] flex-shrink-0" />
            <span className="text-gray-300">
              <strong className="text-white">Atendimento Rápido:</strong> Avaliação ágil dos móveis pela equipe.
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#1c1e29] border border-[#2c3041] flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#ff6a00] flex-shrink-0" />
            <span className="text-gray-300">
              <strong className="text-white">Sem Surpresas:</strong> Visualização real de portas, corredores e escadas.
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#1c1e29] border border-[#2c3041] flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#ff6a00] flex-shrink-0" />
            <span className="text-gray-300">
              <strong className="text-white">Caminhão Ideal:</strong> Dimensionamento certo de espaço e ajudantes.
            </span>
          </div>
        </div>

        {videoError && (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-semibold">
            {videoError}
          </div>
        )}

        {/* Upload Dropzone & Video Preview */}
        {!videoUrl ? (
          <div className="relative">
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#34384a] hover:border-[#ff6a00] rounded-2xl p-7 cursor-pointer bg-[#191b24] hover:bg-[#1f222e] transition text-center group">
              <UploadCloud className="w-11 h-11 text-gray-500 group-hover:text-[#ff6a00] transition mb-2.5" />
              <p className="text-sm font-bold text-white mb-1">
                {isVideoUploading
                  ? 'Preparando vídeo...'
                  : 'Toque aqui para selecionar ou gravar o vídeo da sua mudança'}
              </p>
              <p className="text-xs text-gray-400 max-w-md">
                Formatos aceitos: MP4, MOV, WebM. Se preferir, você também pode gravar direto na conversa do WhatsApp após clicar em enviar.
              </p>
              <input
                type="file"
                accept="video/*"
                capture="environment"
                onChange={handleVideoChange}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#1a1c27] border border-[#2e3346] flex flex-col md:flex-row gap-5 items-center">
              <div className="w-full md:w-64 h-36 bg-black rounded-xl overflow-hidden relative border border-[#3b4156] flex items-center justify-center">
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 text-left space-y-2">
                <div className="flex items-center gap-2 text-green-400 font-bold text-sm">
                  <FileCheck className="w-5 h-5" />
                  <span>Vídeo pronto para envio!</span>
                </div>
                {videoFile && (
                  <p className="text-xs text-gray-300">
                    Arquivo: <span className="text-white font-medium">{videoFile.name}</span> (
                    {(videoFile.size / (1024 * 1024)).toFixed(1)} MB)
                  </p>
                )}
                <p className="text-xs text-gray-400 leading-relaxed">
                  {canUseWebShareWithFile
                    ? 'No celular, você pode usar "Compartilhar Vídeo + Resumo" ou abrir o WhatsApp com os dados preenchidos e anexar este vídeo na conversa.'
                    : 'Clique em "Enviar Tudo para o WhatsApp" abaixo — a conversa abrirá com todas as suas informações preenchidas para você anexar este vídeo.'}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {canUseWebShareWithFile && (
                    <button
                      type="button"
                      onClick={handleShareVideoAndText}
                      className="px-4 py-2 rounded-xl bg-[#ff6a00] hover:bg-[#e65f00] text-white text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" /> Compartilhar Vídeo + Resumo
                    </button>
                  )}
                  <label className="px-3 py-2 rounded-xl bg-[#272b3a] hover:bg-[#343a4e] text-gray-300 text-xs font-medium cursor-pointer transition">
                    Trocar Vídeo
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveVideo}
                    className="px-3 py-2 rounded-xl bg-[#222533] hover:bg-[#2d3245] text-gray-400 hover:text-white text-xs font-medium cursor-pointer transition"
                  >
                    Remover Vídeo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Primary Send All CTA inside / right after video section */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleSendAllToWhatsApp}
            className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#20ba59] to-[#25d366] hover:from-[#1ea750] hover:to-[#20c05c] text-white font-black text-base flex items-center justify-center gap-3 shadow-xl shadow-[#25d366]/30 transition-all duration-200 hover:scale-[1.01] cursor-pointer"
          >
            <MessageCircle className="w-6 h-6 fill-current" />
            <span>Enviar Tudo para o WhatsApp ({TNK_WHATSAPP_DISPLAY})</span>
          </button>

          <button
            type="button"
            onClick={handleCopySummary}
            className="px-5 py-4 rounded-2xl bg-[#1e222f] hover:bg-[#282d3e] text-gray-200 font-bold text-sm flex items-center justify-center gap-2 border border-[#31374d] transition cursor-pointer"
          >
            {copiedSummary ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Resumo Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#ff6a00]" />
                <span>Copiar Resumo</span>
              </>
            )}
          </button>
        </div>

        {sentConfirmation && (
          <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-start gap-3 text-xs text-green-200">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">WhatsApp da TNK Mudanças aberto com todas as suas informações!</p>
              <p className="text-gray-300 mt-0.5">
                {videoUploadSuccess
                  ? 'Agora basta clicar em enviar a mensagem no WhatsApp e anexar o vídeo selecionado na conversa.'
                  : 'Agora basta enviar a mensagem no WhatsApp. Se desejar, você também pode gravar ou anexar um vídeo direto por lá!'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Grid: 4 Key Logistical Specifications (Zero Prices) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Rota & Distância */}
        <div className="p-5 rounded-2xl bg-[#161821] border border-[#272b3a] flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#ff6a00]/15 text-[#ff6a00] flex items-center justify-center mb-3">
              <MapPin className="w-5 h-5" />
            </div>
            <p className="text-xs text-gray-400 font-medium">Distância Estimada</p>
            <h4 className="text-xl font-extrabold text-white mt-1">
              {quote.distanceKm} km
            </h4>
            <p className="text-[11px] text-gray-400 mt-2 truncate">
              {simulation.originCity} ({simulation.originState}) ➔ {simulation.destinationCity} ({simulation.destinationState})
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#232635] text-[11px] text-[#ff6a00] font-semibold flex items-center justify-between">
            <span>Trajeto Rodoviário</span>
            <span>~{quote.estimatedTravelHours}h viagem</span>
          </div>
        </div>

        {/* Caminhão Recomendado / Sugestão de Carga */}
        <div className="p-5 rounded-2xl bg-[#161821] border border-[#272b3a] flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#ff6a00]/15 text-[#ff6a00] flex items-center justify-center mb-3">
              <Truck className="w-5 h-5" />
            </div>
            <p className="text-xs text-gray-400 font-medium">Sugestão de Carga</p>
            <h4 className="text-base font-extrabold text-white mt-1">
              {quote.recommendedTruck.name}
            </h4>
            <p className="text-[11px] text-gray-400 mt-2">
              {quote.recommendedTruck.description}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#232635] text-[11px] text-gray-300 font-semibold">
            Baú fechado com manta e amarração
          </div>
        </div>

        {/* Equipe TNK */}
        <div className="p-5 rounded-2xl bg-[#161821] border border-[#272b3a] flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#ff6a00]/15 text-[#ff6a00] flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-xs text-gray-400 font-medium">Equipe Sugerida</p>
            <h4 className="text-base font-extrabold text-white mt-1">
              Equipe Completa TNK
            </h4>
            <ul className="text-[11px] text-gray-300 mt-2 space-y-1">
              <li>• Motorista ajudante</li>
              <li>• Ajudantes carregadores</li>
              <li>• Montador de móveis ajudante de carga</li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-[#232635] text-[11px] text-gray-300 font-semibold">
            Uniformes, EPIs e Seguro
          </div>
        </div>

        {/* Duração e Data */}
        <div className="p-5 rounded-2xl bg-[#161821] border border-[#272b3a] flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#ff6a00]/15 text-[#ff6a00] flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <p className="text-xs text-gray-400 font-medium">Previsão & Data</p>
            <h4 className="text-base font-extrabold text-white mt-1">
              {quote.estimatedWorkDuration}
            </h4>
            <p className="text-[11px] text-gray-400 mt-2">
              Data: {simulation.preferredDate || 'A combinar'} ({simulation.preferredShift || 'Manhã'})
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#232635] text-[11px] text-gray-300 font-semibold">
            Modalidade: {simulation.moveType}
          </div>
        </div>
      </div>

      {/* Complete Quote Summary Accordion (Items, Access, Services — NO PRICES) */}
      <div className="rounded-2xl bg-[#161821] border border-[#272b3a] overflow-hidden">
        <button
          type="button"
          onClick={() => setShowFullSummary(!showFullSummary)}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-[#1d202b] transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <ClipboardList className="w-5 h-5 text-[#ff6a00]" />
            <div>
              <h4 className="font-bold text-white text-base">Informações Completas do Orçamento</h4>
              <p className="text-xs text-gray-400">
                Tudo o que será enviado para o WhatsApp da transportadora ({TNK_WHATSAPP_DISPLAY})
              </p>
            </div>
          </div>
          {showFullSummary ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>

        {showFullSummary && (
          <div className="p-5 pt-2 border-t border-[#232635] space-y-5 text-xs sm:text-sm">
            {/* Imóveis e Acessos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#1b1e29] border border-[#292e3f] space-y-1">
                <span className="text-[11px] font-bold uppercase text-[#ff6a00]">Origem</span>
                <p className="font-bold text-white">
                  {simulation.originCity} - {simulation.originState}
                </p>
                <p className="text-xs text-gray-400">
                  {simulation.originPropertyType} • Elevador: {simulation.originHasElevator ? 'Sim' : 'Não'} • Escadas: {simulation.originStairsFlights} lance(s)
                </p>
                {(simulation.originZip || simulation.originAddress) && (
                  <p className="text-[11px] text-gray-400">
                    {simulation.originZip ? `CEP: ${simulation.originZip} ` : ''}
                    {simulation.originAddress ? `• ${simulation.originAddress}` : ''}
                  </p>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-[#1b1e29] border border-[#292e3f] space-y-1">
                <span className="text-[11px] font-bold uppercase text-[#ff6a00]">Destino</span>
                <p className="font-bold text-white">
                  {simulation.destinationCity} - {simulation.destinationState}
                </p>
                <p className="text-xs text-gray-400">
                  {simulation.destinationPropertyType} • Elevador: {simulation.destinationHasElevator ? 'Sim' : 'Não'} • Escadas: {simulation.destinationStairsFlights} lance(s)
                </p>
                {(simulation.destinationZip || simulation.destinationAddress) && (
                  <p className="text-[11px] text-gray-400">
                    {simulation.destinationZip ? `CEP: ${simulation.destinationZip} ` : ''}
                    {simulation.destinationAddress ? `• ${simulation.destinationAddress}` : ''}
                  </p>
                )}
              </div>
            </div>

            {/* Itens selecionados */}
            <div className="p-4 rounded-xl bg-[#1b1e29] border border-[#292e3f] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-[#ff6a00]">Lista de Móveis e Itens</span>
                <span className="text-xs text-gray-400 font-semibold">
                  {quote.totalItemsCount} volume(s) • ~{quote.totalVolumeM3} m³
                </span>
              </div>
              {quote.selectedItems.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {quote.selectedItems.map((it) => (
                    <span
                      key={it.id}
                      className="px-2.5 py-1 rounded-lg bg-[#12141c] border border-[#2d3245] text-xs text-gray-200"
                    >
                      <strong className="text-[#ff6a00]">{it.quantity}x</strong> {it.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">Nenhum item específico marcado (detalhes serão enviados por vídeo/mensagem).</p>
              )}
            </div>

            {/* Serviços */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#1b1e29] border border-[#292e3f]">
                <span className="text-gray-400 block">Desmontagem:</span>
                <strong className="text-white">{simulation.needDisassembly ? 'Sim, necessária' : 'Não precisa'}</strong>
              </div>
              <div className="p-3 rounded-xl bg-[#1b1e29] border border-[#292e3f]">
                <span className="text-gray-400 block">Montagem no Destino:</span>
                <strong className="text-white">{simulation.needAssembly ? 'Sim, desejada' : 'Não precisa'}</strong>
              </div>
              <div className="p-3 rounded-xl bg-[#1b1e29] border border-[#292e3f]">
                <span className="text-gray-400 block">Nível de Embalagem:</span>
                <strong className="text-white">{simulation.packingService}</strong>
              </div>
            </div>

            {selectedSpecificPacking.length > 0 && (
              <div className="text-xs text-gray-300">
                <span className="text-gray-400 font-semibold">Embalar itens delicados também: </span>
                <span className="text-white font-medium">
                  {selectedSpecificPacking.map((s) => s.label).join(', ')}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#171923] via-[#1a1d28] to-[#171923] border border-[#2f3448] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-black text-white">Tudo pronto para enviar seu orçamento?</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Ao clicar ao lado, enviaremos todas as informações preenchidas direto para o WhatsApp {TNK_WHATSAPP_DISPLAY}.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onRestart}
            className="px-5 py-3.5 rounded-xl bg-[#222634] hover:bg-[#2e3447] text-gray-300 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Editar / Refazer</span>
          </button>

          <button
            type="button"
            onClick={handleSendAllToWhatsApp}
            className="px-6 py-3.5 rounded-xl bg-[#25d366] hover:bg-[#20ba59] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#25d366]/25 transition cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Enviar no WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
