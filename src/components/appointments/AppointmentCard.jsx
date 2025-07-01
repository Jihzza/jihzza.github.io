// src/pages/profile/AppointmentsPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAppointmentsByUserId } from '../../services/appointmentService';
import AppointmentCard from '../../components/appointments/AppointmentCard';
// 1. Import our new layout component.
import ProfileSectionLayout from '../../components/profile/ProfileSectionLayout';

export default function AppointmentsPage() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Data fetching logic remains unchanged.
    useEffect(() => {
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

    // The content rendering logic is now cleaner, as it doesn't worry about layout.
    const renderContent = () => {
        if (loading) return <p className="text-center text-gray-500">Loading your appointments...</p>;
        if (error) return <p className="text-center text-red-500">{error}</p>;
        if (appointments.length === 0) return <p className="text-center text-gray-500">You have no scheduled appointments.</p>;
        return appointments.map(app => <AppointmentCard key={app.id} appointment={app} />);
    };

    // 2. Wrap everything in the ProfileSectionLayout.
    // Notice we pass the title as a prop. The layout handles rendering it.
    // The `h1` and the main `div` have been removed from this file.
    return (
        <ProfileSectionLayout title="My Appointments">
            <div className="space-y-4">
                {renderContent()}
            </div>
        </ProfileSectionLayout>
    );
}