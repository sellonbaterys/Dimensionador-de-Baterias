
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, AreaChart, Area, LineChart, Line } from 'recharts';
import { Sun, Zap, Home, UtilityPole, Ban, ArrowRight, Battery, Server, Router, Tv, Fan, Lightbulb, BatteryCharging } from 'lucide-react';

interface LoadChartProps {
  cargas127V: number;
  cargas220V: number;
  cargas380V: number;
}

export const ProposalLoadChart: React.FC<LoadChartProps> = ({ cargas127V, cargas220V, cargas380V }) => {
  const data = [
    { name: '127V', value: cargas127V },
    { name: '220V', value: cargas220V },
    { name: '380V', value: cargas380V },
  ].filter(item => item.value > 0);

  if (data.length === 0) return <div className="text-center text-slate-500 py-10 text-sm">Sem dados de carga detalhados</div>;

  const COLORS = ['#3b82f6', '#22c55e', '#8b5cf6'];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
            itemStyle={{ color: '#1e293b' }}
            formatter={(value: number) => [`${value} W`, 'Potência']}
          />
          <Legend iconType="circle" wrapperStyle={{fontSize: '12px', color: '#64748b'}} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const BatteryCycleChart: React.FC = () => {
  // Dados simulados para parecer um ciclo de carga solar durante o dia e descarga a noite
  const data = [
    { time: '00h', level: 40 },
    { time: '02h', level: 30 },
    { time: '04h', level: 25 }, 
    { time: '06h', level: 20 }, // Amanhecer
    { time: '08h', level: 40 }, 
    { time: '10h', level: 65 }, 
    { time: '12h', level: 90 }, // Pico Solar
    { time: '14h', level: 100 }, 
    { time: '16h', level: 95 }, 
    { time: '18h', level: 85 }, // Entardecer
    { time: '20h', level: 70 }, 
    { time: '22h', level: 55 },
  ];

  return (
    <div className="h-full w-full">
       <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
          <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke="rgba(255,255,255,0.5)" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} hide />
          <Tooltip 
             cursor={{ stroke: '#4ade80', strokeWidth: 1, strokeDasharray: '3 3' }}
             contentStyle={{ backgroundColor: '#0f172a', borderColor: '#22c55e', color: '#fff', borderRadius: '8px' }}
             formatter={(value: number) => [`${value}%`, 'Carga']}
          />
          <Area 
            type="monotone" 
            dataKey="level" 
            stroke="#22c55e" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorLevel)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CashFlowChart: React.FC<{ dataPoints: number[] }> = ({ dataPoints }) => {
  const data = dataPoints.map((val, i) => ({
    year: i,
    value: val
  }));

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
           <defs>
            <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
             <linearGradient id="colorFlowNeg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="year" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
          <Tooltip 
            cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
            contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', {maximumFractionDigits: 0})}`, 'Saldo']}
            labelFormatter={(label) => `Ano ${label}`}
          />
           <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#22c55e" 
            strokeWidth={2}
            fill="url(#colorFlow)"
          />
          {/* Linha zero para referência */}
          <Line dataKey="zero" stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" dot={false} activeDot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ZeroGridSchematic: React.FC = () => ( 
    <div className="w-full bg-white p-6 rounded-2xl border border-slate-200 flex flex-col items-center">
        <div className="w-full flex items-center justify-between gap-4 relative">
            <div className="flex flex-col items-center z-10">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-2 shadow-sm">
                    <Sun size={24} />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Solar</span>
            </div>
            <div className="h-1 flex-1 bg-amber-200 relative overflow-hidden rounded-full">
                <div className="absolute inset-0 bg-amber-400 w-1/2 animate-[slideRight_1s_infinite_linear]"></div>
            </div>
            <div className="flex flex-col items-center z-10">
                 <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-2 border-2 border-blue-200 shadow-sm">
                    <Zap size={32} />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Inversor</span>
            </div>
            <div className="h-1 flex-1 bg-green-200 relative overflow-hidden rounded-full">
                 <div className="absolute inset-0 bg-green-400 w-1/2 animate-[slideRight_1s_infinite_linear]"></div>
            </div>
            <div className="flex flex-col items-center z-10">
                 <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2 shadow-sm">
                    <Home size={24} />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Consumo</span>
            </div>
             <div className="flex flex-col items-center justify-center absolute right-[-10px] top-1/2 -translate-y-1/2 z-20">
                <div className="bg-white p-1 rounded-full">
                    <Ban className="text-red-500 w-8 h-8" />
                </div>
             </div>
        </div>
        <div className="w-full flex justify-end mt-2 pr-2">
            <div className="flex flex-col items-center opacity-50 grayscale">
                 <div className="w-12 h-12 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center mb-2">
                    <UtilityPole size={24} />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Rede</span>
            </div>
        </div>
        <div className="mt-6 bg-slate-50 p-3 rounded-lg border border-slate-100 text-center w-full">
            <p className="text-xs text-slate-500 font-medium">
                <span className="text-red-500 font-bold">Bloqueio Ativo:</span> A energia é consumida internamente, mas <strong className="text-slate-700">NADA</strong> é injetado na rede da concessionária.
            </p>
        </div>
    </div>
);

// Novo Esquema 1: Funcionamento do Sistema de Armazenamento
export const BessOperationSchematic: React.FC = () => (
  <div className="w-full bg-gradient-to-b from-slate-50 to-white p-6 rounded-2xl border border-slate-200">
      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center mb-8">Fluxo de Energia Inteligente</h4>
      
      <div className="relative grid grid-cols-3 gap-4 items-center">
          {/* Solar */}
          <div className="flex flex-col items-center relative z-10">
              <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-2 shadow-sm border-2 border-white">
                  <Sun size={28} />
              </div>
              <span className="text-[10px] font-bold text-slate-600">Geração</span>
          </div>

          {/* Inversor Híbrido (Central) */}
          <div className="flex flex-col items-center relative z-20">
              <div className="absolute -top-4 bg-green-100 text-green-700 px-2 py-0.5 rounded text-[9px] font-bold border border-green-200">
                Gerenciamento
              </div>
              <div className="w-20 h-20 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-blue-200">
                  <Zap size={40} />
              </div>
              <span className="text-[10px] font-bold text-blue-700">Inversor Híbrido</span>
          </div>

          {/* Casa */}
          <div className="flex flex-col items-center relative z-10">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-2 shadow-sm border-2 border-white">
                  <Home size={28} />
              </div>
              <span className="text-[10px] font-bold text-slate-600">Consumo</span>
          </div>

          {/* Linhas de Conexão Superiores */}
          <div className="absolute top-7 left-[16%] right-[16%] h-0.5 bg-slate-200 -z-0"></div>
          
          {/* Bateria (Abaixo) */}
          <div className="col-start-2 flex flex-col items-center mt-8 relative">
              <div className="h-8 w-0.5 bg-slate-200 absolute -top-8 -z-0"></div>
              <div className="w-full max-w-[120px] bg-green-50 border border-green-200 p-3 rounded-xl flex flex-col items-center shadow-sm relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-green-100/50"></div>
                  <BatteryCharging size={24} className="text-green-600 mb-1" />
                  <span className="text-[10px] font-bold text-green-800">Armazenamento</span>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8 text-[10px] text-slate-500">
          <div className="bg-amber-50 p-2 rounded border border-amber-100 flex items-center gap-2">
              <Sun size={12} className="text-amber-500"/>
              <span>Dia: Alimenta casa e carrega bateria</span>
          </div>
          <div className="bg-blue-50 p-2 rounded border border-blue-100 flex items-center gap-2">
              <Battery size={12} className="text-blue-500"/>
              <span>Noite/Apagão: Bateria assume cargas</span>
          </div>
      </div>
  </div>
);

// Novo Esquema 2: Instalação de Cargas Críticas (Split Panel)
export const CriticalLoadsSchematic: React.FC = () => (
  <div className="w-full bg-white p-6 rounded-2xl border border-slate-200">
      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center mb-8">Conceito de Instalação: Cargas Apartadas</h4>

      <div className="flex flex-col md:flex-row items-stretch justify-center gap-8">
          
          {/* Entrada Rede */}
          <div className="flex flex-col items-center justify-center">
               <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mb-2 border border-slate-200">
                  <UtilityPole size={24} />
              </div>
              <span className="text-[10px] font-bold text-slate-400">Rede (Concessionária)</span>
          </div>

          <div className="hidden md:flex items-center">
              <ArrowRight size={20} className="text-slate-300" />
          </div>

          {/* Quadro Principal (Não Critico) */}
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4 opacity-70 dashed-border relative">
               <div className="absolute -top-3 left-4 bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-[9px] font-bold">
                  Quadro Principal
              </div>
              <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Fan size={14} /> Ar Condicionado
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Zap size={14} /> Chuveiro Elétrico
                  </div>
              </div>
              <div className="mt-3 text-[9px] text-red-400 font-medium bg-red-50 p-1 rounded text-center">
                  Desliga na falta de luz
              </div>
          </div>

          <div className="hidden md:flex items-center">
              <ArrowRight size={20} className="text-green-400" />
          </div>

          {/* Inversor + Quadro Crítico */}
          <div className="flex-1 bg-green-50 border-2 border-green-400 rounded-xl p-4 relative shadow-lg shadow-green-100">
              <div className="absolute -top-3 left-4 bg-green-500 text-white px-2 py-0.5 rounded text-[9px] font-bold shadow-sm">
                  Quadro de Backup (Crítico)
              </div>
              
              <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center gap-2 text-green-800 text-xs font-bold">
                      <Server size={14} /> Geladeira / Freezer
                  </div>
                  <div className="flex items-center gap-2 text-green-800 text-xs font-bold">
                      <Router size={14} /> Internet / Wi-Fi
                  </div>
                  <div className="flex items-center gap-2 text-green-800 text-xs font-bold">
                      <Lightbulb size={14} /> Iluminação Essencial
                  </div>
                  <div className="flex items-center gap-2 text-green-800 text-xs font-bold">
                      <Tv size={14} /> TV / Computador
                  </div>
              </div>
              <div className="mt-3 text-[9px] text-green-600 font-bold bg-white p-1 rounded text-center border border-green-200">
                  Sempre Ligado (Via Bateria)
              </div>
          </div>
      </div>
  </div>
);
