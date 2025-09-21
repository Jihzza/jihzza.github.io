-- Create session_welcome table to track welcome messages per session
-- This ensures only one welcome message is sent per session_id

CREATE TABLE IF NOT EXISTS session_welcome (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL UNIQUE,
    welcome_message TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on session_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_session_welcome_session_id ON session_welcome(session_id);

-- Add RLS (Row Level Security) policy if needed
ALTER TABLE session_welcome ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert and read their own session data
-- Note: You may need to adjust this policy based on your user authentication setup
CREATE POLICY IF NOT EXISTS "Allow authenticated users to manage session welcome" 
ON session_welcome 
FOR ALL 
USING (true);

-- Grant permissions to the service role (for server-side operations)
-- GRANT ALL ON session_welcome TO service_role;

-- Comments for documentation
COMMENT ON TABLE session_welcome IS 'Tracks welcome messages sent per chat session to ensure only one welcome message per session';
COMMENT ON COLUMN session_welcome.session_id IS 'Unique identifier for the chat session (matches chatbot_conversations.session_id)';
COMMENT ON COLUMN session_welcome.welcome_message IS 'The actual welcome message that was sent to the user';
COMMENT ON COLUMN session_welcome.sent_at IS 'Timestamp when the welcome message was sent';
