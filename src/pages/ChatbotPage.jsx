// src/pages/ChatbotPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // adjust path if different
import { useTranslation } from "react-i18next";
import { ArrowLeftIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

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

  const WELCOME_ENDPOINT = import.meta.env.VITE_N8N_WELCOME_WEBHOOK_URL;

  // ---- Initializer: load messages first, then (maybe) send welcome ----
  useEffect(() => {
    if (!user?.id || !sessionId) return;
    if (initedSessionsRef.current.has(sessionId)) return; // already initialized this session
    initedSessionsRef.current.add(sessionId);

    (async () => {
      setLoading(true);
      try {
        // 1) Load any prior messages for this session
        let mapped = [];
        try {
          const { data, error } = await getMessagesBySession(user.id, sessionId);
          if (error) throw error;
          mapped = (data ?? []).map((m) => ({
            from: m.role === "assistant" ? "bot" : "user",
            text: m.content,
            created_at: m.created_at,
          }));
          setMessages(mapped);
        } catch (e) {
          console.error("getMessagesBySession failed:", e);
        }

        // 2) Only welcome when it’s truly a brand-new session:
        // - no :sessionId in URL
        // - DB returned 0 messages
        // - we haven’t welcomed this session before in this tab
        const welcomedKey = `welcomed:${sessionId}`;
        if (!isExistingSession && mapped.length === 0 && !sessionStorage.getItem(welcomedKey)) {
          if (WELCOME_ENDPOINT) {
            try {
              const res = await fetch(WELCOME_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_id: sessionId, user_id: user?.id }),
              });
              const raw = await res.json();
              const item = Array.isArray(raw) ? raw[0] : raw;
              const { content, value, output } = item || {};
              const text = content ?? value ?? output ?? "👋";
              setMessages((prev) => [...prev, { from: "bot", text }]);
              sessionStorage.setItem(welcomedKey, "1");
            } catch (e) {
              console.error("Welcome fetch failed:", e);
            }
          }
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id, sessionId, isExistingSession, WELCOME_ENDPOINT]);

  // ---- Start a brand-new conversation (header icon) ----
  const startNewConversation = () => {
    // Clear the current session id and welcome flag
    try {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(`welcomed:${sessionId}`);
    } catch {}
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

    const webhooks = [
      "https://rafaello.app.n8n.cloud/webhook/filter",
      "https://rafaello.app.n8n.cloud/webhook/decision",
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
      {/* Header (with New Conversation icon) */}
      <div className="sticky top-0 z-10 bg-[#002147] border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3 lg:gap-1">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label={t("common.back") || "Back"}
          >
            <ArrowLeftIcon className="h-6 w-6 lg:h-4 lg:w-4" />
          </button>

          <h1 className="text-lg md:text-xl lg:text-lg">
            {"Back"}
          </h1>

          <div className="ml-auto">
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
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto" ref={chatListRef}>
        <div className="max-w-4xl mx-auto">
          <ChatMessages messages={messages} loading={loading} scrollRef={chatListRef} />
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
