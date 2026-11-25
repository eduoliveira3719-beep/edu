import React, { useState } from 'react';
import {
  MapPin,
  Building,
  Home,
  Building2,
  Store,
  Layers,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Minus,
  Search,
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  Info,
  ShieldCheck,
  Truck,
  Package,
  Wrench,
  HelpCircle,
} from 'lucide-react';
import { MoveItem, PackingType, PropertyType, SimulationData } from '../types';
import { BRAZIL_STATES, TOP_BRAZIL_CITIES } from '../data/brazilCities';
import { DEFAULT_MOVE_ITEMS } from '../data/defaultItems';

interface SimulationWizardProps {
  initialData: SimulationData;
  onComplete: (data: SimulationData) => void;
  onCancel: () => void;
}

const PROPERTY_TYPES: { type: PropertyType; label: string; icon: React.FC<{ className?: string }> }[] = [
  { type: 'Casa', label: 'Casa Térrea / Rua', icon: Home },
  { type: 'Apartamento', label: 'Apartamento', icon: Building },
  { type: 'Sobrado', label: 'Sobrado', icon: Layers },
  { type: 'Condomínio', label: 'Condomínio Fechado', icon: Building2 },
  { type: 'Comercial', label: 'Comercial / Escritório', icon: Store },
];

export const SimulationWizard: React.FC<SimulationWizardProps> = ({
  initialData,
  onComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 12;

  const [formData, setFormData] = useState<SimulationData>(() => {
    // Initialize with default items list if empty
    const items =
      initialData.items && initialData.items.length > 0
        ? initialData.items
        : DEFAULT_MOVE_ITEMS.map((item) => ({
            ...item,
            quantity: 0,
          }));
    return {
      ...initialData,
      items,
    };
  });

  // State for items search & category filter in Step 7
  const [itemCategoryFilter, setItemCategoryFilter] = useState<string>('Todos');
  const [itemSearchQuery, setItemSearchQuery] = useState<string>('');
  const [showAddCustomModal, setShowAddCustomModal] = useState<boolean>(false);
  const [customItemName, setCustomItemName] = useState<string>('');
  const [customItemCategory, setCustomItemCategory] = useState<MoveItem['category']>('Outros');

  // Validation errors
  const [stepError, setStepError] = useState<string>('');

  // Update item quantity helper
  const handleItemQuantityChange = (itemId: string, delta: number) => {
    setFormData((prev) => {
      const updated = prev.items.map((it) => {
        if (it.id === itemId) {
          const newQty = Math.max(0, it.quantity + delta);
          return { ...it, quantity: newQty };
        }
        return it;
      });
      return { ...prev, items: updated };
    });
  };

  // Add custom item
  const handleAddCustomItem = () => {
    if (!customItemName.trim()) return;
    const newItem: MoveItem = {
      id: `custom_${Date.now()}`,
      name: customItemName.trim(),
      category: customItemCategory,
      volumeM3: 0.8,
      weightKg: 30,
      requiresDisassembly: false,
      quantity: 1,
    };

    setFormData((prev) => ({
      ...prev,
      items: [newItem, ...prev.items],
    }));

    setCustomItemName('');
    setShowAddCustomModal(false);
  };

  // Total items count and volume live
  const totalItemsSelected = formData.items.reduce((acc, it) => acc + it.quantity, 0);
  const totalVolumeEst = formData.items.reduce((acc, it) => acc + it.volumeM3 * it.quantity, 0);

  // Validate current step before advancing
  const validateAndProceed = () => {
    setStepError('');

    if (currentStep === 1) {
      if (!formData.originCity.trim()) {
        setStepError('Por favor, informe a cidade de origem.');
        return;
      }
      if (!formData.originState) {
        setStepError('Por favor, selecione o estado (UF) de origem.');
        return;
      }
    }

    if (currentStep === 2) {
      if (!formData.destinationCity.trim()) {
        setStepError('Por favor, informe a cidade de destino.');
        return;
      }
      if (!formData.destinationState) {
        setStepError('Por favor, selecione o estado (UF) de destino.');
        return;
      }
    }

    if (currentStep === 12) {
      if (!formData.preferredDate) {
        // Default to a date 5 days ahead if empty
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        setFormData((prev) => ({
          ...prev,
          preferredDate: nextWeek.toISOString().split('T')[0],
        }));
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Complete simulation
      onComplete({ ...formData, moveType: 'Exclusiva' });
    }
  };

  const handleBack = () => {
    setStepError('');
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onCancel();
    }
  };

  // Popular cities quick select chips
  const popularCities = [
    { city: 'São Paulo', state: 'SP' },
    { city: 'Rio de Janeiro', state: 'RJ' },
    { city: 'Belo Horizonte', state: 'MG' },
    { city: 'Curitiba', state: 'PR' },
    { city: 'Campinas', state: 'SP' },
    { city: 'Brasília', state: 'DF' },
    { city: 'Florianópolis', state: 'SC' },
    { city: 'Santos', state: 'SP' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">
      {/* Progress & Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-400 mb-2">
          <span className="flex items-center gap-1.5 text-[#ff6a00]">
            <Truck className="w-3.5 h-3.5" />
            <span>Etapa {currentStep} de {totalSteps}</span>
          </span>
          <span>{Math.round((currentStep / totalSteps) * 100)}% concluído</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-[#1b1d24] rounded-full overflow-hidden border border-[#2a2d39]">
          <div
            className="h-full bg-gradient-to-r from-[#ff8c33] to-[#ff6a00] transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Step Card Container */}
      <div className="bg-[#14161d] border border-[#262936] rounded-2xl p-5 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Step 1: Origem */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <span className="inline-block px-2.5 py-1 rounded bg-[#ff6a00]/15 text-[#ff6a00] text-xs font-bold uppercase tracking-wider mb-2">
                Ponto de Partida
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Onde começa a sua mudança?
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Informe o local atual onde nossa equipe fará o carregamento dos seus pertences.
              </p>
            </div>

            {/* Quick chips */}
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-2">Cidades frequentes:</p>
              <div className="flex flex-wrap gap-2">
                {popularCities.map((pc, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        originCity: pc.city,
                        originState: pc.state,
                      }))
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                      formData.originCity === pc.city && formData.originState === pc.state
                        ? 'bg-[#ff6a00] text-white border-[#ff6a00]'
                        : 'bg-[#1b1e27] text-gray-300 border-[#2a2e3d] hover:border-gray-500'
                    }`}
                  >
                    {pc.city} - {pc.state}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Cidade de Origem *
                </label>
                <div className="relative">
                  <MapPin className="w-5 h-5 absolute left-3.5 top-3.5 text-gray-500" />
                  <input
                    type="text"
                    value={formData.originCity}
                    onChange={(e) => setFormData({ ...formData, originCity: e.target.value })}
                    placeholder="Ex: São Paulo, Curitiba, Santos..."
                    className="w-full bg-[#1b1e28] border border-[#2f3342] rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Estado (UF) *
                </label>
                <select
                  value={formData.originState}
                  onChange={(e) => setFormData({ ...formData, originState: e.target.value })}
                  className="w-full bg-[#1b1e28] border border-[#2f3342] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff6a00]"
                >
                  <option value="">Selecione</option>
                  {BRAZIL_STATES.map((st) => (
                    <option key={st.uf} value={st.uf}>
                      {st.uf} - {st.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  CEP de Origem (opcional)
                </label>
                <input
                  type="text"
                  value={formData.originZip || ''}
                  onChange={(e) => setFormData({ ...formData, originZip: e.target.value })}
                  placeholder="00000-000"
                  maxLength={9}
                  className="w-full bg-[#1b1e28] border border-[#2f3342] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6a00]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Bairro ou Endereço (opcional)
                </label>
                <input
                  type="text"
                  value={formData.originAddress || ''}
                  onChange={(e) => setFormData({ ...formData, originAddress: e.target.value })}
                  placeholder="Ex: Jardins, Moema, Centro..."
                  className="w-full bg-[#1b1e28] border border-[#2f3342] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6a00]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Destino */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <span className="inline-block px-2.5 py-1 rounded bg-[#ff6a00]/15 text-[#ff6a00] text-xs font-bold uppercase tracking-wider mb-2">
                Ponto de Chegada
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Para onde você vai se mudar?
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                A TNK realiza mudanças municipais, intermunicipais e interestaduais para todo o Brasil.
              </p>
            </div>

            {/* Quick chips */}
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-2">Cidades frequentes:</p>
              <div className="flex flex-wrap gap-2">
                {popularCities.map((pc, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        destinationCity: pc.city,
                        destinationState: pc.state,
                      }))
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                      formData.destinationCity === pc.city && formData.destinationState === pc.state
                        ? 'bg-[#ff6a00] text-white border-[#ff6a00]'
                        : 'bg-[#1b1e27] text-gray-300 border-[#2a2e3d] hover:border-gray-500'
                    }`}
                  >
                    {pc.city} - {pc.state}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Cidade de Destino *
                </label>
                <div className="relative">
                  <MapPin className="w-5 h-5 absolute left-3.5 top-3.5 text-[#ff6a00]" />
                  <input
                    type="text"
                    value={formData.destinationCity}
                    onChange={(e) => setFormData({ ...formData, destinationCity: e.target.value })}
                    placeholder="Ex: Florianópolis, Rio de Janeiro, Goiânia..."
                    className="w-full bg-[#1b1e28] border border-[#2f3342] rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Estado (UF) *
                </label>
                <select
                  value={formData.destinationState}
                  onChange={(e) => setFormData({ ...formData, destinationState: e.target.value })}
                  className="w-full bg-[#1b1e28] border border-[#2f3342] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#ff6a00]"
                >
                  <option value="">Selecione</option>
                  {BRAZIL_STATES.map((st) => (
                    <option key={st.uf} value={st.uf}>
                      {st.uf} - {st.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  CEP de Destino
                </label>
                <input
                  type="text"
                  value={formData.destinationZip || ''}
                  onChange={(e) => setFormData({ ...formData, destinationZip: e.target.value })}
                  placeholder="00000-000"
                  maxLength={9}
                  className="w-full bg-[#1b1e28] border border-[#2f3342] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6a00]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Bairro ou Endereço de Destino (opcional)
                </label>
                <input
                  type="text"
                  value={formData.destinationAddress || ''}
                  onChange={(e) => setFormData({ ...formData, destinationAddress: e.target.value })}
                  placeholder="Ex: Boa Viagem, Batel, Barra da Tijuca..."
                  className="w-full bg-[#1b1e28] border border-[#2f3342] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6a00]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Tipo do imóvel de origem */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <span className="inline-block px-2.5 py-1 rounded bg-[#ff6a00]/15 text-[#ff6a00] text-xs font-bold uppercase tracking-wider mb-2">
                Origem
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Qual é o tipo do imóvel de origem?
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Isso ajuda a dimensionar o acesso de caminhões e facilidades de estacionamento.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {PROPERTY_TYPES.map((pt) => {
                const Icon = pt.icon;
                const isSelected = formData.originPropertyType === pt.type;
                return (
                  <button
                    key={pt.type}
                    type="button"
                    onClick={() => setFormData({ ...formData, originPropertyType: pt.type })}
                    className={`p-4 rounded-xl text-left border flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#ff6a00]/15 border-[#ff6a00] text-white glow-orange-sm'
                        : 'bg-[#1b1e27] border-[#292c3a] text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-[#ff6a00] text-white' : 'bg-[#252834] text-gray-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-sm">{pt.label}</span>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-[#ff6a00] text-white flex items-center justify-center">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Tipo do imóvel de destino */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <span className="inline-block px-2.5 py-1 rounded bg-[#ff6a00]/15 text-[#ff6a00] text-xs font-bold uppercase tracking-wider mb-2">
                Destino
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Qual é o tipo do imóvel de destino?
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Selecione o tipo de residência ou prédio onde os móveis serão entregues.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {PROPERTY_TYPES.map((pt) => {
                const Icon = pt.icon;
                const isSelected = formData.destinationPropertyType === pt.type;
                return (
                  <button
                    key={pt.type}
                    type="button"
                    onClick={() => setFormData({ ...formData, destinationPropertyType: pt.type })}
                    className={`p-4 rounded-xl text-left border flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#ff6a00]/15 border-[#ff6a00] text-white glow-orange-sm'
                        : 'bg-[#1b1e27] border-[#292c3a] text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-[#ff6a00] text-white' : 'bg-[#252834] text-gray-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-sm">{pt.label}</span>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-[#ff6a00] text-white flex items-center justify-center">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: Existe elevador? (Origem e Destino) */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <span className="inline-block px-2.5 py-1 rounded bg-[#ff6a00]/15 text-[#ff6a00] text-xs font-bold uppercase tracking-wider mb-2">
                Acessibilidade
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Existe elevador nos imóveis?
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Elevadores de serviço ou social agilizam o transporte de grandes volumes.
              </p>
            </div>

            <div className="space-y-4">
              {/* Imóvel de Origem */}
              <div className="p-4 rounded-xl bg-[#1b1e27] border border-[#2b2e3d]">
                <p className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  Elevador no Imóvel de Origem ({formData.originCity || 'Origem'}):
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, originHasElevator: true })}
                    className={`py-3 px-4 rounded-xl font-bold text-sm border flex items-center justify-center gap-2 transition ${
                      formData.originHasElevator
                        ? 'bg-[#ff6a00] text-white border-[#ff6a00]'
                        : 'bg-[#242733] text-gray-300 border-[#323647] hover:border-gray-500'
                    }`}
                  >
                    <Check className="w-4 h-4" /> Sim, tem elevador
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, originHasElevator: false })}
                    className={`py-3 px-4 rounded-xl font-bold text-sm border flex items-center justify-center gap-2 transition ${
                      !formData.originHasElevator
                        ? 'bg-[#ff6a00] text-white border-[#ff6a00]'
                        : 'bg-[#242733] text-gray-300 border-[#323647] hover:border-gray-500'
                    }`}
                  >
                    Não tem elevador
                  </button>
                </div>
              </div>

              {/* Imóvel de Destino */}
              <div className="p-4 rounded-xl bg-[#1b1e27] border border-[#2b2e3d]">
                <p className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#ff6a00]" />
                  Elevador no Imóvel de Destino ({formData.destinationCity || 'Destino'}):
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, destinationHasElevator: true })}
                    className={`py-3 px-4 rounded-xl font-bold text-sm border flex items-center justify-center gap-2 transition ${
                      formData.destinationHasElevator
                        ? 'bg-[#ff6a00] text-white border-[#ff6a00]'
                        : 'bg-[#242733] text-gray-300 border-[#323647] hover:border-gray-500'
                    }`}
                  >
                    <Check className="w-4 h-4" /> Sim, tem elevador
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, destinationHasElevator: false })}
                    className={`py-3 px-4 rounded-xl font-bold text-sm border flex items-center justify-center gap-2 transition ${
                      !formData.destinationHasElevator
                        ? 'bg-[#ff6a00] text-white border-[#ff6a00]'
                        : 'bg-[#242733] text-gray-300 border-[#323647] hover:border-gray-500'
                    }`}
                  >
                    Não tem elevador
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Escadas (lances) */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div>
              <span className="inline-block px-2.5 py-1 rounded bg-[#ff6a00]/15 text-[#ff6a00] text-xs font-bold uppercase tracking-wider mb-2">
                Escadas & Andares
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Quantidade de lances de escada
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Se os móveis precisarem subir ou descer escadas sem elevador, indique a quantidade de lances. (Geralmente 1 lance = 1 andar).
              </p>
            </div>

            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#1b1e27] border border-[#2b2e3d] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-white text-base">Escadas na Origem</h4>
                  <p className="text-xs text-gray-400">
                    {formData.originHasElevator
                      ? 'Elevador disponível (informe apenas lances adicionais de acesso, se houver)'
                      : 'Sem elevador (quantos andares / lances de escada?)'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        originStairsFlights: Math.max(0, formData.originStairsFlights - 1),
                      })
                    }
                    className="w-10 h-10 rounded-lg bg-[#272b38] hover:bg-[#34394b] text-white flex items-center justify-center font-bold text-lg transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-xl font-extrabold text-[#ff6a00]">
                    {formData.originStairsFlights}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        originStairsFlights: formData.originStairsFlights + 1,
                      })
                    }
                    className="w-10 h-10 rounded-lg bg-[#272b38] hover:bg-[#34394b] text-white flex items-center justify-center font-bold text-lg transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#1b1e27] border border-[#2b2e3d] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-white text-base">Escadas no Destino</h4>
                  <p className="text-xs text-gray-400">
                    {formData.destinationHasElevator
                      ? 'Elevador disponível (informe apenas lances adicionais de acesso, se houver)'
                      : 'Sem elevador (quantos andares / lances de escada?)'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        destinationStairsFlights: Math.max(0, formData.destinationStairsFlights - 1),
                      })
                    }
                    className="w-10 h-10 rounded-lg bg-[#272b38] hover:bg-[#34394b] text-white flex items-center justify-center font-bold text-lg transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-xl font-extrabold text-[#ff6a00]">
                    {formData.destinationStairsFlights}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        destinationStairsFlights: formData.destinationStairsFlights + 1,
                      })
                    }
                    className="w-10 h-10 rounded-lg bg-[#272b38] hover:bg-[#34394b] text-white flex items-center justify-center font-bold text-lg transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: O que será transportado? (Lista Inteligente) */}
        {currentStep === 7 && (
          <div className="space-y-5">
            <div>
              <span className="inline-block px-2.5 py-1 rounded bg-[#ff6a00]/15 text-[#ff6a00] text-xs font-bold uppercase tracking-wider mb-2">
                Inventário Inteligente
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                O que será transportado?
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Adicione os principais itens e caixas da sua mudança. Se não encontrar algo, adicione manualmente.
              </p>
            </div>

            {/* Live Counter Pill */}
            <div className="bg-[#1e222d] border border-[#2f3547] rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#ff6a00]/20 text-[#ff6a00] flex items-center justify-center font-bold">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total de itens selecionados:</p>
                  <p className="text-sm font-extrabold text-white">
                    {totalItemsSelected} volumes ~ {totalVolumeEst.toFixed(1)} m³
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCustomModal(true)}
                className="px-3 py-1.5 rounded-lg bg-[#ff6a00] hover:bg-[#e65f00] text-white text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Outro Item
              </button>
            </div>

            {/* Category tabs & Search */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-500" />
                <input
                  type="text"
                  value={itemSearchQuery}
                  onChange={(e) => setItemSearchQuery(e.target.value)}
                  placeholder="Buscar móvel ou item (ex: geladeira, cama, piano...)"
                  className="w-full bg-[#1b1e28] border border-[#2d3140] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6a00]"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                {['Todos', 'Eletro', 'Sala', 'Quarto', 'Cozinha', 'Escritório', 'Caixas', 'Especiais'].map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setItemCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                        itemCategoryFilter === cat
                          ? 'bg-[#ff6a00] text-white font-bold'
                          : 'bg-[#1b1e27] text-gray-400 hover:text-white border border-[#2a2e3d]'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Items list */}
            <div className="max-h-[360px] overflow-y-auto space-y-2 pr-1">
              {formData.items
                .filter((it) => {
                  if (itemCategoryFilter !== 'Todos' && it.category !== itemCategoryFilter) return false;
                  if (itemSearchQuery.trim()) {
                    return it.name.toLowerCase().includes(itemSearchQuery.toLowerCase());
                  }
                  return true;
                })
                .map((item) => {
                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition ${
                        item.quantity > 0
                          ? 'bg-[#ff6a00]/10 border-[#ff6a00]/50'
                          : 'bg-[#191b23] border-[#262936]'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm truncate">{item.name}</span>
                          {item.requiresDisassembly && (
                            <span className="text-[10px] bg-blue-500/15 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 font-medium">
                              Desmontável
                            </span>
                          )}
                          {item.isFragile && (
                            <span className="text-[10px] bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 font-medium">
                              Frágil
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400">
                          {item.volumeM3} m³ • ~{item.weightKg} kg
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleItemQuantityChange(item.id, -1)}
                          disabled={item.quantity === 0}
                          className="w-8 h-8 rounded-lg bg-[#272b38] hover:bg-[#323747] disabled:opacity-30 text-white flex items-center justify-center transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span
                          className={`w-7 text-center font-bold text-sm ${
                            item.quantity > 0 ? 'text-[#ff6a00]' : 'text-gray-400'
                          }`}
                        >
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleItemQuantityChange(item.id, 1)}
                          className="w-8 h-8 rounded-lg bg-[#272b38] hover:bg-[#ff6a00] text-white flex items-center justify-center transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Modal for adding custom item */}
            {showAddCustomModal && (
              <div className="p-4 rounded-xl bg-[#1c202c] border border-[#ff6a00]/40 space-y-3">
                <h4 className="text-sm font-bold text-white">Adicionar Item Personalizado</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={customItemName}
                    onChange={(e) => setCustomItemName(e.target.value)}
                    placeholder="Nome do item (ex: Mesa de sinuca, Aquário...)"
                    className="bg-[#14161f] border border-[#2d3243] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6a00]"
                  />
                  <select
                    value={customItemCategory}
                    onChange={(e) => setCustomItemCategory(e.target.value as any)}
                    className="bg-[#14161f] border border-[#2d3243] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Sala">Sala</option>
                    <option value="Quarto">Quarto</option>
                    <option value="Cozinha">Cozinha</option>
                    <option value="Eletro">Eletrodoméstico</option>
                    <option value="Especiais">Especial / Pesado</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCustomModal(false)}
                    className="px-3 py-1.5 rounded-lg bg-gray-700 text-xs text-white font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleAddCustomItem}
                    className="px-3 py-1.5 rounded-lg bg-[#ff6a00] text-xs text-white font-bold"
                  >
                    Salvar Item
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 8: Deseja desmontagem? */}
        {currentStep === 8 && (
          <div className="space-y-6">
            <div>
              <span className="inline-block px-2.5 py-1 rounded bg-[#ff6a00]/15 text-[#ff6a00] text-xs font-bold uppercase tracking-wider mb-2">
                Serviço de Montador
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Deseja desmontagem de móveis?
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                A equipe TNK conta com montadores profissionais e ferramentas adequadas para desmontar armários, camas e mesas com total segurança.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, needDisassembly: true })}
                className={`p-6 rounded-2xl border text-left transition flex flex-col justify-between h-44 ${
                  formData.needDisassembly
                    ? 'bg-[#ff6a00]/15 border-[#ff6a00] text-white glow-orange-sm'
                    : 'bg-[#1b1e27] border-[#292c3a] text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      formData.needDisassembly ? 'bg-[#ff6a00] text-white' : 'bg-[#252834] text-gray-400'
                    }`}
                  >
                    <Wrench className="w-6 h-6" />
                  </div>
                  {formData.needDisassembly && <Check className="w-5 h-5 text-[#ff6a00]" />}
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-white">Sim, preciso de desmontagem</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Nossa equipe cuidará de desmontar todos os móveis grandes na origem.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, needDisassembly: false })}
                className={`p-6 rounded-2xl border text-left transition flex flex-col justify-between h-44 ${
                  !formData.needDisassembly
                    ? 'bg-[#ff6a00]/15 border-[#ff6a00] text-white glow-orange-sm'
                    : 'bg-[#1b1e27] border-[#292c3a] text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      !formData.needDisassembly ? 'bg-[#ff6a00] text-white' : 'bg-[#252834] text-gray-400'
                    }`}
                  >
                    <Package className="w-6 h-6" />
                  </div>
                  {!formData.needDisassembly && <Check className="w-5 h-5 text-[#ff6a00]" />}
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-white">Não, já estarão desmontados</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Os itens já estarão prontos para serem apenas carregados no caminhão.
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 9: Deseja montagem? */}
        {currentStep === 9 && (
          <div className="space-y-6">
            <div>
              <span className="inline-block px-2.5 py-1 rounded bg-[#ff6a00]/15 text-[#ff6a00] text-xs font-bold uppercase tracking-wider mb-2">
                No Destino
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Deseja montagem de móveis no destino?
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Deixamos seus móveis devidamente montados e posicionados nos seus respectivos cômodos na nova casa.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, needAssembly: true })}
                className={`p-6 rounded-2xl border text-left transition flex flex-col justify-between h-44 ${
                  formData.needAssembly
                    ? 'bg-[#ff6a00]/15 border-[#ff6a00] text-white glow-orange-sm'
                    : 'bg-[#1b1e27] border-[#292c3a] text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      formData.needAssembly ? 'bg-[#ff6a00] text-white' : 'bg-[#252834] text-gray-400'
                    }`}
                  >
                    <Wrench className="w-6 h-6" />
                  </div>
                  {formData.needAssembly && <Check className="w-5 h-5 text-[#ff6a00]" />}
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-white">Sim, desejo montagem</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Montamos os móveis no destino para você já entrar com tudo pronto.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, needAssembly: false })}
                className={`p-6 rounded-2xl border text-left transition flex flex-col justify-between h-44 ${
                  !formData.needAssembly
                    ? 'bg-[#ff6a00]/15 border-[#ff6a00] text-white glow-orange-sm'
                    : 'bg-[#1b1e27] border-[#292c3a] text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      !formData.needAssembly ? 'bg-[#ff6a00] text-white' : 'bg-[#252834] text-gray-400'
                    }`}
                  >
                    <Package className="w-6 h-6" />
                  </div>
                  {!formData.needAssembly && <Check className="w-5 h-5 text-[#ff6a00]" />}
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-white">Não preciso de montagem</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Apenas o descarregamento e posicionamento dos itens no imóvel.
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 10: Deseja embalagem? */}
        {currentStep === 10 && (
          <div className="space-y-6">
            <div>
              <span className="inline-block px-2.5 py-1 rounded bg-[#ff6a00]/15 text-[#ff6a00] text-xs font-bold uppercase tracking-wider mb-2">
                Proteção dos Pertences
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Qual nível de embalagem você deseja?
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Utilizamos mantas térmicas, plástico bolha especial, fitas reforçadas e caixas de alta resistência.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {[
                {
                  type: 'Nenhuma' as PackingType,
                  title: 'Nenhuma',
                  desc: 'Você mesmo embala todos os itens e móveis.',
                  badge: 'Por Conta Própria',
                },
                {
                  type: 'Parcial' as PackingType,
                  title: 'Parcial',
                  desc: 'A TNK embala e protege todos os móveis e eletrodomésticos grandes.',
                  badge: 'Mais Popular',
                  recommended: true,
                },
                {
                  type: 'Completa' as PackingType,
                  title: 'Completa',
                  desc: 'A TNK embala absolutamente tudo: móveis, roupas, caixas e louças.',
                  badge: 'Sem Preocupações',
                },
              ].map((p) => {
                const isSelected = formData.packingService === p.type;
                return (
                  <button
                    key={p.type}
                    type="button"
                    onClick={() => setFormData({ ...formData, packingService: p.type })}
                    className={`p-5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#ff6a00]/15 border-[#ff6a00] text-white glow-orange-sm'
                        : 'bg-[#1b1e27] border-[#292c3a] text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <div>
                      <span className="inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#ff6a00]/20 text-[#ff6a00] mb-2 border border-[#ff6a00]/30">
                        {p.badge}
                      </span>
                      <h4 className="font-extrabold text-lg text-white mb-1">{p.title}</h4>
                      <p className="text-xs text-gray-400">{p.desc}</p>
                    </div>
                    {isSelected && (
                      <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#ff6a00]">
                        <Check className="w-4 h-4 stroke-[3]" /> Selecionado
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 11: Deseja que a TNK embale também (Itens específicos) */}
        {currentStep === 11 && (
          <div className="space-y-6">
            <div>
              <span className="inline-block px-2.5 py-1 rounded bg-[#ff6a00]/15 text-[#ff6a00] text-xs font-bold uppercase tracking-wider mb-2">
                Itens Delicados
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Deseja que a TNK embale também:
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Marque os itens especiais que você deseja que nossos profissionais embale com caixas colmeia e plástico especial:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'dishes', label: 'Louças e Porcelanas', desc: 'Pratos, copos e taças protegidos' },
                { key: 'kitchen', label: 'Utensílios de Cozinha', desc: 'Panelas, eletros e mantimentos' },
                { key: 'decor', label: 'Itens de Decoração', desc: 'Vasos, bibelôs e esculturas' },
                { key: 'clothes', label: 'Roupas em Cabideiro', desc: 'Caixas porta-cabides exclusivas' },
                { key: 'paintings', label: 'Quadros e Espelhos', desc: 'Cantoneiras de proteção e bolha' },
                { key: 'fragile', label: 'Objetos Frágeis Diversos', desc: 'Embalagem especial personalizada' },
              ].map((item) => {
                const isChecked = (formData.packSpecificItems as any)[item.key];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        packSpecificItems: {
                          ...formData.packSpecificItems,
                          [item.key]: !isChecked,
                        },
                      })
                    }
                    className={`p-4 rounded-xl border text-left flex items-start justify-between gap-3 transition ${
                      isChecked
                        ? 'bg-[#ff6a00]/15 border-[#ff6a00] text-white'
                        : 'bg-[#1b1e27] border-[#292c3a] text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-sm text-white">{item.label}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isChecked
                          ? 'bg-[#ff6a00] border-[#ff6a00] text-white'
                          : 'border-gray-500 bg-[#252834]'
                      }`}
                    >
                      {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 12: Data desejada */}
        {currentStep === 12 && (
          <div className="space-y-6">
            <div>
              <span className="inline-block px-2.5 py-1 rounded bg-[#ff6a00]/15 text-[#ff6a00] text-xs font-bold uppercase tracking-wider mb-2">
                Programação
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Qual é a data desejada para sua mudança?
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Escolha o dia ideal. Nossas equipes trabalham de segunda a domingo.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300 block mb-2">
                  Data da Mudança
                </label>
                <div className="relative">
                  <CalendarIcon className="w-5 h-5 absolute left-3.5 top-3.5 text-[#ff6a00]" />
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full bg-[#1b1e28] border border-[#2f3342] rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-[#ff6a00]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300 block mb-2">
                  Período de Preferência
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { shift: 'Manhã', desc: 'Início às 08:00' },
                    { shift: 'Tarde', desc: 'Início às 13:00' },
                    { shift: 'Integral', desc: 'Horário Flexível' },
                  ].map((s) => (
                    <button
                      key={s.shift}
                      type="button"
                      onClick={() => setFormData({ ...formData, preferredShift: s.shift as any })}
                      className={`p-3 rounded-xl border text-center transition ${
                        formData.preferredShift === s.shift
                          ? 'bg-[#ff6a00] text-white border-[#ff6a00] font-bold'
                          : 'bg-[#1b1e27] text-gray-300 border-[#2a2e3d] hover:border-gray-500'
                      }`}
                    >
                      <span className="block text-sm font-bold">{s.shift}</span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">{s.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Validation error message if any */}
        {stepError && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-semibold flex items-center gap-2">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>{stepError}</span>
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-[#262936] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="px-5 py-3 rounded-xl bg-[#1d202b] hover:bg-[#282d3d] text-gray-300 font-bold text-sm flex items-center gap-2 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentStep === 1 ? 'Cancelar' : 'Voltar'}</span>
          </button>

          <button
            type="button"
            onClick={validateAndProceed}
            className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#ff771a] to-[#ff6a00] hover:from-[#ff852e] hover:to-[#ff5c00] text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-[#ff6a00]/30 transition-all hover:scale-[1.02]"
          >
            <span>{currentStep === totalSteps ? 'Gerar Resumo do Orçamento' : 'Próxima Etapa'}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
