import { QuoteResult, SimulationData } from '../types';
import { getRouteDistanceKm } from '../data/brazilCities';

export const TNK_WHATSAPP_NUMBER = '5538999692413';
export const TNK_WHATSAPP_DISPLAY = '(38) 99969-2413';

/**
 * Pure logistical summary builder for TNK Mudanças (no price calculations).
 * Computes estimated route distance, total cargo volume/weight,
 * recommended vehicle, crew sizing, and structured item list.
 */
export function buildMoveQuoteSummary(simulation: SimulationData): QuoteResult {
  // 1. Distance Estimation
  const distanceKm = getRouteDistanceKm(
    simulation.originCity,
    simulation.originState,
    simulation.destinationCity,
    simulation.destinationState
  );

  // 2. Volume, Weight & Item Categories aggregation
  let totalVolumeM3 = 0;
  let totalWeightKg = 0;
  let totalItemsCount = 0;

  const selectedItems: QuoteResult['selectedItems'] = [];
  const allItems = [...(simulation.items || []), ...(simulation.customItems || [])];

  for (const item of allItems) {
    if (item.quantity > 0) {
      totalVolumeM3 += item.volumeM3 * item.quantity;
      totalWeightKg += item.weightKg * item.quantity;
      totalItemsCount += item.quantity;

      selectedItems.push({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        volumeM3: Number((item.volumeM3 * item.quantity).toFixed(2)),
      });
    }
  }

  // Fallback volume if no items selected yet
  if (totalVolumeM3 === 0) {
    totalVolumeM3 = 6.0;
    totalWeightKg = 450;
  }

  // 3. Sugestão de Carga (sempre Caminhão Baú)
  const recommendedTruck = {
    name: 'Caminhão Baú',
    description: 'Baú fechado e equipado para transporte seguro da sua mudança.',
    capacityM3: 55,
  };

  const originStairs = !simulation.originHasElevator ? Math.max(0, simulation.originStairsFlights || 0) : 0;
  const destStairs = !simulation.destinationHasElevator ? Math.max(0, simulation.destinationStairsFlights || 0) : 0;
  const totalStairsFlights = originStairs + destStairs;

  // 4. Equipe Sugerida (sempre fixa)
  const recommendedCrew = {
    drivers: 1,
    helpers: 3,
    description: 'Motorista ajudante, ajudantes carregadores e montador de móveis ajudante de carga',
  };

  // 5. Time Estimates
  const travelHours = Math.max(0.75, Number((distanceKm / 60).toFixed(1)));
  const loadingHours = Math.max(2, Math.round(1.5 + totalVolumeM3 * 0.12 + totalStairsFlights * 0.2));

  let estimatedWorkDuration = `${loadingHours} a ${loadingHours + 2} horas no total`;
  if (distanceKm > 400) {
    const days = Math.ceil(distanceKm / 650);
    estimatedWorkDuration = `${days} a ${days + 1} dias úteis (transporte rodoviário)`;
  }

  return {
    distanceKm,
    estimatedTravelHours: travelHours,
    estimatedWorkDuration,
    totalVolumeM3: Number(totalVolumeM3.toFixed(2)),
    totalWeightKg: Math.round(totalWeightKg),
    totalItemsCount,
    selectedItems,
    recommendedTruck,
    recommendedCrew,
  };
}

const SPECIFIC_PACKING_LABELS: Array<{ key: keyof SimulationData['packSpecificItems']; label: string }> = [
  { key: 'dishes', label: 'Louças e Porcelanas' },
  { key: 'kitchen', label: 'Utensílios de Cozinha' },
  { key: 'decor', label: 'Itens de Decoração' },
  { key: 'clothes', label: 'Roupas em Cabideiro' },
  { key: 'paintings', label: 'Quadros e Espelhos' },
  { key: 'fragile', label: 'Objetos Frágeis Diversos' },
];

/**
 * Formats the complete quote request + comments into a clean WhatsApp message
 * ready to be sent to TNK Mudanças (38) 99969-2413.
 */
export function buildWhatsAppQuoteMessage(
  simulation: SimulationData,
  quote: QuoteResult,
  options?: { hasVideoAttached?: boolean; videoFileName?: string }
): string {
  const originStr = `${simulation.originCity} - ${simulation.originState}`;
  const destStr = `${simulation.destinationCity} - ${simulation.destinationState}`;

  const lines: string[] = [
    'Olá, equipe *TNK Mudanças*! Gostaria de solicitar um orçamento com as informações abaixo:',
    '',
  ];

  if (simulation.clientName?.trim() || simulation.clientPhone?.trim()) {
    lines.push('*DADOS PARA CONTATO*');
    if (simulation.clientName?.trim()) lines.push(`• Nome: ${simulation.clientName.trim()}`);
    if (simulation.clientPhone?.trim()) lines.push(`• WhatsApp: ${simulation.clientPhone.trim()}`);
    lines.push('');
  }

  lines.push('*ROTA E IMÓVEIS*');
  lines.push(`• Origem: ${originStr}${simulation.originZip ? ` (CEP: ${simulation.originZip})` : ''}${simulation.originAddress ? ` - ${simulation.originAddress}` : ''}`);
  lines.push(`  Imóvel: ${simulation.originPropertyType} | Elevador: ${simulation.originHasElevator ? 'Sim' : 'Não'} | Escadas: ${simulation.originStairsFlights} lance(s)`);
  lines.push(`• Destino: ${destStr}${simulation.destinationZip ? ` (CEP: ${simulation.destinationZip})` : ''}${simulation.destinationAddress ? ` - ${simulation.destinationAddress}` : ''}`);
  lines.push(`  Imóvel: ${simulation.destinationPropertyType} | Elevador: ${simulation.destinationHasElevator ? 'Sim' : 'Não'} | Escadas: ${simulation.destinationStairsFlights} lance(s)`);
  lines.push(`• Distância estimada: ~${quote.distanceKm} km`);
  lines.push('');

  lines.push('*DATA E MODALIDADE*');
  lines.push(`• Data desejada: ${simulation.preferredDate || 'A combinar'} (${simulation.preferredShift || 'Manhã'})`);
  lines.push(`• Modalidade: Mudança ${simulation.moveType}`);
  lines.push(`• Sugestão de carga: ${quote.recommendedTruck.name}`);
  lines.push(`• Equipe sugerida: ${quote.recommendedCrew.description}`);
  lines.push('');

  lines.push('*ITENS DA MUDANÇA*');
  if (quote.selectedItems.length > 0) {
    for (const item of quote.selectedItems) {
      lines.push(`• ${item.quantity}x ${item.name}`);
    }
    lines.push(`• Total: ${quote.totalItemsCount} volume(s) (~${quote.totalVolumeM3} m³)`);
  } else {
    lines.push('• Lista detalhada será enviada por mensagem/vídeo.');
  }
  lines.push('');

  const specificLabels = SPECIFIC_PACKING_LABELS
    .filter((entry) => simulation.packSpecificItems?.[entry.key])
    .map((entry) => entry.label);

  lines.push('*SERVIÇOS SOLICITADOS*');
  lines.push(`• Desmontagem: ${simulation.needDisassembly ? 'Sim' : 'Não'}`);
  lines.push(`• Montagem no destino: ${simulation.needAssembly ? 'Sim' : 'Não'}`);
  lines.push(`• Embalagem: ${simulation.packingService}`);
  if (specificLabels.length > 0) {
    lines.push(`• Embalar também: ${specificLabels.join(', ')}`);
  }

  if (simulation.clientNotes?.trim()) {
    lines.push('');
    lines.push('*COMENTÁRIOS / OBSERVAÇÕES*');
    lines.push(simulation.clientNotes.trim());
  }

  lines.push('');
  if (options?.hasVideoAttached || simulation.videoAttachment) {
    const vName = options?.videoFileName || simulation.videoAttachment?.name || 'vídeo do imóvel';
    lines.push(`📹 *Vídeo do imóvel:* Separei o vídeo (${vName}) e vou enviar aqui na conversa em seguida para agilizar o orçamento!`);
  } else {
    lines.push('📹 *Vídeo do imóvel:* Não consegui enviar o vídeo agora, mas sigo à disposição por aqui para passarmos os detalhes.');
  }

  return lines.join('\n');
}

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${TNK_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
