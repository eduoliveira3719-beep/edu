import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildMoveQuoteSummary,
  buildWhatsAppQuoteMessage,
  getWhatsAppUrl,
  TNK_WHATSAPP_NUMBER,
} from './calculator';
import { SimulationData } from '../types';

const SAMPLE_SIMULATION: SimulationData = {
  originCity: 'São Paulo',
  originState: 'SP',
  destinationCity: 'Montes Claros',
  destinationState: 'MG',
  originPropertyType: 'Apartamento',
  destinationPropertyType: 'Casa',
  originHasElevator: true,
  destinationHasElevator: false,
  originStairsFlights: 0,
  destinationStairsFlights: 1,
  items: [
    { id: 'geladeira', name: 'Geladeira / Refrigerador', category: 'Eletro', volumeM3: 1.2, weightKg: 80, quantity: 1 },
    { id: 'sofa_3l', name: 'Sofá 3 Lugares', category: 'Sala', volumeM3: 2.2, weightKg: 70, quantity: 1 },
    { id: 'caixa_padrao', name: 'Caixas de Mudança', category: 'Caixas', volumeM3: 0.1, weightKg: 15, quantity: 10 },
  ],
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
  preferredDate: '2026-12-15',
  preferredShift: 'Manhã',
  moveType: 'Exclusiva',
  clientName: 'João Silva',
  clientPhone: '(38) 99999-0000',
  clientNotes: 'Prédio tem horário comercial para carga e descarga.',
};

test('TNK WhatsApp number is configured to 5538999692413', () => {
  assert.equal(TNK_WHATSAPP_NUMBER, '5538999692413');
  const url = getWhatsAppUrl('Teste');
  assert.ok(url.startsWith('https://wa.me/5538999692413?text='));
});

test('buildMoveQuoteSummary computes logistical metrics without any price properties', () => {
  const summary = buildMoveQuoteSummary(SAMPLE_SIMULATION);

  assert.equal(summary.totalItemsCount, 12);
  assert.equal(summary.totalVolumeM3, 4.4);
  assert.equal(summary.selectedItems.length, 3);
  assert.ok(summary.distanceKm > 0);
  assert.equal(summary.recommendedTruck.name, 'Caminhão Baú');
  assert.equal(
    summary.recommendedCrew.description,
    'Motorista ajudante, ajudantes carregadores e montador de móveis ajudante de carga'
  );
  assert.equal('finalPrice' in summary, false);
  assert.equal('totalPrice' in summary, false);
});

test('buildWhatsAppQuoteMessage includes all route, items, services, comments, and no prices', () => {
  const summary = buildMoveQuoteSummary(SAMPLE_SIMULATION);
  const messageWithVideo = buildWhatsAppQuoteMessage(SAMPLE_SIMULATION, summary, {
    hasVideoAttached: true,
    videoFileName: 'casa_sala.mp4',
  });

  assert.ok(messageWithVideo.includes('São Paulo - SP'));
  assert.ok(messageWithVideo.includes('Montes Claros - MG'));
  assert.ok(messageWithVideo.includes('Caminhão Baú'));
  assert.ok(
    messageWithVideo.includes('Motorista ajudante, ajudantes carregadores e montador de móveis ajudante de carga')
  );
  assert.ok(messageWithVideo.includes('1x Geladeira / Refrigerador'));
  assert.ok(messageWithVideo.includes('10x Caixas de Mudança'));
  assert.ok(messageWithVideo.includes('Prédio tem horário comercial para carga e descarga.'));
  assert.ok(messageWithVideo.includes('casa_sala.mp4'));
  assert.equal(messageWithVideo.includes('R$'), false);

  const messageWithoutVideo = buildWhatsAppQuoteMessage(SAMPLE_SIMULATION, summary, {
    hasVideoAttached: false,
  });
  assert.ok(messageWithoutVideo.includes('Não consegui enviar o vídeo agora'));
});
