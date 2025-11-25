
export const MODULE_POWER_Wp = 640;
export const BESS_BATTERY_CAPACITY_KWH = 5.0;
export const PV_PERFORMANCE_FACTOR = 0.8;
export const FATOR_COMPENSACAO_LIQUIDA = 0.85;
export const BESS_DOD_FACTOR = 0.8;

// Constantes Financeiras para Análise de Investimento (Wall Street Mode)
export const INFLACAO_ENERGETICA_ANUAL = 0.08; // 8% a.a. (Conservador para Brasil)
export const TAXA_DESCONTO_ANUAL = 0.10; // 10% a.a. (TMA - Taxa Mínima de Atratividade)
export const CUSTO_MANUTENCAO_ANUAL = 0.005; // 0.5% do CAPEX ao ano

export const COMMERCIAL_INVERTER_KW = [
    3.0, 3.5, 3.6, 4.0, 4.6, 5.0, 6.0, 7.0, 7.5, 8.0, 8.2, 9.0, 
    10.0, 12.0, 15.0, 20.0, 25.0, 30.0, 40.0, 50.0, 60.0, 75.0, 100.0
];

interface TariffInfo {
    distributor: string;
    price: number;
}

interface StateTariff {
    default: TariffInfo;
    cities: Record<string, TariffInfo>;
}

// Base de dados expandida com tarifas B1 (Residencial) médias com impostos (ICMS/PIS/COFINS) estimados para 2025
export const TARIFF_DATA: Record<string, StateTariff> = {
    'AC': { default: { distributor: 'Energisa Acre', price: 1.02 }, cities: {} },
    'AL': { default: { distributor: 'Equatorial Alagoas', price: 0.98 }, cities: {} },
    'AM': { default: { distributor: 'Amazonas Energia', price: 1.05 }, cities: {} },
    'AP': { default: { distributor: 'Equatorial Amapá', price: 0.92 }, cities: {} },
    'BA': { default: { distributor: 'Neoenergia Coelba', price: 0.99 }, cities: {} },
    'CE': { default: { distributor: 'Enel Ceará', price: 0.97 }, cities: {} },
    'DF': { default: { distributor: 'Neoenergia Brasília', price: 0.85 }, cities: {} },
    'ES': { 
        default: { distributor: 'EDP Espírito Santo', price: 0.91 }, 
        cities: { 
            'Santa Teresa': { distributor: 'Santa Maria (ELFSM)', price: 0.89 } 
        } 
    },
    'GO': { 
        default: { distributor: 'Equatorial Goiás', price: 0.89 }, 
        cities: { 
            'Chevreul': { distributor: 'Chesp', price: 0.91 } 
        } 
    },
    'MA': { default: { distributor: 'Equatorial Maranhão', price: 1.05 }, cities: {} },
    'MG': { 
        default: { distributor: 'CEMIG', price: 0.98 }, 
        cities: { 
            'Poços de Caldas': { distributor: 'DMED', price: 0.92 }, 
            'Cataguases': { distributor: 'Energisa Minas-Rio', price: 1.01 }, 
            'Leopoldina': { distributor: 'Energisa Minas-Rio', price: 1.01 }, 
            'Muriaé': { distributor: 'Energisa Minas-Rio', price: 1.01 }, 
            'Manhuaçu': { distributor: 'Energisa Minas-Rio', price: 1.01 }, 
            'Ubá': { distributor: 'Energisa Minas-Rio', price: 1.01 }, 
            'São João Nepomuceno': { distributor: 'Energisa Minas-Rio', price: 1.01 } 
        } 
    },
    'MS': { default: { distributor: 'Energisa MS', price: 1.01 }, cities: {} },
    'MT': { default: { distributor: 'Energisa MT', price: 0.96 }, cities: {} },
    'PA': { default: { distributor: 'Equatorial Pará', price: 1.15 }, cities: {} },
    'PB': { 
        default: { distributor: 'Energisa Paraíba', price: 0.93 }, 
        cities: { 
            'João Pessoa': { distributor: 'Energisa Borborema', price: 0.94 },
            'Campina Grande': { distributor: 'Energisa Borborema', price: 0.94 }
        } 
    },
    'PE': { default: { distributor: 'Neoenergia Pernambuco', price: 0.96 }, cities: {} },
    'PI': { default: { distributor: 'Equatorial Piauí', price: 1.02 }, cities: {} },
    'PR': { default: { distributor: 'Copel', price: 0.86 }, cities: {} },
    'RJ': { 
        default: { distributor: 'Enel RJ', price: 1.12 }, 
        cities: { 
            // Área de Concessão LIGHT
            'Rio de Janeiro': { distributor: 'Light', price: 1.25 }, 
            'Nova Iguaçu': { distributor: 'Light', price: 1.25 }, 
            'Belford Roxo': { distributor: 'Light', price: 1.25 }, 
            'São João de Meriti': { distributor: 'Light', price: 1.25 }, 
            'Duque de Caxias': { distributor: 'Light', price: 1.25 }, 
            'Mesquita': { distributor: 'Light', price: 1.25 }, 
            'Nilópolis': { distributor: 'Light', price: 1.25 }, 
            'Queimados': { distributor: 'Light', price: 1.25 }, 
            'Paracambi': { distributor: 'Light', price: 1.25 }, 
            'Seropédica': { distributor: 'Light', price: 1.25 }, 
            'Itaguaí': { distributor: 'Light', price: 1.25 }, 
            'Barra do Piraí': { distributor: 'Light', price: 1.25 }, 
            'Piraí': { distributor: 'Light', price: 1.25 }, 
            'Rio Claro': { distributor: 'Light', price: 1.25 }, 
            'Volta Redonda': { distributor: 'Light', price: 1.25 }, 
            'Barra Mansa': { distributor: 'Light', price: 1.25 }, 
            'Valença': { distributor: 'Light', price: 1.25 }, 
            'Vassouras': { distributor: 'Light', price: 1.25 }, 
            'Três Rios': { distributor: 'Light', price: 1.25 }, 
            // Área Energisa
            'Nova Friburgo': { distributor: 'Energisa Nova Friburgo', price: 1.08 },
            // Enel Específicos
            'Niterói': { distributor: 'Enel RJ', price: 1.12 },
            'São Gonçalo': { distributor: 'Enel RJ', price: 1.12 },
            'Maricá': { distributor: 'Enel RJ', price: 1.12 },
            'Cabo Frio': { distributor: 'Enel RJ', price: 1.12 },
            'Macaé': { distributor: 'Enel RJ', price: 1.12 }
        } 
    },
    'RN': { default: { distributor: 'Neoenergia Cosern', price: 0.95 }, cities: {} },
    'RO': { default: { distributor: 'Energisa Rondônia', price: 0.92 }, cities: {} },
    'RR': { default: { distributor: 'Roraima Energia', price: 0.90 }, cities: {} },
    'RS': { 
        default: { distributor: 'RGE Sul', price: 0.94 }, 
        cities: { 
            // Área CEEE Equatorial
            'Porto Alegre': { distributor: 'CEEE Equatorial', price: 0.89 }, 
            'Pelotas': { distributor: 'CEEE Equatorial', price: 0.89 }, 
            'Viamão': { distributor: 'CEEE Equatorial', price: 0.89 }, 
            'Alvorada': { distributor: 'CEEE Equatorial', price: 0.89 }, 
            'Rio Grande': { distributor: 'CEEE Equatorial', price: 0.89 }, 
            'Bagé': { distributor: 'CEEE Equatorial', price: 0.89 }, 
            'Camaquã': { distributor: 'CEEE Equatorial', price: 0.89 }, 
            'Guaíba': { distributor: 'CEEE Equatorial', price: 0.89 }, 
            'Osório': { distributor: 'CEEE Equatorial', price: 0.89 }, 
            'Tramandaí': { distributor: 'CEEE Equatorial', price: 0.89 }, 
            // Demei
            'Ijuí': { distributor: 'Demei', price: 0.92 } 
        } 
    },
    'SC': { 
        default: { distributor: 'Celesc', price: 0.82 }, 
        cities: { 
            'Jaraguá do Sul': { distributor: 'Celesc', price: 0.82 }, 
            'Urussanga': { distributor: 'EFLUL', price: 0.81 }, 
            'Içara': { distributor: 'Cooperaliança', price: 0.79 } 
        } 
    },
    'SE': { 
        default: { distributor: 'Energisa Sergipe', price: 0.96 }, 
        cities: { 
            'Estância': { distributor: 'Sulgipe', price: 0.98 } 
        } 
    },
    'SP': { 
        default: { distributor: 'CPFL Paulista', price: 0.96 }, 
        cities: { 
            // Área ENEL SP
            'São Paulo': { distributor: 'Enel SP', price: 0.90 }, 
            'Osasco': { distributor: 'Enel SP', price: 0.90 }, 
            'Santo André': { distributor: 'Enel SP', price: 0.90 }, 
            'São Bernardo do Campo': { distributor: 'Enel SP', price: 0.90 }, 
            'São Caetano do Sul': { distributor: 'Enel SP', price: 0.90 },
            'Diadema': { distributor: 'Enel SP', price: 0.90 },
            'Cotia': { distributor: 'Enel SP', price: 0.90 },
            'Barueri': { distributor: 'Enel SP', price: 0.90 },
            
            // Área EDP SP
            'Guarulhos': { distributor: 'EDP SP', price: 0.95 }, 
            'Mogi das Cruzes': { distributor: 'EDP SP', price: 0.95 }, 
            'São José dos Campos': { distributor: 'EDP SP', price: 0.95 }, 
            'Taubaté': { distributor: 'EDP SP', price: 0.95 },
            
            // Área CPFL Piratininga
            'Santos': { distributor: 'CPFL Piratininga', price: 0.97 }, 
            'Sorocaba': { distributor: 'CPFL Piratininga', price: 0.97 }, 
            'Jundiaí': { distributor: 'CPFL Piratininga', price: 0.97 },
            'Indaiatuba': { distributor: 'CPFL Piratininga', price: 0.97 },
            'Vinhedo': { distributor: 'CPFL Piratininga', price: 0.97 },
            'Campinas': { distributor: 'CPFL Paulista', price: 0.96 },
            
            // Área Elektro
            'Limeira': { distributor: 'Elektro', price: 0.94 }, 
            'Rio Claro': { distributor: 'Elektro', price: 0.94 }, 
            'Campos do Jordão': { distributor: 'Elektro', price: 0.94 },
            
            // Energisa
            'Presidente Prudente': { distributor: 'Energisa SP', price: 1.02 }, 
            'Bragança Paulista': { distributor: 'Energisa Sul-Sudeste', price: 1.03 } 
        } 
    },
    'TO': { default: { distributor: 'Energisa Tocantins', price: 1.04 }, cities: {} },
    'PADRAO': { default: { distributor: 'Concessionária Local', price: 0.90 }, cities: {} }
};

export const HSP_BY_STATE: Record<string, number> = { 
    'AC': 4.9, 'AL': 5.3, 'AP': 4.7, 'AM': 4.6, 'BA': 5.6, 'CE': 5.7, 'DF': 5.2, 
    'ES': 4.9, 'GO': 5.3, 'MA': 5.4, 'MT': 5.1, 'MS': 5.0, 'MG': 5.1, 'PA': 4.8, 
    'PB': 5.6, 'PR': 4.5, 'PE': 5.5, 'PI': 5.8, 'RJ': 4.8, 'RN': 5.9, 'RS': 4.3, 
    'RO': 4.6, 'RR': 4.9, 'SC': 4.4, 'SP': 4.7, 'SE': 5.3, 'TO': 5.2, 'PADRAO': 5.0 
};

export const BRAZILIAN_STATES = [ 
    { uf: 'AC', nome: 'Acre' }, { uf: 'AL', nome: 'Alagoas' }, { uf: 'AP', nome: 'Amapá' }, 
    { uf: 'AM', nome: 'Amazonas' }, { uf: 'BA', nome: 'Bahia' }, { uf: 'CE', nome: 'Ceará' }, 
    { uf: 'DF', nome: 'Distrito Federal' }, { uf: 'ES', nome: 'Espírito Santo' }, { uf: 'GO', nome: 'Goiás' }, 
    { uf: 'MA', nome: 'Maranhão' }, { uf: 'MT', nome: 'Mato Grosso' }, { uf: 'MS', nome: 'Mato Grosso do Sul' }, 
    { uf: 'MG', nome: 'Minas Gerais' }, { uf: 'PA', nome: 'Pará' }, { uf: 'PB', nome: 'Paraíba' }, 
    { uf: 'PR', nome: 'Paraná' }, { uf: 'PE', nome: 'Pernambuco' }, { uf: 'PI', nome: 'Piauí' }, 
    { uf: 'RJ', nome: 'Rio de Janeiro' }, { uf: 'RN', nome: 'Rio Grande do Norte' }, { uf: 'RS', nome: 'Rio Grande do Sul' }, 
    { uf: 'RO', nome: 'Rondônia' }, { uf: 'RR', nome: 'Roraima' }, { uf: 'SC', nome: 'Santa Catarina' }, 
    { uf: 'SP', nome: 'São Paulo' }, { uf: 'SE', nome: 'Sergipe' }, { uf: 'TO', nome: 'Tocantins' } 
];

export const getTariffData = (uf: string, city: string) => {
    const stateData = TARIFF_DATA[uf] || TARIFF_DATA['PADRAO'];
    if (stateData.cities && stateData.cities[city]) { return stateData.cities[city]; }
    return stateData.default;
};
