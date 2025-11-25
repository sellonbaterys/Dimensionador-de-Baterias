
import React, { useState, useRef, useCallback } from 'react';
import { Send, Image as ImageIcon, X, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string, imageFile: File | null) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!inputText.trim() && !selectedImage) || isLoading) return;

    onSendMessage(inputText, selectedImage);
    setInputText('');
    clearImage();
    
    // Reset altura do textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const adjustTextareaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="relative bg-slate-800 border border-slate-700 rounded-2xl shadow-lg p-2">
        
        {/* Preview da Imagem */}
        {imagePreview && (
          <div className="relative inline-block mb-2 ml-2 mt-2">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="h-20 w-20 object-cover rounded-lg border border-slate-600" 
            />
            <button 
              onClick={clearImage}
              className="absolute -top-2 -right-2 bg-slate-900 text-slate-400 hover:text-white rounded-full p-1 border border-slate-700 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          {/* Botão de Upload */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-slate-400 hover:text-emerald-400 hover:bg-slate-700/50 rounded-xl transition-all duration-200 disabled:opacity-50"
            disabled={isLoading}
            title="Adicionar imagem"
          >
            <ImageIcon size={22} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageSelect} 
            accept="image/*" 
            className="hidden" 
          />

          {/* Área de Texto */}
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={adjustTextareaHeight}
            onKeyDown={handleKeyDown}
            placeholder={selectedImage ? "Pergunte algo sobre a imagem..." : "Digite sua mensagem..."}
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 resize-none outline-none py-3 max-h-[120px] overflow-y-auto"
            rows={1}
            disabled={isLoading}
          />

          {/* Botão de Enviar */}
          <button
            type="submit"
            disabled={(!inputText.trim() && !selectedImage) || isLoading}
            className={`p-3 rounded-xl flex items-center justify-center transition-all duration-200 ${
              (!inputText.trim() && !selectedImage) || isLoading
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20'
            }`}
          >
            {isLoading ? <Loader2 size={22} className="animate-spin" /> : <Send size={22} />}
          </button>
        </form>
      </div>
      <div className="text-center mt-2">
        <p className="text-[10px] text-slate-600">
          O Gemini pode cometer erros. Verifique informações importantes.
        </p>
      </div>
    </div>
  );
};