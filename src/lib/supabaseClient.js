import { createClient } from '@supabase/supabase-js';

// !! IMPORTANT: Store these in environment variables in a real project
const supabaseUrl = 'https://ijyjsffnshuooneqxvqm.supabase.co'; // Replace with your URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqeWpzZmZuc2h1b29uZXF4dnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NTEyMzEsImV4cCI6MjA2MDMyNzIzMX0.iElDvuaQvEo8Gm59nClkUWaj31XMxyCjw26S0fHb99k'; // Replace with your Key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);