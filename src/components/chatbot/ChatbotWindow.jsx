// src/components/chatbot/ChatbotWindow.jsx

// --- DEPENDENCIES ---
import React, { useState, useEffect, useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../contexts/AuthContext";
import BotIcon from '../../assets/icons/DaGalow Branco.svg';

// --- COMPONENT DEFINITION ---
export default function ChatbotWindow({ isOpen, onClose, navBarHeight }) {
  // ... (No changes to state, refs, effects, or sendMessage logic) ...
  const { user, isAuthenticated } = useAuth();

  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! I am your personal assistant. How can I help you today?" },
  ]);
  const [userText, setUserText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());

  const chatListRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!userText.trim() || loading || !isAuthenticated) return;

    const newUserMessage = { from: "user", text: userText.trim() };
    setMessages((currentMessages) => [...currentMessages, newUserMessage]);

    const textToSend = userText.trim();
    setUserText("");
    setLoading(true);

    try {
      const response = await fetch("https://rafaello.app.n8n.cloud/webhook/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          user_id: user.id,
          chatInput: textToSend,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage = {
        from: "bot",
        text: data.output || "I'm sorry, I encountered an issue.",
      };
      setMessages((currentMessages) => [...currentMessages, botMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage = {
        from: "bot",
        text: "Error: Could not connect to the assistant.",
      };
      setMessages((currentMessages) => [...currentMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0" />
        </Transition.Child>
        <div className="fixed inset-0 flex items-end">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <Dialog.Panel 
                className="w-full h-full bg-[#002147] border-t-2 border-[#bfa200] text-white rounded-t-2xl shadow-2xl flex flex-col"
                style={{ paddingBottom: `${navBarHeight}px` }}
            >
              <div className="p-4 border-b border-blue-900/50 flex justify-between items-center flex-shrink-0">
                <Dialog.Title className="font-semibold text-lg">Support Assistant</Dialog.Title>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-blue-900">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div ref={chatListRef} className="flex-1 py-4 overflow-y-auto">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${
                      message.from === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                      {/* --- CHANGE: The message bubble is now the flex container --- */}
                      {/* The "Why": By making the bubble a flex container, we can place the
                          avatar *inside* it. `items-center` vertically aligns the icon
                          with the text, and `gap-2` provides spacing.
                      */}
                      <div className={`w-full p-4 flex items-start gap-2 ${
                          message.from === 'user'
                              ? 'justify-end'
                              : 'bg-[#333333]/70'
                      }`}>
                          
                          {/* The "Why": The icon is now inside the bubble. It's styled
                              to be slightly smaller to fit nicely.
                          */}
                          {message.from === 'bot' && (
                              <img
                                  src={BotIcon}
                                  alt="Bot Avatar"
                                  className="w-6 h-6 flex-shrink-0 "
                              />
                          )}

                          {/* The "Why": We wrap the text in a `span` to ensure it's
                              treated as a single element within the flex container.
                          */}
                          <span>{message.text}</span>
                      </div>
                  </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="w-full px-3 py-2 flex items-center gap-2 bg-[#333333]/70">
                            <img src={BotIcon} alt="Bot Avatar" className="w-6 h-6"/>
                            <span className="animate-pulse">...</span>
                        </div>
                    </div>
                )}
              </div>
              <div className="p-4">
                <div className="relative flex items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={userText}
                    onChange={(e) => setUserText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type your message..."
                    className="w-full border-2 border-[#bfa200] rounded-full py-3 pl-4 pr-14 text-white placeholder:text-white/50"
                    disabled={loading || !isAuthenticated}
                  />
                  <button
                    onClick={sendMessage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 font-semibold"
                    disabled={loading || !userText.trim() || !isAuthenticated}
                  >
                    <PaperAirplaneIcon className="h-5 w-5"/>
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}