// src/pages/profile/ChatbotHistoryPage.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getConversationSessionsByUserId } from '../../services/chatbotService';
import ConversationHistoryCard from '../../components/chatbot/ConversationalHistoryCard'; // path unchanged
import ProfileSectionLayout from '../../components/profile/ProfileSectionLayout';
import { useTranslation } from 'react-i18next';
import SectionTextWhite from '../../components/common/SectionTextWhite';

export default function ChatbotHistoryPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [sessions, setSessions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const loadHistory = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const { data, error } = await getConversationSessionsByUserId(user.id);
        if (error) throw error;
        setSessions(data ?? []);
      } catch (err) {
        console.error('Failed to fetch chat history:', err);
        setError(t('chatbotHistory.error'));
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, [user?.id, t]);

  const renderContent = () => {
    if (loading) return <p className="text-center text-gray-500">{t('chatbotHistory.loading')}</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (sessions.length === 0) return <p className="text-center text-gray-500">{t('chatbotHistory.empty')}</p>;
    return sessions.map((s) => <ConversationHistoryCard key={s.session_id} session={s} />);
  };

  return (
    <div className="bg-[#002147]  h-full">
      <ProfileSectionLayout>
        <SectionTextWhite title={t('chatbotHistory.title')} /> {/* ← was "Chatbot History" */}
        <div className="space-y-4">{renderContent()}</div>
      </ProfileSectionLayout>
    </div>
  );
}
