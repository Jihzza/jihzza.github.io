// src/pages/SubscriptionsPage.jsx

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getSubscriptionsByUserId } from '../services/subscriptionService';
import SubscriptionCard from '../components/subscriptions/SubscriptionCard';
import { Link } from 'react-router-dom';
import ProfileSectionLayout from '../components/profile/ProfileSectionLayout'; // Ensure this is imported

export default function SubscriptionsPage() {
    const { user } = useAuth();
    const [subscriptions, setSubscriptions] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const loadSubscriptions = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const { data, error: fetchError } = await getSubscriptionsByUserId(user.id);
                if (fetchError) throw fetchError;
                setSubscriptions(data || []);
            } catch (err) {
                console.error("Failed to fetch subscriptions:", err);
                setError("We couldn't load your subscriptions. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        loadSubscriptions();
    }, [user]);

    const renderContent = () => {
        if (loading) return <p className="text-center text-gray-500">Loading your subscriptions...</p>;
        if (error) return <p className="text-center text-red-500">{error}</p>;
        if (subscriptions.length === 0) {
            return (
                <div className="text-center bg-gray-50 p-8 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-800">No Subscriptions Found</h3>
                    <p className="mt-2 text-gray-600">You do not have any active subscriptions yet.</p>
                    <Link 
                        to="/scheduling"
                        className="mt-4 inline-block bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition-colors"
                    >
                        Explore Plans
                    </Link>
                </div>
            );
        }
        return subscriptions.map(sub => <SubscriptionCard key={sub.id} subscription={sub} />);
    };
    
    return (
        <ProfileSectionLayout title="My Subscriptions">
            <div className="space-y-6">
                {renderContent()}
            </div>
        </ProfileSectionLayout>
    );
}