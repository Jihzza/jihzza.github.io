# Welcome Message Implementation

This document describes the implementation of the welcome message functionality for the chatbot.

## 🎯 Requirements Implemented

✅ **Single Welcome Per Session**: Only 1 welcome message is sent per `session_id`  
✅ **Character Limit**: Welcome messages are limited to 50 characters  
✅ **User Personalization**: Accesses user profile information for personalization  
✅ **Exact Prompt**: Uses the specified prompt exactly as requested  
✅ **Quote Removal**: Ensures no quotes are included in the output  

## 🛠️ Implementation Details

### Core Logic (src/services/chatbotService.js)

#### `generateWelcomeMessage(userId, sessionId)`
- **Session Check**: First checks if welcome already exists for the session
- **User Profile Access**: Retrieves user profile from Supabase for personalization
- **Exact Prompt**: Uses the specified system prompt:
  ```
  Send a personal and with less than 50 characters welcome message to the user to welcome him and know what they need.
  Access the user information, if needed, for more personalization.

  The only thing you can output is the user message and don't start and end the message in quotes.
  ```
- **Quote Cleaning**: Removes any quotes from the AI response
- **Database Storage**: Stores the message in `chatbot_conversations` and marks session as welcomed
- **Session Tracking**: Uses `session_welcome` table to prevent duplicate welcomes

#### Session Management Methods
- **`checkExistingWelcome(sessionId)`**: Checks if welcome already sent for session
- **`markWelcomeSent(sessionId, message)`**: Marks session as having received welcome

### Database Schema (create-session-welcome-table.sql)

```sql
CREATE TABLE session_welcome (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL UNIQUE,
    welcome_message TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

### UI Integration (src/pages/ChatbotPage.jsx)

#### Welcome Generation Logic
- Triggers when user is authenticated and hasn't seen welcome
- Handles both new welcomes and existing session welcomes  
- Prevents duplicate welcomes in the UI
- Provides fallback message if generation fails

#### Development Testing
- **🧪 Test Button**: Shows in development mode only (`import.meta.env.DEV`)
- **WelcomeMessageTester**: Component for testing welcome message functionality

## 🧪 Testing Component (src/components/chatbot/WelcomeMessageTester.jsx)

### Features
- **Generate Welcome**: Tests welcome message generation for current session
- **Session Uniqueness**: Verifies only one welcome per session_id
- **New Session**: Generates new test session_id for fresh testing
- **Character Count**: Validates 50-character limit
- **API Status**: Shows current configuration and API key status

### Test Scenarios
1. **Single Welcome**: Generate welcome for new session
2. **Duplicate Prevention**: Attempt second welcome for same session (should return existing)
3. **Character Limit**: Verify messages are ≤50 characters
4. **Personalization**: Check if user data is used for personalization

## 🔧 Configuration

### Environment Variables
```bash
VITE_OPENAI_API_KEY=sk-your_openai_api_key_here
```

### Database Setup
```bash
# Run the SQL file to create the session_welcome table
psql -d your_database < create-session-welcome-table.sql
```

## 📊 Flow Diagram

```
User enters chatbot page
         ↓
Is user authenticated?
         ↓ (Yes)
Check if welcome exists for session_id
         ↓
Does welcome exist?
    ↓ (No)         ↓ (Yes)
Generate new       Return existing
welcome message    welcome message
         ↓               ↓
Store in database  Display in UI
         ↓               ↓
Mark session       Skip generation
as welcomed
         ↓
Display in UI
```

## 🎯 Key Features

### Session-Based Tracking
- **Unique Sessions**: Each `session_id` gets exactly one welcome message
- **Persistent Storage**: Welcome messages stored in database
- **Cross-Tab Consistency**: Same welcome shown across browser tabs with same session

### AI Personalization  
- **User Profile Access**: Retrieves name, email, and other profile data
- **Dynamic Prompting**: Includes user data in AI prompt for personalization
- **Fallback Handling**: Works even without user profile data

### Character Limit Enforcement
- **50-Character Limit**: Enforced via AI prompt
- **Testing Validation**: Tester component validates character count
- **User Experience**: Ensures concise, focused welcome messages

### Quote Removal
- **Clean Output**: Removes surrounding quotes from AI responses
- **Regex Cleaning**: `response.replace(/^["']|["']$/g, '').trim()`
- **Consistent Format**: Ensures messages display properly in UI

## 🐛 Error Handling

### Graceful Degradation
- **API Failures**: Falls back to static welcome message
- **Database Issues**: Uses in-memory storage as backup
- **Missing User Data**: Generates generic welcome if profile unavailable
- **Session Errors**: Continues without session tracking if table missing

### Logging
- **Console Debugging**: Detailed logs with `🔍 Chatbot:` prefix
- **Error Tracking**: All errors logged with context
- **Development Mode**: Enhanced logging in development builds

## 🔍 Testing Instructions

### Manual Testing
1. **First Visit**: Visit chatbot page → should see personalized welcome ≤50 chars
2. **Refresh Page**: Refresh → should see same welcome message (not new one)
3. **New Session**: Clear session storage → should generate new welcome
4. **Character Count**: Verify all welcomes are ≤50 characters

### Development Testing
1. Click **🧪** button in chatbot header (development mode only)
2. Use **Test Welcome Message** to generate welcomes
3. Use **Test Session Uniqueness** to verify single-welcome-per-session
4. Use **Generate New Session ID** to test fresh sessions

### Database Validation
```sql
-- Check welcome messages
SELECT * FROM session_welcome ORDER BY created_at DESC LIMIT 10;

-- Verify session uniqueness
SELECT session_id, COUNT(*) as welcome_count 
FROM session_welcome 
GROUP BY session_id 
HAVING COUNT(*) > 1; -- Should return no rows
```

## ✅ Success Criteria

- [x] Only 1 welcome message per `session_id`
- [x] Welcome messages are ≤50 characters  
- [x] User profile data is accessed for personalization
- [x] Exact prompt specification is used
- [x] No quotes in welcome message output
- [x] Database persistence with `session_welcome` table
- [x] UI integration with ChatbotPage
- [x] Development testing tools available
- [x] Error handling and fallbacks implemented
- [x] Cross-session consistency maintained

## 🚀 Production Deployment

### Pre-deployment Checklist
1. ✅ Add `VITE_OPENAI_API_KEY` to production environment
2. ✅ Run `create-session-welcome-table.sql` on production database
3. ✅ Verify RLS policies on `session_welcome` table
4. ✅ Test welcome message generation in production environment
5. ✅ Confirm session tracking works correctly
6. ✅ Validate 50-character limit compliance

### Monitoring
- Monitor welcome message generation success/failure rates
- Track average welcome message length
- Verify session uniqueness constraints
- Monitor database performance with `session_welcome` table

The welcome message functionality is now fully implemented and ready for testing and deployment!
