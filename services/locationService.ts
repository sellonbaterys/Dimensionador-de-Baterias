
import { TARIFF_DATA } from '../constants';

interface IBGEMunicipality {
  id: number;
  nome: string;
}

export interface TariffResult {
  distribuidora: string;
  preco: number;
  uf: string;
  cidade: string;
  sourceType: 'CITY_SPECIFIC' | 'STATE_DEFAULT';
}

const cityCache: Record<string, string[]> = {};

export const fetchCitiesForState = async (uf: string): Promise<string[]> => {
  if (cityCache[uf]) {
    return cityCache[uf];
  }

  try {
    const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
    if (!response.ok) throw new Error('Falha ao buscar cidades');
    
    const data: IBGEMunicipality[] = await response.json();
    // Ordena alfabeticamente
    const cityNames = data.map(city => city.nome).sort((a, b) => a.localeCompare(b));
    
    cityCache[uf] = cityNames;
    return cityNames;
  } catch (error) {
    console.error("Erro ao carregar cidades do IBGE:", error);
    return ['Capital'];
  }
};

export const fetchTariffDetails = async (uf: string, city: string): Promise<TariffResult> => {
  // Simula uma requisição mas processa imediatamente para UI snappy
  // Normaliza strings para comparação (remove acentos se necessário, mas aqui usamos match direto dos dados do IBGE)
  
  const stateData = TARIFF_DATA[uf] || TARIFF_DATA['PADRAO'];
  let info = stateData.default;
  let sourceType: 'CITY_SPECIFIC' | 'STATE_DEFAULT' = 'STATE_DEFAULT';

  // Busca exata primeiro
  if (stateData.cities && stateData.cities[city]) {
    info = stateData.cities[city];
    sourceType = 'CITY_SPECIFIC';
  } else {
      // Tenta buscar normalizando (sem acentos caso haja discrepancia)
      // Mas geralmente o constants.ts deve bater com o IBGE
  }

  return {
    distribuidora: info.distributor,
    preco: info.price,
    uf,
    cidade: city,
    sourceType
  };
};