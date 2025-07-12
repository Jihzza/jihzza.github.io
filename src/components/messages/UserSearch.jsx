// src/components/messages/UserSearch.jsx
import React, { useState } from 'react';
import { searchUsers } from '../../services/messagesService';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function UserSearch({ onUserSelect }) {
    const { t } = useTranslation();
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
                placeholder={t('directMessages.userSearch.placeholder')}
                className="w-full p-3 bg-gray-100 border-2 border-gray-300 rounded-lg text-black placeholder-gray-500"
                disabled={authLoading || loading}
            />
            {results.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {results.map((u) => (
                        <li
                            key={u.id}
                            onClick={() => handleSelectUser(u)}
                            className="p-3 flex items-center space-x-4 hover:bg-gray-100 cursor-pointer"
                        >
                            <img src={u.avatar_url || `https://i.pravatar.cc/150?u=${u.id}`} alt={u.username} className="w-10 h-10 rounded-full" />
                            <div>
                                <p className="font-semibold text-gray-800">{u.username}</p>
                                <p className="text-sm text-gray-500">{u.full_name}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}