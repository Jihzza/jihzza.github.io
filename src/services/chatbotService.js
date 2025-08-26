// src/services/chatbotService.js
import { supabase } from '../lib/supabaseClient';

/** Sessions list (one row per session) for a user */
export const getConversationSessionsByUserId = async (userId) => {
  const { data, error } = await supabase
    .from('chatbot_sessions')
    .select('session_id, last_message_at, first_message, last_message')
    .eq('user_id', userId)
    .order('last_message_at', { ascending: false });

  return { data, error };
};

/** Full message list for a given session (chronological) */
export const getMessagesBySession = async (userId, sessionId) => {
  const { data, error } = await supabase
    .from('chatbot_conversations')
    .select('id, created_at, content, role')
    .eq('user_id', userId)
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  return { data, error };
};
