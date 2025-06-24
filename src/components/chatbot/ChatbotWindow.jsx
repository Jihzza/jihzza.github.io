// src/components/chatbot/ChatbotWindow.jsx

// --- DEPENDENCIES ---
// We only need React's core hooks and the Headless UI library for the sliding panel.
import React, { useState, useEffect, useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline"; // A simple icon for the close button.
import ChatInterface from "./ChatInterface";

// --- COMPONENT DEFINITION ---
// This is a "dumb" component. It only knows how to display what it's given
// and report when the user wants to close it.
export default function ChatbotWindow({ isOpen, onClose }) {
  // --- STATE MANAGEMENT ---
  // The essential pieces of data our component needs to remember.

  // `messages`: An array of objects, where each object is a message in the chat.
  // We start it with a welcome message.
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! How can I help you today?" },
  ]);

  // `userText`: The current string of text in the input field.
  const [userText, setUserText] = useState("");

  // `loading`: A boolean that tracks if we are currently waiting for a response from the n8n server.
  const [loading, setLoading] = useState(false);

  // We use useState with a function to ensure the UUID is generated only ONCE when the component first mounts. This ID will persist for the entire session.
  const [sessionId] = useState(() => crypto.randomUUID());

  // --- REFS ---
  // A direct "pointer" to a DOM element, used here to auto-scroll the chat.
  const chatListRef = useRef(null);

  // --- EFFECTS ---
  // Code that runs in response to component lifecycle events.

  // This `useEffect` hook runs every time the `messages` array is updated.
  // Its job is to automatically scroll the chat window to the bottom to show the newest message.
  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [messages]); // The dependency array ensures this runs only when `messages` changes.

  // --- CORE LOGIC ---
  // The function that handles the main business logic of the component.

  const sendMessage = async () => {
    // 1. PRE-CONDITION CHECKS: Don't do anything if the input is empty or we're already loading.
    if (!userText.trim() || loading) return;

    // 2. UPDATE UI IMMEDIATELY: Create the user's message and add it to the state.
    // This makes the UI feel fast and responsive.
    const newUserMessage = { from: "user", text: userText.trim() };
    setMessages((currentMessages) => [...currentMessages, newUserMessage]);

    const textToSend = userText.trim();
    setUserText(""); // Clear the input field.
    setLoading(true); // Set loading to true to show a spinner and disable the input.

    // 3. API CALL: Communicate with the n8n backend.
    try {
      // Use the standard `fetch` API to send a POST request.
      const response = await fetch("https://rafaello.app.n8n.cloud/webhook/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The `body` contains the data your n8n workflow expects.
        body: JSON.stringify({
          session_id: sessionId,
          chatInput: textToSend
        }),
      });

      // If the server response is not "OK" (e.g., a 404 or 500 error), throw an error.
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      // Parse the JSON data from the response body.
      const data = await response.json();

      // Create the bot's response message object. Assume the reply is in `data.output`.
      const botMessage = {
        from: "bot",
        text: data.output || "I'm sorry, I encountered an issue.", // Provide a fallback message.
      };
      setMessages((currentMessages) => [...currentMessages, botMessage]);
    } catch (error) {
      // 4. ERROR HANDLING: If the `fetch` call fails, show an error message in the chat.
      console.error("Failed to send message:", error);
      const errorMessage = {
        from: "bot",
        text: "Error: Could not connect to the server.",
      };
      setMessages((currentMessages) => [...currentMessages, errorMessage]);
    } finally {
      // 5. CLEANUP: This `finally` block runs whether the API call succeeded or failed.
      setLoading(false); // Stop loading, re-enabling the input field.
    }
  };

  // --- RENDER (JSX) ---
  // This is the HTML-like structure of our component.
  return (
    <div className="fixed bottom-4 right-4 w-96">
      <ChatInterface
        workflowId="general-site-bot-workflow"
        initialMessage="Hello! I'm here to help you with any questions you have about our services."
        containerHeight="h-full"
      />
    </div>
  );
}
