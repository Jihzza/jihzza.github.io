// src/pages/profile/AppointmentsPage.jsx

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAppointmentsByUserId } from '../../services/appointmentService';
import AppointmentCard from '../../components/appointments/AppointmentCard';
import ProfileSectionLayout from '../../components/profile/ProfileSectionLayout';
import { useTranslation } from 'react-i18next'; // 1. Import hook

export default function AppointmentsPage() {
    const { t } = useTranslation(); // 2. Initialize hook
    const { user } = useAuth();
    const [appointments, setAppointments] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const loadAppointments = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const { data, error: fetchError } = await getAppointmentsByUserId(user.id);
                if (fetchError) throw fetchError;
                setAppointments(data || []);
            } catch (err) {
                console.error("Failed to fetch appointments:", err);
                // 3. Use translated error message
                setError(t('appointments.error'));
            } finally {
                setLoading(false);
            }
        };
        loadAppointments();
    }, [user, t]); // Add t to dependency array

    const renderContent = () => {
        // 4. Use translated status messages
        if (loading) return <p className="text-center text-gray-500">{t('appointments.loading')}</p>;
        if (error) return <p className="text-center text-red-500">{error}</p>;
        if (appointments.length === 0) return <p className="text-center text-gray-500">{t('appointments.empty')}</p>;
        return appointments.map(app => <AppointmentCard key={app.id} appointment={app} />);
    };

    return (
        // 5. Use translated title
        <ProfileSectionLayout title={t('appointments.title')}>
            <div className="space-y-4">
                {renderContent()}
            </div>
        </ProfileSectionLayout>
    );
}