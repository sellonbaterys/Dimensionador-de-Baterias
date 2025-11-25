
import React from 'react';
import { X, Zap, TrendingUp, FileCheck, BrainCircuit, ArrowRight } from 'lucide-react';

interface SalesPitchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SalesPitchModal: React.FC<SalesPitchModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#020617]/90 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-[fadeIn_0.3s_ease-out]">
      <div className="bg-slate-900 border border-green-500/30 w-full max-w-lg rounded-3xl shadow-[0_0_50px_rgba(34,197,94,0.15)] overflow-hidden relative">
        
        {/* Efeito de fundo */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors z-10"
        >
            <X size={20} />
        </button>

        <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-500/20 p-3 rounded-xl text-green-400 animate-pulse">
                    <Zap size={28} fill="currentColor" />
                </div>
                <div>
                    <p className="text-xs font-black uppercase tracking-widest text-green-500">Masterclass de Vendas</p>
                    <h2 className="text-2xl font-bold text-white leading-tight">Baterias são o <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">PRESENTE</span>.</h2>
                </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Esqueça a "guerra de preços" do On-Grid. O dinheiro real está na venda de <strong>Segurança Energética</strong>. 
                O Dossiê Premium foi desenhado para você vender sistemas de alto ticket (R$ 50k+) usando gatilhos mentais.
            </p>

            <div className="space-y-4 bg-slate-800/50 p-5 rounded-2xl border border-white/5 mb-8">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <BrainCircuit size={16} className="text-green-400"/> Por que usar o Relatório Premium?
                </h3>
                
                <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-slate-400">
                        <TrendingUp size={16} className="text-green-500 mt-0.5 shrink-0" />
                        <span>
                            <strong className="text-slate-200">Matemática Financeira Bancária:</strong> Mostre VPL e TIR para provar que a bateria é um investimento, não um custo.
                        </span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-slate-400">
                        <FileCheck size={16} className="text-green-500 mt-0.5 shrink-0" />
                        <span>
                            <strong className="text-slate-200">Gatilho da Inércia:</strong> O relatório calcula quanto dinheiro o cliente <i>perde</i> se não fechar com você hoje.
                        </span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-slate-400">
                        <Zap size={16} className="text-green-500 mt-0.5 shrink-0" />
                        <span>
                            <strong className="text-slate-200">Autoridade Técnica:</strong> Um documento com visual de consultoria internacional elimina concorrentes amadores.
                        </span>
                    </li>
                </ul>
            </div>

            <button 
                onClick={onClose}
                className="w-full group flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-900/20 transition-all hover:scale-[1.02]"
            >
                Ver meu Dimensionamento <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
            </button>
        </div>
      </div>
    </div>
  );
};

export default SalesPitchModal;
