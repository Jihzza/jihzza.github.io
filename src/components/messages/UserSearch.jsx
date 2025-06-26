// src/components/messages/UserSearch.jsx
import React, { useState } from 'react';
import { searchUsers } from '../../services/messagesService';
import { useAuth } from '../../contexts/AuthContext';

// --- FIX: Simplify the component's responsibility ---
// It should only SEARCH for a user and report the SELECTION back to the parent.
// The prop is renamed from `onSelect` to `onUserSelect` to be more descriptive.
export default function UserSearch({ onUserSelect }) {
    const { user, loading: authLoading } = useAuth(); // Also get loading state here
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        const currentQuery = e.target.value;
        setQuery(currentQuery);

        if (currentQuery.length < 2) {
            setResults([]);
            return;
        }

        setLoading(true);
        // Your original search was fine, this remains the same.
        const { data } = await searchUsers(currentQuery, user.id);
        setResults(data || []);
        setLoading(false);
    };

    // This is now much simpler. It just calls the callback with the chosen user object.
    // The parent component (`MessagesPage`) will handle the logic for creating the conversation.
    const handleSelectUser = (selectedUser) => {
        setQuery('');
        setResults([]);
        onUserSelect(selectedUser);
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="Search for a user..."
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                // Disable the input if auth isn't ready or a search is in progress.
                disabled={authLoading || loading}
            />
            {results.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {results.map((u) => (
                        <li
                            key={u.id}
                            onClick={() => handleSelectUser(u)}
                            className="p-3 flex items-center space-x-3 hover:bg-indigo-50 cursor-pointer"
                        >
                            <div>
                                <p className="font-semibold">{u.username}</p>
                                <p className="text-sm text-gray-500">{u.full_name}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
