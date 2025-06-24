// src/components/chatbot/ChatInterface.jsx

import React, { useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import FormButton from '../common/Forms/FormButton';

/**
 * A reusable, generic chat interface component
 * @param {string} workflowId - The unique identifier for the n8n webhook
 * @param {string} initialMessage - The first message displayed by the chatbot
 * @param {string} inputPlaceholder - The placeholder text for the chat input field
 * @param {string} containerHeight - The height of the chat container
 */

export default function ChatInterface({
    workflowId,
    initialMessage,
    inputPlaceholder = "Type your message...",
    containerHeight = 'h-96'
}) {
    // STATE MANAGEMENT
    const [messages, setMessages] = useState([{ text: initialMessage, sender: 'bot' }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // HOOKS
    // Effect to scroll to the bottom whenever a new message if added
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // HANDLERS
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // The URL for your n8n webhook. It should be in your environment variables.
            const webhookUrl = `${import.meta.env.VITE_N8N_WEBHOOK_URL}/${workflowId}`;

            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const botMessage = { text: data.reply, sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Error communicating with the chatbot:", error);
            const errorMessage = { text: "Sorry, there was an error processing your message. Please try again later.", sender: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    // RENDER LOGIC
    return (
        <div className="flex flex-col w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            {/* Message Display Area */}
            <div className={`p-4 overflow-y-auto ${containerHeight}`}>
                {messages.map((msg, index) => (
                    <div key={index} className={`flex mb-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl
                            ${msg.sender === 'user'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-200 text-gray-800'
                            }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                {/* Shows a typing indicator when the bot is processing */}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-xl">
                            <span className="animate-pulse">...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input Form */}
            <div className="border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={inputPlaceholder}
                        disabled={isLoading}
                        className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
                    >
                        <PaperAirplaneIcon className="w-6 h-6" />
                    </button>
                </form>
            </div>
        </div>
    );
}