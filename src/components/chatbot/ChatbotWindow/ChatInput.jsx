// src/components/chatbot/ChatbotWindow/ChatInput.jsx

import React, { useRef, useEffect, useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next'; // 1. Import hook

export default function ChatInput({ 
  userText, setUserText, sendMessage, loading, isAuthenticated, isOpen 
}) {
  const { t } = useTranslation(); // 2. Initialize hook
  const textareaRef = useRef(null);
  const [textareaHeight, setTextareaHeight] = useState('auto');

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      
      // Calculate the height based on content
      const scrollHeight = textarea.scrollHeight;
      const lineHeight = 24; // Approximate line height in pixels
      const maxLines = 5;
      const maxHeight = lineHeight * maxLines;
      
      // Set height to scrollHeight but cap at maxHeight
      const newHeight = Math.min(scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;
      setTextareaHeight(`${newHeight}px`);
    }
  }, [userText]);

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
    <div className="py-3">
      <div className="relative flex items-end">
        <textarea
          ref={textareaRef}
          value={userText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholderText}
          rows={1}
          style={{ 
            height: textareaHeight,
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // Internet Explorer 10+
          }}
           className={`
             w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl py-3 pl-4 pr-14 text-white placeholder:text-white/50 focus:outline-none focus:ring focus:ring-white/70 md:text-lg lg:py-2 lg:text-base
             resize-none overflow-y-auto [&::-webkit-scrollbar]:hidden shadow-sm
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
              ? 'text-white/50 cursor-not-allowed' 
              : 'text-white hover:bg-white hover:scale-110'
            }
          `}
          title={buttonTitle}
        >
          <PaperAirplaneIcon className="h-5 w-5 md:h-7 md:w-7" />
        </button>
      </div>
      
      {!isAuthenticated && (
        <p className="text-xs text-white/70 mt-2 text-center">
          {t('chatbot.input.helperTextLoggedOut')}
        </p>
      )}
    </div>
  );
}