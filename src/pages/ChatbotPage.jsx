// src/pages/ChatbotPage.jsx

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const WEBHOOK_URL = 'https://rafaello.app.n8n.cloud/webhook/decision';
const SESSION_STORAGE_KEY = 'chatbot-session-id';

export default function ChatbotPage() {
  const { user, isAuthenticated } = useAuth();

  const [sessionId, setSessionId] = useState(() => {
    const cached = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (cached) return cached;
    const id = typeof crypto?.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(SESSION_STORAGE_KEY, id);
    return id;
  });

  const [messages, setMessages] = useState(() => []);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
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

  // Consume pending welcome message once the user visits the chat page
  useEffect(() => {
    try {
      const msg = sessionStorage.getItem('pending_welcome_message');
      if (msg) {
        setMessages((prev) => [...prev, { role: 'assistant', content: msg }]);
        sessionStorage.removeItem('pending_welcome_message');
        window.dispatchEvent(new CustomEvent('welcomeMessageConsumed'));
      }
    } catch {}
  }, []);

  const handleSend = async () => {
    if (!canSend) return;

    const content = inputValue.trim();
    setInputValue('');
    setMessages((prev) => [...prev, { role: 'user', content }]);
    setIsSending(true);

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id ?? null,
          session_id: sessionId,
          // Send both keys for compatibility with existing workflows
          content,
          message: content,
        }),
      });

      let text = '';
      try {
        const data = await res.json();
        const first = Array.isArray(data) ? data[0] : data;
        text = first?.content ?? first?.value ?? first?.output ?? '';
      } catch (_) {
        // fall through to generic error below
      }

      if (!res.ok || !text) {
        text = "Sorry, I couldn't process that. Please try again.";
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: text }]);
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

  return (
    <div className="flex flex-col h-full bg-[#002147] text-white">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#002147]">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Chatbot</h1>
          <div className="text-xs opacity-75">Session: {sessionId.slice(0, 8)}</div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-3 py-4 space-y-3">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm md:text-base shadow-sm ${
                  m.role === 'user'
                    ? 'bg-[#BFA200] text-black'
                    : 'bg-white/10 text-white border border-white/20'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {isSending && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl px-3 py-2 text-sm bg-white/10 text-white border border-white/20 shadow-sm">
                Typing...
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
              className={`w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl py-3 pl-4 pr-24 text-white placeholder:text-white/50 focus:outline-none focus:ring focus:ring-white/30 md:text-base resize-none`}
            />
            <button
              onClick={handleSend}
              disabled={!canSend}
              className={`absolute right-2 bottom-2 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                canSend ? 'bg-[#BFA200] text-black hover:opacity-90' : 'bg-white/10 text-white/50 cursor-not-allowed'
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


