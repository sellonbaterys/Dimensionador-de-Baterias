
import React, { useState } from 'react'; 
import { ReportContent, ProjectData, CalculationResults } from '../types'; 
import { ZeroGridSchematic, CashFlowChart, BatteryCycleChart, BessOperationSchematic, CriticalLoadsSchematic } from './PremiumCharts';
import { 
  FileText, Download, Leaf, TrendingUp, ShieldCheck, 
  Battery, Sun, Zap, User as UserIcon, Briefcase as BriefcaseIcon, CheckCircle2, Send, PenTool, BatteryCharging,
  Landmark, Phone, Mail, BookOpen, Settings, ArrowUpRight, AlertCircle, AlertTriangle
} from 'lucide-react';

const ReportDisplay: React.FC<{ 
    content: ReportContent; 
    projectData: ProjectData; 
    results: CalculationResults 
}> = ({ content, projectData, results }) => {
    
    const [customInvestment, setCustomInvestment] = useState<string>("");

    if (!content.structured) {
        return <div className="text-red-400 p-6 bg-red-900/20 rounded-2xl border border-red-500/30 text-center font-bold">Erro: Dados do relatório indisponíveis.</div>;
    }

    const { structured } = content;
    
    const handlePrint = () => window.print();

    const handleWhatsapp = () => {
        const text = `Olá ${projectData.cliente}, aqui é ${projectData.integrador}. Estou enviando o link da sua proposta de viabilidade energética.`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    // Formatação de Moeda
    const fmtBRL = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

    return (
        <div className="w-full max-w-[210mm] mx-auto font-inter pb-20 text-slate-800 bg-white">
            
            {/* --- Toolbar Flutuante (Não sai na impressão) --- */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 print:hidden animate-in fade-in slide-in-from-bottom-4 duration-700 bg-slate-900 p-4 rounded-2xl border border-slate-700 shadow-2xl sticky top-4 z-50">
                <div className="flex items-center gap-3 text-slate-300 text-xs md:text-sm font-medium mb-4 md:mb-0">
                    <div className="bg-green-500/20 p-2 rounded-full text-green-400 animate-pulse">
                        <PenTool size={16} />
                    </div>
                    <span>Preencha o <strong>Valor do Investimento</strong> abaixo antes de salvar.</span>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button 
                        onClick={handleWhatsapp}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-2.5 rounded-xl transition-all font-bold text-sm shadow-lg active:scale-95"
                    >
                        <Send size={16} /> WhatsApp
                    </button>
                    <button 
                        onClick={handlePrint}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-slate-900 hover:bg-slate-100 px-5 py-2.5 rounded-xl transition-all font-bold text-sm shadow-lg active:scale-95"
                    >
                        <Download size={16} /> Gerar PDF
                    </button>
                </div>
            </div>

            {/* --- Dossiê A4 Digital --- */}
            <div className="bg-white shadow-2xl print:shadow-none print:w-full overflow-hidden relative min-h-[297mm]">
                
                {/* Faixa Lateral Decorativa */}
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-slate-900 print:visible"></div>

                {/* --- HEADER / CAPA --- */}
                <header className="bg-slate-50 p-12 md:p-16 border-b border-slate-200 relative overflow-hidden pl-16">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <Zap size={400} strokeWidth={0.5} className="text-slate-900"/>
                    </div>

                    <div className="relative z-10">
                        <div className="flex flex-col gap-2 mb-10">
                             <span className="text-xs font-black tracking-[0.4em] uppercase text-green-600">Dossiê Técnico-Comercial</span>
                             <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-[1.1] max-w-3xl tracking-tight">
                                 {structured.tituloProposta}
                             </h1>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-200 pt-8">
                            {/* Cliente */}
                            <div>
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <UserIcon size={12} /> Cliente
                                </h3>
                                <p className="text-lg font-bold text-slate-900">{projectData.cliente}</p>
                                <p className="text-sm text-slate-500 font-medium">{projectData.cidade} / {projectData.estado}</p>
                            </div>

                            {/* Integrador */}
                            <div>
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <BriefcaseIcon size={12} /> Responsável Técnico
                                </h3>
                                <p className="text-lg font-bold text-slate-900">{projectData.integrador}</p>
                                <p className="text-sm text-slate-500 font-medium">Validade: 10 dias</p>
                            </div>

                            {/* INPUT DE INVESTIMENTO */}
                            <div className="bg-white shadow-lg ring-1 ring-slate-100 p-4 rounded-xl relative group hover:ring-green-400 transition-all cursor-text print:border print:border-slate-300 print:shadow-none">
                                <div className="absolute -top-2.5 left-3 bg-green-600 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                    Investimento (R$)
                                </div>
                                <div className="flex items-baseline gap-1 mt-1">
                                    <input 
                                        type="text" 
                                        placeholder="Inserir Valor"
                                        value={customInvestment}
                                        onChange={(e) => setCustomInvestment(e.target.value)}
                                        className="w-full text-2xl font-black text-slate-900 placeholder:text-slate-300 outline-none bg-transparent"
                                    />
                                </div>
                                <PenTool size={12} className="absolute bottom-3 right-3 text-slate-300 group-hover:text-green-500 opacity-0 group-hover:opacity-100 transition-all print:hidden" />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-12 md:p-16 space-y-14 pl-16">

                    {/* --- 1. RESUMO E KPIs (Destaques) --- */}
                    <section className="print:break-inside-avoid">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                            {/* KPI 1 */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>
                                <div className="relative z-10">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Economia Estimada</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black text-slate-900">{fmtBRL(structured.analiseFinanceira.economiaAnual)}</span>
                                        <span className="text-xs font-bold text-green-600">/ Ano</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">Projeção baseada no consumo atual</p>
                                </div>
                            </div>

                            {/* KPI 2 */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>
                                <div className="relative z-10">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Retorno (Payback)</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black text-slate-900">{results.paybackAnos.toFixed(1)}</span>
                                        <span className="text-sm font-bold text-slate-600">Anos</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">Retorno acelerado do capital</p>
                                </div>
                            </div>

                            {/* KPI 3 */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>
                                <div className="relative z-10">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Autonomia de Backup</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black text-slate-900">{projectData.horasBackup}</span>
                                        <span className="text-sm font-bold text-slate-600">Horas</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">Segurança para cargas críticas</p>
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-slate prose-lg text-slate-600 leading-relaxed max-w-none text-justify">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4 uppercase tracking-wide text-sm">
                                <FileText className="text-green-600" size={18} /> Diagnóstico Executivo
                            </h3>
                            <p className="text-sm md:text-base">{structured.resumoExecutivo}</p>
                        </div>
                    </section>

                    {/* --- 2. ANÁLISE FINANCEIRA PROFUNDA --- */}
                    <section className="bg-slate-50 -mx-12 px-12 py-12 md:-mx-16 md:px-16 border-y border-slate-200 print:break-inside-avoid">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Landmark className="text-green-600" /> Estudo de Viabilidade Econômica
                            </h3>
                            <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold bg-white border border-slate-200 px-3 py-1 rounded-full text-slate-500 uppercase tracking-wider">
                                <TrendingUp size={12} /> Inflação Energética: { (parseFloat('0.08') * 100).toFixed(0) }% a.a.
                            </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Gráfico de Fluxo de Caixa */}
                            <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-sm font-bold text-slate-700">Fluxo de Caixa Acumulado (25 Anos)</h4>
                                    <div className="flex gap-4 text-[10px] font-medium text-slate-500">
                                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-400"></div> Investimento</span>
                                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Lucro Líquido</span>
                                    </div>
                                </div>
                                <div className="h-72 w-full">
                                    <CashFlowChart dataPoints={results.fluxoCaixaAcumulado} />
                                </div>
                            </div>

                            {/* Indicadores Financeiros e Custo de Inércia */}
                            <div className="lg:col-span-4 flex flex-col gap-4">
                                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Economia Acumulada (25 anos)</p>
                                    <p className="text-2xl font-black text-green-600">{fmtBRL(structured.analiseFinanceira.economiaTotal25Anos)}</p>
                                    <div className="mt-4 pt-4 border-t border-slate-100">
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Retorno sobre Investimento (ROI)</p>
                                        <p className="text-xl font-bold text-slate-800">{(structured.analiseFinanceira.economiaTotal25Anos / (results.valorInvestimentoEstimado || 1) * 100).toFixed(0)}%</p>
                                    </div>
                                </div>

                                {/* CALLOUT: CUSTO DA INÉRCIA */}
                                <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 relative overflow-hidden">
                                    <div className="absolute right-0 top-0 p-3 opacity-10">
                                        <AlertTriangle size={60} className="text-amber-600"/>
                                    </div>
                                    <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-2 flex items-center gap-1">
                                        <AlertCircle size={12}/> Custo da Inércia
                                    </p>
                                    <p className="text-xs text-amber-900 mb-2 leading-relaxed">
                                        Se você não investir, este é o valor que você <strong>pagará à concessionária</strong> nos próximos 25 anos sem receber nada em troca:
                                    </p>
                                    <p className="text-xl font-black text-amber-800 underline decoration-amber-300 underline-offset-4">
                                        {fmtBRL(results.custoInercia25Anos)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-8 text-sm text-slate-600 leading-relaxed text-justify">
                            {structured.analiseFinanceira.texto}
                        </div>
                    </section>

                    {/* --- 3. ENGENHARIA E BESS (Tecnologia) --- */}
                    <section className="print:break-inside-avoid">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Settings className="text-blue-600" /> Especificações Técnicas
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {/* Card Sistema Fotovoltaico */}
                            <div className="border border-slate-200 rounded-2xl p-6 relative overflow-hidden">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Sun size={18} className="text-amber-500"/>
                                            <h4 className="font-bold text-slate-800">Gerador Solar</h4>
                                        </div>
                                        <p className="text-xs text-slate-500">Captação de Energia</p>
                                    </div>
                                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded">Tier 1</span>
                                </div>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-3xl font-black text-slate-900">{results.potenciaPvKwP}</span>
                                    <span className="text-sm font-bold text-slate-500">kWp</span>
                                </div>
                                <p className="text-sm text-slate-600">Composto por <strong>{results.numModulos} módulos</strong> de alta eficiência, otimizados para a irradiação local de {projectData.cidade}.</p>
                            </div>

                            {/* Card BESS (Se houver) */}
                            {(projectData.systemType === 'HIB' || projectData.systemType === 'OFF') ? (
                                <div className="border border-green-200 bg-green-50/50 rounded-2xl p-6 relative overflow-hidden">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <BatteryCharging size={18} className="text-green-600"/>
                                                <h4 className="font-bold text-slate-800">Armazenamento (BESS)</h4>
                                            </div>
                                            <p className="text-xs text-slate-500">Backup Inteligente</p>
                                        </div>
                                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded">LFP</span>
                                    </div>
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-3xl font-black text-slate-900">{results.energiaBessKwh}</span>
                                        <span className="text-sm font-bold text-slate-500">kWh</span>
                                    </div>
                                    <p className="text-sm text-slate-600">Banco de baterias dimensionado para suportar cargas críticas por <strong>{projectData.horasBackup} horas</strong>.</p>
                                </div>
                            ) : (
                                <div className="border border-slate-200 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-center opacity-50">
                                    <p className="text-center text-sm font-medium text-slate-400">Sistema On-Grid (Sem baterias)</p>
                                </div>
                            )}
                        </div>

                        {/* Gráficos Educacionais e Cargas */}
                        {(projectData.systemType === 'HIB' || projectData.systemType === 'OFF') && structured.educacaoBess && (
                            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                                <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Arquitetura do Sistema</h4>
                                    <span className="text-[10px] text-slate-400 flex items-center gap-1"><CheckCircle2 size={10}/> Instalação Certificada</span>
                                </div>
                                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                    <div className="space-y-4">
                                        <h5 className="font-bold text-slate-800 flex items-center gap-2 text-sm"><ArrowUpRight size={16} className="text-blue-500"/> Fluxo de Energia</h5>
                                        <p className="text-xs text-slate-500 leading-relaxed">{structured.educacaoBess.comoFunciona}</p>
                                        <BessOperationSchematic />
                                    </div>
                                    <div className="space-y-4">
                                        <h5 className="font-bold text-slate-800 flex items-center gap-2 text-sm"><Settings size={16} className="text-green-500"/> Separação de Cargas</h5>
                                        <p className="text-xs text-slate-500 leading-relaxed">{structured.educacaoBess.explicacaoInstalacao}</p>
                                        <CriticalLoadsSchematic />
                                    </div>
                                </div>
                                {/* Gráfico de Ciclo da Bateria */}
                                <div className="bg-slate-900 p-8">
                                    <div className="flex items-center justify-between mb-6 text-white">
                                        <h5 className="text-sm font-bold flex items-center gap-2"><Battery size={16} className="text-green-400"/> Ciclo Diário Simulado</h5>
                                        <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-slate-400">Carregamento Solar vs. Descarga Noturna</span>
                                    </div>
                                    <div className="h-48 w-full">
                                        <BatteryCycleChart />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Zero Grid Section */}
                        {projectData.usaraZeroGrid && (
                            <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col md:flex-row gap-8 items-center">
                                <div className="flex-1">
                                    <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2"><ShieldCheck size={18}/> Modo Zero Grid Ativo</h4>
                                    <p className="text-sm text-amber-900/80 leading-relaxed mb-3">{structured.explicacaoZeroGrid}</p>
                                    <div className="text-xs font-bold text-amber-700 bg-amber-100 inline-block px-3 py-1 rounded-full">
                                        Homologação Simplificada
                                    </div>
                                </div>
                                <div className="w-full md:w-1/3 bg-white rounded-xl p-4 border border-amber-100 shadow-sm">
                                    <ZeroGridSchematic />
                                </div>
                            </div>
                        )}
                    </section>

                    {/* --- 4. SUSTENTABILIDADE E FECHAMENTO --- */}
                    <section className="print:break-inside-avoid">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-10">
                                <Leaf size={150} className="text-green-800"/>
                            </div>
                            
                            <div className="flex-1 relative z-10">
                                <h3 className="text-green-800 font-bold flex items-center gap-2 text-lg mb-3">
                                    <Leaf size={20}/> Impacto Ambiental Positivo
                                </h3>
                                <p className="text-green-900/70 text-sm leading-relaxed max-w-xl">
                                    {structured.impactoAmbiental.texto}
                                </p>
                            </div>

                            <div className="flex gap-8 relative z-10 bg-white/60 p-4 rounded-2xl backdrop-blur-sm border border-green-100">
                                <div className="text-center">
                                    <p className="text-2xl font-black text-green-700">{structured.impactoAmbiental.co2EvitadoToneladas}</p>
                                    <p className="text-[9px] font-bold text-green-600 uppercase tracking-wider">Ton de CO₂</p>
                                </div>
                                <div className="w-px bg-green-200"></div>
                                <div className="text-center">
                                    <p className="text-2xl font-black text-green-700">{structured.impactoAmbiental.arvoresSalvas}</p>
                                    <p className="text-[9px] font-bold text-green-600 uppercase tracking-wider">Árvores</p>
                                </div>
                            </div>
                        </div>
                    </section>

                </main>

                {/* --- FOOTER --- */}
                <footer className="bg-slate-900 text-white p-16 pl-24 mt-8 print:break-inside-avoid relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-green-500"></div>
                    
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h4 className="text-2xl font-bold mb-4">Próximos Passos</h4>
                            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-md">
                                "{structured.conclusaoVenda}"
                            </p>
                            <div className="flex items-center gap-6 text-sm font-medium text-slate-300">
                                <div className="flex items-center gap-2">
                                    <div className="bg-green-500 w-2 h-2 rounded-full"></div>
                                    Aprovação
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="bg-slate-600 w-2 h-2 rounded-full"></div>
                                    Instalação
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="bg-slate-600 w-2 h-2 rounded-full"></div>
                                    Homologação
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-start md:items-end justify-center">
                            <div className="text-right mb-4">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Emitido Por</p>
                                <p className="text-xl font-bold text-white">{projectData.integrador}</p>
                            </div>
                            
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg text-xs hover:bg-white/20 transition-colors cursor-pointer">
                                    <Phone size={14} className="text-green-400"/> Falar com Consultor
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg text-xs hover:bg-white/20 transition-colors cursor-pointer">
                                    <Mail size={14} className="text-blue-400"/> Enviar E-mail
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 mt-12 pt-8 flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-widest">
                        <span>Calculadora de Baterias Pro © {new Date().getFullYear()}</span>
                        <span className="flex items-center gap-1">Powered by <Zap size={10} className="text-green-500"/> Gemini AI</span>
                    </div>
                </footer>

            </div>
        </div>
    );
}; 

export default ReportDisplay;
