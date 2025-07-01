// src/services/pitchDeckServices.jsx

import { supabase } from '../lib/supabaseClient';

/**
 * Fetches all pitch deck requests for a user from the database.
 * 
 * @param {string} userId - The ID of the user whose pitch deck requests we want to fetch.
 * @returns {Promise<{data: any[] | null, error: any | null}>}
 */
export const getPitchDeckRequestsByUserId = async (userId) => {
    const { data, error } = await supabase
        .from('pitch_deck_requests')
        .select('*')
        .eq('user_id', userId)
        .order('submitted_at', { ascending: false });

    return { data, error };
};