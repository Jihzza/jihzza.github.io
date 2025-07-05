// src/pages/ConversationPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import ChatWindow from '../components/messages/ChatWindow';
// --- CHANGE: Import the new header component ---
import ConversationHeader from '../components/messages/ConversationHeader'; 

export default function ConversationPage() {
    const { conversationId } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const [conversationPartner, setConversationPartner] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && user) {
            const fetchConversationDetails = async () => {
                setPageLoading(true);
                const { data: memberData, error } = await supabase
                    .from('conversation_members')
                    .select('*')
                    .eq('conversation_id', conversationId)
                    .neq('user_id', user.id)
                    .single();

                if (error || !memberData) {
                    console.error("Error fetching conversation details:", error);
                    navigate('/messages');
                } else {
                    setConversationPartner(memberData);
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

    if (authLoading || pageLoading || !conversationPartner) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-black text-white">
                Loading Conversation...
            </div>
        );
    }

    const conversation = {
        conversation_id: parseInt(conversationId, 10),
        profiles: conversationPartner,
    };

    return (
        // --- CHANGE: Applied the desired background gradient and flex layout ---
        // The "Why": The page is now responsible for the overall layout and background,
        // making the child components more modular and reusable.
        <div className="h-full flex flex-col bg-gradient-to-b from-[#002147] to-[#ECEBE5]">
            {/* --- CHANGE: Replaced inline header with the new reusable component --- */}
            <ConversationHeader partner={conversationPartner} />
            
            <main className="flex-grow overflow-hidden">
                 <ChatWindow key={conversationId} conversation={conversation} />
            </main>
        </div>
    );
}