// src/pages/profile/ChatbotHistoryPage.jsx

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getConversationHistoryByUserId } from '../../services/chatbotService';
import ConversationHistoryCard from '../../components/chatbot/ConversationalHistoryCard';
import ProfileSectionLayout from '../../components/profile/ProfileSectionLayout';
import { Link } from 'react-router-dom';

export default function ChatbotHistoryPage() {
    const { user } = useAuth();
    const [conversations, setConversations] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const loadHistory = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const { data, error: fetchError } = await getConversationHistoryByUserId(user.id);
                if (fetchError) throw fetchError;
                setConversations(data || []);
            } catch (err) {
                console.error("Failed to fetch chat history:", err);
                setError("We couldn't load your chat history. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        loadHistory();
    }, [user]);

    const renderContent = () => {
        if (loading) return <p className="text-center text-gray-500">Loading your history...</p>;
        if (error) return <p className="text-center text-red-500">{error}</p>;
        if (conversations.length === 0) {
            return (
                <div className="text-center bg-gray-50 p-8 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-800">No History Found</h3>
                    <p className="mt-2 text-gray-600">You haven't had any conversations with the chatbot yet.</p>
                    <Link 
                        to="/#chat" // Or a link to the main page section with the chatbot
                        className="mt-4 inline-block bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition-colors"
                    >
                        Start a Conversation
                    </Link>
                </div>
            );
        }
        return conversations.map(convo => <ConversationHistoryCard key={convo.id} conversation={convo} />);
    };

    return (
        <ProfileSectionLayout title="My Chatbot History">
            <div className="space-y-4">
                {renderContent()}
            </div>
        </ProfileSectionLayout>
    );
}