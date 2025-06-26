// src/components/messages/ConversationList.jsx
import React from 'react';

export default function ConversationList({ conversations, onSelect, selectedConversationId }) {
    if (!conversations.length) {
        return <div className="p-4 text-center text-gray-500">No conversations yet.</div>;
    }

    return (
        <ul>
            {conversations.map((conv) => (
                <li
                    key={conv.conversation_id}
                    onClick={() => onSelect(conv)}
                    className={`p-4 cursor-pointer border-b border-gray-200 hover:bg-gray-50 ${
                        selectedConversationId === conv.conversation_id ? 'bg-indigo-50' : ''
                    }`}
                >
                    <div className="font-semibold">{conv.profiles.username}</div>
                    <div className="text-sm text-gray-600 truncate">{conv.profiles.full_name}</div>
                </li>
            ))}
        </ul>
    );
}