// src/pages/MyConsultationsPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAppointmentsByUserId } from '../services/appointmentService';
import { isSameDay, parseISO, format } from 'date-fns';

// --- COMPONENT IMPORTS ---
import SectionTextBlack from '../components/common/SectionTextBlack';
import ProfileSectionLayout from '../components/profile/ProfileSectionLayout';
import ConsultationCalendar from '../components/calendar/AppointmentCalendar';
import ConsultationList from '../components/calendar/ConsultationList';
import Button from '../components/common/Button';

/**
 * Displays a user's scheduled consultations with a top-down calendar and list view.
 * This page is linked from the main navigation bar.
 */
export default function MyConsultationsPage() {
    // --- STATE MANAGEMENT ---
    const { user } = useAuth();
    const [allAppointments, setAllAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    // --- DATA FETCHING (Unchanged) ---
    useEffect(() => {
        const loadAppointments = async () => {
            if (!user) return;
            setLoading(true);
            try {
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
    const highlightedDates = useMemo(() => {
        return allAppointments.map(app => parseISO(app.appointment_date));
    }, [allAppointments]);

    const filteredAppointments = useMemo(() => {
        if (!selectedDate) return allAppointments;
        return allAppointments.filter(app => isSameDay(parseISO(app.appointment_date), selectedDate));
    }, [allAppointments, selectedDate]);

    const listTitle = useMemo(() => {
        if (selectedDate) return `Appointments for ${format(selectedDate, 'PPP')}`;
        return 'All Appointments';
    }, [selectedDate, allAppointments]);

    // --- RENDER LOGIC ---
    return (
        <ProfileSectionLayout>
            <SectionTextBlack title="My Consultations">
                View and manage your scheduled appointments.
            </SectionTextBlack>
            {loading && <p className="text-center text-gray-500">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {/* This content is rendered once loading is complete.
        The layout is now a single-column flex container with spacing between elements.
      */}
            {!loading && !error && (
                <div className="flex flex-col space-y-6">

                    {/* 1. The Calendar is now always visible at the top */}
                    <ConsultationCalendar
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                        highlightedDates={highlightedDates}
                    />

                    {/* The "Show All" button appears only when a date is selected */}
                    {selectedDate && (
                        <Button
                            onClick={() => setSelectedDate(null)}
                            className="w-full bg-gray-700 text-white hover:bg-gray-800"
                        >
                            Show All Appointments
                        </Button>
                    )}

                    {/* 2. The List of consultations is always visible below the calendar */}
                    <ConsultationList
                        appointments={filteredAppointments}
                        title={listTitle}
                    />

                </div>
            )}
        </ProfileSectionLayout>
    );
}