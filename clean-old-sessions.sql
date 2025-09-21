-- Clean up old chat sessions and welcome messages
-- This script removes sessions older than 30 days to keep the database clean

-- Remove old welcome messages (older than 30 days)
DELETE FROM session_welcome 
WHERE sent_at < NOW() - INTERVAL '30 days';

-- Remove old conversation messages (older than 30 days)
DELETE FROM chatbot_conversations 
WHERE created_at < NOW() - INTERVAL '30 days';

-- Remove old conversation descriptions (older than 30 days)
DELETE FROM conversation_description 
WHERE created_at < NOW() - INTERVAL '30 days';

-- Remove old message descriptions (older than 30 days)  
DELETE FROM message_description 
WHERE created_at < NOW() - INTERVAL '30 days';

-- Remove old questions and answers (older than 30 days)
DELETE FROM questions_answers 
WHERE created_at < NOW() - INTERVAL '30 days';

-- Remove old action plans (older than 30 days)
DELETE FROM action_plan 
WHERE created_at < NOW() - INTERVAL '30 days';

-- Show cleanup results
SELECT 
  'session_welcome' as table_name,
  COUNT(*) as remaining_records
FROM session_welcome
UNION ALL
SELECT 
  'chatbot_conversations' as table_name,
  COUNT(*) as remaining_records  
FROM chatbot_conversations
UNION ALL
SELECT 
  'conversation_description' as table_name,
  COUNT(*) as remaining_records
FROM conversation_description
UNION ALL
SELECT 
  'message_description' as table_name,
  COUNT(*) as remaining_records
FROM message_description
UNION ALL
SELECT 
  'questions_answers' as table_name,
  COUNT(*) as remaining_records
FROM questions_answers
UNION ALL
SELECT 
  'action_plan' as table_name, 
  COUNT(*) as remaining_records
FROM action_plan;

-- Analyze session_welcome table for statistics
SELECT 
  DATE(sent_at) as date,
  COUNT(*) as welcome_messages_sent
FROM session_welcome 
WHERE sent_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(sent_at)
ORDER BY date DESC;
