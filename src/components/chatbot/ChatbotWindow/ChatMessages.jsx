// src/components/chatbot/ChatbotWindow/ChatMessages.jsx

import React, { useEffect } from 'react';
import BotIcon from '../../../assets/icons/DaGalow Branco.svg';
import { useTranslation } from 'react-i18next'; // 1. Import hook

export default function ChatMessages({ messages, loading, scrollRef }) {
  const { t } = useTranslation(); // 2. Initialize hook

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, scrollRef]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto lg:py-2">
      {messages.map((message, index) => (
        <div key={index} className={`flex ${message.from === 'user' ? 'justify-end md:text-lg lg:text-base' : 'justify-start md:text-lg lg:text-base'} mb-4 lg:mb-2`}>
          <div className={`w-full px-4 flex items-start gap-2 ${message.from === 'user' ? 'justify-end md:py-2' : 'py-4 bg-white/10 backdrop-blur-md border border-white/20 md:py-6 lg:py-4 shadow-sm'}`}>
            {message.from === 'bot' && (
              <img
                src={BotIcon}
                alt={t('chatbot.messages.avatarAlt')} // 3. Use translated alt text
                className="w-6 h-6 flex-shrink-0 md:w-8 md:h-8 lg:w-6 lg:h-6"
              />
            )}
            <span className="text-white leading-relaxed">{message.text}</span>
          </div>
        </div>
      ))}
      
      {loading && (
        <div className="flex justify-start mb-4">
          <div className="relative w-full px-3 py-2 flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-sm">
            <img src={BotIcon} alt={t('chatbot.messages.avatarAlt')} className="w-6 h-6 md:w-8 md:h-8" />
            <div className="flex items-center gap-1">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
            <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
              <div className="typing-shimmer" />
            </div>
          </div>
          <style>{`
            @keyframes chatbot-typing {
              0%, 80%, 100% { transform: scale(0.4); opacity: .5; }
              40% { transform: scale(1); opacity: 1; }
            }
            @keyframes chatbot-shimmer {
              0% { transform: translateX(-150%); }
              100% { transform: translateX(150%); }
            }
            .typing-dot {
              width: 8px;
              height: 8px;
              background: #bfa200;
              border-radius: 9999px;
              display: inline-block;
              animation: chatbot-typing 1.2s infinite ease-in-out;
            }
            .typing-dot:nth-child(2) { animation-delay: 0.15s; }
            .typing-dot:nth-child(3) { animation-delay: 0.3s; }
            .typing-shimmer {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(90deg, transparent, rgba(255,255,255,.08), transparent);
              animation: chatbot-shimmer 1.8s infinite;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}