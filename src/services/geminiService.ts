
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ProjectData, CalculationResults, ReportContent, PremiumReportData } from "../types";

const getApiKey = () => {
  return process.env.API_KEY;
}

const reportSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    tituloProposta: { type: Type.STRING, description: "Um título comercial atraente para a proposta" },
    resumoExecutivo: { type: Type.STRING, description: "Resumo executivo persuasivo focado no cliente e na dor dele (conta alta ou falta de luz)" },
    analiseTecnica: { type: Type.STRING, description: "Explicação técnica da solução destacando a qualidade e a robustez dos equipamentos" },
    
    educacaoBess: {
      type: Type.OBJECT,
      properties: {
         oQueE: { type: Type.STRING, description: "Explicação didática do que é um Sistema de Armazenamento de Energia (BESS) e Baterias Inteligentes." },
         comoFunciona: { type: Type.STRING, description: "Como o sistema armazena energia solar de dia para usar à noite ou durante apagões." },
         explicacaoInstalacao: { type: Type.STRING, description: "Explicação CRUCIAL sobre a instalação: O conceito de separar as cargas no quadro elétrico. Explique que criamos um 'Quadro de Cargas Críticas' (Luz, Internet, Geladeira) que nunca desliga, enquanto cargas pesadas (Chuveiro, AC Central) ficam no quadro comum." }
      },
      required: ["oQueE", "comoFunciona", "explicacaoInstalacao"]
    },

    contextoLegal: {
      type: Type.OBJECT,
      properties: {
         titulo: { type: Type.STRING, description: "Título chamativo sobre a Lei 14.300" },
         explicacaoFioB: { type: Type.STRING, description: "Explicação simples sobre o que é a taxa do Fio B e como ela encarece a conta." },
         impactoLei14300: { type: Type.STRING, description: "Como a Lei 14.300 mudou as regras e por que baterias (autoconsumo) são a melhor defesa contra essas taxas." }
      },
      required: ["titulo", "explicacaoFioB", "impactoLei14300"]
    },
    explicacaoZeroGrid: { type: Type.STRING, description: "Se aplicável, explicação técnica sobre o funcionamento do Zero Grid e anti-injeção." },

    analiseFinanceira: {
      type: Type.OBJECT,
      properties: {
        texto: { type: Type.STRING, description: "Análise detalhada do retorno financeiro, mencionando VPL e comparando com investimentos tradicionais" },
        roiEstimadoMeses: { type: Type.NUMBER, description: "Retorno do investimento em meses (Payback Simples)" },
        economiaAnual: { type: Type.NUMBER, description: "Economia projetada em 1 ano em R$" },
        economiaTotal25Anos: { type: Type.NUMBER, description: "Economia projetada em 25 anos em R$ (considerar inflação energética de 6% a.a)" },
      },
      required: ["texto", "roiEstimadoMeses", "economiaAnual", "economiaTotal25Anos"]
    },
    impactoAmbiental: {
      type: Type.OBJECT,
      properties: {
        texto: { type: Type.STRING, description: "Texto inspirador sobre legado e sustentabilidade" },
        co2EvitadoToneladas: { type: Type.NUMBER, description: "Estimativa de CO2 evitado em 25 anos" },
        arvoresSalvas: { type: Type.NUMBER, description: "Equivalente em árvores plantadas" }
      },
      required: ["texto", "co2EvitadoToneladas", "arvoresSalvas"]
    },
    conclusaoVenda: { type: Type.STRING, description: "Call to action forte (Fechamento) criando senso de urgência ou oportunidade" }
  },
  required: ["tituloProposta", "resumoExecutivo", "analiseTecnica", "educacaoBess", "contextoLegal", "analiseFinanceira", "impactoAmbiental", "conclusaoVenda"]
};

export const generateReport = async (projectData: ProjectData, results: CalculationResults): Promise<ReportContent> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key não encontrada. Configure a variável de ambiente API_KEY.");
  
  const ai = new GoogleGenAI({ apiKey });
  
  const zeroGridInstruction = projectData.usaraZeroGrid 
    ? `O cliente ativou o modo ZERO GRID (Anti-Injeção). Você DEVE incluir uma explicação técnica detalhada no campo "explicacaoZeroGrid" sobre o que é isso: "Sistema que modula a potência do inversor para cobrir exatamente o consumo da casa sem exportar energia excedente para a rede da concessionária, evitando burocracias ou bloqueios em áreas saturadas".` 
    : `O cliente NÃO usará Zero Grid, deixe o campo explicacaoZeroGrid como uma string vazia ou null.`;

  const educationalInstruction = (projectData.systemType === 'HIB' || projectData.systemType === 'OFF')
    ? `Inclua obrigatoriamente a seção 'educacaoBess'. Explique de forma didática o que é o sistema, como ele garante energia ininterrupta e DETALHE como é feita a instalação elétrica com separação de circuitos (Cargas Críticas vs Cargas Comuns).`
    : `Preencha a seção 'educacaoBess' focando nos benefícios da tecnologia solar moderna, mas pode ser mais breve na parte de instalação de backup.`;

  const prompt = `
    Atue como um Diretor Comercial de Elite de uma grande integradora de Energia Solar e BESS.
    Gere uma proposta comercial IRRECUSÁVEL baseada nos dados abaixo.
    
    INTEGRADOR (QUEM VENDE): ${projectData.integrador || 'Sua Empresa de Energia'}
    
    PERFIL DO CLIENTE (QUEM COMPRA):
    - Nome: ${projectData.cliente || 'Cliente VIP'}
    - Local: ${projectData.cidade}/${projectData.estado}
    - Tarifa Atual: R$ ${projectData.custoKwh.toFixed(2)}/kWh
    
    SOLUÇÃO OFERECIDA:
    - Sistema: ${projectData.systemType === 'ONG' ? 'On-Grid (Conectado à Rede)' : projectData.systemType === 'HIB' ? 'Híbrido com Backup Inteligente' : 'Off-Grid (Autônomo)'}
    - Potência Solar: ${results.potenciaPvKwP} kWp
    - Produção Mensal: ${(results.dailyProductionKwh * 30).toFixed(1)} kWh
    - Banco de Baterias: ${results.energiaBessKwh} kWh (${results.numBaterias} módulos)
    - Autonomia de Backup: ${projectData.horasBackup} horas
    
    DADOS FINANCEIROS (CRUCIAL):
    - Investimento Total Estimado (CAPEX): R$ ${results.valorInvestimentoEstimado.toFixed(2)}
    - Economia Mensal Inicial: R$ ${results.economiaMensalEstimada}
    - VPL: R$ ${results.vpl.toFixed(2)}
    - CUSTO DA INÉRCIA: R$ ${results.custoInercia25Anos.toLocaleString('pt-BR')}
    
    ${zeroGridInstruction}
    ${educationalInstruction}

    CONTEXTO REGULATÓRIO (IMPORTANTE):
    No campo "contextoLegal", explique didaticamente a Lei 14.300 e a taxação do "Fio B" (custo de uso da rede de distribuição). 
    Argumente que sistemas com Baterias (Híbridos) são a solução definitiva, pois permitem o AUTOCONSUMO (consumir a própria energia gerada) sem precisar injetar na rede e pagar a taxa do Fio B sobre o retorno.
    
    Responda ESTRITAMENTE com o JSON estruturado.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: reportSchema,
        temperature: 0.7
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Resposta vazia da IA");

    const structuredData = JSON.parse(jsonText) as PremiumReportData;

    return {
      structured: structuredData
    };
    
  } catch (error: any) {
    console.error("Erro ao gerar relatório:", error);
    throw new Error("Falha na geração do relatório premium. Tente novamente.");
  }
};
