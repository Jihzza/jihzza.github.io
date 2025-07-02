// src/pages/MessagesPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate for navigation.
import { useAuth } from '../contexts/AuthContext';
import { getConversations, findOrCreateConversation } from '../services/messagesService';
import UserSearch from '../components/messages/UserSearch';
import ConversationList from '../components/messages/ConversationList';

// This component now acts as an "Inbox" or "Conversation List" page.
export default function MessagesPage() {
    const navigate = useNavigate(); // 2. Initialize the navigate function from React Router.
    const { user, loading: authLoading } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);

    // This data fetching logic is correct and remains the same.
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

    // 3. This handler is called when a user is selected from the UserSearch component.
    const handleUserSelect = async (selectedUser) => {
        // It creates or finds the conversation...
        const { data: conversationId, error } = await findOrCreateConversation(selectedUser.id);

        if (error) {
            console.error("Error finding or creating conversation:", error.message);
            return;
        }

        if (conversationId) {
            // 4. ...and then programmatically navigates to the dedicated chat page.
            navigate(`/messages/${conversationId}`);
        }
    };

    // 5. This handler is for clicking an existing conversation in the list.
    const handleConversationSelect = (conversation) => {
        // 6. It navigates to the dedicated page for that specific conversation.
        navigate(`/messages/${conversation.conversation_id}`);
    };

    if (authLoading || pageLoading) {
        return <div className="p-4 text-center">Loading...</div>;
    }

    // 7. The JSX for this page is now simplified. It no longer contains the ChatWindow.
    // Its sole responsibility is to display the search and list components.
    return (
        <div className="h-full flex flex-col bg-white">
            <div className="p-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold">Messages</h1>
            </div>
            <div className="p-4 border-b border-gray-200">
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