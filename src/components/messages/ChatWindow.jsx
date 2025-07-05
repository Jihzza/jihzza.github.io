// src/components/messages/ChatWindow.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getMessages, sendMessage, subscribeToMessages } from '../../services/messagesService';
import { supabase } from '../../lib/supabaseClient';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

export default function ChatWindow({ conversation }) {
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
        return <div className="flex-grow flex items-center justify-center text-white">Loading messages...</div>;
    }

    return (
        <div className="h-full flex flex-col text-black">
            {/* Message Display Area */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {messages.map((msg) => {
                    const isCurrentUser = msg.sender_id === user.id;
                    const avatarUrl = msg.profiles?.avatar_url || `https://i.pravatar.cc/150?u=${msg.sender_id}`;

                    return (
                        <div key={msg.id} className={`flex items-start gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                            <img 
                                src={avatarUrl} 
                                alt={msg.profiles?.username || 'User'} 
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl shadow-sm ${
                                isCurrentUser
                                    ? 'bg-[#BFA200] text-black rounded-br-none' // Current user's bubble
                                    : 'bg-white/90 text-black rounded-bl-none' // Other user's bubble
                                }`}
                            >
                                <p>{msg.content}</p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input Form */}
            <div className="p-4 border-t border-gray-700/50">
                 <form onSubmit={handleSendMessage} className="relative flex items-center">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full bg-white/20 border-2 border-gray-400 rounded-full py-3 pl-4 pr-14 text-white placeholder:text-gray-200/70 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-white hover:bg-white/20 disabled:text-gray-500 disabled:cursor-not-allowed"
                        aria-label="Send message"
                    >
                        <PaperAirplaneIcon className="h-6 w-6"/>
                    </button>
                </form>
            </div>
        </div>
    );
}