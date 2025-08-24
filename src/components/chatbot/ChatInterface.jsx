// src/components/chatbot/ChatInterface.jsx

import React, { useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import BotIcon from '../../assets/icons/DaGalow Branco.svg'; // Step 1: Import the bot icon

/**
 * A reusable, generic chat interface component
 * @param {string} initialMessage - The first message displayed by the chatbot
 * @param {string} inputPlaceholder - The placeholder text for the chat input field
 * @param {string} containerHeight - The height of the chat container
 */
export default function ChatInterface({
    initialMessage,
    inputPlaceholder = "Type your message...",
    containerHeight = 'h-[450px]'
}) {
    // STATE MANAGEMENT (No changes needed here)
    const [messages, setMessages] = useState([{ text: initialMessage, sender: 'bot' }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const SESSION_KEY = 'chatbot-session-id';
    const [sessionId] = useState(() => {
        const cached = sessionStorage.getItem(SESSION_KEY);
        if (cached) return cached;            // ✅ reuse on refresh / welcome call
        const id = crypto.randomUUID();       // RFC-4122 v4 UUID
        sessionStorage.setItem(SESSION_KEY, id);
        return id;
    });

    // HOOKS (No changes needed here)
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // HANDLERS (No changes needed here)
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const webhookUrl = `${import.meta.env.VITE_N8N_WEBHOOK_URL}`;
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: sessionId, chatInput: input }),
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();

            const extractText = (obj) => {
                const keys = ['output', 'content', 'value', 'text', 'message', 'reply'];
                for (const k of keys) if (typeof obj?.[k] === 'string' && obj[k].trim()) return obj[k];
                for (const k in obj) if (typeof obj[k] === 'string' && obj[k].trim()) return obj[k];
                return null;
            };

            const text = extractText(data) ?? "Sorry, I had an issue processing that.";
            setMessages(prev => [...prev, { text, sender: 'bot' }]);
        } catch (error) {
            console.error("Error communicating with the chatbot:", error);
            setMessages(prev => [...prev, { text: "Sorry, there was an error. Please try again.", sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };

    // RENDER LOGIC
    return (
        // Step 2: Update the main container styling
        <div className={`flex flex-col w-full bg-transparent rounded-lg shadow-sm ${containerHeight}`}>
            {/* Message Display Area */}
            {/* Step 3: Remove padding from the scroll area */}
            <div className="py-4 overflow-y-auto flex-1">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
                        {/* Step 4: Update message bubble styling */}
                        <div className={`w-full p-1 flex items-start gap-2 ${msg.sender === 'bot' ? 'rounded-xl rounded-tl-sm bg-[#333333]/70' : ''
                            }`}>

                            {/* Step 5: Wrap user message to align it properly */}
                            <span className={`max-w-xs lg:max-w-md px-4 py-2 text-white ${msg.sender === 'user'
                                ? 'bg-[#BFA200] text-black ml-auto rounded-xl rounded-tr-sm'
                                : 'rounded-xl rounded-tl-sm'
                                }`}>
                                {msg.text}
                            </span>
                        </div>
                    </div>
                ))}
                {/* Step 6: Update loading indicator styling */}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="w-full p-4 flex items-center gap-2 bg-[#333333]/70">
                            <img src={BotIcon} alt="Bot Avatar" className="w-6 h-6" />
                            <span className="animate-pulse text-white">...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input Form */}
            {/* Step 7: Update input area styling */}
            <div>
                <form onSubmit={handleSendMessage} className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={inputPlaceholder}
                        disabled={isLoading}
                        // Step 8: Update input field styling
                        className="w-full bg-transparent border-2 border-[#bfa200] rounded-full py-3 pl-4 pr-14 text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-[#BFA200]"
                    />
                    {/* Step 9: Update send button styling */}
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-white hover:bg-white/20 disabled:text-gray-500"
                        aria-label="Send message"
                    >
                        <PaperAirplaneIcon className="w-6 h-6" />
                    </button>
                </form>
            </div>
        </div>
    );
}