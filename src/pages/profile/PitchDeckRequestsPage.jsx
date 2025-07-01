// src/pages/profile/PitchDeckRequestsPage.jsx

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getPitchDeckRequestsByUserId } from '../../services/pitchDeckServices';
import PitchDeckRequestCard from '../../components/pitchdeck/PitchDeckRequestCard';
import ProfileSectionLayout from '../../components/profile/ProfileSectionLayout';
import { Link } from 'react-router-dom';

export default function PitchDeckRequestsPage() {
    const { user } = useAuth();
    const [requests, setRequests] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const loadRequests = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const { data, error: fetchError } = await getPitchDeckRequestsByUserId(user.id);
                if (fetchError) throw fetchError;
                setRequests(data || []);
            } catch (err) {
                console.error("Failed to fetch pitch deck requests:", err);
                setError("We couldn't load your requests. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        loadRequests();
    }, [user]);

    const renderContent = () => {
        if (loading) return <p className="text-center text-gray-500">Loading your requests...</p>;
        if (error) return <p className="text-center text-red-500">{error}</p>;
        if (requests.length === 0) {
            return (
                <div className="text-center bg-gray-50 p-8 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-800">No Requests Found</h3>
                    <p className="mt-2 text-gray-600">You haven't submitted a pitch deck for review yet.</p>
                    <Link 
                        to="/scheduling" // Link to your pitch deck submission form
                        className="mt-4 inline-block bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition-colors"
                    >
                        Submit a Pitch Deck
                    </Link>
                </div>
            );
        }
        return requests.map(req => <PitchDeckRequestCard key={req.id} request={req} />);
    };

    return (
        <ProfileSectionLayout title="My Pitch Deck Requests">
            <div className="space-y-6">
                {renderContent()}
            </div>
        </ProfileSectionLayout>
    );
}