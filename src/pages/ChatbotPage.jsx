// src/pages/ChatbotPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";           // adjust path if different
import { useTranslation } from "react-i18next";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// Reuse your existing building blocks
import ChatMessages from "../components/chatbot/ChatbotWindow/ChatMessages";
import ChatInput from "../components/chatbot/ChatbotWindow/ChatInput";

export default function ChatbotPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();

  // ---- State copied from ChatbotWindow (simplified) ----
  const [messages, setMessages] = useState([]);
  const [userText, setUserText] = useState("");
  const [loading, setLoading] = useState(false);
  const chatListRef = useRef(null);

  const SESSION_KEY = "chatbot-session-id";
  const [sessionId] = useState(() => {
    const cached = sessionStorage.getItem(SESSION_KEY);
    if (cached) return cached;
    const id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  });

  const WELCOME_ENDPOINT = import.meta.env.VITE_N8N_WELCOME_WEBHOOK_URL;

  // ---- Messaging (same behavior as in ChatbotWindow) ----
  const sendMessage = async () => {
    if (!userText.trim() || loading || !isAuthenticated) return;

    const newUserMessage = { from: "user", text: userText.trim() };
    setMessages((prev) => [...prev, newUserMessage]);
    const textToSend = userText.trim();
    setUserText("");
    setLoading(true);

    const webhooks = [
      "https://rafaello.app.n8n.cloud/webhook/filter",
      "https://rafaello.app.n8n.cloud/webhook/decision",
    ];

    try {
      // Fire off both (filter can be fire-and-forget)
      void fetch(webhooks[0], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, chatInput: textToSend, user_id: user?.id }),
      });

      const res = await fetch(webhooks[1], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, chatInput: textToSend, user_id: user?.id }),
      });

      const data = await res.json();
      const { content, value, output } = Array.isArray(data) ? data[0] : data;
      const text = content ?? value ?? output ?? t("chatbot.messages.fetchError");
      setMessages((prev) => [...prev, { from: "bot", text }]);
    } catch (err) {
      console.error("ChatbotPage.sendMessage error:", err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: t("chatbot.messages.connectionError") },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ---- Welcome message (same trigger) ----
  useEffect(() => {
    if (!user?.id || !WELCOME_ENDPOINT) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(WELCOME_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId, user_id: user?.id }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw = await res.json();
        const item = Array.isArray(raw) ? raw[0] : raw;
        const { content, value, output } = item;
        const text = content ?? value ?? output ?? "👋";
        if (!cancelled) setMessages((prev) => [...prev, { from: "bot", text }]);
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setMessages((prev) => [
            ...prev,
            { from: "bot", text: "Sorry, I couldn’t fetch the welcome message." },
          ]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id, sessionId, WELCOME_ENDPOINT]);

  // ---- Layout ----
  return (
    <div
      className="
        flex flex-col
        bg-[#002147] text-white
        h-full
      "
      style={{
        // Ensure the input sits above iOS/Android home bar if present
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >

      {/* Messages (fills remaining height, scrollable) */}
      <div className="flex-1 overflow-y-auto">
        <ChatMessages messages={messages} loading={loading} scrollRef={chatListRef} />
      </div>

      {/* Input */}
      <ChatInput
        userText={userText}
        setUserText={setUserText}
        sendMessage={sendMessage}
        loading={loading}
        isAuthenticated={isAuthenticated}
        isOpen={true} // keeps auto-focus behavior
      />
    </div>
  );
}
