// src/components/chatbot/ConversationHistoryCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { ChatBubbleLeftRightIcon, CalendarDaysIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

/**
 * Displays a summary of a single past chatbot conversation.
 * It's designed to be a link to a more detailed conversation view.
 *
 * @param {object} conversation - The conversation session object.
 */
const ConversationHistoryCard = ({ conversation }) => {
    const formattedDate = new Date(conversation.created_at).toLocaleString(undefined, {
        dateStyle: 'long',
        timeStyle: 'short',
    });

    // Use the AI summary, or create a default title if none exists.
    const title = conversation.summary || `Conversation from ${formattedDate}`;

    return (
        <Link
            to={`/messages/${conversation.id}`}
            className="block bg-white hover:bg-gray-50 transition-colors duration-200 shadow-md rounded-lg p-4"
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-500 mr-4" />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                            <CalendarDaysIcon className="h-4 w-4 mr-1.5" />
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