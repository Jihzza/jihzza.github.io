// src/components/messages/UserSearch.jsx
import React, { useState } from 'react';
import { searchUsers } from '../../services/messagesService';
import { useAuth } from '../../contexts/AuthContext';

export default function UserSearch({ onUserSelect }) {
    const { user, loading: authLoading } = useAuth();
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
        const { data } = await searchUsers(currentQuery, user.id);
        setResults(data || []);
        setLoading(false);
    };

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
                placeholder="Search to start a new chat..."
                className="w-full p-3 bg-[#002147] border-2 border-gray-600 rounded-lg text-white placeholder-gray-400"
                disabled={authLoading || loading}
            />
            {results.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-[#002147] border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {results.map((u) => (
                        <li
                            key={u.id}
                            onClick={() => handleSelectUser(u)}
                            className="p-3 flex items-center space-x-4 hover:bg-gray-700 cursor-pointer"
                        >
                            <img src={u.avatar_url || `https://i.pravatar.cc/150?u=${u.id}`} alt={u.username} className="w-10 h-10 rounded-full" />
                            <div>
                                <p className="font-semibold text-white">{u.username}</p>
                                <p className="text-sm text-gray-400">{u.full_name}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}