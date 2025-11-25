
import React from 'react';
import { CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Legend, AreaChart, Area, Line, Cell, XAxis, YAxis } from 'recharts';
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

  if (data.length === 0) return <div className="text-center text-slate-400 py-10 text-xs font-medium uppercase tracking-wider">Sem dados de carga detalhados</div>;

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
            contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }} 
            itemStyle={{ color: '#1e293b', fontWeight: 600 }}
            formatter={(value: number) => [`${value} W`, 'Potência']}
          />
          <Legend iconType="circle" wrapperStyle={{fontSize: '11px', color: '#64748b', fontWeight: 500}} />
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
             contentStyle={{ backgroundColor: '#0f172a', borderColor: '#22c55e', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
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
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
           <defs>
            <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis 
            dataKey="year" 
            stroke="#94a3b8" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(val) => val % 5 === 0 ? `Ano ${val}` : ''}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(val) => `R$ ${(val/1000).toFixed(0)}k`}
          />
          <Tooltip 
            cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
            contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
            formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', {maximumFractionDigits: 0})}`, 'Saldo Acumulado']}
            labelFormatter={(label) => `Ano ${label}`}
          />
           <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#16a34a" 
            strokeWidth={2}
            fill="url(#colorFlow)"
            activeDot={{ r: 6, fill: '#16a34a', stroke: '#fff', strokeWidth: 2 }}
          />
          {/* Linha zero para referência */}
          <Line dataKey="zero" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" dot={false} activeDot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ZeroGridSchematic: React.FC = () => ( 
    <div className="w-full flex flex-col items-center">
        <div className="w-full flex items-center justify-between gap-4 relative mb-4">
            <div className="flex flex-col items-center z-10">
                <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-1 border border-amber-100">
                    <Sun size={20} />
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Solar</span>
            </div>
            <div className="h-0.5 flex-1 bg-slate-100 relative overflow-hidden rounded-full">
                <div className="absolute inset-0 bg-amber-400 w-1/2 animate-[slideRight_1.5s_infinite_linear]"></div>
            </div>
            <div className="flex flex-col items-center z-10">
                 <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-1 border border-blue-100">
                    <Zap size={24} />
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Inversor</span>
            </div>
            <div className="h-0.5 flex-1 bg-slate-100 relative overflow-hidden rounded-full">
                 <div className="absolute inset-0 bg-green-400 w-1/2 animate-[slideRight_1.5s_infinite_linear]"></div>
            </div>
            <div className="flex flex-col items-center z-10">
                 <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-1 border border-green-100">
                    <Home size={20} />
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Casa</span>
            </div>
             <div className="flex flex-col items-center justify-center absolute right-[-10px] top-1/3 z-20">
                <div className="bg-white p-0.5 rounded-full border border-red-100 shadow-sm">
                    <Ban className="text-red-500 w-5 h-5" />
                </div>
             </div>
        </div>
        <div className="w-full flex justify-end pr-2">
            <div className="flex flex-col items-center opacity-40 grayscale scale-90">
                 <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-1">
                    <UtilityPole size={20} />
                </div>
                <span className="text-[9px] font-bold text-slate-300 uppercase">Rede</span>
            </div>
        </div>
    </div>
);

// Novo Esquema 1: Funcionamento do Sistema de Armazenamento
export const BessOperationSchematic: React.FC = () => (
  <div className="w-full">
      <div className="relative grid grid-cols-3 gap-4 items-center mb-6">
          {/* Solar */}
          <div className="flex flex-col items-center relative z-10">
              <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-2 border border-amber-100">
                  <Sun size={20} />
              </div>
              <span className="text-[9px] font-bold text-slate-500 uppercase">Geração</span>
          </div>

          {/* Inversor Híbrido (Central) */}
          <div className="flex flex-col items-center relative z-20">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-blue-100">
                  <Zap size={32} />
              </div>
              <span className="text-[9px] font-bold text-blue-600 uppercase">Híbrido</span>
          </div>

          {/* Casa */}
          <div className="flex flex-col items-center relative z-10">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-2 border border-indigo-100">
                  <Home size={20} />
              </div>
              <span className="text-[9px] font-bold text-slate-500 uppercase">Consumo</span>
          </div>

          {/* Linhas de Conexão Superiores */}
          <div className="absolute top-6 left-[16%] right-[16%] h-px bg-slate-200 -z-0"></div>
          
          {/* Bateria (Abaixo) */}
          <div className="col-start-2 flex flex-col items-center mt-4 relative">
              <div className="h-6 w-px bg-slate-200 absolute -top-6 -z-0"></div>
              <div className="w-full max-w-[100px] bg-green-50 border border-green-200 p-2 rounded-lg flex flex-col items-center shadow-sm">
                  <BatteryCharging size={20} className="text-green-600 mb-1" />
                  <span className="text-[9px] font-bold text-green-700 uppercase">Bateria</span>
              </div>
          </div>
      </div>
  </div>
);

// Novo Esquema 2: Instalação de Cargas Críticas (Split Panel)
export const CriticalLoadsSchematic: React.FC = () => (
  <div className="w-full">
      <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 md:gap-8">
          
          {/* Entrada Rede */}
          <div className="flex flex-col items-center justify-center">
               <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-2">
                  <UtilityPole size={20} />
              </div>
              <span className="text-[9px] font-bold text-slate-400 uppercase">Rede</span>
          </div>

          <div className="hidden md:flex items-center">
              <ArrowRight size={16} className="text-slate-300" />
          </div>

          {/* Quadro Principal (Não Critico) */}
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 opacity-60 relative">
               <div className="absolute -top-2 left-3 bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase">
                  Quadro Geral
              </div>
              <div className="flex flex-col gap-1.5 mt-2">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px]">
                      <Fan size={12} /> Ar Cond.
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-[10px]">
                      <Zap size={12} /> Chuveiro
                  </div>
              </div>
          </div>

          <div className="hidden md:flex items-center">
              <ArrowRight size={16} className="text-green-400" />
          </div>

          {/* Inversor + Quadro Crítico */}
          <div className="flex-1 bg-green-50/50 border border-green-400 rounded-xl p-3 relative shadow-sm">
              <div className="absolute -top-2 left-3 bg-green-500 text-white px-1.5 py-0.5 rounded text-[8px] font-bold uppercase shadow-sm">
                  Cargas Críticas
              </div>
              
              <div className="flex flex-col gap-1.5 mt-2">
                  <div className="flex items-center gap-2 text-green-800 text-[10px] font-bold">
                      <Server size={12} /> Geladeira
                  </div>
                  <div className="flex items-center gap-2 text-green-800 text-[10px] font-bold">
                      <Router size={12} /> Internet
                  </div>
                  <div className="flex items-center gap-2 text-green-800 text-[10px] font-bold">
                      <Lightbulb size={12} /> Luz
                  </div>
              </div>
          </div>
      </div>
  </div>
);
