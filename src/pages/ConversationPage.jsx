// src/pages/ConversationPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext'; // 1. Import the useAuth hook
import ChatWindow from '../components/messages/ChatWindow';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

export default function ConversationPage() {
    const { conversationId } = useParams();
    const navigate = useNavigate();
    
    // 2. Use the AuthContext to get the user and, crucially, the loading status.
    const { user, loading: authLoading } = useAuth(); 

    const [conversation, setConversation] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        // 3. This effect now depends on the auth status. It will only run when we are
        //    sure about whether a user is logged in or not.
        if (!authLoading && user) {
            const fetchConversationDetails = async () => {
                setPageLoading(true);

                // 4. We use the user object directly from our hook, which we know is reliable.
                const { data: memberData, error } = await supabase
                    .from('conversation_members')
                    .select('*')
                    .eq('conversation_id', conversationId)
                    .neq('user_id', user.id) // Use the safe user.id from the context
                    .single();

                if (error) {
                    console.error("Error fetching conversation details:", error);
                    navigate('/messages');
                } else {
                    // 5. Set the state for the ChatWindow component.
                    setConversation({
                        conversation_id: parseInt(conversationId, 10),
                        profiles: {
                            id: memberData.user_id,
                            username: memberData.username,
                            full_name: memberData.full_name,
                            avatar_url: memberData.avatar_url
                        }
                    });
                }
                setPageLoading(false);
            };

            if (conversationId) {
                fetchConversationDetails();
            }
        } else if (!authLoading && !user) {
            // If auth is done loading and there's no user, redirect them.
            navigate('/login');
        }
    }, [conversationId, navigate, user, authLoading]); // 6. Add auth dependencies to the hook.

    // Display a loading indicator while either auth or page data is being fetched.
    if (authLoading || pageLoading) {
        return <div className="p-4 text-center">Loading conversation...</div>;
    }

    if (!conversation) {
        return <div className="p-4 text-center">Conversation not found or you do not have permission to view it.</div>;
    }

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-white flex items-center space-x-4">
                <button onClick={() => navigate('/messages')} className="p-2 rounded-full hover:bg-gray-100">
                    <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
                </button>
                <h1 className="text-xl font-semibold">{conversation.profiles.username}</h1>
            </div>
            
            <div className="flex-grow">
                 <ChatWindow key={conversationId} conversation={conversation} />
            </div>
        </div>
    );
}
