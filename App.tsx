import React, { useState, useEffect } from 'react';
import { 
  Sun, Battery, Zap, MapPin, ChevronRight, ChevronLeft, 
  RotateCcw, Calculator, FileText, Loader2, Lightbulb, 
  LayoutDashboard, Home, Info, Settings, DollarSign, Building2,
  BatteryCharging, HardHat, User, Gauge, BrainCircuit, CheckCircle, Instagram, Star, Sparkles,
  TrendingUp, AlertTriangle, Unplug
} from 'lucide-react';

import { ProjectData, CalculationResults, ReportContent, SystemType } from './types';
import { BRAZILIAN_STATES } from './constants';
import { fetchCitiesForState, fetchTariffDetails, TariffResult } from './services/locationService';
import { calculateDimensioning } from './utils/calculations';
import { generateReport } from './services/geminiService';

import InputField from './components/ui/InputField';
import SystemOption from './components/ui/SystemOption';
import StepIndicator from './components/ui/StepIndicator';
import ToggleSwitch from './components/ui/ToggleSwitch';
import ResultItem from './components/ui/ResultItem';
import ReportDisplay from './components/ReportDisplay';
import PremiumModal from './components/PremiumModal';
import SalesPitchModal from './components/SalesPitchModal';

const INITIAL_DATA: ProjectData = {
  systemType: null,
  cliente: '',
  integrador: '',
  estado: 'SP',
  cidade: 'São Paulo',
  distribuidora: '',
  custoKwh: 0,
  consumoMensalKWh: 500,
  systemVoltage: '220V',
  tipoTarifa: 'B1',
  horasBackup: 4,
  cargas127V: 0,
  cargas220V: 0,
  cargas380V: 0,
  fatorSimultaneidade: 70,
  usaraZeroGrid: false,
  kWhApuradosMes: 0,
  isMobileApplication: false
};

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<ProjectData>(INITIAL_DATA);
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [report, setReport] = useState<ReportContent | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showSalesModal, setShowSalesModal] = useState(false); // Novo estado para o modal de vendas
  const [reportError, setReportError] = useState<string | null>(null);
  
  const [cities, setCities] = useState<string[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isFetchingTariff, setIsFetchingTariff] = useState(false);
  const [tariffSource, setTariffSource] = useState<'CITY_SPECIFIC' | 'STATE_DEFAULT'>('STATE_DEFAULT');

  useEffect(() => {
    const loadCities = async () => {
      setIsLoadingCities(true);
      try {
        const citiesList = await fetchCitiesForState(data.estado);
        setCities(citiesList);
        if (!citiesList.includes(data.cidade) && citiesList.length > 0) {
            setData(prev => ({ ...prev, cidade: citiesList[0] }));
        }
      } catch (error) {
        console.error("Failed to load cities");
        setCities(['Capital']);
      } finally {
        setIsLoadingCities(false);
      }
    };
    loadCities();
  }, [data.estado]);

  useEffect(() => {
    const updateTariff = async () => {
      setIsFetchingTariff(true);
      try {
        const tariffInfo = await fetchTariffDetails(data.estado, data.cidade);
        setData(prev => ({
          ...prev,
          distribuidora: tariffInfo.distribuidora,
          custoKwh: tariffInfo.preco
        }));
        setTariffSource(tariffInfo.sourceType);
      } finally {
        setIsFetchingTariff(false);
      }
    };
    updateTariff();
  }, [data.estado, data.cidade]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    setData(prev => ({ ...prev, [name]: val }));
  };

  const handleSystemSelect = (type: SystemType) => {
    setData(prev => ({ ...prev, systemType: type }));
    setTimeout(() => setStep(2), 300);
  };

  const calculate = () => {
    const res = calculateDimensioning(data);
    setResults(res);
    setStep(5);
    // Aciona o modal de vendas/educação 1 segundo após o cálculo para dar tempo da transição
    setTimeout(() => {
        setShowSalesModal(true);
    }, 800);
  };

  const handleGenerateReport = async () => {
    if (!results) return;
    setIsGeneratingReport(true);
    setReportError(null);
    try {
      const rep = await generateReport(data, results);
      setReport(rep);
    } catch (e: any) {
      setReportError("Não foi possível gerar o relatório. " + (e.message || "Tente novamente."));
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const resetApp = () => {
    setStep(1);
    setData(INITIAL_DATA);
    setResults(null);
    setReport(null);
    setReportError(null);
  };

  const nextStep = () => {
    // On-Grid Logic: Skip Step 4
    if (step === 3 && data.systemType === 'ONG') {
        calculate(); 
        return;
    }
    // Off-Grid Logic: Skip Step 4 (Combined in Step 3)
    if (step === 3 && data.systemType === 'OFF') {
        calculate();
        return;
    }

    setStep(prev => prev + 1);
  };
  
  const prevStep = () => {
      // On-Grid Logic: Back from 5 to 3
      if (step === 5 && data.systemType === 'ONG') {
          setStep(3);
          return;
      }
      // Off-Grid Logic: Back from 5 to 3
      if (step === 5 && data.systemType === 'OFF') {
          setStep(3);
          return;
      }
      setStep(prev => prev - 1);
  };

  const renderStep1 = () => (
    <div className="animate-[fadeIn_0.6s_cubic-bezier(0.22,1,0.36,1)] py-8 px-4">
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight leading-none">
          Calculadora de<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-teal-400 filter drop-shadow-[0_0_20px_rgba(74,222,128,0.3)]">
            Baterias Pro
          </span>
        </h2>
        
        <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
          Dimensionamento profissional focado em lucratividade máxima. A ferramenta essencial para projetos de alto valor e segurança energética.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <SystemOption 
          icon={Sun} 
          title="On-Grid" 
          description="Conectado à rede. Reduz a conta em até 95%." 
          isSelected={data.systemType === 'ONG'} 
          onClick={() => handleSystemSelect('ONG')} 
        />
        <SystemOption 
          icon={BatteryCharging} 
          title="Híbrido" 
          description="Economia + Segurança. Nunca fique sem luz." 
          isSelected={data.systemType === 'HIB'} 
          onClick={() => handleSystemSelect('HIB')} 
        />
        <SystemOption 
          icon={Unplug} 
          title="Off-Grid" 
          description="Energia em qualquer lugar. 100% livre da rede." 
          isSelected={data.systemType === 'OFF'} 
          onClick={() => handleSystemSelect('OFF')} 
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="animate-[fadeIn_0.4s_ease-out] max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-3">Identificação do Projeto</h2>
        <p className="text-slate-400">Personalize o dossiê comercial para seu cliente.</p>
      </div>

      <div className="glass-panel p-8 md:p-10 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-blue-500"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <InputField 
             label="Integrador (Sua Empresa)" 
             name="integrador" 
             value={data.integrador} 
             onChange={handleInputChange} 
             Icon={HardHat} 
             placeholder="Digite o nome da sua empresa" 
             autoFocus
           />
           <InputField 
             label="Nome do Cliente" 
             name="cliente" 
             value={data.cliente} 
             onChange={handleInputChange} 
             Icon={User} 
             placeholder="Nome do Cliente VIP" 
           />
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="group">
            <label className="block text-xs uppercase font-bold text-slate-400 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-400"/> Localização (Estado)
            </label>
            <div className="relative">
              <select 
                name="estado" 
                value={data.estado} 
                onChange={handleInputChange} 
                className="w-full p-4 border border-white/10 bg-slate-900/50 text-white rounded-xl focus:ring-2 focus:ring-green-500 outline-none appearance-none cursor-pointer hover:bg-white/5 transition-all font-medium"
              >
                {BRAZILIAN_STATES.map(st => <option key={st.uf} value={st.uf} className="bg-slate-900">{st.nome}</option>)}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                <ChevronRight className="rotate-90 w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="group">
            <label className="block text-xs uppercase font-bold text-slate-400 mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-green-400"/> 
              Município
              {isLoadingCities && <Loader2 className="w-3 h-3 ml-2 animate-spin text-green-400" />}
            </label>
            <div className="relative">
              <select 
                name="cidade" 
                value={data.cidade} 
                onChange={handleInputChange} 
                disabled={isLoadingCities}
                className="w-full p-4 border border-white/10 bg-slate-900/50 text-white rounded-xl focus:ring-2 focus:ring-green-500 outline-none appearance-none cursor-pointer hover:bg-white/5 transition-all font-medium disabled:opacity-50"
              >
                {isLoadingCities ? (
                  <option>Carregando cidades...</option>
                ) : (
                  cities.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)
                )}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                <ChevronRight className="rotate-90 w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => {
    const isOffGrid = data.systemType === 'OFF';

    return (
      <div className="animate-[fadeIn_0.4s_ease-out] max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-3">
            {isOffGrid ? 'Dimensionamento Off-Grid' : 'Inteligência Energética'}
          </h2>
          <p className="text-slate-400">
            {isOffGrid ? 'Defina consumo e autonomia em uma única etapa.' : 'Análise do perfil de consumo.'}
          </p>
        </div>

        <div className="glass-panel p-8 md:p-10 rounded-3xl space-y-8 relative">
          
          {/* Se for Off-Grid, oculta o card de tarifa */}
          {!isOffGrid && (
            <div className={`rounded-2xl p-6 border relative overflow-hidden transition-all duration-500 ${
               tariffSource === 'CITY_SPECIFIC' 
                ? 'bg-green-500/10 border-green-500/30 shadow-[inset_0_0_40px_rgba(34,197,94,0.05)]' 
                : 'bg-slate-800/50 border-slate-700'
            }`}>
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                <Zap size={200} className="text-white" />
              </div>
              
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className={`font-bold flex items-center gap-2 text-sm tracking-wider uppercase ${
                   tariffSource === 'CITY_SPECIFIC' ? 'text-green-400' : 'text-slate-400'
                }`}>
                  <Info size={16} /> 
                  {tariffSource === 'CITY_SPECIFIC' 
                    ? `Tarifa Local Detectada` 
                    : `Tarifa Média Estadual`
                  }
                </h3>
                {tariffSource === 'CITY_SPECIFIC' && (
                   <span className="bg-green-500 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg shadow-green-500/20">
                     <CheckCircle size={12} strokeWidth={3} /> AUTOMÁTICO
                   </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                 <div>
                    <label className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-3 block">Distribuidora Local</label>
                    {isFetchingTariff ? (
                       <div className="h-14 bg-slate-700/30 rounded-xl animate-pulse w-full"></div>
                    ) : (
                       <div className="relative group">
                         <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5 group-hover:text-green-300 transition-colors" />
                         <input 
                           type="text"
                           name="distribuidora"
                           value={data.distribuidora}
                           onChange={handleInputChange}
                           className="w-full bg-slate-900/60 border border-white/10 text-white rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none font-bold text-lg placeholder-slate-600 transition-all hover:bg-slate-900/80"
                         />
                       </div>
                    )}
                 </div>
                 <div>
                    <label className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-3 block">Custo (R$/kWh)</label>
                    {isFetchingTariff ? (
                       <div className="h-14 bg-slate-700/30 rounded-xl animate-pulse w-full"></div>
                    ) : (
                       <div className="relative group">
                         <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5 group-hover:text-green-300 transition-colors" />
                         <input 
                           type="number"
                           step="0.01"
                           name="custoKwh"
                           value={data.custoKwh}
                           onChange={handleInputChange}
                           className="w-full bg-slate-900/60 border border-white/10 text-white rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none font-bold text-lg placeholder-slate-600 transition-all hover:bg-slate-900/80"
                         />
                       </div>
                    )}
                 </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <InputField 
               label={isOffGrid ? "Média mensal de kWh apurado no mês" : "Consumo Mensal (kWh)"}
               name="consumoMensalKWh" 
               type="number" 
               value={data.consumoMensalKWh} 
               onChange={handleInputChange} 
               Icon={Lightbulb} 
               placeholder="Média na conta"
               className="text-xl font-black text-green-400"
             />
             <div className="group">
               <label className="block text-xs uppercase font-bold text-slate-400 mb-3 flex items-center gap-2">
                 <Zap className="w-4 h-4 text-green-400"/> Tensão de Entrada
               </label>
               <div className="relative">
                 <select 
                   name="systemVoltage" 
                   value={data.systemVoltage} 
                   onChange={handleInputChange} 
                   className="w-full p-4 border border-white/10 bg-slate-900/50 text-white rounded-xl focus:ring-2 focus:ring-green-500 outline-none appearance-none cursor-pointer font-medium hover:bg-white/5"
                 >
                    <option value="127V" className="bg-slate-900">Monofásico 127V</option>
                    <option value="220V" className="bg-slate-900">Monofásico 220V</option>
                    <option value="220V Trifásico" className="bg-slate-900">Trifásico 220V</option>
                    <option value="380V" className="bg-slate-900">Trifásico 380V</option>
                 </select>
                 <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                   <ChevronRight className="rotate-90 w-5 h-5" />
                 </div>
               </div>
             </div>
          </div>

          {/* Seção de Cargas Nominais e Baterias - EXCLUSIVO OFF-GRID (Fusão das etapas) */}
          {isOffGrid && (
            <>
              <div className="border-t border-white/10 pt-6 mt-6 animate-[fadeIn_0.3s]">
                 <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <LayoutDashboard size={16} className="text-green-400" />
                    OU Preencha as Cargas Nominais (Watts)
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField 
                      label="Cargas 127V" 
                      name="cargas127V" 
                      type="number" 
                      value={data.cargas127V} 
                      onChange={handleInputChange} 
                      Icon={LayoutDashboard} 
                      placeholder="0" 
                      description="Ex: Lâmpadas, TV, Geladeira, Roteador. (Potência = V x A)"
                    />
                    <InputField 
                      label="Cargas 220V" 
                      name="cargas220V" 
                      type="number" 
                      value={data.cargas220V} 
                      onChange={handleInputChange} 
                      Icon={LayoutDashboard} 
                      placeholder="0" 
                      description="Ex: Ar Condicionado, Chuveiro, Bomba Piscina. (Potência = V x A)"
                    />
                    <InputField 
                      label="Cargas 380V" 
                      name="cargas380V" 
                      type="number" 
                      value={data.cargas380V} 
                      onChange={handleInputChange} 
                      Icon={LayoutDashboard} 
                      placeholder="0" 
                      description="Ex: Motores Trifásicos, Compressores Industriais. (Potência = V x A)"
                    />
                 </div>
                 <p className="text-xs text-slate-500 mt-3 text-center italic">
                    Se preencher as cargas acima, a média mensal pode ser deixada em 0.
                 </p>
              </div>

              {/* Seção Baterias (Trazida da Etapa 4) */}
              <div className="border-t border-white/10 pt-6 mt-6 animate-[fadeIn_0.3s]">
                 <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Battery size={16} className="text-green-400" />
                    Dimensionamento do Banco de Baterias
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InputField 
                    label="Autonomia Desejada (Horas)" 
                    name="horasBackup" 
                    type="number" 
                    value={data.horasBackup} 
                    onChange={handleInputChange} 
                    Icon={Battery}
                    placeholder="Ex: 4"
                    className="font-bold text-lg"
                  />
                  <InputField 
                    label="Fator de Simultaneidade (%)" 
                    name="fatorSimultaneidade" 
                    type="number" 
                    value={data.fatorSimultaneidade} 
                    onChange={handleInputChange} 
                    Icon={Settings}
                    description="% dos aparelhos ligados ao mesmo tempo"
                    className="font-bold text-lg"
                  />
                </div>
              </div>
            </>
          )}

          {!isOffGrid && (
             <div className="pt-6 border-t border-white/5">
                <ToggleSwitch 
                  label="Zero Grid (Anti-Injeção)" 
                  description="Ative se a concessionária proibir envio de energia para a rede."
                  checked={data.usaraZeroGrid} 
                  onChange={(e) => setData({...data, usaraZeroGrid: e.target.checked})} 
                />
             </div>
          )}
        </div>
      </div>
    );
  };

  const renderStep4 = () => {
    // Se for Off-Grid, essa tela não deve aparecer (foi fundida na 3)
    // Mas mantemos a função para On-Grid e Híbrido
    const totalWatts = (data.cargas127V || 0) + (data.cargas220V || 0) + (data.cargas380V || 0);
    const isEstimativaMode = totalWatts === 0;

    return (
      <div className="animate-[fadeIn_0.4s_ease-out] max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-3">Cargas & Autonomia</h2>
          <p className="text-slate-400">Defina o perfil de consumo para o backup.</p>
        </div>
        
        <div className={`transition-all duration-500 rounded-2xl border p-6 mb-8 ${
            isEstimativaMode 
              ? 'bg-blue-900/10 border-blue-500/20' 
              : 'bg-green-900/10 border-green-500/30 shadow-[0_0_30px_rgba(74,222,128,0.1)]'
        }`}>
          <div className="flex gap-5 items-center">
             <div className={`p-4 rounded-xl transition-colors ${isEstimativaMode ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
               {isEstimativaMode ? <BrainCircuit size={32} /> : <Gauge size={32} />}
             </div>
             <div className="flex-1">
               <h4 className={`font-bold text-lg mb-1 uppercase tracking-wide ${isEstimativaMode ? 'text-blue-200' : 'text-green-300'}`}>
                 {isEstimativaMode ? 'Modo Estimativa Inteligente' : 'Modo Precisão Ativado'}
               </h4>
               <p className={`text-sm leading-relaxed ${isEstimativaMode ? 'text-blue-200/60' : 'text-green-200/60'}`}>
                 {isEstimativaMode 
                   ? "Nenhuma carga específica inserida. O sistema usará a média da conta de luz e padrões de mercado para sugerir o banco de baterias ideal."
                   : `Carga total definida: ${totalWatts} Watts. O sistema será dimensionado cirurgicamente para suportar esses equipamentos.`
                 }
               </p>
             </div>
          </div>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <InputField 
            label="Cargas 127V (Watts)" 
            name="cargas127V" 
            type="number" 
            value={data.cargas127V} 
            onChange={handleInputChange} 
            Icon={LayoutDashboard} 
            placeholder="0 (Vazio)" 
            description="Ex: Lâmpadas, TV, Geladeira, Roteador. (Potência = V x A)"
            className={data.cargas127V > 0 ? "border-green-500/50 text-green-400 font-bold bg-green-500/5" : "opacity-70"}
          />
          <InputField 
            label="Cargas 220V (Watts)" 
            name="cargas220V" 
            type="number" 
            value={data.cargas220V} 
            onChange={handleInputChange} 
            Icon={LayoutDashboard} 
            placeholder="0 (Vazio)" 
            description="Ex: Ar Condicionado, Chuveiro, Bomba Piscina. (Potência = V x A)"
            className={data.cargas220V > 0 ? "border-green-500/50 text-green-400 font-bold bg-green-500/5" : "opacity-70"}
          />
          <InputField 
            label="Cargas 380V (Watts)" 
            name="cargas380V" 
            type="number" 
            value={data.cargas380V} 
            onChange={handleInputChange} 
            Icon={LayoutDashboard} 
            placeholder="0 (Vazio)" 
            description="Ex: Motores Trifásicos, Compressores Industriais. (Potência = V x A)"
            className={data.cargas380V > 0 ? "border-green-500/50 text-green-400 font-bold bg-green-500/5" : "opacity-70"}
          />
        </div>
  
        <div className="glass-panel p-8 rounded-3xl border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <InputField 
            label="Autonomia Desejada (Horas)" 
            name="horasBackup" 
            type="number" 
            value={data.horasBackup} 
            onChange={handleInputChange} 
            Icon={Battery}
            placeholder="Ex: 4"
            className="font-bold text-lg"
          />
          <InputField 
            label="Fator de Simultaneidade (%)" 
            name="fatorSimultaneidade" 
            type="number" 
            value={data.fatorSimultaneidade} 
            onChange={handleInputChange} 
            Icon={Settings}
            description="% dos aparelhos ligados ao mesmo tempo"
            className="font-bold text-lg"
          />
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!results) return null;
    return (
      <div className="animate-[fadeIn_0.6s_cubic-bezier(0.22,1,0.36,1)] space-y-10 max-w-6xl mx-auto">
        <div className="text-center mb-12 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-green-500/20 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-green-500/30 shadow-[0_0_20px_rgba(74,222,128,0.3)] backdrop-blur-md relative z-10">
             <CheckCircle size={14} /> Estudo de Viabilidade Técnica
          </div>
          <h2 className="text-5xl font-black text-white mb-3 relative z-10">Solução Energética</h2>
          <p className="text-slate-400 text-lg relative z-10">Configuração otimizada para <span className="text-white font-semibold">{data.cliente}</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ResultItem icon={Sun} title="Potência Solar Sugerida" value={`${results.potenciaPvKwP} kWp`} description="Potência Instalada" highlight />
          <ResultItem icon={Lightbulb} title="Geração Média" value={`${results.dailyProductionKwh.toFixed(1)} kWh/dia`} description="Produção Estimada" />
          
          {/* Oculta o Inversor padrão (FV) se for Híbrido, pois já aparece no card de BESS */}
          {data.systemType !== 'HIB' && (
              <ResultItem icon={Calculator} title="Inversor" value={`${results.suggestedInverterPvKw} kW`} description="Potência Nominal" />
          )}
          
          <ResultItem icon={FileText} title="Economia Mensal" value={`R$ ${results.economiaMensalEstimada}`} description="Redução na Fatura" highlight />
        </div>

        {(data.systemType === 'HIB' || data.systemType === 'OFF') && (
           <div className="glass-panel rounded-[2rem] p-10 shadow-2xl relative overflow-hidden border border-green-500/20">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-teal-500"></div>
              <div className="absolute -right-10 -bottom-10 opacity-10 text-green-400">
                 <Battery size={200} />
              </div>
              
              <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-8 relative z-10">
                 <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                   <BatteryCharging className="text-green-400 w-8 h-8"/> BESS (Battery Energy Storage System)
                 </h3>
                 
                 <div className="flex items-center gap-2 text-[10px] text-green-400 uppercase font-black tracking-widest bg-green-900/20 px-4 py-2 rounded-full border border-green-500/10">
                    <Instagram size={14} /> Tecnologia Sellon Embarcada
                 </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                 <ResultItem icon={Battery} title="Banco de Baterias" value={`${results.energiaBessKwh} kWh`} description={`${results.numBaterias} unidades de 5kWh`} />
                 <ResultItem icon={Zap} title="Inversor Híbrido" value={`${results.potenciaInversorKw} kW`} description={`Modelo: ${results.suggestedInverterBess}`} />
                 <ResultItem icon={LayoutDashboard} title="Energia Instantânea" value={`${results.effectiveLoadKw} kW`} description={`Autonomia proj. de ${data.horasBackup}h`} />
              </div>
           </div>
        )}

        <div className="flex flex-col md:flex-row gap-6 justify-center pt-8 pb-12">
          {!report ? (
             <div className="w-full max-w-lg text-center space-y-4">
              {/* Nota de Disclaimer */}
              <p className="text-xs text-slate-500 italic max-w-md mx-auto mb-6 leading-relaxed">
                  * Nota: Este é um dimensionamento aproximado, pois depende do perfil de uso dos equipamentos, perdas do sistema e das condições climáticas adversas.
              </p>

              <button 
                onClick={handleGenerateReport} 
                disabled={isGeneratingReport}
                className="group relative flex items-center justify-center px-10 py-6 bg-green-600 text-white rounded-2xl font-bold text-xl shadow-[0_0_40px_rgba(34,197,94,0.3)] transition-all hover:-translate-y-1 hover:scale-105 hover:shadow-[0_0_60px_rgba(34,197,94,0.5)] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden w-full"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-400 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative flex items-center z-10">
                  {isGeneratingReport ? <Loader2 className="animate-spin mr-3 w-6 h-6" /> : <FileText className="mr-3 w-6 h-6" />}
                  {isGeneratingReport ? "Gerando Relatório..." : "Relatório Premium"}
                </span>
              </button>
              
              {reportError && (
                <div className="p-4 bg-red-900/30 border border-red-500/30 rounded-xl text-red-200 text-sm animate-[fadeIn_0.3s]">
                   <p className="flex items-center justify-center gap-2"><AlertTriangle size={16}/> {reportError}</p>
                   <button onClick={() => setReportError(null)} className="text-xs underline mt-2 hover:text-white">Tentar novamente</button>
                </div>
              )}
            </div>
          ) : (
             <div className="w-full animate-[fadeIn_0.5s_ease-out]">
               <ReportDisplay content={report} projectData={data} results={results} />
               <div className="flex justify-center mt-16 print:hidden">
                 <button onClick={resetApp} className="flex items-center px-8 py-4 border border-white/10 hover:border-green-500/50 bg-white/5 hover:bg-green-500/10 rounded-2xl text-slate-300 hover:text-green-400 transition-all font-semibold backdrop-blur-sm">
                    <RotateCcw size={20} className="mr-3" /> Iniciar Novo Estudo
                 </button>
               </div>
             </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-green-500/30 selection:text-white flex flex-col">
      
      <header className="fixed top-0 w-full z-50 bg-[#050b14]/70 backdrop-blur-xl border-b border-white/5 print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => step > 1 && setStep(1)}>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2.5 rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.4)] group-hover:shadow-[0_0_25px_rgba(34,197,94,0.6)] transition-all">
              <Zap className="text-white w-5 h-5" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white leading-none group-hover:text-green-400 transition-colors">Calculadora<span className="text-green-400">.Pro</span></h1>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">Enterprise Edition</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/sellon.batterys" target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-2 text-xs text-slate-400 hover:text-green-400 transition-colors font-bold uppercase tracking-wider">
               <Instagram size={14} /> Sellon Partner
            </a>
            <button onClick={() => setShowPremiumModal(true)} className="group relative flex items-center gap-2 text-xs font-bold bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-full border border-white/10 transition-all overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
               <Star size={12} className="text-yellow-400 fill-yellow-400" />
               UPGRADE PLAN
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-grow px-4 pt-28 pb-24 print:p-0 print:pt-0">
        
        {step <= 5 && (
           <div className="max-w-3xl mx-auto mb-16 relative px-4 print:hidden">
             {/* Progress Bar Line */}
             <div className="absolute top-[18px] left-10 right-10 h-[2px] bg-white/5 -z-10"></div>
             <div className="absolute top-[18px] left-10 h-[2px] bg-gradient-to-r from-green-500 to-emerald-400 -z-10 transition-all duration-700" style={{ width: `${((step - 1) / 4) * 100}%` }}></div>
             
             <div className="flex justify-between items-start">
               <StepIndicator step={1} currentStep={step} title="Tipo" systemType={data.systemType} />
               <StepIndicator step={2} currentStep={step} title="Cliente" systemType={data.systemType} />
               <StepIndicator step={3} currentStep={step} title="Energia" systemType={data.systemType} />
               <StepIndicator step={4} currentStep={step} title="Cargas" systemType={data.systemType} />
               <StepIndicator step={5} currentStep={step} title="Resultado" systemType={data.systemType} />
             </div>
           </div>
        )}

        <div className="min-h-[600px] flex flex-col justify-center print:block print:min-h-0">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderResults()}
        </div>

        {step <= 5 && (
          <div className="fixed bottom-8 left-0 right-0 z-40 pointer-events-none print:hidden">
            <div className="max-w-4xl mx-auto px-6 flex justify-between items-center pointer-events-auto">
               <button 
                 onClick={prevStep} 
                 disabled={step === 1}
                 className={`flex items-center px-6 py-4 rounded-2xl font-bold text-sm transition-all backdrop-blur-md ${step === 1 ? 'opacity-0 pointer-events-none' : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/10 hover:border-white/30'}`}
               >
                 <ChevronLeft className="mr-2" size={18} /> {step === 5 ? 'Editar Dados' : 'Voltar'}
               </button>
               
               {step < 5 && (
                   (step === 4 || (step === 3 && (data.systemType === 'ONG' || data.systemType === 'OFF'))) ? (
                      <button 
                        onClick={calculate}
                        className="flex items-center px-8 py-4 bg-green-500 hover:bg-green-400 text-[#020617] rounded-2xl font-black text-lg shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all hover:scale-105 hover:-translate-y-1"
                      >
                        Calcular Projeto <Calculator className="ml-2" size={20} />
                      </button>
                   ) : (
                      <button 
                        onClick={nextStep}
                        disabled={!data.systemType || (step === 2 && (!data.cliente || !data.integrador))}
                        className="group flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                      >
                        Próximo Passo <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                      </button>
                   )
               )}
            </div>
          </div>
        )}
      </main>
      
      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
      <SalesPitchModal isOpen={showSalesModal} onClose={() => setShowSalesModal(false)} />
    </div>
  );
};

export default App;