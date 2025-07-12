// src/pages/CalendarPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAppointmentsByUserId } from '../services/appointmentService';
import { isSameDay, parseISO, format } from 'date-fns';
import { useTranslation } from 'react-i18next'; // 1. Import hook

// --- COMPONENT IMPORTS ---
import SectionTextWhite from '../components/common/SectionTextWhite';
import ProfileSectionLayout from '../components/profile/ProfileSectionLayout';
import AppointmentCalendar from '../components/calendar/AppointmentCalendar';
import ConsultationList from '../components/calendar/ConsultationList';
import Button from '../components/common/Button';

export default function CalendarPage() {
    const { t } = useTranslation(); // 2. Initialize hook
    const { user } = useAuth();
    const [allAppointments, setAllAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        const loadAppointments = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const { data, error: fetchError } = await getAppointmentsByUserId(user.id);
                if (fetchError) throw fetchError;
                setAllAppointments(data || []);
            } catch (err) {
                // 3. Use translated error message
                setError(t('calendar.error'));
            } finally {
                setLoading(false);
            }
        };
        loadAppointments();
    }, [user, t]); // Add 't' to dependency array

    const filteredAppointments = useMemo(() => {
        if (!selectedDate) return allAppointments;
        return allAppointments.filter(app => isSameDay(parseISO(app.appointment_date), selectedDate));
    }, [allAppointments, selectedDate]);

    // 4. Use translated titles, with interpolation for the date
    const listTitle = useMemo(() => {
        if (selectedDate) return t('calendar.listTitleForDate', { date: format(selectedDate, 'PPP') });
        return t('calendar.listTitleAll');
    }, [selectedDate, t]);

    return (
        <div className="bg-gradient-to-b from-[#002147] to-[#ECEBE5] min-h-screen">
            <ProfileSectionLayout>
                {/* 5. Use translated title and subtitle */}
                <SectionTextWhite title={t('calendar.pageTitle')}>
                    {t('calendar.pageSubtitle')}
                </SectionTextWhite>
                {loading && <p className="text-center text-gray-500">{t('calendar.loading')}</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {!loading && !error && (
                    <div className="flex flex-col space-y-6">
                        <AppointmentCalendar
                            appointments={allAppointments}
                            selectedDate={selectedDate}
                            onDateSelect={setSelectedDate}
                        />

                        {selectedDate && (
                            <Button
                                onClick={() => setSelectedDate(null)}
                                className="self-center"
                            >
                                {/* 6. Use translated button text */}
                                {t('calendar.showAllButton')}
                            </Button>
                        )}

                        <ConsultationList
                            appointments={filteredAppointments}
                            title={listTitle}
                        />
                    </div>
                )}
            </ProfileSectionLayout>
        </div>
    );
}