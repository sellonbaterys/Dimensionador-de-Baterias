import React from 'react';
import { X, Star } from 'lucide-react';

const PremiumModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null; 
    
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 fade-in">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-center relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white">
                        <X size={20} />
                    </button>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        <Star className="text-white" fill="currentColor" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Versão Premium</h2>
                    <p className="text-green-50 text-sm mt-1">Desbloqueie todo o potencial</p>
                </div>
                
                <div className="p-6 space-y-4">
                    <div className="flex gap-3 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shadow-[0_0_5px_rgba(74,222,128,0.8)]"></div>
                        <p className="text-slate-300 text-sm">Relatórios detalhados em PDF com sua logo.</p>
                    </div>
                    <div className="flex gap-3 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shadow-[0_0_5px_rgba(74,222,128,0.8)]"></div>
                        <p className="text-slate-300 text-sm">Análise financeira avançada (VPL, TIR, Payback).</p>
                    </div>
                    <div className="flex gap-3 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shadow-[0_0_5px_rgba(74,222,128,0.8)]"></div>
                        <p className="text-slate-300 text-sm">Banco de dados de equipamentos atualizado.</p>
                    </div>
                    
                    <button onClick={onClose} className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-medium transition-colors border border-slate-700">
                        Entendi
                    </button>
                </div>
            </div>
        </div>
    );
}; 

export default PremiumModal;