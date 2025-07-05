// src/pages/MessagesPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getConversations, findOrCreateConversation } from '../services/messagesService';
import UserSearch from '../components/messages/UserSearch';
import ConversationList from '../components/messages/ConversationList';

export default function MessagesPage() {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && user) {
            const fetchConversations = async () => {
                setPageLoading(true);
                const { data, error } = await getConversations();
                if (error) {
                    console.error("Error fetching conversations:", error);
                } else {
                    setConversations(data || []);
                }
                setPageLoading(false);
            };
            fetchConversations();
        } else if (!authLoading && !user) {
             setPageLoading(false);
        }
    }, [user, authLoading]);

    const handleUserSelect = async (selectedUser) => {
        const { data: conversationId, error } = await findOrCreateConversation(selectedUser.id);

        if (error) {
            console.error("Error finding or creating conversation:", error.message);
            return;
        }

        if (conversationId) {
            navigate(`/messages/${conversationId}`);
        }
    };

    const handleConversationSelect = (conversation) => {
        navigate(`/messages/${conversation.conversation_id}`);
    };

    if (authLoading || pageLoading) {
        return <div className="p-4 text-center">Loading...</div>;
    }

    return (
        <div className="h-full flex flex-col bg-white text-black">
            <div className="p-4 border-b border-gray-700">
                <h1 className="text-2xl font-bold">Messages</h1>
            </div>
            <div className="p-4 border-b border-gray-700">
                <UserSearch onUserSelect={handleUserSelect} />
            </div>
            <div className="flex-grow overflow-y-auto">
                <ConversationList
                    conversations={conversations}
                    onSelect={handleConversationSelect}
                />
            </div>
        </div>
    );
}