// src/components/messages/ConversationHeader.jsx

import React from 'react';
import BackButton from '../common/BackButton';

/**
 * A presentational component for the header of a conversation window
 * It displays a back button and the conversation partner's avatar and name
 * @param {object} props
 */
export default function ConversationHeader({ partner }) {
    if (!partner) return null;

    return (
       <header className="p-4 flex items-center space-x-4 flex-shrink-0 border-b border-[#333333.] text-white">
        <BackButton />
        <div className="flex items-center space-x-3">
            <img 
                src={partner.avatar_url || `https://i.pravatar.cc/150?u=${partner.user_id}`} 
                alt={partner.username}
                className="w-10 h-10 rounded-full object-cover"
            />
            <div>
                <h1 className="text-lg font-bold text-white">{partner.username}</h1>
                {partner.full_name && <p className="text-sm text-gray-400">{partner.full_name}</p>}
            </div>
        </div>
       </header> 
    );
}