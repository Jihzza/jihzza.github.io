import React, { useState, useEffect, useRef, Fragment, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAuth } from "../../contexts/AuthContext";

// --- CHILD COMPONENT IMPORTS ---
import DraggableHeader from "./ChatbotWindow/DraggableHeader";
import ChatMessages from "./ChatbotWindow/ChatMessages";
import ChatInput from "./ChatbotWindow/ChatInput";

// --- CONSTANTS ---
// The 'Why' of the fix: The original component used `h-full`, which resolved to 100% of the
// viewport height. This constant was incorrectly set to 90. Setting it to 100 restores
// the original, correct "full screen" initial height.
const INITIAL_HEIGHT_PERCENT = 100; // The default height of the chat window (100% of screen).
const MIN_DRAG_HEIGHT_PX = 150;    // The minimum height the window can be dragged to.
const CLOSE_THRESHOLD_PERCENT = 30; // If height is below this on release, close the window.

export default function ChatbotWindow({ isOpen, onClose, navBarHeight }) {
  // --- AUTH & MESSAGING STATE ---
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! I am your personal assistant. How can I help you today?" },
  ]);
  const [userText, setUserText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const chatListRef = useRef(null);

  // --- DRAG & RESIZE STATE ---
  const [height, setHeight] = useState(INITIAL_HEIGHT_PERCENT);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ y: 0, height: 0 });

  // --- DRAG HANDLERS ---
  const handleDragStart = useCallback((e) => {
    setIsDragging(true);
    const startY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = { y: startY, height };
    e.preventDefault();
  }, [height]);

  const handleDragMove = useCallback((e) => {
    if (!isDragging) return;
    const currentY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaY = currentY - dragStartRef.current.y;
    const newHeight = dragStartRef.current.height - (deltaY / window.innerHeight) * 100;
    
    const minHeightPercent = (MIN_DRAG_HEIGHT_PX / window.innerHeight) * 100;
    
    setHeight(Math.max(minHeightPercent, Math.min(newHeight, INITIAL_HEIGHT_PERCENT)));
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    if (height < CLOSE_THRESHOLD_PERCENT) {
      onClose();
    }
  }, [height, onClose]);
  
  // --- LIFECYCLE HOOKS ---
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("touchmove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchend", handleDragEnd);
    }
    return () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("touchmove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);
  
  useEffect(() => {
    if (isOpen) {
      setHeight(INITIAL_HEIGHT_PERCENT);
    }
  }, [isOpen]);

  // --- MESSAGING LOGIC (Unchanged) ---
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
      if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);
      const data = await response.json();
      const botMessage = { from: "bot", text: data.output || "I'm sorry, I encountered an issue." };
      setMessages((currentMessages) => [...currentMessages, botMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage = { from: "bot", text: "Error: Could not connect to the assistant." };
      setMessages((currentMessages) => [...currentMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <div className="fixed inset-0" />
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
              className="w-full bg-[#002147] border-t-2 border-[#bfa200] text-white rounded-t-2xl shadow-2xl flex flex-col"
              style={{
                height: `${height}vh`,
                paddingBottom: `${navBarHeight}px`,
                transition: isDragging ? 'none' : 'height 0.3s ease-in-out',
              }}
            >
              <DraggableHeader
                title="Support Assistant"
                onClose={onClose}
                onDragStart={handleDragStart}
                isDragging={isDragging}
                heightPercentage={(height / INITIAL_HEIGHT_PERCENT) * 100}
              />
              <ChatMessages
                messages={messages}
                loading={loading}
                scrollRef={chatListRef}
              />
              <ChatInput
                userText={userText}
                setUserText={setUserText}
                sendMessage={sendMessage}
                loading={loading}
                isAuthenticated={isAuthenticated}
                isOpen={isOpen}
              />
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}