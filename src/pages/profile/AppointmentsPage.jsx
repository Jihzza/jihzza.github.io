// src/pages/profile/AppointmentsPage.jsx

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAppointmentsByUserId } from '../../services/appointmentService';
import AppointmentCard from '../../components/appointments/AppointmentCard';
import ProfileSectionLayout from '../../components/profile/ProfileSectionLayout'; // Ensure this is imported

export default function AppointmentsPage() {
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
                setError("We couldn't load your appointments. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        loadAppointments();
    }, [user]);

    const renderContent = () => {
        if (loading) return <p className="text-center text-gray-500">Loading your appointments...</p>;
        if (error) return <p className="text-center text-red-500">{error}</p>;
        if (appointments.length === 0) return <p className="text-center text-gray-500">You have no scheduled appointments.</p>;
        return appointments.map(app => <AppointmentCard key={app.id} appointment={app} />);
    };

    return (
        <ProfileSectionLayout title="My Appointments">
            <div className="space-y-4">
                {renderContent()}
            </div>
        </ProfileSectionLayout>
    );
}