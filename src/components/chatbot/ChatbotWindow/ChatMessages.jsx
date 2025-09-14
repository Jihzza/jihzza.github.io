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
          <div className="w-full px-3 py-2 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 shadow-sm">
            <img src={BotIcon} alt={t('chatbot.messages.avatarAlt')} className="w-6 h-6 md:w-8 md:h-8" />
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-[#bfa200] rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-[#bfa200] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-[#bfa200] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}