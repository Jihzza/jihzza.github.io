import React, { useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

/**
 * ChatInput component for message input and sending
 * Handles keyboard interactions and input validation
 * * @param {Object} props - Component props
 * @param {string} props.userText - Current input text
 * @param {Function} props.setUserText - Function to update input text
 * @param {Function} props.sendMessage - Function to send the message
 * @param {boolean} props.loading - Whether a message is being sent
 * @param {boolean} props.isAuthenticated - Whether user is authenticated
 * @param {boolean} props.isOpen - Whether the chat window is open
 */
export default function ChatInput({ 
  userText, 
  setUserText, 
  sendMessage, 
  loading, 
  isAuthenticated,
  isOpen 
}) {
  const inputRef = useRef(null);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  /**
   * Handle Enter key press to send message
   * @param {KeyboardEvent} e - Keyboard event
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /**
   * Handle input change
   * @param {ChangeEvent} e - Change event
   */
  const handleInputChange = (e) => {
    setUserText(e.target.value);
  };

  /**
   * Check if send button should be disabled
   */
  const isSendDisabled = loading || !userText.trim() || !isAuthenticated;

  return (
    <div className="p-4">
      <div className="relative flex items-center">
        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={userText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={
            !isAuthenticated 
              ? "Please log in to chat..." 
              : "Type your message..."
          }
          className={`
            w-full border-2 border-[#bfa200] rounded-full py-3 pl-4 pr-14 
            text-white placeholder:text-white/50 bg-transparent
            focus:outline-none focus:border-[#bfa200]/80
            transition-colors duration-200
            ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          disabled={loading || !isAuthenticated}
        />
        
        {/* Send Button */}
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
          title={!isAuthenticated ? 'Please log in to chat' : 'Send message'}
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </div>
      
      {/* Helper Text */}
      {!isAuthenticated && (
        <p className="text-xs text-gray-400 mt-2 text-center">
          You need to be logged in to use the chat
        </p>
      )}
    </div>
  );
}