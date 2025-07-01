// src/pages/SubscriptionsPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getSubscriptionsByUserId } from '../../services/subscriptionService';
import SubscriptionCard from '../../components/subscriptions/SubscriptionCard';
import { Link } from 'react-router-dom';
// 1. Import our new layout component.
import ProfileSectionLayout from '../../components/profile/ProfileSectionLayout';

export default function SubscriptionsPage() {
    const { user } = useAuth();
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Data fetching logic remains unchanged.
    useEffect(() => {
        // ... (same as before)
    }, [user]);

    // The content rendering logic is now cleaner.
    const renderContent = () => {
        if (loading) return <p className="text-center text-gray-500">Loading your subscriptions...</p>;
        if (error) return <p className="text-center text-red-500">{error}</p>;
        if (subscriptions.length === 0) {
            // ... (same JSX for no subscriptions)
        }
        return subscriptions.map(sub => <SubscriptionCard key={sub.id} subscription={sub} />);
    };
    
    // 2. Wrap everything in the ProfileSectionLayout.
    return (
        <ProfileSectionLayout title="My Subscriptions">
            <div className="space-y-6">
                {renderContent()}
            </div>
        </ProfileSectionLayout>
    );
}