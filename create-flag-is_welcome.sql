-- Add is_welcome flag to chatbot_conversations table to mark welcome messages
ALTER TABLE chatbot_conversations
ADD COLUMN IF NOT EXISTS is_welcome boolean DEFAULT false;

-- Helpful index for quick checks
CREATE INDEX IF NOT EXISTS idx_chatbot_conv_session_welcome
ON chatbot_conversations(session_id, is_welcome);

-- Optional: Backfill existing data by marking the earliest assistant message
-- per session as welcome if no explicit flag exists.
-- NOTE: Run carefully in production; review before executing.
-- WITH first_msgs AS (
--   SELECT DISTINCT ON (session_id) id
--   FROM chatbot_conversations
--   WHERE role = 'assistant'
--   ORDER BY session_id, created_at ASC
-- )
-- UPDATE chatbot_conversations c
-- SET is_welcome = TRUE
-- FROM first_msgs f
-- WHERE c.id = f.id AND c.is_welcome IS FALSE;


