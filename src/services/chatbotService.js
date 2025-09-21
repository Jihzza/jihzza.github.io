// src/services/chatbotService.js
// Direct chatbot service to replace n8n workflows
import { supabase } from '../lib/supabaseClient';

class ChatbotService {
  constructor() {
    this.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    this.model = 'gpt-5'; // Weaker model for testing, can be changed to gpt-4o-mini
    this.conversationMemory = new Map(); // Local conversation memory
  }

  /**
   * Generate a welcome message for a user (only once per session)
   */
  async generateWelcomeMessage(userId, sessionId) {
    try {
      if (import.meta.env.VITE_CHATBOT_DEBUG === 'true') {
        console.log('🔍 ChatbotService: Generating welcome message for user:', userId, 'session:', sessionId);
      }

      // Check if welcome message already exists for this session
      const existingWelcome = await this.checkExistingWelcome(sessionId);
      if (existingWelcome) {
        if (import.meta.env.VITE_CHATBOT_DEBUG === 'true') console.log('🔍 ChatbotService: Returning existing welcome message');
        return {
          success: true,
          message: existingWelcome,
          alreadyExists: true
        };
      }

      if (import.meta.env.VITE_CHATBOT_DEBUG === 'true') console.log('🔍 ChatbotService: No existing welcome found, generating new one');

      // Get user profile info for personalization
      const userProfile = await this.getUserProfile(userId);
      if (import.meta.env.VITE_CHATBOT_DEBUG === 'true') console.log('🔍 ChatbotService: User profile:', userProfile ? 'found' : 'not found');

      // Fast path (no LLM): configurable via env
      const preferTemplate = (import.meta.env.VITE_WELCOME_MODE || 'template') === 'template';

      // Helper: build a super fast, constraint-safe message (<= 50 chars)
      const buildTemplateWelcome = () => {
        const name = (userProfile?.full_name || userProfile?.name || '').split(' ')[0];
        const base = name ? `Welcome ${name}! What do you need?` : 'Welcome! What do you need?';
        return base.length > 50 ? base.slice(0, 47).trimEnd() + '...' : base;
      };

      let cleanResponse;
      if (preferTemplate) {
        cleanResponse = buildTemplateWelcome();
      } else {
        // LLM path (with tight budget and timeout, faster model by default)
        const systemPrompt = `Send a personal and with less than 50 characters welcome message to the user to welcome him and know what they need.
Access the user information, if needed, for more personalization.

The only thing you can output is the user message and don't start and end the message in quotes.`;

        const userPrompt = userProfile 
          ? `Generate a welcome message for user: ${JSON.stringify(userProfile)}`
          : `Generate a welcome message for a new user.`;

        const preferredWelcomeModel = import.meta.env.VITE_WELCOME_MODEL || 'gpt-4o-mini';
        const welcomeTimeout = Number(import.meta.env.VITE_WELCOME_TIMEOUT_MS || '1200');

        if (import.meta.env.VITE_CHATBOT_DEBUG === 'true') console.log('🔍 ChatbotService: Calling OpenAI for welcome message generation');

        try {
          const response = await this.callOpenAI(systemPrompt, userPrompt, sessionId, [], {
            model: preferredWelcomeModel,
            max_tokens: 40,
            temperature: 0.2,
            timeoutMs: welcomeTimeout,
          });
          cleanResponse = response.replace(/^["']|["']$/g, '').trim();
        } catch (err) {
          // Timeout or API issue → fall back to template instantly
          if (import.meta.env.VITE_CHATBOT_DEBUG === 'true') console.warn('🔍 ChatbotService: Welcome LLM fallback to template:', err?.message || err);
          cleanResponse = buildTemplateWelcome();
        }
        if (import.meta.env.VITE_CHATBOT_DEBUG === 'true') console.log('🔍 ChatbotService: Generated welcome message:', cleanResponse, `(${cleanResponse.length} chars)`);
      }

      // Mark welcome as sent FIRST to prevent race conditions
      await this.markWelcomeSent(sessionId, cleanResponse);

      // Store the welcome message in conversation history (flag as welcome)
      await this.storeMessage(userId, sessionId, 'assistant', cleanResponse, { isWelcome: true });
      
      // Create initial conversation context
      try {
        await this.createConversationContext(userId, sessionId, cleanResponse);
      } catch (ctxErr) {
        console.warn('🔍 ChatbotService: Skipping context upsert (likely missing constraints):', ctxErr && ctxErr.message ? ctxErr.message : ctxErr);
      }

      return {
        success: true,
        message: cleanResponse
      };
    } catch (error) {
      console.error('ChatbotService: Error generating welcome message:', error);
      return {
        success: false,
        message: "Hi! I'm Daniel's assistant. How can I help you today?"
      };
    }
  }

  /**
   * Process a regular chat message with decision-making logic
   */
  async processMessage(userId, sessionId, message) {
    try {
      // Store user message
      await this.storeMessage(userId, sessionId, 'user', message);

      // Get conversation context and history
      const context = await this.getConversationContext(sessionId);
      const conversationHistory = await this.getConversationHistory(sessionId);

      // Decision-making: determine if we need to trigger specific workflows
      const decision = await this.makeDecision(message, context, conversationHistory);

      let response;
      
      if (decision.action === 'send') {
        // Generate direct response
        response = await this.generateResponse(message, context, conversationHistory, sessionId);
      } else if (decision.action === 'workflow') {
        // Handle specific workflow requirements
        response = await this.handleWorkflow(decision.workflowType, message, context, sessionId);
      } else {
        // Default to general response
        response = await this.generateResponse(message, context, conversationHistory, sessionId);
      }

      // Store assistant response
      await this.storeMessage(userId, sessionId, 'assistant', response);

      return {
        success: true,
        message: response
      };
    } catch (error) {
      console.error('ChatbotService: Error processing message:', error);
      return {
        success: false,
        message: "I'm sorry, I encountered an error. Please try again."
      };
    }
  }

  /**
   * Make decision about what to do with the message
   */
  async makeDecision(message, context, conversationHistory) {
    try {
      const systemPrompt = `You are a decision-making agent for Daniel DaGalow's chatbot. Analyze the user message and conversation context to determine the next action.

Based on the user message, conversation history, and context, decide:
1. If this requires immediate response -> output "Send"  
2. If this needs a specific workflow (scheduling, complaint, testimonial) -> output "Workflow" and specify which

Available workflows:
- scheduling: For appointment/consultation requests
- complain: For complaints or issues
- testimonial: For testimonial requests

Context: ${JSON.stringify(context)}
Conversation History: ${JSON.stringify(conversationHistory.slice(-5))} // Last 5 messages

Respond with either:
- "Send" for immediate response
- "Workflow: scheduling" for scheduling workflow
- "Workflow: complain" for complaint workflow  
- "Workflow: testimonial" for testimonial workflow`;

      const response = await this.callOpenAI(systemPrompt, `Analyze this message: "${message}"`, null, []);

      if (response.toLowerCase().includes('workflow')) {
        const workflowMatch = response.match(/workflow:\s*(\w+)/i);
        return {
          action: 'workflow',
          workflowType: workflowMatch ? workflowMatch[1].toLowerCase() : 'scheduling'
        };
      }

      return { action: 'send' };
    } catch (error) {
      console.error('ChatbotService: Error making decision:', error);
      return { action: 'send' }; // Default to send
    }
  }

  /**
   * Generate a response to the user
   */
  async generateResponse(message, context, conversationHistory, sessionId) {
    try {
      const systemPrompt = `You are Daniel DaGalow's AI assistant. Respond to the user based on all available information.

About Daniel DaGalow:
- Business consultant and coach
- Offers consultations (€90/hour), coaching plans (Basic €40/mo, Standard €90/mo, Premium €230/mo)
- Has projects: GalowClub and Perspectiv
- Provides pitch deck services

Context: ${JSON.stringify(context)}
Recent conversation: ${JSON.stringify(conversationHistory.slice(-5))}

Rules:
- Be helpful and professional
- Reference previous conversation when relevant
- Suggest services when appropriate
- Keep responses conversational and natural
- Don't mention n8n or workflows`;

      const response = await this.callOpenAI(systemPrompt, message, sessionId, conversationHistory);
      
      return response;
    } catch (error) {
      console.error('ChatbotService: Error generating response:', error);
      return "I understand you're looking for help. Let me know what specific service you're interested in - consultations, coaching, or pitch deck services.";
    }
  }

  /**
   * Handle specific workflow requirements
   */
  async handleWorkflow(workflowType, message, context, sessionId) {
    try {
      let workflowPrompt = '';
      
      switch (workflowType) {
        case 'scheduling':
          workflowPrompt = `The user wants to schedule something. Guide them through the scheduling process or direct them to use the scheduling commands like "book appointment for tomorrow at 3pm for 60 minutes".`;
          break;
        case 'complain':
          workflowPrompt = `The user has a complaint. Be empathetic and helpful in addressing their concern.`;
          break;
        case 'testimonial':
          workflowPrompt = `The user wants to provide a testimonial. Thank them and guide them through sharing their experience.`;
          break;
        default:
          workflowPrompt = `Help the user with their request.`;
      }

      const systemPrompt = `You are Daniel DaGalow's AI assistant. ${workflowPrompt}

Context: ${JSON.stringify(context)}

Be professional, helpful, and guide the conversation toward resolution.`;

      const response = await this.callOpenAI(systemPrompt, message, sessionId, []);
      
      return response;
    } catch (error) {
      console.error('ChatbotService: Error handling workflow:', error);
      return "I understand you need help with that. Let me assist you the best I can.";
    }
  }

  /**
   * Call OpenAI API
   */
  async callOpenAI(systemPrompt, userPrompt, sessionId = null, conversationHistory = []) {
    return this.callOpenAI(systemPrompt, userPrompt, sessionId, conversationHistory, {});
  }

  async callOpenAI(systemPrompt, userPrompt, sessionId = null, conversationHistory = [], overrides = {}) {
    try {
      if (!this.openaiApiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const messages = [
        { role: 'system', content: systemPrompt }
      ];

      // Add conversation history if available
      if (conversationHistory && conversationHistory.length > 0) {
        // Add last few messages for context
        const recentHistory = conversationHistory.slice(-6); // Last 6 messages
        recentHistory.forEach(msg => {
          messages.push({
            role: msg.role,
            content: msg.content
          });
        });
      }

      // Add current user message
      messages.push({ role: 'user', content: userPrompt });

      // Allow overrides for performance-sensitive calls (like welcome)
      const model = overrides.model || this.model;
      const max_tokens = overrides.max_tokens || 500;
      const temperature = typeof overrides.temperature === 'number' ? overrides.temperature : 0.7;

      const controller = new AbortController();
      const timeoutMs = overrides.timeoutMs || 0;
      let timeoutId;
      if (timeoutMs > 0) {
        timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: messages,
          max_tokens,
          temperature,
        }),
        signal: controller.signal,
      });

      if (timeoutId) clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content?.trim() || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('ChatbotService: OpenAI API call failed:', error);
      throw error;
    }
  }

  /**
   * Store message in conversation history
   */
  async storeMessage(userId, sessionId, role, content, options = {}) {
    try {
      const { error } = await supabase
        .from('chatbot_conversations')
        .insert({
          user_id: userId,
          session_id: sessionId,
          role: role,
          content: content,
          created_at: new Date().toISOString(),
          is_welcome: options.isWelcome === true ? true : false
        });

      if (error) {
        console.warn('Failed to store message in database:', error);
        // Store in local memory as fallback
        const key = sessionId;
        if (!this.conversationMemory.has(key)) {
          this.conversationMemory.set(key, []);
        }
        this.conversationMemory.get(key).push({ role, content, created_at: new Date().toISOString() });
      }
    } catch (error) {
      console.warn('Error storing message:', error);
    }
  }

  /**
   * Get conversation history
   */
  async getConversationHistory(sessionId) {
    try {
      const { data, error } = await supabase
        .from('chatbot_conversations')
        .select('role, content, created_at')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error || !data) {
        console.warn('Failed to get conversation history from database:', error);
        // Fallback to local memory
        return this.conversationMemory.get(sessionId) || [];
      }

      return data;
    } catch (error) {
      console.warn('Error getting conversation history:', error);
      return this.conversationMemory.get(sessionId) || [];
    }
  }

  /**
   * Get user profile for personalization
   */
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        return null;
      }

      return data;
    } catch (error) {
      console.warn('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Create conversation context
   */
  async createConversationContext(userId, sessionId, initialMessage) {
    try {
      // Store initial conversation description
      await supabase
        .from('conversation_description')
        .upsert({
          session_id: sessionId,
          user_id: userId,
          description: `New conversation started with welcome message: ${initialMessage}`,
          created_at: new Date().toISOString()
        })
        .select();

      // Store initial message description
      await supabase
        .from('message_description')
        .insert({
          session_id: sessionId,
          user_id: userId,
          message_type: 'welcome',
          description: 'Welcome message generated for new conversation',
          created_at: new Date().toISOString()
        })
        .select();
    } catch (error) {
      console.warn('Error creating conversation context:', error);
    }
  }

  /**
   * Get conversation context
   */
  async getConversationContext(sessionId) {
    try {
      // Get all context data in parallel
      const [messageDesc, conversationDesc, questionsAnswers, actionPlan] = await Promise.all([
        supabase.from('message_description').select('*').eq('session_id', sessionId),
        supabase.from('conversation_description').select('*').eq('session_id', sessionId),
        supabase.from('questions_answers').select('*').eq('session_id', sessionId),
        supabase.from('action_plan').select('*').eq('session_id', sessionId)
      ]);

      return {
        messageDescriptions: messageDesc.data || [],
        conversationDescription: conversationDesc.data?.[0] || null,
        questionsAnswers: questionsAnswers.data || [],
        actionPlan: actionPlan.data || []
      };
    } catch (error) {
      console.warn('Error getting conversation context:', error);
      return {
        messageDescriptions: [],
        conversationDescription: null,
        questionsAnswers: [],
        actionPlan: []
      };
    }
  }

  /**
   * Update conversation context
   */
  async updateConversationContext(sessionId, userId, messageType, description) {
    try {
      // Update conversation description
      await supabase
        .from('conversation_description')
        .upsert({
          session_id: sessionId,
          user_id: userId,
          description: description,
          updated_at: new Date().toISOString()
        }, { onConflict: 'session_id' });

      // Add message description
      await supabase
        .from('message_description')
        .insert({
          session_id: sessionId,
          user_id: userId,
          message_type: messageType,
          description: description,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.warn('Error updating conversation context:', error);
    }
  }

  /**
   * Configure OpenAI model
   */
  setModel(model) {
    this.model = model;
  }

  /**
   * Get available models
   */
  getAvailableModels() {
    return [
      'gpt-3.5-turbo',    // Weaker, faster, cheaper
      'gpt-4o-mini',      // Good balance
      'gpt-4o',           // More capable
      'gpt-4-turbo'       // Most capable
    ];
  }

  /**
   * Check if a welcome message already exists for this session
   */
  async checkExistingWelcome(sessionId) {
    try {
      if (import.meta.env.VITE_CHATBOT_DEBUG === 'true') console.log('🔍 ChatbotService: Checking existing welcome for session:', sessionId);

      // First, check if welcome message is marked as sent in session_welcome table
      try {
        const { data: welcomeData, error: welcomeError } = await supabase
          .from('session_welcome')
          .select('welcome_message, sent_at')
          .eq('session_id', sessionId)
          .single();

        if (!welcomeError && welcomeData) {
          if (import.meta.env.VITE_CHATBOT_DEBUG === 'true') console.log('🔍 ChatbotService: Found existing welcome in session_welcome table');
          return welcomeData.welcome_message;
        }
      } catch (tableError) {
        if (import.meta.env.VITE_CHATBOT_DEBUG === 'true') console.warn('🔍 ChatbotService: session_welcome table not accessible, checking conversations');
      }

      // Fallback: Prefer an explicit welcome-flagged message
      const { data: flaggedWelcome, error: flagErr } = await supabase
        .from('chatbot_conversations')
        .select('content, created_at')
        .eq('session_id', sessionId)
        .eq('is_welcome', true)
        .order('created_at', { ascending: true })
        .limit(1);

      if (!flagErr && flaggedWelcome && flaggedWelcome.length > 0) {
        if (import.meta.env.VITE_CHATBOT_DEBUG === 'true') console.log('🔍 ChatbotService: Found flagged welcome message in conversations');
        return flaggedWelcome[0].content;
      }

      // Final fallback: any assistant message indicates welcome was likely sent
      const { data: messagesData, error: messagesError } = await supabase
        .from('chatbot_conversations')
        .select('content, created_at')
        .eq('session_id', sessionId)
        .eq('role', 'assistant')
        .order('created_at', { ascending: true })
        .limit(1);

      if (!messagesError && messagesData && messagesData.length > 0) {
        // If there's already an assistant message, consider welcome sent
        if (import.meta.env.VITE_CHATBOT_DEBUG === 'true') console.log('🔍 ChatbotService: Found existing assistant message for session');
        return messagesData[0].content;
      }

      if (import.meta.env.VITE_CHATBOT_DEBUG === 'true') console.log('🔍 ChatbotService: No existing welcome found for session');
      return null;
    } catch (error) {
      console.warn('Error checking existing welcome message:', error);
      return null;
    }
  }

  /**
   * Mark welcome as sent for this session
   */
  async markWelcomeSent(sessionId, welcomeMessage) {
    try {
      if (import.meta.env.VITE_CHATBOT_DEBUG === 'true') console.log('🔍 ChatbotService: Marking welcome as sent for session:', sessionId);
      
      // Try to create session_welcome table entry
      const { data, error } = await supabase
        .from('session_welcome')
        .upsert({
          session_id: sessionId,
          welcome_message: welcomeMessage,
          sent_at: new Date().toISOString()
        }, { onConflict: 'session_id' });

      if (error) {
        console.warn('🔍 ChatbotService: Could not mark welcome in session_welcome table:', error.message);
      } else {
        if (import.meta.env.VITE_CHATBOT_DEBUG === 'true') console.log('🔍 ChatbotService: Successfully marked welcome as sent');
      }
    } catch (error) {
      console.warn('🔍 ChatbotService: Error marking welcome as sent:', error);
      // This is non-critical, so we continue without failing
    }
  }
}

// Export singleton instance
export const chatbotService = new ChatbotService();
export default chatbotService;
