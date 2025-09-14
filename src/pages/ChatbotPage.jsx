// src/pages/ChatbotPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // adjust path if different
import { useTranslation } from "react-i18next";
import { PlusCircleIcon, ClockIcon } from "@heroicons/react/24/outline";

import ChatMessages from "../components/chatbot/ChatbotWindow/ChatMessages";
import ChatInput from "../components/chatbot/ChatbotWindow/ChatInput";
import { getMessagesBySession } from "../services/chatbotService";

export default function ChatbotPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const { sessionId: routeSessionId } = useParams(); // /chat/:sessionId support
  const isExistingSession = Boolean(routeSessionId);

  const chatListRef = useRef(null);
  // Track which sessionIds have been initialized (handles Strict Mode double-effect)
  const initedSessionsRef = useRef(new Set());

  const [messages, setMessages] = useState([]);
  const [userText, setUserText] = useState("");
  const [loading, setLoading] = useState(false);

  const SESSION_KEY = "chatbot-session-id";
  const [sessionId, setSessionId] = useState(() => {
    if (routeSessionId) return routeSessionId; // URL param wins
    const cached = sessionStorage.getItem(SESSION_KEY);
    if (cached) return cached;
    const id =
      typeof crypto?.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  });

  // ---- Welcome message display ----
  useEffect(() => {
    // Only show welcome message for new sessions (not existing ones from URL params)
    if (isExistingSession) return;
    
    // Check if there's a pending welcome message
    const pendingMessage = sessionStorage.getItem('pending_welcome_message');
    if (pendingMessage) {
      console.log('💬 Displaying welcome message in chatbot:', pendingMessage);
      // Show the stored welcome message
      setMessages(prev => [...prev, { from: "bot", text: pendingMessage }]);
      // Clear the pending message
      sessionStorage.removeItem('pending_welcome_message');
      console.log('✅ Welcome message displayed and cleared from storage');
    } else {
      console.log('ℹ️ No pending welcome message found for this session');
    }
  }, [isExistingSession]);

  // ---- Initializer: load messages for this session ----
  useEffect(() => {
    if (!user?.id || !sessionId) return;
    if (initedSessionsRef.current.has(sessionId)) return; // already initialized this session
    initedSessionsRef.current.add(sessionId);

    (async () => {
      setLoading(true);
      try {
        // Load any prior messages for this session
        try {
          const { data, error } = await getMessagesBySession(user.id, sessionId);
          if (error) throw error;
          const mapped = (data ?? []).map((m) => ({
            from: m.role === "assistant" ? "bot" : "user",
            text: m.content,
            created_at: m.created_at,
          }));
          setMessages(mapped);
        } catch (e) {
          console.error("getMessagesBySession failed:", e);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id, sessionId]);

  // ---- Start a brand-new conversation (header icon) ----
  const startNewConversation = () => {
    // Clear the current session id and welcome flag
    try {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(`welcomed:${sessionId}`);
    } catch { }
    // Generate a fresh session id
    const newId =
      typeof crypto?.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(SESSION_KEY, newId);

    // Reset local state
    setMessages([]);
    setUserText("");
    setLoading(false);

    // Mark new id as not yet initialized (so effect runs)
    initedSessionsRef.current.delete(newId);

    // Switch to the new session (and go to /chat root)
    setSessionId(newId);
    navigate("/chat"); // go to the non-param route
  };

  // ---- Sending logic ----
  const sendMessage = async () => {
    if (!userText.trim() || loading || !isAuthenticated) return;

    const textToSend = userText.trim();
    const newUserMessage = { from: "user", text: textToSend };
    setMessages((prev) => [...prev, newUserMessage]);
    setUserText("");
    setLoading(true);

    // Use environment variables with fallbacks to hardcoded URLs
    const webhooks = [
      import.meta.env.VITE_N8N_FILTER_WEBHOOK_URL || "https://rafaello.app.n8n.cloud/webhook/filter",
      import.meta.env.VITE_N8N_WEBHOOK_URL || "https://rafaello.app.n8n.cloud/webhook/decision",
    ];

    try {
      // Fire-and-forget filter
      void fetch(webhooks[0], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, chatInput: textToSend, user_id: user?.id }),
      });

      // Await decision
      const res = await fetch(webhooks[1], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, chatInput: textToSend, user_id: user?.id }),
      });

      const data = await res.json();
      const first = Array.isArray(data) ? data[0] : data;
      const { content, value, output } = first || {};
      const text = content ?? value ?? output ?? t("chatbot.messages.fetchError");

      setMessages((prev) => [...prev, { from: "bot", text }]);
    } catch (err) {
      console.error("sendMessage error:", err);
      setMessages((prev) => [...prev, { from: "bot", text: t("chatbot.messages.connectionError") }]);
    } finally {
      setLoading(false);
    }
  };

  // ---- UI ----
  return (
    <div
      className="flex flex-col bg-[#002147] text-white h-full"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Header (with New Conversation and History icons) */}
      <div className="sticky top-0 z-10 bg-[#002147] border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate("/profile/chatbot-history")}
            className="p-2 rounded-xl hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label={t("chatbot.history") || "Chat History"}
            title={t("chatbot.history") || "Chat History"}
          >
            <ClockIcon className="h-6 w-6" />
          </button>
          
          <button
            onClick={startNewConversation}
            className="p-2 rounded-xl hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label={t("chatbot.newConversation") || "New conversation"}
            title={t("chatbot.newConversation") || "New conversation"}
          >
            <PlusCircleIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto" ref={chatListRef}>
        <div className="max-w-4xl mx-auto">
          <ChatMessages 
            messages={messages} 
            loading={loading} 
            scrollRef={chatListRef} 
          />
        </div>
      </div>

      {/* Input */}
      <div className="max-w-4xl mx-auto w-full px-4 py-3">
        <ChatInput
          userText={userText}
          setUserText={setUserText}
          sendMessage={sendMessage}
          loading={loading}
          isAuthenticated={isAuthenticated}
          isOpen={true}
        />
      </div>
    </div>
  );
}
