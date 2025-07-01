// src/services/appointmentService.js

import { supabase } from '../lib/supabaseClient';

/**
 * Fetches all appointments for a specific user.
 * This function encapsulates the database query, separating data access logic
 * from the UI components. This is a core principle of good architecture.
 *
 * @param {string} userId - The UUID of the user whose appointments are being requested.
 * @returns {Promise<{data: any[] | null, error: any | null}>} An object containing the fetched data or an error.
 */
export const getAppointmentsByUserId = async (userId) => {
    // We select all columns from the 'appointments' table.
    // We filter the rows where the 'user_id' column matches the provided userId.
    // We order the results by the appointment_date in descending order (newest first).
    const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', userId)
        .order('appointment_date', { ascending: false });

    // Log errors to the console for easier debugging during development.
    if (error) {
        console.error('Error fetching appointments:', error.message);
    }

    // Return the data and error to the calling component for state management.
    return { data, error };
};