// src/pages/profile/PitchDeckRequestsPage.jsx


import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getPitchDeckRequestsByUserId } from '../../services/pitchDeckServices';
import PitchDeckRequestCard from '../../components/pitchdeck/PitchDeckRequestCard';
import ProfileSectionLayout from '../../components/profile/ProfileSectionLayout';
import { useTranslation } from 'react-i18next';
import SectionTextWhite from '../../components/common/SectionTextWhite';


export default function PitchDeckRequestsPage() {
const { t } = useTranslation();
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
console.error('Failed to fetch pitch deck requests:', err);
setError(t('pitchDeckRequests.error'));
} finally {
setLoading(false);
}
};
loadRequests();
}, [user, t]);


const renderContent = () => {
if (loading) return <p className="text-center text-gray-500">{t('pitchDeckRequests.loading')}</p>;
if (error) return <p className="text-center text-red-500">{error}</p>;
if (requests.length === 0)
return <p className="text-center text-gray-500">{t('pitchDeckRequests.empty')}</p>;


return requests.map((req) => <PitchDeckRequestCard key={req.id} request={req} />);
};


return (
<div className="bg-gradient-to-b from-[#002147] to-[#ECEBE5] h-full">
<ProfileSectionLayout>
<SectionTextWhite title="Pitch Deck Requests" />
<div className="space-y-4">{renderContent()}</div>
</ProfileSectionLayout>
</div>
);
}