// src/components/chatbot/ChatbotWindow/ChatInput.jsx

import React, { useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next'; // 1. Import hook

export default function ChatInput({ 
  userText, setUserText, sendMessage, loading, isAuthenticated, isOpen 
}) {
  const { t } = useTranslation(); // 2. Initialize hook
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e) => setUserText(e.target.value);
  const isSendDisabled = loading || !userText.trim() || !isAuthenticated;

  // 3. Determine dynamic text from translations
  const placeholderText = isAuthenticated ? t('chatbot.input.placeholder') : t('chatbot.input.placeholderLoggedOut');
  const buttonTitle = isAuthenticated ? t('chatbot.input.buttonAria') : t('chatbot.input.buttonAriaLoggedOut');

  return (
    <div className="p-4">
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={userText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholderText} // 4. Use translated placeholder
          className={`
            w-full bg-transparent border-2 border-[#bfa200] rounded-2xl py-3 pl-4 pr-14 text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-[#BFA200] md:text-lg lg:py-2 lg:text-base
            ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          disabled={loading || !isAuthenticated}
        />
        <button
          onClick={sendMessage}
          disabled={isSendDisabled}
          className={`
            absolute right-2 top-1/2 -translate-y-1/2 
            rounded-full p-2 font-semibold
            transition-all duration-200
            ${isSendDisabled 
              ? 'text-gray-500 cursor-not-allowed' 
              : 'text-[#bfa200] hover:bg-[#bfa200]/10 hover:scale-110'
            }
          `}
          title={buttonTitle} // 5. Use translated title
        >
          <PaperAirplaneIcon className="h-5 w-5 md:h-7 md:w-7" />
        </button>
      </div>
      
      {!isAuthenticated && (
        <p className="text-xs text-gray-400 mt-2 text-center">
          {t('chatbot.input.helperTextLoggedOut')} {/* 6. Use translated helper text */}
        </p>
      )}
    </div>
  );
}