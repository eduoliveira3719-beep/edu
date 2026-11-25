import React, { useState } from 'react';
import {
  BarChart3,
  FileSpreadsheet,
  MapPin,
  Lock,
  LogOut,
  X,
  Play,
  Video,
  Search,
  Eye,
  Truck,
  TrendingUp,
  MessageCircle,
} from 'lucide-react';
import { SavedQuote } from '../types';
import { TOP_BRAZIL_CITIES } from '../data/brazilCities';
import { buildWhatsAppQuoteMessage, getWhatsAppUrl } from '../utils/calculator';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  savedQuotes: SavedQuote[];
  onUpdateQuotes: (quotes: SavedQuote[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  savedQuotes,
  onUpdateQuotes,
}) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>('admin@tnk.com.br');
  const [adminPassword, setAdminPassword] = useState<string>('admin123');
  const [authError, setAuthError] = useState<string>('');

  // Admin tabs (zero pricing/coupons tabs)
  const [activeTab, setActiveTab] = useState<'kpis' | 'quotes' | 'cities'>('kpis');

  // Search in quotes
  const [quoteSearch, setQuoteSearch] = useState<string>('');
  const [selectedQuoteForReview, setSelectedQuoteForReview] = useState<SavedQuote | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail === 'admin@tnk.com.br' && adminPassword === 'admin123') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Credenciais incorretas. Use admin@tnk.com.br / admin123');
    }
  };

  // KPIs Calculations (no price metrics)
  const totalQuotesCount = savedQuotes.length;
  const videosCount = savedQuotes.filter((q) => !!q.simulation.videoAttachment).length;
  const totalVolumeM3 = savedQuotes.reduce((acc, q) => acc + q.quote.totalVolumeM3, 0);
  const exclusiveCount = savedQuotes.filter((q) => q.simulation.moveType === 'Exclusiva').length;

  // Export to Excel / CSV (no price column)
  const handleExportCSV = () => {
    if (savedQuotes.length === 0) {
      alert('Nenhum orçamento para exportar.');
      return;
    }

    const headers = [
      'ID',
      'Data',
      'Cliente',
      'Telefone',
      'Origem',
      'Destino',
      'Distancia_KM',
      'Tipo_Mudanca',
      'Volumes_m3',
      'Comentarios',
      'Tem_Video',
      'Status',
    ];

    const rows = savedQuotes.map((q) => [
      q.id,
      q.createdAt.split('T')[0],
      `"${q.simulation.clientName || 'Cliente Web'}"`,
      `"${q.simulation.clientPhone || 'Não informado'}"`,
      `"${q.simulation.originCity} - ${q.simulation.originState}"`,
      `"${q.simulation.destinationCity} - ${q.simulation.destinationState}"`,
      q.quote.distanceKm,
      q.simulation.moveType,
      q.quote.totalVolumeM3,
      `"${(q.simulation.clientNotes || '').replace(/"/g, '""')}"`,
      q.simulation.videoAttachment ? 'Sim' : 'Nao',
      q.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `orcamentos_tnk_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMarkAsAttended = (quoteId: string) => {
    const updated = savedQuotes.map((q) =>
      q.id === quoteId ? { ...q, status: 'Atendido' as const } : q
    );
    onUpdateQuotes(updated);
    try {
      localStorage.setItem('tnk_saved_quotes', JSON.stringify(updated));
    } catch {
      // Ignore
    }
    setSelectedQuoteForReview(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4">
      <div className="w-full max-w-6xl max-h-[92vh] bg-[#101217] border border-[#2b3040] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#232734] flex items-center justify-between bg-[#15171f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff6a00] text-black flex items-center justify-center font-black">
              TNK
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                Painel Administrativo TNK
                <span className="text-[10px] bg-[#ff6a00]/20 text-[#ff6a00] px-2 py-0.5 rounded-full font-bold uppercase border border-[#ff6a00]/30">
                  Orçamentos & Vídeos
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Solicitações recebidas, comentários de clientes, vídeos e rotas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-3 py-1.5 rounded-lg bg-[#222634] hover:bg-[#2c3245] text-xs font-semibold text-gray-300 flex items-center gap-1.5 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Fechar painel administrativo"
              className="w-9 h-9 rounded-xl bg-[#202330] hover:bg-[#2d3244] text-gray-400 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {!isAuthenticated ? (
            /* Login Screen */
            <div className="max-w-md mx-auto py-12">
              <div className="p-8 rounded-3xl bg-[#171922] border border-[#2c3142] text-center space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-[#ff6a00]/15 text-[#ff6a00] flex items-center justify-center mx-auto">
                  <Lock className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Acesso Restrito</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Digite suas credenciais de administrador da TNK Transportes
                  </p>
                </div>

                {authError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                    {authError}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4 text-left">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      E-mail do Administrador
                    </label>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      required
                      className="w-full bg-[#11131a] border border-[#2c3040] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff6a00]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      Senha
                    </label>
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                      className="w-full bg-[#11131a] border border-[#2c3040] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff6a00]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#ff6a00] hover:bg-[#e65f00] text-white font-bold text-sm transition shadow-lg shadow-[#ff6a00]/30"
                  >
                    Entrar no Painel
                  </button>
                </form>

                <div className="pt-2 text-[11px] text-gray-500">
                  Dica de teste rápido: E-mail: <strong className="text-gray-300">admin@tnk.com.br</strong> / Senha: <strong className="text-gray-300">admin123</strong>
                </div>
              </div>
            </div>
          ) : (
            /* Authenticated Admin Workspace */
            <div className="space-y-6">
              {/* Tabs Navigation */}
              <div className="flex items-center gap-2 border-b border-[#232735] pb-3 overflow-x-auto no-scrollbar">
                {[
                  { id: 'kpis', label: 'Dashboard & Métricas', icon: BarChart3 },
                  { id: 'quotes', label: `Orçamentos & Vídeos (${savedQuotes.length})`, icon: Video },
                  { id: 'cities', label: 'Cidades Atendidas', icon: MapPin },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'kpis' | 'quotes' | 'cities')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition ${
                        isActive
                          ? 'bg-[#ff6a00] text-white shadow-md shadow-[#ff6a00]/25'
                          : 'bg-[#181a24] text-gray-400 hover:text-white border border-[#262a38]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: KPIs & Metrics */}
              {activeTab === 'kpis' && (
                <div className="space-y-6">
                  {/* Top Stats Cards (No Price KPIs) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-[#161822] border border-[#282c3c]">
                      <div className="flex items-center justify-between text-gray-400 mb-2">
                        <span className="text-xs font-bold uppercase">Orçamentos Gerados</span>
                        <BarChart3 className="w-5 h-5 text-[#ff6a00]" />
                      </div>
                      <div className="text-3xl font-black text-white">{totalQuotesCount}</div>
                      <p className="text-[11px] text-green-400 mt-2 flex items-center gap-1 font-medium">
                        <TrendingUp className="w-3.5 h-3.5" /> Solicitações ativas
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#161822] border border-[#282c3c]">
                      <div className="flex items-center justify-between text-gray-400 mb-2">
                        <span className="text-xs font-bold uppercase">Mudanças Exclusivas</span>
                        <Truck className="w-5 h-5 text-[#ff6a00]" />
                      </div>
                      <div className="text-3xl font-black text-white">{exclusiveCount}</div>
                      <p className="text-[11px] text-gray-400 mt-2">
                        De {totalQuotesCount} solicitações
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#161822] border border-[#282c3c]">
                      <div className="flex items-center justify-between text-gray-400 mb-2">
                        <span className="text-xs font-bold uppercase">Vídeos Recebidos</span>
                        <Video className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="text-3xl font-black text-white">{videosCount}</div>
                      <p className="text-[11px] text-purple-400 mt-2 font-medium">
                        Vistorias anexadas pelo cliente
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#161822] border border-[#282c3c]">
                      <div className="flex items-center justify-between text-gray-400 mb-2">
                        <span className="text-xs font-bold uppercase">Volume Total Estimado</span>
                        <Truck className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="text-3xl font-black text-white">
                        {totalVolumeM3.toFixed(0)} m³
                      </div>
                      <p className="text-[11px] text-gray-400 mt-2">Capacidade mobilizada</p>
                    </div>
                  </div>

                  {/* Route Map Visual List */}
                  <div className="p-6 rounded-2xl bg-[#161822] border border-[#282c3c]">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-white text-base flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[#ff6a00]" /> Rotas Mais Solicitadas
                      </h4>
                      <button
                        onClick={handleExportCSV}
                        className="px-3.5 py-1.5 rounded-xl bg-[#232736] hover:bg-[#2e3347] text-white text-xs font-bold flex items-center gap-1.5 border border-[#373d52] transition"
                      >
                        <FileSpreadsheet className="w-4 h-4 text-green-400" />
                        Exportar Relatório Excel / CSV
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { route: 'São Paulo (SP) ➔ Rio de Janeiro (RJ)', km: 435, quotes: 14, tag: 'Interestadual' },
                        { route: 'São Paulo (SP) ➔ Curitiba (PR)', km: 408, quotes: 9, tag: 'Interestadual' },
                        { route: 'São Paulo (SP) ➔ Campinas (SP)', km: 95, quotes: 18, tag: 'Intermunicipal' },
                        { route: 'Curitiba (PR) ➔ Florianópolis (SC)', km: 300, quotes: 7, tag: 'Interestadual' },
                      ].map((r, i) => (
                        <div
                          key={i}
                          className="p-3.5 rounded-xl bg-[#1c1e29] border border-[#2c3040] flex items-center justify-between"
                        >
                          <div>
                            <p className="text-xs font-bold text-white">{r.route}</p>
                            <span className="text-[10px] text-gray-400">{r.km} km • {r.tag}</span>
                          </div>
                          <span className="text-xs font-extrabold text-[#ff6a00] bg-[#ff6a00]/10 px-2.5 py-1 rounded-lg">
                            {r.quotes} solicitações
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Quotes & Videos Review */}
              {activeTab === 'quotes' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 justify-between">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-500" />
                      <input
                        type="text"
                        value={quoteSearch}
                        onChange={(e) => setQuoteSearch(e.target.value)}
                        placeholder="Buscar por cliente, cidade de origem ou destino..."
                        className="w-full bg-[#161822] border border-[#282c3c] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6a00]"
                      />
                    </div>
                    <button
                      onClick={handleExportCSV}
                      className="px-4 py-2.5 rounded-xl bg-[#232736] hover:bg-[#2e3347] text-white text-xs font-bold flex items-center justify-center gap-2 border border-[#373d52] transition"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-green-400" />
                      Exportar para Excel (CSV)
                    </button>
                  </div>

                  {savedQuotes.length === 0 ? (
                    <div className="p-12 text-center rounded-2xl bg-[#161822] border border-[#282c3c]">
                      <Video className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-sm font-bold text-white">Nenhuma solicitação registrada ainda</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Os orçamentos preenchidos pelos clientes no aplicativo aparecerão listados aqui.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-[#282c3c] bg-[#161822]">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#1b1e2a] text-gray-400 uppercase text-[10px] tracking-wider border-b border-[#282c3c]">
                          <tr>
                            <th className="p-3.5">Cliente / Contato</th>
                            <th className="p-3.5">Origem ➔ Destino</th>
                            <th className="p-3.5">Modalidade</th>
                            <th className="p-3.5">Volume / Veículo</th>
                            <th className="p-3.5">Vídeo do Imóvel</th>
                            <th className="p-3.5">Status</th>
                            <th className="p-3.5 text-right">Ação</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#242838]">
                          {savedQuotes
                            .filter((q) => {
                              if (!quoteSearch.trim()) return true;
                              const query = quoteSearch.toLowerCase();
                              return (
                                (q.simulation.clientName || '').toLowerCase().includes(query) ||
                                q.simulation.originCity.toLowerCase().includes(query) ||
                                q.simulation.destinationCity.toLowerCase().includes(query)
                              );
                            })
                            .map((quote) => (
                              <tr key={quote.id} className="hover:bg-[#1d202e] transition">
                                <td className="p-3.5">
                                  <div className="font-bold text-white">
                                    {quote.simulation.clientName || 'Cliente Web'}
                                  </div>
                                  <div className="text-[11px] text-gray-400">
                                    {quote.simulation.clientPhone || 'WhatsApp não preenchido'}
                                  </div>
                                </td>
                                <td className="p-3.5">
                                  <div className="font-medium text-gray-200">
                                    {quote.simulation.originCity} ({quote.simulation.originState}) ➔ {quote.simulation.destinationCity} ({quote.simulation.destinationState})
                                  </div>
                                  <div className="text-[10px] text-gray-400">
                                    {quote.quote.distanceKm} km
                                  </div>
                                </td>
                                <td className="p-3.5">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      quote.simulation.moveType === 'Compartilhada'
                                        ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                                        : 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                                    }`}
                                  >
                                    {quote.simulation.moveType}
                                  </span>
                                </td>
                                <td className="p-3.5">
                                  <div className="font-bold text-white">{quote.quote.totalVolumeM3} m³</div>
                                  <div className="text-[10px] text-gray-400">{quote.quote.recommendedTruck.name}</div>
                                </td>
                                <td className="p-3.5">
                                  {quote.simulation.videoAttachment ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/15 text-purple-400 font-bold text-[10px] border border-purple-500/30">
                                      <Video className="w-3.5 h-3.5" /> Vídeo Disponível
                                    </span>
                                  ) : (
                                    <span className="text-gray-500 text-[11px]">Sem vídeo</span>
                                  )}
                                </td>
                                <td className="p-3.5">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                                    {quote.status}
                                  </span>
                                </td>
                                <td className="p-3.5 text-right">
                                  <button
                                    onClick={() => setSelectedQuoteForReview(quote)}
                                    className="px-3 py-1.5 rounded-lg bg-[#272b3c] hover:bg-[#ff6a00] hover:text-white text-gray-300 text-xs font-bold transition flex items-center gap-1 ml-auto"
                                  >
                                    <Eye className="w-3.5 h-3.5" /> Detalhes
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Review Quote Modal */}
                  {selectedQuoteForReview && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                      <div className="w-full max-w-2xl bg-[#14161f] border border-[#2f3547] rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-[#282d3e] pb-3">
                          <h3 className="text-base font-bold text-white">
                            Detalhes da Solicitação & Vídeo
                          </h3>
                          <button
                            onClick={() => setSelectedQuoteForReview(null)}
                            className="w-8 h-8 rounded-lg bg-[#222634] text-gray-400 hover:text-white flex items-center justify-center"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Video Player if client uploaded */}
                        {selectedQuoteForReview.simulation.videoAttachment?.url && (
                          <div className="space-y-2">
                            <span className="text-xs font-bold uppercase text-[#ff6a00] flex items-center gap-1.5">
                              <Play className="w-3.5 h-3.5" /> Vídeo Gravado pelo Cliente
                            </span>
                            <div className="w-full h-56 bg-black rounded-2xl overflow-hidden border border-[#3b4156] flex items-center justify-center">
                              <video
                                src={selectedQuoteForReview.simulation.videoAttachment.url}
                                controls
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3 text-xs bg-[#191b24] p-4 rounded-xl border border-[#272a38]">
                          <div>
                            <span className="text-gray-400">Origem:</span>
                            <p className="font-bold text-white">
                              {selectedQuoteForReview.simulation.originCity} - {selectedQuoteForReview.simulation.originState} (
                              {selectedQuoteForReview.simulation.originPropertyType})
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400">Destino:</span>
                            <p className="font-bold text-white">
                              {selectedQuoteForReview.simulation.destinationCity} - {selectedQuoteForReview.simulation.destinationState} (
                              {selectedQuoteForReview.simulation.destinationPropertyType})
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400">Data Preferencial:</span>
                            <p className="font-bold text-white">
                              {selectedQuoteForReview.simulation.preferredDate || 'A combinar'}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400">Volume / Veículo Sugerido:</span>
                            <p className="font-bold text-[#ff6a00] text-sm">
                              {selectedQuoteForReview.quote.totalVolumeM3} m³ • {selectedQuoteForReview.quote.recommendedTruck.name}
                            </p>
                          </div>
                        </div>

                        {selectedQuoteForReview.simulation.clientNotes && (
                          <div className="p-3.5 rounded-xl bg-[#191b24] border border-[#272a38] text-xs">
                            <span className="text-gray-400 font-bold block mb-1">Comentários do Cliente:</span>
                            <p className="text-white">{selectedQuoteForReview.simulation.clientNotes}</p>
                          </div>
                        )}

                        <div className="flex flex-wrap justify-end gap-2 pt-2">
                          <button
                            onClick={() => {
                              const msg = buildWhatsAppQuoteMessage(
                                selectedQuoteForReview.simulation,
                                selectedQuoteForReview.quote
                              );
                              window.open(getWhatsAppUrl(msg), '_blank');
                            }}
                            className="px-4 py-2.5 rounded-xl bg-[#25d366] text-white text-xs font-bold hover:bg-[#20ba59] transition flex items-center gap-1.5"
                          >
                            <MessageCircle className="w-4 h-4" /> Abrir no WhatsApp
                          </button>
                          <button
                            onClick={() => handleMarkAsAttended(selectedQuoteForReview.id)}
                            className="px-5 py-2.5 rounded-xl bg-[#ff6a00] text-white text-xs font-bold hover:bg-[#e65f00] transition"
                          >
                            Marcar como Atendido
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Cities Database */}
              {activeTab === 'cities' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">Cidades & Polos Atendidos pela TNK</h4>
                      <p className="text-xs text-gray-400">
                        Mais de {TOP_BRAZIL_CITIES.length} cidades cadastradas com coordenadas e rotas integradas
                      </p>
                    </div>
                  </div>

                  <div className="max-h-[360px] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pr-1">
                    {TOP_BRAZIL_CITIES.map((city, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#161822] border border-[#262a39] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#ff6a00]" />
                          <span className="font-semibold text-white">{city.name}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-[#222634] text-gray-300 font-bold text-[10px]">
                          {city.state}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
