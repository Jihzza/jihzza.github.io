// src/components/chatbot/ChatbotWindow.jsx

// --- DEPENDENCIES ---
import React, { useState, useEffect, useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../contexts/AuthContext";

// --- COMPONENT DEFINITION ---
export default function ChatbotWindow({ isOpen, onClose, style }) {
  // --- AUTHENTICATION & STATE MANAGEMENT ---
  const { user, isAuthenticated } = useAuth();

  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! I am your personal assistant. How can I help you today?" },
  ]);
  const [userText, setUserText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());

  // --- REFS ---
  const chatListRef = useRef(null);
  const inputRef = useRef(null);

  // --- EFFECTS ---
  // Scrolls to the bottom of the chat list when new messages are added
  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [messages]);

  // Focuses the input field when the chat window opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // --- CORE LOGIC: SENDING A MESSAGE ---
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

  // --- RENDER (JSX) ---
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* The "Why": The overlay provides visual context, dimming the background
          to focus the user's attention on the chatbot window itself.
        */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        {/* The "Why": The main panel uses a flex container at the bottom of the screen.
          The transition properties `translate-y-full` and `translate-y-0` create the
          desired slide-up and slide-down animation, providing a smooth and
          professional user experience.
        */}
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
            <Dialog.Panel className="w-full bg-[#002147] h-[85vh] max-h-[700px] bg-gray-800 text-white rounded-t-2xl shadow-2xl flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-blue-900/50 flex justify-between items-center flex-shrink-0">
                <Dialog.Title className="font-semibold text-lg">Support Assistant</Dialog.Title>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-blue-900">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Message List */}
              <div ref={chatListRef} className="flex-1 p-4 space-y-4 overflow-y-auto">
              {messages.map((message, index) => (
                  <div key={index} className={`flex items-end gap-2 ${message.from === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`py-2 px-4 rounded-xl max-w-[80%] ${
                      message.from === "user" 
                        ? "bg-indigo-600" 
                        // CHANGE THIS LINE
                        : "bg-gray-700" 
                    }`}>
                      {message.text}
                    </div>
                  </div>
                ))}
                {loading && (
                    <div className="flex items-end gap-2 justify-start">
                        <div className="bg-gray-600 px-4 py-2 rounded-xl">
                            <span className="animate-pulse">...</span>
                        </div>
                    </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-blue-900/50">
                {/* ADD a relative container */}
                <div className="relative flex items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={userText}
                    onChange={(e) => setUserText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type your message..."
                    // CHANGE: Update styling for the input field
                    className="w-full bg-gray-700 rounded-full py-3 pl-4 pr-14 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-600"
                    disabled={loading || !isAuthenticated}
                  />
                  <button
                    onClick={sendMessage}
                    // CHANGE: Position the button inside the input
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 rounded-full p-2 font-semibold disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors hover:bg-indigo-700"
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