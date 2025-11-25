import React from 'react'; 
import { LucideIcon } from 'lucide-react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> { 
    label: string; 
    Icon: LucideIcon; 
    description?: string; 
}

const InputField: React.FC<InputFieldProps> = ({ label, type, value, onChange, Icon, description, className, ...props }) => {
    const displayValue = (type === 'number' && (value === 0 || value === '0') && props.placeholder) ? '' : value;

    return (
        <div className="group w-full">
            <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2.5 flex items-center gap-2 group-focus-within:text-green-400 transition-colors">
                <Icon className="w-4 h-4 text-slate-600 group-focus-within:text-green-400 transition-colors" /> 
                {label}
            </label>
            <div className="relative">
                <input 
                    type={type} 
                    value={displayValue} 
                    onChange={onChange} 
                    className={`w-full bg-slate-900/40 border border-white/10 text-white rounded-xl py-4 pl-5 pr-4 focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all outline-none placeholder:text-slate-600 text-lg font-medium hover:bg-slate-900/60 focus:bg-slate-900/80 backdrop-blur-sm ${className}`} 
                    {...props} 
                />
                {/* Glow effect on focus */}
                <div className="absolute inset-0 rounded-xl bg-green-500/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-500"></div>
            </div>
            {description && <p className="mt-2 text-xs text-slate-500 font-medium ml-1">{description}</p>}
        </div>
    );
}; 

export default InputField;