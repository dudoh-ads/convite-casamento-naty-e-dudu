import React, { useState, useEffect } from 'react';
import { Send, Heart } from 'lucide-react';
import { GuestMessage } from '../types';
import { loadMessages, submitMessage } from '../services/storage';

interface GuestBookProps {
  webhookUrl?: string;
}

export const GuestBook: React.FC<GuestBookProps> = ({ webhookUrl }) => {
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    loadMessages(webhookUrl)
      .then((msgs) => { if (active) setMessages(msgs); })
      .catch((e) => console.error('Erro ao carregar mural da planilha:', e))
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [webhookUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;

    setIsSubmitting(true);
    try {
      const updatedMessages = await submitMessage(author, text, webhookUrl);
      setMessages(updatedMessages);
      setAuthor('');
      setText('');
    } catch (e) {
      console.error('Erro ao publicar mensagem:', e);
      alert('Não foi possível publicar sua mensagem agora. Tente novamente em instantes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-8 border-b border-sep max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <span className="micro-label mb-3 block text-[#8A2E63]">
          Mural de Recados
        </span>
        <p className="font-serif-title text-lg sm:text-xl italic text-[#4A4A4A]">
          Deixe uma mensagem de carinho para guardar para sempre no nosso coração.
        </p>
      </div>

      {/* Message Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-10 p-6 border border-sep rounded-xl bg-[#F8F7F4] shadow-xs">
        <div>
          <label className="micro-label block mb-1 text-[#8A2E63]">Seu Nome / Família</label>
          <input
            type="text"
            required
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Ex: Ana & Carlos Silva"
            className="w-full bg-transparent border-b border-[#6B1124]/20 py-2 text-base font-serif-title italic text-[#4A4A4A] focus:outline-none focus:border-[#6B1124] transition-colors"
          />
        </div>

        <div>
          <label className="micro-label block mb-1 text-[#8A2E63]">Sua Mensagem</label>
          <textarea
            required
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escreva sua mensagem aos noivos..."
            className="w-full bg-transparent border-b border-[#6B1124]/20 py-2 text-base font-serif-title italic text-[#4A4A4A] focus:outline-none focus:border-[#6B1124] transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !author.trim() || !text.trim()}
          className="w-full py-3 bg-[#6B1124] text-[#F8F7F4] font-sans-clean text-[10px] font-bold uppercase tracking-[0.18em] hover:bg-[#7C2338] transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2 shadow-xs"
        >
          <Send className="w-3.5 h-3.5 text-[#C6C6C8]" />
          Publicar no Mural
        </button>
      </form>

      {/* List of Published Messages */}
      <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
        {isLoading ? (
          <p className="font-serif-title text-sm italic text-[#4A4A4A] text-center py-4">
            Carregando mensagens...
          </p>
        ) : messages.length === 0 ? (
          <p className="font-serif-title text-sm italic text-[#4A4A4A] text-center py-4">
            Seja o primeiro a deixar uma mensagem de carinho aos noivos.
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="p-5 border border-sep rounded-xl bg-[#F8F7F4] relative shadow-xs"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif-display font-semibold text-sm italic text-[#6B1124] flex items-center gap-1.5">
                  <Heart className="w-3 h-3 text-[#A13B74] fill-[#A13B74]" />
                  {msg.author}
                </span>
                <span className="micro-label !text-[#8A2E63] !text-[9px]">
                  {new Date(msg.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <p className="font-serif-title text-lg italic text-[#4A4A4A] leading-relaxed">
                "{msg.message}"
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

