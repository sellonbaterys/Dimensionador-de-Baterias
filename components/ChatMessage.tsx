
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Bot, AlertCircle } from 'lucide-react';
import { ChatMessage as ChatMessageType, Role } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
        }`}>
          {isUser ? <User size={18} /> : <Bot size={18} />}
        </div>

        {/* Conteúdo da Mensagem */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`relative px-4 py-3 rounded-2xl shadow-sm ${
            message.isError 
              ? 'bg-red-900/20 border border-red-800 text-red-200'
              : isUser 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none'
          }`}>
            
            {/* Imagem enviada pelo usuário */}
            {message.imageUrl && (
              <div className="mb-3 overflow-hidden rounded-lg border border-white/10">
                <img 
                  src={message.imageUrl} 
                  alt="Conteúdo enviado" 
                  className="max-w-full max-h-60 object-cover"
                />
              </div>
            )}

            {/* Texto / Markdown */}
            {message.isError ? (
              <div className="flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{message.text}</span>
              </div>
            ) : (
              <div className="prose prose-invert prose-sm max-w-none break-words leading-relaxed">
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
            )}
          </div>
          
          <span className="text-xs text-slate-500 mt-1 px-1">
            {new Date(message.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};