export interface BrazilCity {
  name: string;
  state: string;
  lat: number;
  lng: number;
  capital?: boolean;
}

export const BRAZIL_STATES = [
  { uf: 'AC', name: 'Acre' },
  { uf: 'AL', name: 'Alagoas' },
  { uf: 'AP', name: 'Amapá' },
  { uf: 'AM', name: 'Amazonas' },
  { uf: 'BA', name: 'Bahia' },
  { uf: 'CE', name: 'Ceará' },
  { uf: 'DF', name: 'Distrito Federal' },
  { uf: 'ES', name: 'Espírito Santo' },
  { uf: 'GO', name: 'Goiás' },
  { uf: 'MA', name: 'Maranhão' },
  { uf: 'MT', name: 'Mato Grosso' },
  { uf: 'MS', name: 'Mato Grosso do Sul' },
  { uf: 'MG', name: 'Minas Gerais' },
  { uf: 'PA', name: 'Pará' },
  { uf: 'PB', name: 'Paraíba' },
  { uf: 'PR', name: 'Paraná' },
  { uf: 'PE', name: 'Pernambuco' },
  { uf: 'PI', name: 'Piauí' },
  { uf: 'RJ', name: 'Rio de Janeiro' },
  { uf: 'RN', name: 'Rio Grande do Norte' },
  { uf: 'RS', name: 'Rio Grande do Sul' },
  { uf: 'RO', name: 'Rondônia' },
  { uf: 'RR', name: 'Roraima' },
  { uf: 'SC', name: 'Santa Catarina' },
  { uf: 'SP', name: 'São Paulo' },
  { uf: 'SE', name: 'Sergipe' },
  { uf: 'TO', name: 'Tocantins' },
];

export const TOP_BRAZIL_CITIES: BrazilCity[] = [
  // SP
  { name: 'São Paulo', state: 'SP', lat: -23.5505, lng: -46.6333, capital: true },
  { name: 'Campinas', state: 'SP', lat: -22.9056, lng: -47.0608 },
  { name: 'Guarulhos', state: 'SP', lat: -23.4542, lng: -46.5333 },
  { name: 'São Bernardo do Campo', state: 'SP', lat: -23.6944, lng: -46.5653 },
  { name: 'Santo André', state: 'SP', lat: -23.6572, lng: -46.5333 },
  { name: 'Osasco', state: 'SP', lat: -23.5325, lng: -46.7917 },
  { name: 'Santos', state: 'SP', lat: -23.9608, lng: -46.3331 },
  { name: 'Ribeirão Preto', state: 'SP', lat: -21.1775, lng: -47.8103 },
  { name: 'São José dos Campos', state: 'SP', lat: -23.1896, lng: -45.8841 },
  { name: 'Sorocaba', state: 'SP', lat: -23.5015, lng: -47.4526 },
  { name: 'Jundiaí', state: 'SP', lat: -23.1857, lng: -46.8978 },
  { name: 'Barueri / Alphaville', state: 'SP', lat: -23.5108, lng: -46.8761 },

  // RJ
  { name: 'Rio de Janeiro', state: 'RJ', lat: -22.9068, lng: -43.1729, capital: true },
  { name: 'Niterói', state: 'RJ', lat: -22.8833, lng: -43.1036 },
  { name: 'São Gonçalo', state: 'RJ', lat: -22.8267, lng: -43.0536 },
  { name: 'Duque de Caxias', state: 'RJ', lat: -22.7856, lng: -43.3117 },
  { name: 'Petrópolis', state: 'RJ', lat: -22.505, lng: -43.1789 },
  { name: 'Campos dos Goytacazes', state: 'RJ', lat: -21.7539, lng: -41.3239 },

  // MG
  { name: 'Belo Horizonte', state: 'MG', lat: -19.9167, lng: -43.9345, capital: true },
  { name: 'Uberlândia', state: 'MG', lat: -18.9186, lng: -48.2772 },
  { name: 'Contagem', state: 'MG', lat: -19.9317, lng: -44.0536 },
  { name: 'Juiz de Fora', state: 'MG', lat: -21.7642, lng: -43.3497 },
  { name: 'Betim', state: 'MG', lat: -19.9678, lng: -44.1983 },

  // PR
  { name: 'Curitiba', state: 'PR', lat: -25.4284, lng: -49.2733, capital: true },
  { name: 'Londrina', state: 'PR', lat: -23.3103, lng: -51.1628 },
  { name: 'Maringá', state: 'PR', lat: -23.421, lng: -51.9331 },
  { name: 'Cascavel', state: 'PR', lat: -24.9578, lng: -53.4595 },
  { name: 'Foz do Iguaçu', state: 'PR', lat: -25.5163, lng: -54.5854 },

  // SC
  { name: 'Florianópolis', state: 'SC', lat: -27.5954, lng: -48.548, capital: true },
  { name: 'Joinville', state: 'SC', lat: -26.3045, lng: -48.8487 },
  { name: 'Blumenau', state: 'SC', lat: -26.9196, lng: -49.0659 },
  { name: 'Balneário Camboriú', state: 'SC', lat: -26.9926, lng: -48.6347 },

  // RS
  { name: 'Porto Alegre', state: 'RS', lat: -30.0346, lng: -51.2177, capital: true },
  { name: 'Caxias do Sul', state: 'RS', lat: -29.1678, lng: -51.1794 },
  { name: 'Pelotas', state: 'RS', lat: -31.7654, lng: -52.3376 },
  { name: 'Canoas', state: 'RS', lat: -29.9178, lng: -51.1833 },

  // Centro-Oeste
  { name: 'Brasília', state: 'DF', lat: -15.7975, lng: -47.8919, capital: true },
  { name: 'Goiânia', state: 'GO', lat: -16.6869, lng: -49.2648, capital: true },
  { name: 'Anápolis', state: 'GO', lat: -16.3267, lng: -48.9533 },
  { name: 'Cuiabá', state: 'MT', lat: -15.601, lng: -56.0974, capital: true },
  { name: 'Campo Grande', state: 'MS', lat: -20.4697, lng: -54.6201, capital: true },

  // Nordeste
  { name: 'Salvador', state: 'BA', lat: -12.9777, lng: -38.5016, capital: true },
  { name: 'Feira de Santana', state: 'BA', lat: -12.2667, lng: -38.9667 },
  { name: 'Fortaleza', state: 'CE', lat: -3.7319, lng: -38.5267, capital: true },
  { name: 'Recife', state: 'PE', lat: -8.0476, lng: -34.877, capital: true },
  { name: 'Natal', state: 'RN', lat: -5.7945, lng: -35.211, capital: true },
  { name: 'João Pessoa', state: 'PB', lat: -7.1195, lng: -34.845, capital: true },
  { name: 'Maceió', state: 'AL', lat: -9.6658, lng: -35.735, capital: true },
  { name: 'Aracaju', state: 'SE', lat: -10.9472, lng: -37.0731, capital: true },
  { name: 'Teresina', state: 'PI', lat: -5.0919, lng: -42.8034, capital: true },
  { name: 'São Luís', state: 'MA', lat: -2.5307, lng: -44.3068, capital: true },

  // Norte
  { name: 'Belém', state: 'PA', lat: -1.4558, lng: -48.4902, capital: true },
  { name: 'Manaus', state: 'AM', lat: -3.119, lng: -60.0217, capital: true },
  { name: 'Porto Velho', state: 'RO', lat: -8.7619, lng: -63.9039, capital: true },
  { name: 'Palmas', state: 'TO', lat: -10.2491, lng: -48.3243, capital: true },

  // ES
  { name: 'Vitória', state: 'ES', lat: -20.3155, lng: -40.3128, capital: true },
  { name: 'Vila Velha', state: 'ES', lat: -20.3297, lng: -40.2925 },
];

/**
 * Approximate real highway distance between two coordinates in kilometers.
 * Applies a 1.28x highway tortuosity factor to great-circle distance.
 */
export function estimateRoadDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (lat1 === lat2 && lon1 === lon2) {
    return 15; // Local intra-neighborhood move base distance
  }

  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLineKm = R * c;

  if (straightLineKm < 10) {
    return Math.max(12, Math.round(straightLineKm * 1.4));
  }

  // Realistic Brazilian road highway winding factor
  const roadKm = Math.round(straightLineKm * 1.28);
  return roadKm;
}

/**
 * Finds city by name or state, fallback to state center approximate
 */
export function findCity(name: string, state: string): BrazilCity | null {
  const normName = name.trim().toLowerCase();
  const normState = state.trim().toUpperCase();

  const exact = TOP_BRAZIL_CITIES.find(
    (c) =>
      c.state.toUpperCase() === normState &&
      c.name.toLowerCase() === normName
  );
  if (exact) return exact;

  const partial = TOP_BRAZIL_CITIES.find(
    (c) =>
      c.state.toUpperCase() === normState &&
      (c.name.toLowerCase().includes(normName) || normName.includes(c.name.toLowerCase()))
  );
  if (partial) return partial;

  // Fallback to capital of the state
  const capital = TOP_BRAZIL_CITIES.find(
    (c) => c.state.toUpperCase() === normState && c.capital
  );
  if (capital) return capital;

  return null;
}

/**
 * Calculates distance between origin and destination string addresses/cities
 */
export function getRouteDistanceKm(
  originCity: string,
  originState: string,
  destCity: string,
  destState: string
): number {
  const c1 = findCity(originCity, originState);
  const c2 = findCity(destCity, destState);

  if (c1 && c2) {
    // If same city
    if (c1.name.toLowerCase() === c2.name.toLowerCase() && c1.state === c2.state) {
      return 22; // Average intra-city move distance in km
    }
    return estimateRoadDistanceKm(c1.lat, c1.lng, c2.lat, c2.lng);
  }

  // Fallback if not found in database:
  // Same state: default 85 km average
  if (originState.toUpperCase() === destState.toUpperCase()) {
    return 80;
  }

  // Different states: average inter-state distance baseline
  return 520;
}
