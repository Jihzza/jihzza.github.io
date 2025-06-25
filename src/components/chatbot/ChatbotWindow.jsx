// src/components/chatbot/ChatbotWindow.jsx

// --- DEPENDENCIES ---
import React, { useState, useEffect, useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

// --- COMPONENT DEFINITION ---
export default function ChatbotWindow({ isOpen, onClose }) {
  // --- STATE MANAGEMENT ---

  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [userText, setUserText] = useState("");
  const [loading, setLoading] = useState(false);

  // --- NEW: SESSION ID STATE ---
  // We use useState with a function to ensure the UUID is generated only ONCE
  // when the component first mounts. This ID will persist for the entire session.
  const [sessionId] = useState(() => crypto.randomUUID());

  // --- REFS ---
  const chatListRef = useRef(null);

  // --- EFFECTS ---
  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [messages]);

  // --- CORE LOGIC ---
  const sendMessage = async () => {
    if (!userText.trim() || loading) return;

    const newUserMessage = { from: "user", text: userText.trim() };
    setMessages((currentMessages) => [...currentMessages, newUserMessage]);

    const textToSend = userText.trim();
    setUserText("");
    setLoading(true);

    try {
      const response = await fetch("https://rafaello.app.n8n.cloud/webhook/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // --- UPDATED: The body now includes the session_id ---
        // This fulfills the data contract required by your n8n workflow and database.
        body: JSON.stringify({
          session_id: sessionId,
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
        text: "Error: Could not connect to the server.",
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
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        {/* Panel */}
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
            <Dialog.Panel className="w-full h-[85vh] bg-gray-800 text-white flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <Dialog.Title className="font-semibold">Support Assistant</Dialog.Title>
                <button onClick={onClose} className="p-1">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Message List */}
              <div ref={chatListRef} className="flex-1 p-4 space-y-4 overflow-y-auto">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.from === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`py-2 px-4 rounded-lg max-w-[80%] ${message.from === "user" ? "bg-indigo-600" : "bg-gray-600"}`}>
                      {message.text}
                    </div>
                  </div>
                ))}
                {loading && <div className="text-center text-gray-400">Bot is typing...</div>}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-700">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={userText}
                    onChange={(e) => setUserText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-grow bg-gray-700 rounded-full py-2 px-4 focus:outline-none"
                    disabled={loading}
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-indigo-600 rounded-full px-5 py-2 font-semibold disabled:bg-gray-500"
                    disabled={loading}
                  >
                    Send
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
