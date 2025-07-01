// src/components/profile/ProfileHeader.jsx
import React from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

export default function ProfileHeader({
    avatarUrl = '',
    fullName,
    phone, // Added phone prop
    onEdit
}) {
    return (
        <div className="flex items-center p-4 space-x-4">
            <img
                src={avatarUrl}
                // Add an error handler to fall back to a placeholder if the image link is broken
                onError={(e) => { e.currentTarget.src = ''; }}
                alt={`${fullName || 'User'}'s avatar`}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
            />
            <div className="flex-grow">
                <h2 className="text-xl font-bold text-gray-900">{fullName || 'User'}</h2>
                {/* Display phone number if it exists */}
                {phone && <p className="text-sm text-gray-500">{phone}</p>}
            </div>
            <button
                onClick={onEdit}
                className="p-2 text-gray-600 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label="Edit profile"
            >
                <PencilSquareIcon className="h-6 w-6" />
            </button>
        </div>
    );
}