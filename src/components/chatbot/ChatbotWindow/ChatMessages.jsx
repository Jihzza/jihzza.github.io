import React, { useEffect, useRef } from 'react';
import BotIcon from '../../../assets/icons/DaGalow Branco.svg';

/**
 * ChatMessages component for displaying conversation messages
 * Handles auto-scrolling to bottom and loading states
 * * @param {Object} props - Component props
 * @param {Array} props.messages - Array of message objects
 * @param {boolean} props.loading - Whether a message is being sent
 * @param {React.RefObject} props.scrollRef - Ref for the scroll container
 */
export default function ChatMessages({ messages, loading, scrollRef }) {
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, scrollRef]);

  return (
    <div 
      ref={scrollRef}
      className="flex-1 py-2 overflow-y-auto"
    >
      {/* Messages List */}
      {messages.map((message, index) => (
        <div 
          key={index} 
          className={`flex ${
            message.from === 'user' ? 'justify-end' : 'justify-start'
          } mb-4`}
        >
          <div className={`w-full p-4 flex items-start gap-2 ${
            message.from === 'user'
              ? 'justify-end'
              : 'bg-[#333333]/70'
          }`}>
            
            {/* Bot Avatar - Only show for bot messages */}
            {message.from === 'bot' && (
              <img
                src={BotIcon}
                alt="Bot Avatar"
                className="w-6 h-6 flex-shrink-0"
              />
            )}

            {/* Message Text */}
            <span className="text-white leading-relaxed">
              {message.text}
            </span>
          </div>
        </div>
      ))}
      
      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-start mb-4">
          <div className="w-full px-3 py-2 flex items-center gap-2 bg-[#333333]/70 rounded-lg">
            <img 
              src={BotIcon} 
              alt="Bot Avatar" 
              className="w-6 h-6"
            />
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