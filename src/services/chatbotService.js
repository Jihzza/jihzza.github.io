// src/services/chatbotService.js

import { supabase } from '../lib/supabaseClient';

/**
 * Fetches the conversation history (list of sessions) for a specific user.
 *
 * @param {string} userId - The UUID of the user.
 * @returns {Promise<{ data: any[] | null, error: any | null }>}
 */
export const getConversationHistoryByUserId = async (userId) => {
    const { data, error } = await supabase
        .from('chatbot_conversations')
        .select('id, created_at, summary') // Select only the fields needed for the list view
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    return { data, error };
};