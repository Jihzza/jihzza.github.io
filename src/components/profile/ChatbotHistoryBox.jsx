// src/components/profile/ChatbotHistoryBox.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChatBubbleLeftRightIcon, ClockIcon } from '@heroicons/react/24/outline';
import ProfileDashboardBox from './ProfileDashboardBox';

/**
 * Chatbot History section box showing recent conversations
 */
const ChatbotHistoryBox = ({ 
  conversations = [], 
  to = '/profile/chatbot-history',
  maxDisplay = 2 
}) => {
  const { t } = useTranslation();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleTimeString('pt-PT', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const displayedConversations = conversations.slice(0, maxDisplay);
  const hasMore = conversations.length > maxDisplay;

  return (
    <ProfileDashboardBox 
      title="Chatbot History" 
      to={to}
      className="bg-white/10"
    >
      <div className="space-y-2">
        {displayedConversations.length > 0 ? (
          displayedConversations.map((conversation, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="flex items-center space-x-3">
                <ChatBubbleLeftRightIcon className="h-4 w-4 text-white/80" />
                <div>
                  <span className="text-sm font-medium text-white/90 block">
                    Conversation from {formatDate(conversation.created_at || conversation.date)}
                  </span>
                  <div className="flex items-center space-x-2 mt-1">
                    <ClockIcon className="h-3 w-3 text-white/60" />
                    <span className="text-xs text-white/70">
                      {formatTime(conversation.created_at || conversation.date)}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-white/60">
                {conversation.messageCount || 0} messages
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-white/40 mx-auto mb-2" />
            <p className="text-sm text-white/70">No conversations yet</p>
          </div>
        )}
        
        {hasMore && (
          <div className="text-center pt-2">
            <span className="text-xs text-white/60">
              +{conversations.length - maxDisplay} more conversations
            </span>
          </div>
        )}
      </div>
    </ProfileDashboardBox>
  );
};

export default ChatbotHistoryBox;
