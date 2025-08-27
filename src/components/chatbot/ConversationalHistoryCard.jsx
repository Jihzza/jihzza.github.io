// src/components/chatbot/ConversationHistoryCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ChatBubbleLeftRightIcon, CalendarDaysIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const ConversationHistoryCard = ({ session }) => {
  const date = new Date(session.last_message_at);
  const formattedDate = date.toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' });

  const title =
    session.last_message?.slice(0, 80) ||
    session.first_message?.slice(0, 80) ||
    `Conversation from ${formattedDate}`;

  return (
    <Link
      to={`/chat/${session.session_id}`} // ✅ route with session id
      className="block bg-white hover:bg-gray-50 transition-colors duration-200 shadow-md rounded-lg p-4"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-500 mr-4 md:h-10 md:w-10 lg:h-8 lg:w-8" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 md:text-xl lg:text-base">{title}</h3>
            <div className="flex items-center text-sm text-gray-500 mt-1 md:text-base lg:text-sm">
              <CalendarDaysIcon className="h-4 w-4 mr-1.5 md:h-6 md:w-6 lg:h-5 lg:w-5" />
              {formattedDate}
            </div>
          </div>
        </div>
        <ChevronRightIcon className="h-6 w-6 text-gray-400" />
      </div>
    </Link>
  );
};

export default ConversationHistoryCard;
