// src/components/messages/ChatWindow.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getMessages, sendMessage, subscribeToMessages } from '../../services/messagesService';
import { supabase } from '../../lib/supabaseClient';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

export default function ChatWindow({ conversation }) {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        setLoading(true);
        getMessages(conversation.conversation_id).then(({ data, error }) => {
            if (error) {
                console.error("Error fetching messages:", error);
            } else {
                setMessages(data || []);
            }
            setLoading(false);
        });

        const channel = subscribeToMessages(conversation.conversation_id, (newMessage) => {
            setMessages(currentMessages => [...currentMessages, newMessage]);
        });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversation.conversation_id]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        await sendMessage(conversation.conversation_id, newMessage);
        setNewMessage('');
    };
    
    if (loading) {
        return <div className="flex-grow flex items-center justify-center text-gray-500">{t('directMessages.chatWindow.loading')}</div>;
    }

    return (
        <div className="h-full flex flex-col bg-gray-50 text-black">
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {messages.map((msg) => {
                    const isCurrentUser = msg.sender_id === user.id;
                    const avatarUrl = msg.profiles?.avatar_url || `https://i.pravatar.cc/150?u=${msg.sender_id}`;

                    return (
                        <div key={msg.id} className={`flex items-start gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                            <img 
                                src={avatarUrl} 
                                alt={t('directMessages.chatWindow.avatarAlt', { user: msg.profiles?.username || 'User' })}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl shadow-sm ${
                                isCurrentUser
                                    ? 'bg-yellow-400 text-black rounded-br-none'
                                    : 'bg-white text-black rounded-bl-none'
                                }`}
                            >
                                <p>{msg.content}</p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 bg-white">
                 <form onSubmit={handleSendMessage} className="relative flex items-center">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={t('directMessages.chatWindow.inputPlaceholder')}
                        className="w-full bg-gray-100 border-2 border-gray-300 rounded-full py-3 pl-4 pr-14 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-gray-500 hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
                        aria-label={t('directMessages.chatWindow.sendAriaLabel')}
                    >
                        <PaperAirplaneIcon className="h-6 w-6"/>
                    </button>
                </form>
            </div>
        </div>
    );
}