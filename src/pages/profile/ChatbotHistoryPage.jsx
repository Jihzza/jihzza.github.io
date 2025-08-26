// src/pages/profile/ChatbotHistoryPage.jsx


import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getConversationHistoryByUserId } from '../../services/chatbotService';
import ConversationHistoryCard from '../../components/chatbot/ConversationalHistoryCard';
import ProfileSectionLayout from '../../components/profile/ProfileSectionLayout';
import { useTranslation } from 'react-i18next';
import SectionTextWhite from '../../components/common/SectionTextWhite';


export default function ChatbotHistoryPage() {
    const { t } = useTranslation();
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
                console.error('Failed to fetch chat history:', err);
                setError(t('chatbotHistory.error'));
            } finally {
                setLoading(false);
            }
        };
        loadHistory();
    }, [user, t]);


    const renderContent = () => {
        if (loading) return <p className="text-center text-gray-500">{t('chatbotHistory.loading')}</p>;
        if (error) return <p className="text-center text-red-500">{error}</p>;
        if (conversations.length === 0)
            return <p className="text-center text-gray-500">{t('chatbotHistory.empty')}</p>;


        return conversations.map((convo) => (
            <ConversationHistoryCard key={convo.id} conversation={convo} />
        ));
    };


    return (
        <div className="bg-gradient-to-b from-[#002147] to-[#ECEBE5] h-full">
            <ProfileSectionLayout>
                <SectionTextWhite title="Chatbot History" />
                <div className="space-y-4">{renderContent()}</div>
            </ProfileSectionLayout>
        </div>
    );
}