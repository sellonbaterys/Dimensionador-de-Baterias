import React from 'react'; 
import { LucideIcon } from 'lucide-react';

const ResultItem: React.FC<{ 
    icon: LucideIcon; 
    title: string; 
    value: string; 
    description: string;
    highlight?: boolean;
}> = ({ icon: Icon, title, value, description, highlight }) => (
    <div className={`flex flex-col p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 hover:-translate-y-1 ${
        highlight 
            ? 'border-green-500/30 bg-green-900/10 shadow-[0_0_30px_rgba(74,222,128,0.1)] hover:shadow-[0_0_40px_rgba(74,222,128,0.2)]' 
            : 'border-white/5 bg-slate-900/40 hover:bg-slate-800/60'
    }`}>
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${highlight ? 'bg-green-500 text-black shadow-lg shadow-green-500/30' : 'bg-white/5 text-slate-400'}`}>
                <Icon className="w-6 h-6" strokeWidth={2} />
            </div>
            {highlight && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#4ade80]"></div>}
        </div>
        
        <div className="mt-auto">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</p>
            <p className={`text-2xl font-black tracking-tight ${highlight ? 'text-white' : 'text-slate-200'}`}>{value}</p>
            <p className={`text-xs mt-2 font-medium ${highlight ? 'text-green-400' : 'text-slate-500'}`}>{description}</p>
        </div>
    </div>
); 

export default ResultItem;