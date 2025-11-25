
import React, { useState } from 'react'; 
import { ReportContent, ProjectData, CalculationResults } from '../types'; 
import { ZeroGridSchematic, CashFlowChart, ProposalLoadChart, BatteryCycleChart, BessOperationSchematic, CriticalLoadsSchematic } from './PremiumCharts';
import { 
  FileText, Download, Leaf, TrendingUp, ShieldCheck, 
  Battery, Sun, Zap, Award, Calendar, CheckCircle2, Send, DollarSign, AlertTriangle, PenTool, BatteryCharging,
  BarChart3, Landmark, Phone, Mail, Scale, BookOpen, Lightbulb, Settings
} from 'lucide-react';

const ReportDisplay: React.FC<{ 
    content: ReportContent; 
    projectData: ProjectData; 
    results: CalculationResults 
}> = ({ content, projectData, results }) => {
    
    const [customInvestment, setCustomInvestment] = useState<string>("");

    // Helper para formatar moeda
    const fmtBRL = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

    if (!content.structured) {
        return <div className="text-red-400 p-6 bg-red-900/20 rounded-2xl border border-red-500/30 text-center font-bold">Erro: Dados do relatório indisponíveis.</div>;
    }

    const { structured } = content;
    
    const handlePrint = () => {
        window.print();
    };

    const handleWhatsapp = () => {
        const text = `Olá ${projectData.cliente}, aqui é ${projectData.integrador}. Estou enviando o link da sua proposta de viabilidade energética: [Link Aqui]`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="w-full max-w-[210mm] mx-auto font-inter pb-20">
            
            {/* --- Toolbar Flutuante (Não sai na impressão) --- */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 print:hidden animate-in fade-in slide-in-from-bottom-4 duration-700 bg-slate-800/50 p-4 rounded-2xl border border-white/10 backdrop-blur-md sticky top-4 z-50 shadow-2xl">
                <div className="flex items-center gap-3 text-slate-300 text-xs md:text-sm font-medium mb-4 md:mb-0">
                    <div className="bg-blue-500/20 p-2 rounded-full text-blue-400 animate-pulse">
                        <PenTool size={16} />
                    </div>
                    <span>Edite o <strong>Valor do Investimento</strong> diretamente no documento abaixo.</span>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button 
                        onClick={handleWhatsapp}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3 rounded-xl transition-all font-bold text-sm shadow-lg shadow-green-900/20 active:scale-95"
                    >
                        <Send size={18} /> WhatsApp
                    </button>
                    <button 
                        onClick={handlePrint}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-slate-900 hover:bg-slate-100 px-6 py-3 rounded-xl transition-all font-bold text-sm shadow-lg active:scale-95"
                    >
                        <Download size={18} /> Salvar PDF
                    </button>
                </div>
            </div>

            {/* --- Dossiê A4 Digital (Estilo Editorial/Clean) --- */}
            <div className="bg-white text-slate-900 shadow-2xl print:shadow-none print:w-full overflow-hidden relative selection:bg-green-100 selection:text-green-900">
                
                {/* Faixa Decorativa Lateral (Design System) */}
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-slate-900 via-slate-800 to-green-600 print:hidden md:block"></div>

                {/* --- HEADER / CAPA --- */}
                <header className="bg-slate-50 p-12 md:p-16 border-b border-slate-200 relative overflow-hidden">
                    {/* Elementos de fundo sutis */}
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                        <Zap size={300} strokeWidth={0.5} className="text-slate-900"/>
                    </div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-12">
                             <div>
                                <p className="text-xs font-black tracking-[0.3em] uppercase text-slate-400 mb-2">Estudo de Viabilidade</p>
                                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight max-w-2xl">
                                    {structured.tituloProposta}
                                </h1>
                             </div>
                             {/* Badge de Status */}
                             <div className="hidden md:flex items-center gap-2 border border-green-200 bg-green-50 text-green-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                                <CheckCircle2 size={14} /> Validado Tecnicamente
                             </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Cliente Card */}
                            <div className="group">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <UserIcon /> Cliente
                                </h3>
                                <p className="text-xl font-bold text-slate-800 border-l-4 border-slate-900 pl-4 py-1">{projectData.cliente}</p>
                                <p className="text-sm text-slate-500 pl-5">{projectData.cidade}/{projectData.estado}</p>
                            </div>

                            {/* Integrador Card */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <BriefcaseIcon /> Responsável Técnico
                                </h3>
                                <p className="text-xl font-bold text-green-700 border-l-4 border-green-500 pl-4 py-1">{projectData.integrador}</p>
                                <p className="text-sm text-slate-500 pl-5">{new Date().toLocaleDateString()}</p>
                            </div>

                            {/* INPUT DE INVESTIMENTO (O Coração da Venda) */}
                            <div className="bg-white shadow-xl shadow-slate-200/50 p-5 rounded-2xl border border-slate-100 relative group hover:border-green-400 transition-colors cursor-text">
                                <div className="absolute -top-3 left-4 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                    Valor do Investimento
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="text-xl text-slate-400 font-light">R$</span>
                                    <input 
                                        type="text" 
                                        placeholder="0,00"
                                        value={customInvestment}
                                        onChange={(e) => setCustomInvestment(e.target.value)}
                                        className="w-full text-3xl font-black text-slate-900 placeholder:text-slate-300 outline-none bg-transparent"
                                    />
                                </div>
                                <PenTool size={12} className="absolute bottom-3 right-3 text-slate-300 group-hover:text-green-500 opacity-0 group-hover:opacity-100 transition-all" />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-12 md:p-16 space-y-16">

                    {/* --- 1. RESUMO EXECUTIVO & DESTAQUES --- */}
                    <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-7 prose prose-slate prose-lg text-slate-600 leading-relaxed">
                            <h3 className="text-slate-900 font-bold flex items-center gap-2 text-xl mb-6">
                                <FileText className="text-blue-600" /> Diagnóstico Executivo
                            </h3>
                            <p>{structured.resumoExecutivo}</p>
                        </div>
                        
                        {/* Cards de Impacto Rápido */}
                        <div className="lg:col-span-5 space-y-4">
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
                                <div className="bg-green-100 p-3 rounded-xl text-green-700">
                                    <TrendingUp size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Economia Mensal</p>
                                    <p className="text-2xl font-black text-slate-900">R$ {results.economiaMensalEstimada}</p>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
                                <div className="bg-blue-100 p-3 rounded-xl text-blue-700">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Segurança Energética</p>
                                    <p className="text-lg font-bold text-slate-900">{projectData.horasBackup}h de Autonomia</p>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
                                <div className="bg-amber-100 p-3 rounded-xl text-amber-700">
                                    <Sun size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Geração Estimada</p>
                                    <p className="text-lg font-bold text-slate-900">{(results.dailyProductionKwh * 30).toFixed(0)} kWh/mês</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* --- NOVA SEÇÃO: MASTERCLASS DE TECNOLOGIA (EDUCACIONAL) --- */}
                    {(projectData.systemType === 'HIB' || projectData.systemType === 'OFF') && structured.educacaoBess && (
                        <>
                            <hr className="border-slate-100" />
                            <section className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-10 border border-slate-200 shadow-sm">
                                <h3 className="text-slate-900 font-bold flex items-center gap-2 text-xl mb-8">
                                    <BookOpen className="text-indigo-600" /> Masterclass: Entendendo sua Tecnologia
                                </h3>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                                    {/* O que é BESS */}
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-l-4 border-indigo-500 pl-3">
                                            O que é o sistema?
                                        </h4>
                                        <p className="text-sm text-slate-600 leading-relaxed">{structured.educacaoBess.oQueE}</p>
                                        <div className="mt-6">
                                            <BessOperationSchematic />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-3 italic">{structured.educacaoBess.comoFunciona}</p>
                                    </div>

                                    {/* Conceito de Cargas Críticas */}
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-l-4 border-green-500 pl-3">
                                            Instalação: Cargas Apartadas
                                        </h4>
                                        <p className="text-sm text-slate-600 leading-relaxed">{structured.educacaoBess.explicacaoInstalacao}</p>
                                        <div className="mt-6">
                                            <CriticalLoadsSchematic />
                                        </div>
                                        <div className="bg-green-50 p-3 rounded-lg border border-green-100 mt-3">
                                            <p className="text-xs text-green-800 font-medium flex items-center gap-2">
                                                <Settings size={14} />
                                                <strong>Nota Técnica:</strong> Durante a instalação, nosso time separa o quadro elétrico para garantir que o backup alimente apenas o essencial.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </>
                    )}
                    
                    {/* --- CONTEXTO REGULATÓRIO E ZERO GRID --- */}
                    <hr className="border-slate-100" />
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        
                        {/* Contexto Lei 14.300 */}
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
                            <h3 className="text-slate-900 font-bold flex items-center gap-2 text-xl mb-6">
                                <Scale className="text-indigo-600" /> Contexto Regulatório (Lei 14.300)
                            </h3>
                            <h4 className="font-bold text-slate-800 mb-2">{structured.contextoLegal.titulo}</h4>
                            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                                <p>{structured.contextoLegal.explicacaoFioB}</p>
                                <div className="bg-indigo-100 p-4 rounded-xl text-indigo-900 border border-indigo-200">
                                    <strong>Solução:</strong> {structured.contextoLegal.impactoLei14300}
                                </div>
                            </div>
                        </div>

                        {/* Zero Grid (Condicional) */}
                        {projectData.usaraZeroGrid && structured.explicacaoZeroGrid && (
                            <div className="bg-white p-8 rounded-3xl border-2 border-amber-100 shadow-sm">
                                <h3 className="text-slate-900 font-bold flex items-center gap-2 text-xl mb-6">
                                    <Zap className="text-amber-500" /> Tecnologia Zero Grid
                                </h3>
                                <p className="text-sm text-slate-600 mb-6">{structured.explicacaoZeroGrid}</p>
                                <ZeroGridSchematic />
                            </div>
                        )}
                    </section>
                    <hr className="border-slate-100" />

                    {/* --- 2. ESPECIFICAÇÕES TÉCNICAS (Grid Bento) --- */}
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-slate-900 font-bold flex items-center gap-2 text-xl">
                                <Zap className="text-amber-500" /> Engenharia do Sistema
                            </h3>
                            <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-medium">Dimensionamento Personalizado</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Solar Card */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative overflow-hidden group hover:border-amber-200 transition-colors">
                                <Sun className="text-amber-500 mb-3 w-8 h-8" />
                                <p className="text-3xl font-black text-slate-900 mb-1">{results.potenciaPvKwP}</p>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Potência kWp</p>
                                <div className="mt-4 text-sm text-slate-600 border-t border-slate-200 pt-2">
                                    {results.numModulos} painéis de alta eficiência
                                </div>
                            </div>

                            {/* Inversor Card */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative overflow-hidden group hover:border-blue-200 transition-colors">
                                <Zap className="text-blue-500 mb-3 w-8 h-8" />
                                <p className="text-3xl font-black text-slate-900 mb-1">{results.potenciaInversorKw || results.suggestedInverterPvKw}</p>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Inversor kW</p>
                                <div className="mt-4 text-sm text-slate-600 border-t border-slate-200 pt-2">
                                    Topologia {projectData.systemType === 'ONG' ? 'On-Grid' : 'Híbrida Inteligente'}
                                </div>
                            </div>

                            {/* Battery Card (Destaque se houver) */}
                            {(projectData.systemType === 'HIB' || projectData.systemType === 'OFF') && (
                                <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-6 opacity-10">
                                        <BatteryCharging size={120} />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 text-green-400 mb-2">
                                            <BatteryCharging size={20} /> 
                                            <span className="text-xs font-black uppercase tracking-widest">Backup System</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <p className="text-4xl font-black">{results.energiaBessKwh}</p>
                                            <span className="text-lg text-slate-400 font-medium">kWh</span>
                                        </div>
                                        <p className="text-sm text-slate-300 mt-1 mb-4">Banco de Baterias LFP (Lítio Ferro Fosfato)</p>
                                        <div className="inline-flex bg-white/10 px-3 py-1 rounded-lg text-xs border border-white/10">
                                            {results.numBaterias} Módulos de 5kWh
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100 text-sm">
                            <p>{structured.analiseTecnica}</p>
                        </div>
                    </section>

                    {/* --- 3. ANÁLISE FINANCEIRA (Onde se ganha o cliente) --- */}
                    <section>
                        <h3 className="text-slate-900 font-bold flex items-center gap-2 text-xl mb-8">
                            <Landmark className="text-green-600" /> Projeção Financeira (25 Anos)
                        </h3>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Tabela de Ganhos */}
                            <div className="lg:col-span-1 space-y-4">
                                <FinancialRow label="Economia no 1º Ano" value={structured.analiseFinanceira.economiaAnual} color="text-slate-900" />
                                <FinancialRow label="Economia Acumulada" value={structured.analiseFinanceira.economiaTotal25Anos} color="text-green-600" isLarge />
                                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl mt-6">
                                    <p className="text-xs text-amber-800 font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                                        <AlertTriangle size={12}/> Custo da Inércia
                                    </p>
                                    <p className="text-amber-900 text-sm leading-tight">
                                        Se não investir, você pagará aprox. <strong className="text-amber-700 underline">R$ {results.custoInercia25Anos.toLocaleString('pt-BR', {maximumFractionDigits:0})}</strong> para a concessionária.
                                    </p>
                                </div>
                            </div>

                            {/* Gráfico de Fluxo de Caixa */}
                            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <h4 className="text-sm font-bold text-slate-500 mb-6">Fluxo de Caixa Acumulado (Patrimônio Líquido)</h4>
                                <div className="h-64">
                                    <CashFlowChart dataPoints={results.fluxoCaixaAcumulado} />
                                </div>
                                <div className="flex justify-between mt-4 text-xs text-slate-400 border-t border-slate-100 pt-3">
                                    <span>Hoje (Investimento)</span>
                                    <span>Payback ({results.paybackAnos.toFixed(1)} anos)</span>
                                    <span>Ano 25 (Lucro)</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 prose prose-slate text-slate-600 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <p>{structured.analiseFinanceira.texto}</p>
                        </div>
                    </section>
                    
                    {/* --- Seção Bateria Gráfico Visual --- */}
                    {(projectData.systemType === 'HIB' || projectData.systemType === 'OFF') && (
                        <section>
                            <h3 className="text-slate-900 font-bold flex items-center gap-2 text-xl mb-6">
                                <Battery className="text-green-600" /> Comportamento do Backup
                            </h3>
                            <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
                                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
                                <div className="relative z-10 h-64">
                                    <BatteryCycleChart />
                                </div>
                                <p className="text-center text-xs text-slate-400 mt-4 relative z-10">
                                    Simulação de ciclo diário: Carga Solar (Dia) vs. Descarga (Noite/Backup)
                                </p>
                            </div>
                        </section>
                    )}

                    {/* --- 4. SUSTENTABILIDADE --- */}
                    <section className="bg-green-50 rounded-3xl p-8 border border-green-100">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1">
                                <h3 className="text-green-800 font-bold flex items-center gap-2 text-xl mb-3">
                                    <Leaf /> Legado Ambiental
                                </h3>
                                <p className="text-green-800/80 text-sm leading-relaxed mb-4">
                                    {structured.impactoAmbiental.texto}
                                </p>
                                <div className="flex gap-6">
                                    <div>
                                        <p className="text-2xl font-black text-green-700">{structured.impactoAmbiental.co2EvitadoToneladas}</p>
                                        <p className="text-xs font-bold text-green-600 uppercase tracking-wider">Ton de CO₂</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-green-700">{structured.impactoAmbiental.arvoresSalvas}</p>
                                        <p className="text-xs font-bold text-green-600 uppercase tracking-wider">Árvores Plantadas</p>
                                    </div>
                                </div>
                            </div>
                            <div className="opacity-20">
                                <Leaf size={120} className="text-green-700" />
                            </div>
                        </div>
                    </section>

                </main>

                {/* --- FOOTER --- */}
                <footer className="bg-slate-50 border-t border-slate-200 p-12 text-center">
                    <h4 className="text-2xl font-bold text-slate-900 mb-2">Vamos transformar sua energia?</h4>
                    <p className="text-slate-500 mb-8 max-w-xl mx-auto">"{structured.conclusaoVenda}"</p>
                    
                    <div className="inline-flex items-center gap-8 text-sm text-slate-400">
                        <span className="flex items-center gap-2"><Phone size={14}/> Contato via Integrador</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className="flex items-center gap-2"><Mail size={14}/> Proposta válida por 10 dias</span>
                    </div>
                    
                    <div className="mt-8 pt-8 border-t border-slate-200 text-[10px] text-slate-300 uppercase tracking-widest font-bold">
                        Gerado por Calculadora de Baterias Pro • Tecnologia Gemini AI
                    </div>
                </footer>

            </div>
        </div>
    );
}; 

// Componentes Auxiliares do Relatório
const FinancialRow: React.FC<{ label: string; value: number; color: string; isLarge?: boolean }> = ({ label, value, color, isLarge }) => (
    <div className="flex justify-between items-end border-b border-slate-100 pb-3">
        <span className="text-slate-500 text-sm font-medium">{label}</span>
        <span className={`font-bold ${color} ${isLarge ? 'text-2xl' : 'text-lg'}`}>
            R$ {value.toLocaleString('pt-BR', {maximumFractionDigits: 0})}
        </span>
    </div>
);

const UserIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const BriefcaseIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;

export default ReportDisplay;