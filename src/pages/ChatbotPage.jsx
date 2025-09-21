// src/pages/ChatbotPage.jsx

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mcpClient } from '../services/mcpClient';
import { chatbotService } from '../services/chatbotService';
import AppointmentScheduler from '../components/chatbot/AppointmentScheduler';
import CoachingSubscription from '../components/chatbot/CoachingSubscription';
import PitchDeckRequest from '../components/chatbot/PitchDeckRequest';
import ChatbotSettings from '../components/chatbot/ChatbotSettings';
import WelcomeMessageTester from '../components/chatbot/WelcomeMessageTester';
import TypingIndicator from '../components/chatbot/TypingIndicator';

const SESSION_STORAGE_KEY = 'chatbot-session-id';
const SESSION_TIMESTAMP_KEY = 'chatbot-session-timestamp';

export default function ChatbotPage() {
  const { user, isAuthenticated } = useAuth();

  // Debug flag to silence logs unless explicitly enabled
  const DEBUG = import.meta.env.VITE_CHATBOT_DEBUG === 'true';
  const debugLog = (...args) => { if (DEBUG) console.log(...args); };

  const [sessionId, setSessionId] = useState(() => {
    const cached = sessionStorage.getItem(SESSION_STORAGE_KEY);
    const timestamp = sessionStorage.getItem(SESSION_TIMESTAMP_KEY);
    const now = Date.now();
    
    // Check if session is valid (exists and less than 24 hours old)
    const isValidSession = cached && timestamp && (now - parseInt(timestamp)) < 24 * 60 * 60 * 1000;
    
    if (isValidSession) {
      return cached;
    }
    
    // Create new session
    const id = typeof crypto?.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(SESSION_STORAGE_KEY, id);
    sessionStorage.setItem(SESSION_TIMESTAMP_KEY, now.toString());
    return id;
  });

  const [messages, setMessages] = useState(() => []);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showAppointmentScheduler, setShowAppointmentScheduler] = useState(false);
  const [showCoachingSubscription, setShowCoachingSubscription] = useState(false);
  const [showPitchDeckRequest, setShowPitchDeckRequest] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWelcomeTester, setShowWelcomeTester] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [isGeneratingWelcome, setIsGeneratingWelcome] = useState(false);
  const messagesEndRef = useRef(null);

  const canSend = useMemo(() => {
    if (!isAuthenticated) return false;
    if (isSending) return false;
    if (!inputValue.trim()) return false;
    return true;
  }, [isAuthenticated, isSending, inputValue]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle payment success/cancellation from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const payment = urlParams.get('payment');
    const type = urlParams.get('type');
    
    if (payment === 'success') {
      if (type === 'appointment') {
        setMessages((prev) => [...prev, { 
          role: 'assistant', 
          content: '🎉 Payment successful! Your appointment has been confirmed. You will receive a confirmation email shortly.' 
        }]);
      } else if (type === 'subscription') {
        const plan = urlParams.get('plan');
        setMessages((prev) => [...prev, { 
          role: 'assistant', 
          content: `🎉 Payment successful! Your ${plan} coaching subscription is now active. Welcome to the program!` 
        }]);
      }
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (payment === 'cancelled') {
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: 'Payment was cancelled. No charges were made. Feel free to try again anytime!' 
      }]);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Consume pending welcome message once the user visits the chat page
  useEffect(() => {
    try {
      const msg = sessionStorage.getItem('pending_welcome_message');
      if (msg) {
        setMessages((prev) => [...prev, { role: 'assistant', content: msg }]);
        sessionStorage.removeItem('pending_welcome_message');
        window.dispatchEvent(new CustomEvent('welcomeMessageConsumed'));
        setHasShownWelcome(true);
      }
    } catch {}
  }, []);

  // Load conversation history when session changes (only once on mount or when sessionId changes)
  useEffect(() => {
    const loadConversationHistory = async () => {
      if (!isAuthenticated || !user || !sessionId) {
        return;
      }

      setIsLoadingHistory(true);
      debugLog('🔍 Chatbot: Loading conversation history for session:', sessionId);

      try {
        const history = await chatbotService.getConversationHistory(sessionId);
        
        if (history && history.length > 0) {
          debugLog('🔍 Chatbot: Found existing conversation history:', history.length, 'messages');
          setMessages(history.map(msg => ({ role: msg.role, content: msg.content })));
          setHasShownWelcome(true);
        } else {
          debugLog('🔍 Chatbot: No conversation history found, will generate welcome');
          setMessages([]);
          setHasShownWelcome(false);
        }
      } catch (error) {
        console.error('Failed to load conversation history:', error);
        setMessages([]);
        setHasShownWelcome(false);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadConversationHistory();
    // Intentionally depend only on sessionId to avoid duplicate loads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Generate welcome message when there is no history yet
  useEffect(() => {
    const generateWelcome = async () => {
      if (!isAuthenticated || !user || hasShownWelcome || isLoadingHistory) {
        return;
      }

      // Guard against React StrictMode double-invocation and rapid re-renders
      if (welcomeRunForSessionRef.current === sessionId || generatingWelcomeRef.current) {
        return;
      }
      generatingWelcomeRef.current = true;
      setIsGeneratingWelcome(true);
      debugLog('🔍 Chatbot: Generating welcome message for session:', sessionId);

      try {
        const result = await chatbotService.generateWelcomeMessage(user.id, sessionId);
        if (result.success) {
          if (result.alreadyExists) {
            debugLog('🔍 Chatbot: Welcome message already exists for this session');
            // Only add to UI if not already displayed
            if (messages.length === 0 || !messages.some(m => m.role === 'assistant')) {
              setMessages((prev) => [...prev, { role: 'assistant', content: result.message }]);
            }
          } else {
            debugLog('🔍 Chatbot: Generated new welcome message:', result.message);
            setMessages((prev) => [...prev, { role: 'assistant', content: result.message }]);
          }
          setHasShownWelcome(true);
          welcomeRunForSessionRef.current = sessionId;
        }
      } catch (error) {
        console.error('Failed to generate welcome message:', error);
        // Fallback welcome message - only if no messages exist
        if (messages.length === 0) {
          setMessages((prev) => [...prev, { 
            role: 'assistant', 
            content: "Hi! I'm Daniel's assistant. How can I help you today?" 
          }]);
        }
        setHasShownWelcome(true);
        welcomeRunForSessionRef.current = sessionId;
      } finally {
        generatingWelcomeRef.current = false;
        setIsGeneratingWelcome(false);
      }
    };

    generateWelcome();
    // Depend on minimal set to avoid double trigger
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, hasShownWelcome, isLoadingHistory]);

  // Dedup guards (persist only in-memory per mount)
  const welcomeRunForSessionRef = useRef(null);
  const generatingWelcomeRef = useRef(false);

  const handleSend = async () => {
    if (!canSend) return;

    const content = inputValue.trim();
    setInputValue('');
    setMessages((prev) => [...prev, { role: 'user', content }]);
    setIsSending(true);

    try {
      // Debug: Log the message and check all intents
      console.log('🔍 Chatbot: Processing message:', content);
      console.log('🔍 Chatbot: Is appointment request?', mcpClient.isAppointmentRequest(content));
      console.log('🔍 Chatbot: Is subscription request?', mcpClient.isSubscriptionRequest(content));
      console.log('🔍 Chatbot: Is pitch deck request?', mcpClient.isPitchDeckRequest(content));
      
      // Check for different types of requests (order matters - more specific first)
      if (mcpClient.isSubscriptionRequest(content)) {
        console.log('🔍 Chatbot: Detected subscription request');
        // Handle coaching subscription requests
        const subscriptionData = mcpClient.parseSubscriptionRequest(content);
        console.log('🔍 Chatbot: Parsed subscription data:', subscriptionData);
        
        if (subscriptionData.plan) {
          try {
            // Calculate price for display
            const planPrices = { basic: 40, standard: 90, premium: 230 };
            const price = planPrices[subscriptionData.plan];
            
            // Show price confirmation before payment
            setMessages((prev) => [...prev, { 
              role: 'assistant', 
              content: `I'll set up your ${subscriptionData.plan} coaching subscription. The cost is €${price}/month. Redirecting to payment...` 
            }]);
            
            try {
              const result = await mcpClient.subscribeToCoachingWithPayment({
                ...subscriptionData,
                userId: user?.id,
                name: subscriptionData.name || (user?.user_metadata?.full_name || user?.user_metadata?.name) || null,
                email: subscriptionData.email || user?.email || null
              });
              
              // This won't execute due to redirect, but good to have
              setMessages((prev) => [...prev, { role: 'assistant', content: result.message }]);
              setIsSending(false);
              return;
            } catch (paymentError) {
              console.error('Payment setup failed, falling back to direct subscription:', paymentError);
                        // Fallback to direct subscription if payment setup fails
                        try {
                            const result = await mcpClient.subscribeToCoaching({
                                ...subscriptionData,
                                userId: user?.id,
                                name: subscriptionData.name || (user?.user_metadata?.full_name || user?.user_metadata?.name) || null,
                                email: subscriptionData.email || user?.email || null
                            });
                            
                            // Check if it's simulation mode and show form
                            if (result.message.includes('SIMULATION MODE')) {
                                setMessages((prev) => [...prev, { role: 'assistant', content: result.message }]);
                                setMessages((prev) => [...prev, { 
                                    role: 'assistant', 
                                    content: `Since payment integration isn't set up yet, please use the manual subscription form below to complete your coaching subscription.` 
                                }]);
                                setShowCoachingSubscription(true);
                            } else if (result.checkoutUrl) {
                                // Show checkout link message
                                setMessages((prev) => [...prev, { role: 'assistant', content: result.message }]);
                            } else {
                                setMessages((prev) => [...prev, { role: 'assistant', content: result.message }]);
                            }
                            setIsSending(false);
                            return;
                        } catch (fallbackError) {
                            console.error('Fallback subscription also failed:', fallbackError);
                            setMessages((prev) => [...prev, { 
                                role: 'assistant', 
                                content: `I'd be happy to help you subscribe to coaching! I detected your request for the ${subscriptionData.plan} plan, but I need to show you the form to complete the subscription.` 
                            }]);
                            setShowCoachingSubscription(true);
                            setIsSending(false);
                            return;
                        }
            }
          } catch (subscriptionError) {
            console.error('Subscription creation failed:', subscriptionError);
            // Show the actual error for debugging
            setMessages((prev) => [...prev, { 
              role: 'assistant', 
              content: `Subscription creation failed: ${subscriptionError.message}. Please try again or contact support.` 
            }]);
            setIsSending(false);
            return;
          }
        } else {
          setMessages((prev) => [...prev, { 
            role: 'assistant', 
            content: "I'd be happy to help you subscribe to our coaching plans! Let me show you the available options." 
          }]);
          setShowCoachingSubscription(true);
          setIsSending(false);
          return;
        }
      } else if (mcpClient.isPitchDeckRequest(content)) {
        console.log('🔍 Chatbot: Detected pitch deck request');
        // Handle pitch deck requests
        const pitchData = mcpClient.parsePitchDeckRequest(content);
        console.log('🔍 Chatbot: Parsed pitch data:', pitchData);
        
        if (pitchData.project) {
          try {
            const result = await mcpClient.requestPitchDeck({
              ...pitchData,
              userId: user?.id,
              name: pitchData.name || (user?.user_metadata?.full_name || user?.user_metadata?.name) || null,
              email: pitchData.email || user?.email || null
            });
            setMessages((prev) => [...prev, { role: 'assistant', content: result.message }]);
            setIsSending(false);
            return;
          } catch (pitchError) {
            console.error('Pitch deck request failed:', pitchError);
            // Show the actual error for debugging
            setMessages((prev) => [...prev, { 
              role: 'assistant', 
              content: `Pitch deck request failed: ${pitchError.message}. Please try again or contact support.` 
            }]);
            setIsSending(false);
            return;
          }
        } else {
          setMessages((prev) => [...prev, { 
            role: 'assistant', 
            content: "I'd be happy to help you request a pitch deck! Let me show you the available options." 
          }]);
          setShowPitchDeckRequest(true);
          setIsSending(false);
          return;
        }
      } else if (mcpClient.isAppointmentRequest(content)) {
        console.log('🔍 Chatbot: Detected appointment request');
        // Handle appointment requests
        const appointmentData = mcpClient.parseAppointmentRequest(content);
        
        if (appointmentData.date && appointmentData.startTime && appointmentData.durationMinutes) {
          try {
            // Calculate price for display
            const hourlyRate = 90;
            const price = Math.round(hourlyRate * (appointmentData.durationMinutes / 60) * 100) / 100;
            
            // Show price confirmation before payment
            setMessages((prev) => [...prev, { 
              role: 'assistant', 
              content: `I'll schedule your consultation for ${appointmentData.date} at ${appointmentData.startTime} for ${appointmentData.durationMinutes} minutes. The cost is €${price.toFixed(2)}. Redirecting to payment...` 
            }]);
            
            try {
              const result = await mcpClient.scheduleAppointmentWithPayment({
                ...appointmentData,
                userId: user?.id,
                timezone: 'Europe/Madrid',
                contactEmail: appointmentData.contactEmail || user?.email || null,
                contactName: appointmentData.contactName || (user?.user_metadata?.full_name || user?.user_metadata?.name) || null
              });
              
              // This won't execute due to redirect, but good to have
              setMessages((prev) => [...prev, { role: 'assistant', content: result.message }]);
              setIsSending(false);
              return;
            } catch (paymentError) {
              console.error('Payment setup failed, falling back to direct booking:', paymentError);
                        // Fallback to direct booking if payment setup fails
                        try {
                            const result = await mcpClient.scheduleAppointment({
                                ...appointmentData,
                                userId: user?.id,
                                timezone: 'Europe/Madrid',
                                contactEmail: appointmentData.contactEmail || user?.email || null,
                                contactName: appointmentData.contactName || (user?.user_metadata?.full_name || user?.user_metadata?.name) || null
                            });
                            
                            // Check if it's simulation mode and show form
                            if (result.message.includes('SIMULATION MODE')) {
                                setMessages((prev) => [...prev, { role: 'assistant', content: result.message }]);
                                setMessages((prev) => [...prev, { 
                                    role: 'assistant', 
                                    content: `Since payment integration isn't set up yet, please use the manual booking form below to complete your appointment.` 
                                }]);
                                setShowAppointmentScheduler(true);
                            } else if (result.checkoutUrl) {
                                // Show checkout link message
                                setMessages((prev) => [...prev, { role: 'assistant', content: result.message }]);
                            } else {
                                setMessages((prev) => [...prev, { role: 'assistant', content: result.message }]);
                            }
                            setIsSending(false);
                            return;
                        } catch (fallbackError) {
                            console.error('Fallback booking also failed:', fallbackError);
                            setMessages((prev) => [...prev, { 
                                role: 'assistant', 
                                content: `I'd be happy to help you schedule an appointment! I detected your request for ${appointmentData.date} at ${appointmentData.startTime} for ${appointmentData.durationMinutes} minutes, but I need to show you the form to complete the booking.` 
                            }]);
                            setShowAppointmentScheduler(true);
                            setIsSending(false);
                            return;
                        }
            }
          } catch (appointmentError) {
            console.error('Appointment scheduling failed:', appointmentError);
            setMessages((prev) => [...prev, { 
              role: 'assistant', 
              content: `I'd be happy to help you schedule an appointment! I detected your request for ${appointmentData.date} at ${appointmentData.startTime} for ${appointmentData.durationMinutes} minutes, but I need to show you the form to complete the booking.` 
            }]);
            setShowAppointmentScheduler(true);
            setIsSending(false);
            return;
          }
        } else {
          setMessages((prev) => [...prev, { 
            role: 'assistant', 
            content: "I'd be happy to help you schedule an appointment! Let me show you the appointment form." 
          }]);
          setShowAppointmentScheduler(true);
          setIsSending(false);
          return;
        }
      }

      // Regular message processing via local chatbot service
      console.log('🔍 Chatbot: Processing with local chatbot service');
      const result = await chatbotService.processMessage(user?.id ?? null, sessionId, content);
  
      if (result.success) {
        setMessages((prev) => [...prev, { role: 'assistant', content: result.message }]);
      } else {
        setMessages((prev) => [...prev, { 
          role: 'assistant', 
          content: "Sorry, I couldn't process that. Please try again." 
        }]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Network error. Please try again.' },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAppointmentScheduled = (message) => {
    setMessages((prev) => [...prev, { role: 'assistant', content: message }]);
    setShowAppointmentScheduler(false);
  };

  const handleCloseAppointmentScheduler = () => {
    setShowAppointmentScheduler(false);
  };

  const handleSubscriptionCreated = (message) => {
    setMessages((prev) => [...prev, { role: 'assistant', content: message }]);
    setShowCoachingSubscription(false);
  };

  const handleCloseCoachingSubscription = () => {
    setShowCoachingSubscription(false);
  };

  const handlePitchDeckRequested = (message) => {
    setMessages((prev) => [...prev, { role: 'assistant', content: message }]);
    setShowPitchDeckRequest(false);
  };

  const handleClosePitchDeckRequest = () => {
    setShowPitchDeckRequest(false);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const handleCloseWelcomeTester = () => {
    setShowWelcomeTester(false);
  };

  const createNewConversation = () => {
    const id = typeof crypto?.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const now = Date.now();
    
    // Update session storage
    sessionStorage.setItem(SESSION_STORAGE_KEY, id);
    sessionStorage.setItem(SESSION_TIMESTAMP_KEY, now.toString());
    
    // Update state
    setSessionId(id);
    setMessages([]);
    setHasShownWelcome(false);
    
    console.log('🔍 Chatbot: Created new conversation with session:', id);
  };

  return (
    <div className="flex flex-col h-full bg-[#002147] text-white">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#002147]">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold">Chatbot</h1>
            <button
              onClick={createNewConversation}
              className="bg-green-600/80 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-green-600 transition"
              title="Start New Conversation"
            >
              🆕 New Chat
            </button>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <button
                  onClick={() => setShowAppointmentScheduler(true)}
                  className="bg-[#BFA200] text-black px-2 py-1 rounded text-xs font-semibold hover:opacity-90 transition"
                >
                  Appointment
                </button>
                <button
                  onClick={() => setShowCoachingSubscription(true)}
                  className="bg-[#BFA200] text-black px-2 py-1 rounded text-xs font-semibold hover:opacity-90 transition"
                >
                  Coaching
                </button>
                <button
                  onClick={() => setShowPitchDeckRequest(true)}
                  className="bg-[#BFA200] text-black px-2 py-1 rounded text-xs font-semibold hover:opacity-90 transition"
                >
                  Pitch Deck
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="bg-black/20 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-black/30 transition border border-white/20"
                  title="Chatbot Settings"
                >
                  ⚙️
                </button>
                {import.meta.env.DEV && (
                  <button
                    onClick={() => setShowWelcomeTester(true)}
                    className="bg-purple-600/80 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-purple-600 transition border border-purple-400/50"
                    title="Welcome Message Tester (Dev Only)"
                  >
                    🧪
                  </button>
                )}
              </>
            )}
            <div className="text-xs opacity-75 ml-2">
              <div>Session: {sessionId.slice(0, 8)}</div>
              <div>Messages: {messages.length}</div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-3 py-4 space-y-3">
          {isLoadingHistory && (
            <div className="flex justify-center">
              <div className="max-w-[85%] rounded-2xl px-3 py-2 text-sm bg-black/10 text-white shadow-sm">
                Loading conversation history...
              </div>
            </div>
          )}
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm md:text-base shadow-sm ${
                  m.role === 'user'
                    ? 'bg-[#BFA200] text-black'
                    : 'bg-black/10 text-white'
                }`}
              >
                {m.content.split('\n').map((line, lineIdx) => {
                  // Check if line contains a markdown link
                  const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
                  if (linkMatch) {
                    const [fullMatch, linkText, linkUrl] = linkMatch;
                    const beforeLink = line.substring(0, line.indexOf(fullMatch));
                    const afterLink = line.substring(line.indexOf(fullMatch) + fullMatch.length);
                    
                    return (
                      <div key={lineIdx}>
                        {beforeLink}
                        <button 
                          onClick={() => {
                            // Redirect to Stripe checkout
                            window.location.href = linkUrl;
                          }}
                          className="text-[#BFA200] underline hover:no-underline font-semibold bg-transparent border-none cursor-pointer p-0"
                        >
                          {linkText}
                        </button>
                        {afterLink}
                      </div>
                    );
                  }
                  
                  // Check if line is bold
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return (
                      <div key={lineIdx} className="font-bold">
                        {line.slice(2, -2)}
                      </div>
                    );
                  }
                  
                  // Check if line is italic
                  if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
                    return (
                      <div key={lineIdx} className="italic opacity-75">
                        {line.slice(1, -1)}
                      </div>
                    );
                  }
                  
                  return <div key={lineIdx}>{line}</div>;
                })}
              </div>
            </div>
          ))}
          
          {showAppointmentScheduler && (
            <AppointmentScheduler
              onAppointmentScheduled={handleAppointmentScheduled}
              onClose={handleCloseAppointmentScheduler}
            />
          )}
          
          {showCoachingSubscription && (
            <CoachingSubscription
              onSubscriptionCreated={handleSubscriptionCreated}
              onClose={handleCloseCoachingSubscription}
            />
          )}
          
          {showPitchDeckRequest && (
            <PitchDeckRequest
              onRequestCreated={handlePitchDeckRequested}
              onClose={handleClosePitchDeckRequest}
            />
          )}
          
          {showSettings && (
            <ChatbotSettings
              onClose={handleCloseSettings}
            />
          )}

          {showWelcomeTester && (
            <WelcomeMessageTester
              onClose={handleCloseWelcomeTester}
            />
          )}
          
          {(isSending || isGeneratingWelcome) && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl px-3 py-2 text-sm bg-black/10 text-white shadow-sm">
                <TypingIndicator label={isGeneratingWelcome ? 'Preparing welcome' : 'Typing'} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="border-t border-white/10">
        <div className="max-w-3xl mx-auto w-full px-3 py-3">
          {!isAuthenticated && (
            <div className="text-xs text-white/70 mb-2">
              Please log in to send messages.
            </div>
          )}
          <div className="relative flex items-end">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder={isAuthenticated ? 'Type your message...' : 'Log in to chat'}
              disabled={!isAuthenticated || isSending}
              className={`w-full bg-black/10 backdrop-blur-md border border-white/20 rounded-xl py-3 pl-4 pr-24 text-white placeholder:text-white/50 focus:outline-none focus:ring focus:ring-white/30 md:text-base resize-none`}
            />
            <button
              onClick={handleSend}
              disabled={!canSend}
              className={`absolute right-2 bottom-2 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                canSend ? 'bg-[#BFA200] text-black hover:opacity-90' : 'bg-black/10 text-white/50 cursor-not-allowed'
              }`}
            >
              Send
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}


