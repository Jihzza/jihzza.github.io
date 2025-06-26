// src/components/messages/ChatWindow.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getMessages, sendMessage } from '../../services/messagesService';
import FormButton from '../common/Forms/FormButton';
import { supabase } from '../../lib/supabaseClient';

export default function ChatWindow({ conversation }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    
    // This ref will hold the stable channel instance.
    const channelRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // --- THE DEFINITIVE REAL-TIME LIFECYCLE ---
        
        // 1. Immediately unsubscribe from any existing channel to stop listening to old conversations.
        if (channelRef.current) {
            channelRef.current.unsubscribe();
        }

        // 2. Fetch initial messages for the new conversation.
        const fetchAndSubscribe = async () => {
            setLoading(true);
            const { data, error } = await getMessages(conversation.conversation_id);
            if (error) {
                console.error("Error fetching messages:", error);
            } else {
                setMessages(data || []);
            }
            setLoading(false);
        };
        fetchAndSubscribe();

        // 3. Use the "get or create" pattern for the channel.
        const channelName = `messages_for_${conversation.conversation_id}`;
        const channel = supabase.channel(channelName);
        
        // 4. Set up the event listener for new messages.
        channel
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversation.conversation_id}` },
                async (payload) => {
                    // Enrich the message with profile data before adding to state.
                    const { data: profileData } = await supabase.from('profiles').select('username, avatar_url').eq('id', payload.new.sender_id).single();
                    const messageWithProfile = {...payload.new, profiles: profileData};
                    setMessages(currentMessages => [...currentMessages, messageWithProfile]);
                }
            )
            .subscribe((status, err) => {
                // This callback handles subscription status. It's the right place
                // to gracefully handle the "multiple times" error if it somehow still occurs.
                if (status === 'SUBSCRIBED') {
                    console.log(`Successfully subscribed to ${channelName}`);
                }
                if (status === 'CHANNEL_ERROR' || err) {
                    console.error(`Subscription error on ${channelName}:`, err);
                }
            });

        // 5. Store the new channel instance in the ref.
        channelRef.current = channel;

        // 6. The cleanup function ONLY runs when the ChatWindow component is
        //    completely unmounted (e.g., navigating away from the Messages page).
        //    It's crucial that we don't call `removeChannel` here, only `unsubscribe`.
        return () => {
            if (channelRef.current) {
                channelRef.current.unsubscribe();
            }
        };
    }, [conversation.conversation_id]); // This is correct, the effect re-runs when you switch conversations.

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        await sendMessage(conversation.conversation_id, newMessage);
        setNewMessage('');
    };
    
    if (loading) {
        return <div className="flex-grow flex items-center justify-center">Loading messages...</div>;
    }

    return (
        <div className="h-full flex flex-col bg-gray-50">
            <div className="p-4 border-b border-gray-200 bg-white">
                <h2 className="text-xl font-semibold">{conversation.profiles?.username || 'Chat'}</h2>
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex mb-3 ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl shadow-sm ${
                            msg.sender_id === user.id
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-gray-800 border'
                            }`}
                        >
                            <p>{msg.content}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200 bg-white">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        autoComplete="off"
                    />
                    <FormButton type="submit">Send</FormButton>
                </form>
            </div>
        </div>
    );
}
