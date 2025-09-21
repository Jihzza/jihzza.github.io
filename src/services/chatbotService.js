// src/services/chatbotService.js
// OpenAI Chatbot Service - Direct integration replacing n8n workflow

import OpenAI from 'openai';

class ChatbotService {
  constructor() {
    this.openai = null;
    this.conversationHistory = new Map(); // Store conversation history by session
  }

  /**
   * Initialize OpenAI client
   */
  initializeOpenAI() {
    if (!this.openai) {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your environment variables.');
      }
      
      this.openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Required for client-side usage
      });
    }
    return this.openai;
  }

  /**
   * Get conversation history for a session
   */
  getConversationHistory(sessionId) {
    if (!this.conversationHistory.has(sessionId)) {
      this.conversationHistory.set(sessionId, []);
    }
    return this.conversationHistory.get(sessionId);
  }

  /**
   * Add message to conversation history
   */
  addToHistory(sessionId, role, content) {
    const history = this.getConversationHistory(sessionId);
    history.push({ role, content });
    
    // Keep only last 20 messages to avoid token limits
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }
  }

  /**
   * Generate system prompt with context about the business
   */
  getSystemPrompt() {
    return `You are an AI assistant for Daniel Dagalow, a business coach and entrepreneur. Your role is to help users with:

1. SERVICES OFFERED:
   - Business Coaching (Basic €40/month, Standard €90/month, Premium €230/month)
   - 1-on-1 Consultations (€90/hour, available in 45-120 minute slots)
   - Pitch Deck Services (for GalowClub and Perspectiv projects)

2. YOUR PERSONALITY:
   - Professional but friendly and approachable
   - Knowledgeable about business, entrepreneurship, and coaching
   - Helpful in guiding users to the right services
   - Concise but thorough in responses

3. IMPORTANT GUIDELINES:
   - If someone asks about scheduling appointments, subscriptions, or pitch decks, the system will handle these automatically
   - For general business questions, provide helpful advice
   - If asked about pricing, refer to the rates above
   - Keep responses under 150 words unless specifically asked for detailed information
   - Always be encouraging and supportive

4. CONTEXT:
   - Daniel Dagalow is an experienced business coach
   - He helps entrepreneurs and businesses grow
   - The platform offers both coaching subscriptions and one-time consultations
   - Users can also request pitch decks for specific projects

Remember: Be helpful, professional, and guide users toward the appropriate services when relevant.`;
  }

  /**
   * Send message to OpenAI and get response
   */
  async sendMessage(message, sessionId, userId = null) {
    try {
      this.initializeOpenAI();

      // Add user message to history
      this.addToHistory(sessionId, 'user', message);

      // Get conversation history
      const history = this.getConversationHistory(sessionId);

      // Build messages array for OpenAI
      const messages = [
        {
          role: 'system',
          content: this.getSystemPrompt()
        },
        ...history
      ];

      // Call OpenAI API
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // You can change this to gpt-4 if you prefer
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      const assistantResponse = completion.choices[0].message.content;

      // Add assistant response to history
      this.addToHistory(sessionId, 'assistant', assistantResponse);

      return {
        success: true,
        response: assistantResponse,
        tokensUsed: completion.usage?.total_tokens || 0
      };

    } catch (error) {
      console.error('ChatbotService: Error generating response:', error);
      
      // Handle specific OpenAI errors
      if (error.code === 'insufficient_quota') {
        return {
          success: false,
          response: "I'm sorry, but I'm currently experiencing issues due to API quota limits. Please try again later or contact support.",
          error: 'quota_exceeded'
        };
      } else if (error.code === 'invalid_api_key') {
        return {
          success: false,
          response: "I'm sorry, but there's a configuration issue with my AI service. Please contact support.",
          error: 'invalid_api_key'
        };
      } else if (error.name === 'APIConnectionError') {
        return {
          success: false,
          response: "I'm having trouble connecting to my AI service right now. Please check your internet connection and try again.",
          error: 'connection_error'
        };
      } else {
        return {
          success: false,
          response: "I'm sorry, I encountered an unexpected error. Please try again in a moment.",
          error: 'unexpected_error'
        };
      }
    }
  }

  /**
   * Clear conversation history for a session
   */
  clearHistory(sessionId) {
    this.conversationHistory.delete(sessionId);
  }

  /**
   * Get conversation statistics
   */
  getStats(sessionId) {
    const history = this.getConversationHistory(sessionId);
    return {
      messageCount: history.length,
      userMessages: history.filter(msg => msg.role === 'user').length,
      assistantMessages: history.filter(msg => msg.role === 'assistant').length
    };
  }
}

// Export a singleton instance
export const chatbotService = new ChatbotService();
export default chatbotService;
