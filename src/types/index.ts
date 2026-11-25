export type PropertyType = 'Casa' | 'Apartamento' | 'Sobrado' | 'Condomínio' | 'Comercial';

export type PackingType = 'Nenhuma' | 'Parcial' | 'Completa';

export type MoveType = 'Exclusiva' | 'Compartilhada';

export interface MoveItem {
  id: string;
  name: string;
  category: 'Eletro' | 'Sala' | 'Quarto' | 'Cozinha' | 'Escritório' | 'Caixas' | 'Especiais' | 'Outros';
  volumeM3: number;
  weightKg: number;
  requiresDisassembly?: boolean;
  isFragile?: boolean;
  quantity: number;
}

export interface SimulationData {
  id?: string;
  createdAt?: string;
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  clientNotes?: string;

  // Etapa 1: Origem
  originCity: string;
  originState: string;
  originZip?: string;
  originAddress?: string;

  // Etapa 2: Destino
  destinationCity: string;
  destinationState: string;
  destinationZip?: string;
  destinationAddress?: string;

  // Etapa 3 & 4: Tipos de Imóveis
  originPropertyType: PropertyType;
  destinationPropertyType: PropertyType;

  // Etapa 5: Elevador
  originHasElevator: boolean;
  destinationHasElevator: boolean;

  // Etapa 6: Escadas (lances)
  originStairsFlights: number;
  destinationStairsFlights: number;

  // Etapa 7: Itens transportados
  items: MoveItem[];
  customItems?: MoveItem[];

  // Etapa 8: Desmontagem
  needDisassembly: boolean;

  // Etapa 9: Montagem
  needAssembly: boolean;

  // Etapa 10: Embalagem
  packingService: PackingType;

  // Etapa 11: Embalagem de itens específicos
  packSpecificItems: {
    dishes: boolean; // Louças
    kitchen: boolean; // Cozinha
    decor: boolean; // Decoração
    clothes: boolean; // Roupas
    paintings: boolean; // Quadros
    fragile: boolean; // Objetos frágeis
  };

  // Etapa 12: Data desejada
  preferredDate: string;
  preferredShift?: 'Manhã' | 'Tarde' | 'Integral';

  // Etapa 13: Tipo de mudança
  moveType: MoveType;

  // Video attachment
  videoAttachment?: {
    name: string;
    size: number;
    url?: string;
    uploadedAt: string;
  } | null;
}

export interface QuoteResult {
  distanceKm: number;
  estimatedTravelHours: number;
  estimatedWorkDuration: string;
  totalVolumeM3: number;
  totalWeightKg: number;
  totalItemsCount: number;
  selectedItems: Array<{
    id: string;
    name: string;
    quantity: number;
    volumeM3: number;
  }>;
  recommendedTruck: {
    name: string;
    description: string;
    capacityM3: number;
  };
  recommendedCrew: {
    drivers: number;
    helpers: number;
    description: string;
  };
}

export interface SavedQuote {
  id: string;
  createdAt: string;
  simulation: SimulationData;
  quote: QuoteResult;
  status: 'Novo' | 'Aguardando Vídeo' | 'Vídeo Recebido' | 'Enviado no WhatsApp' | 'Atendido';
  adminNotes?: string;
}
