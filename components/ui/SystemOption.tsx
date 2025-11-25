import React from 'react'; 
import { LucideIcon, Check } from 'lucide-react';

const SystemOption: React.FC<{ 
    icon: LucideIcon; 
    title: string; 
    description: string; 
    isSelected: boolean; 
    onClick: () => void 
}> = ({ icon: Icon, title, description, isSelected, onClick }) => (
    <div className="flex flex-col items-center group cursor-pointer" onClick={onClick}>
        <div 
            className={`relative w-full aspect-[4/3] rounded-[2rem] border transition-all duration-500 flex flex-col items-center justify-center overflow-hidden backdrop-blur-md ${
                isSelected 
                    ? 'border-green-400 bg-green-500/10 shadow-[0_0_50px_rgba(74,222,128,0.2)] scale-105' 
                    : 'border-white/10 bg-slate-900/40 hover:border-green-500/30 hover:bg-slate-800/60 hover:shadow-[0_0_30px_rgba(74,222,128,0.1)] hover:-translate-y-2'
            }`} 
        >
            <div className={`absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent opacity-0 transition-opacity duration-500 ${isSelected ? 'opacity-100' : 'group-hover:opacity-30'}`}></div>
            
            {isSelected && (
                <div className="absolute top-6 right-6 bg-green-500 text-black p-1.5 rounded-full shadow-[0_0_15px_rgba(74,222,128,0.8)] animate-in zoom-in duration-300">
                    <Check size={16} strokeWidth={4} />
                </div>
            )}
            
            <div className={`relative z-10 p-6 rounded-2xl transition-all duration-500 ${
                isSelected 
                    ? 'bg-green-500 text-black shadow-[0_0_20px_rgba(74,222,128,0.6)] rotate-0' 
                    : 'bg-white/5 text-slate-400 group-hover:text-green-400 group-hover:bg-white/10 group-hover:scale-110'
            }`}>
                <Icon className="w-12 h-12" strokeWidth={1.5} />
            </div>
            <h4 className={`relative z-10 text-2xl font-bold mt-6 tracking-tight transition-colors duration-300 ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>{title}</h4>
        </div>
        
        <div className="mt-6 px-4 text-center max-w-xs">
             <p className={`text-sm leading-relaxed transition-all duration-300 ${isSelected ? 'text-green-300 font-medium opacity-100' : 'text-slate-500 group-hover:text-slate-400'}`}>
                {description}
             </p>
        </div>
    </div>
); 

export default SystemOption;