// src/components/messages/ConversationList.jsx
import React from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

export default function ConversationList({ conversations, onSelect }) {
    if (!conversations || conversations.length === 0) {
        return (
            <div className="p-8 text-center text-gray-400 bg-[#002147] rounded-lg">
                <h3 className="text-lg font-semibold text-black">No conversations yet.</h3>
                <p className="mt-1">Use the search bar above to find someone and start chatting.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {conversations.map((conv) => (
                <div
                    key={conv.conversation_id}
                    onClick={() => onSelect(conv)}
                    className="flex items-center justify-between p-4 border-b-2 border-[#002147] cursor-pointer hover:bg-gray-700 transition-colors"
                >
                    <div className="flex items-center space-x-4">
                        <img 
                            src={conv.profiles.avatar_url || `https://i.pravatar.cc/150?u=${conv.profiles.id}`} 
                            alt={conv.profiles.username} 
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                            <p className="font-bold text-black">{conv.profiles.username}</p>
                            <p className="text-sm text-gray-400">{conv.profiles.full_name}</p>
                        </div>
                    </div>
                    <ChevronRightIcon className="h-6 w-6 text-gray-500" />
                </div>
            ))}
        </div>
    );
}