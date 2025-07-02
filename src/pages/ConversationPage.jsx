// src/pages/ConversationPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import ChatWindow from '../components/messages/ChatWindow';
import BackButton from '../components/common/BackButton';

/**
 * A full-screen page dedicated to a single conversation.
 * It fetches the conversation details and renders the ChatWindow.
 */
export default function ConversationPage() {
    const { conversationId } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const [conversation, setConversation] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);

    // Effect to fetch details of the conversation partner.
    useEffect(() => {
        if (!authLoading && user) {
            const fetchConversationDetails = async () => {
                setPageLoading(true);
                // Fetch the *other* member of the conversation to display their name.
                const { data: memberData, error } = await supabase
                    .from('conversation_members')
                    .select('*')
                    .eq('conversation_id', conversationId)
                    .neq('user_id', user.id)
                    .single();

                if (error) {
                    console.error("Error fetching conversation details:", error);
                    navigate('/messages'); // Redirect if conversation not found or error.
                } else {
                    setConversation({
                        conversation_id: parseInt(conversationId, 10),
                        profiles: memberData,
                    });
                }
                setPageLoading(false);
            };

            if (conversationId) {
                fetchConversationDetails();
            }
        } else if (!authLoading && !user) {
            navigate('/login');
        }
    }, [conversationId, navigate, user, authLoading]);

    if (authLoading || pageLoading || !conversation) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-black text-white">
                Loading Conversation...
            </div>
        );
    }

    return (
        // The page is a flex container that fills the screen height.
        <div className="h-full flex flex-col">
            {/* Header Section */}
            <header className="p-4 flex items-center space-x-4 flex-shrink-0">
                <BackButton />
            </header>
            
            {/* Chat Window takes up the remaining space */}
            <main className="flex-grow overflow-hidden">
                 <ChatWindow key={conversationId} conversation={conversation} />
            </main>
        </div>
    );
}