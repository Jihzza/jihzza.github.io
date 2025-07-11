// src/pages/CalendarPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAppointmentsByUserId } from '../services/appointmentService';
import { isSameDay, parseISO, format } from 'date-fns';

// --- COMPONENT IMPORTS ---
import SectionTextBlack from '../components/common/SectionTextBlack';
import ProfileSectionLayout from '../components/profile/ProfileSectionLayout';
// --- CHANGE: Import the new AppointmentCalendar ---
import AppointmentCalendar from '../components/calendar/AppointmentCalendar';
import ConsultationList from '../components/calendar/ConsultationList';
import Button from '../components/common/Button';

/**
 * Displays a user's scheduled consultations with a top-down calendar and list view.
 */
export default function CalendarPage() {
    // --- STATE MANAGEMENT ---
    const { user } = useAuth();
    const [allAppointments, setAllAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    // --- DATA FETCHING (Remains here as the source of truth) ---
    useEffect(() => {
        const loadAppointments = async () => {
            if (!user) return;
            setLoading(true);
            try {
                // Fetch all appointments for the user.
                const { data, error: fetchError } = await getAppointmentsByUserId(user.id);
                if (fetchError) throw fetchError;
                setAllAppointments(data || []);
            } catch (err) {
                setError("We couldn't load your appointments.");
            } finally {
                setLoading(false);
            }
        };
        loadAppointments();
    }, [user]);

    // --- DERIVED STATE & MEMOIZATION ---
    const filteredAppointments = useMemo(() => {
        if (!selectedDate) return allAppointments;
        // The date parsing is now done here before comparison.
        return allAppointments.filter(app => isSameDay(parseISO(app.appointment_date), selectedDate));
    }, [allAppointments, selectedDate]);

    const listTitle = useMemo(() => {
        if (selectedDate) return `Appointments for ${format(selectedDate, 'PPP')}`;
        return 'All Appointments';
    }, [selectedDate]);

    // --- RENDER LOGIC ---
    return (
        <ProfileSectionLayout>
            <SectionTextBlack title="My Consultations">
                View and manage your scheduled appointments.
            </SectionTextBlack>
            {loading && <p className="text-center text-gray-500">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && (
                <div className="flex flex-col space-y-6">

                    {/* --- CHANGE: Use the new AppointmentCalendar component --- */}
                    <AppointmentCalendar
                        appointments={allAppointments}
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                    />

                    {selectedDate && (
                        <Button
                            onClick={() => setSelectedDate(null)}
                            className="w-full bg-gray-700 text-white hover:bg-gray-800"
                        >
                            Show All Appointments
                        </Button>
                    )}
                    
                    <ConsultationList
                        appointments={filteredAppointments}
                        title={listTitle}
                    />

                </div>
            )}
        </ProfileSectionLayout>
    );
}