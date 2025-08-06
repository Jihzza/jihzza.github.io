import React, { useState, useEffect, useRef, Fragment, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";

// --- CHILD COMPONENT IMPORTS ---
import DraggableHeader from "./ChatbotWindow/DraggableHeader";
import ChatMessages from "./ChatbotWindow/ChatMessages";
import ChatInput from "./ChatbotWindow/ChatInput";

/** -------------------------------------------------------------------------
 *  HOOK: useVisualViewport --------------------------------------------------
 *  Returns real‑time {@link window.visualViewport} width & height. This is a
 *  critical building‑block for mobile UX because it automatically shrinks when
 *  the software keyboard is shown – giving us an accurate "safe" area.
 * ------------------------------------------------------------------------ */
function useVisualViewport() {
  const [vp, setVp] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    if (!window.visualViewport) return;
    const handleResize = () => setVp({ width: window.visualViewport.width, height: window.visualViewport.height });
    window.visualViewport.addEventListener("resize", handleResize);
    handleResize();
    return () => window.visualViewport.removeEventListener("resize", handleResize);
  }, []);

  return vp;
}

/** -------------------------------------------------------------------------
 *  COMPONENT: ChatbotWindow -------------------------------------------------
 *  • Sheet is offset upward by the NavigationBar height **only when** the
 *    keyboard is not showing, so the NavBar remains visible. While typing
 *    (keyboard visible) we lock the sheet to the very bottom (offset = 0),
 *    thereby covering the NavBar (which is also physically behind the
 *    software keyboard on most devices).
 * ------------------------------------------------------------------------ */
export default function ChatbotWindow({ isOpen, onClose, navBarHeight = 0 }) {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const viewport = useVisualViewport();

  // ----------------------------- LOCAL STATE ------------------------------
  const [messages, setMessages] = useState([]);
  const [userText, setUserText] = useState("");
  const [loading, setLoading] = useState(false);
  const SESSION_KEY = 'chatbot-session-id';
  const [sessionId] = useState(() => {
    const cached = sessionStorage.getItem(SESSION_KEY);
    if (cached) return cached;            // reuse across welcome + prompts
    const id = crypto.randomUUID();       // generate once per tab
    sessionStorage.setItem(SESSION_KEY, id);
    return id;
  }); const chatListRef = useRef(null);
  const hasFetchedWelcome = useRef(false);
  const WELCOME_ENDPOINT = import.meta.env.VITE_N8N_WELCOME_WEBHOOK_URL;

  // -----------------------------------------------------------------------
  // Detect software‑keyboard presence. We assume that if the viewport height
  // shrank by >= 120px relative to the *original* window.innerHeight then the
  // keyboard is up. Tune the 120px threshold if needed for edge cases.
  // -----------------------------------------------------------------------
  const initialWindowHeight = useRef(window.innerHeight);
  const keyboardOpen = viewport.height < initialWindowHeight.current - 120;

  //    Panel height logic --------------------------------------------------
  const MIN_HEIGHT = 120; // Header (~60) + last message stub
  const [panelHeight, setPanelHeight] = useState(() => viewport.height);
  const [dragState, setDragState] = useState({ active: false, startY: 0, startHeight: viewport.height });

  // Re‑clamp height when viewport changes ---------------------------------
  const prevVpHeightRef = useRef(viewport.height);
  useEffect(() => {
    const prev = prevVpHeightRef.current;
    if (viewport.height === prev) return;
    setPanelHeight((current) => {
      const filledPrevViewport = Math.abs(current - prev) < 24;
      if (filledPrevViewport) return viewport.height;
      return Math.min(current, viewport.height);
    });
    prevVpHeightRef.current = viewport.height;
  }, [viewport.height]);

  // -----------------------------------------------------------------------
  // Detect mobile OS navigation bar "go back" button press
  // This listens for the popstate event which is triggered when the user
  // presses the OS back button or uses browser back navigation
  // 
  // HOW IT WORKS:
  // 1. When the chatbot opens, we push a new history state with a unique identifier
  // 2. When the user presses the OS back button, the popstate event fires
  // 3. We check if the popped state is our chatbot state
  // 4. If it is, we close the chatbot (this was an OS back button press)
  // 5. If the chatbot is closed normally (via X button), we clean up the history
  //
  // BENEFITS:
  // - Provides native mobile UX where OS back button closes the chatbot
  // - Doesn't interfere with React Router's internal navigation
  // - Works across all mobile browsers and PWA environments
  // - Maintains proper browser history state
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!isOpen) return;

    // Push a new history state when chatbot opens to track OS back button
    const chatbotState = { chatbotOpen: true, timestamp: Date.now() };

    try {
      window.history.pushState(chatbotState, '', window.location.href);
    } catch (error) {
      // Fallback: if history manipulation fails, we can't track OS back button
      console.warn('Could not set history state for chatbot:', error);
      return;
    }

    const handlePopState = (event) => {
      try {
        // Check if the popped state is our chatbot state
        if (event.state && event.state.chatbotOpen) {
          // This means the user pressed the OS back button - close the chatbot
          onClose();
        }
      } catch (error) {
        // Fallback: if state checking fails, close the chatbot anyway
        console.warn('Error checking popstate:', error);
        onClose();
      }
    };

    // Add event listener for popstate (OS back button)
    window.addEventListener('popstate', handlePopState);

    // Cleanup function to remove the event listener and restore history
    return () => {
      window.removeEventListener('popstate', handlePopState);

      // If the chatbot is being closed normally (not via OS back), 
      // we need to clean up the history state we added
      try {
        if (window.history.state && window.history.state.chatbotOpen) {
          window.history.back();
        }
      } catch (error) {
        // Fallback: if history cleanup fails, just log it
        console.warn('Could not clean up chatbot history state:', error);
      }
    };
  }, [isOpen, onClose]);

  /** Handlers: Drag to resize ------------------------------------------- */
  const beginDrag = (e) => {
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragState({ active: true, startY: clientY, startHeight: panelHeight });
  };

  const onDragMove = useCallback(
    (e) => {
      if (!dragState.active) return;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const delta = dragState.startY - clientY; // positive when dragging up
      const tentative = dragState.startHeight + delta;
      const clamped = Math.max(MIN_HEIGHT, Math.min(tentative, viewport.height));
      setPanelHeight(clamped);
    },
    [dragState, viewport.height]
  );

  const endDrag = () => {
    // Check if panel height is less than 30% of viewport height
    const thirtyPercentHeight = viewport.height * 0.4;
    if (panelHeight < thirtyPercentHeight) {
      onClose(); // Automatically close the chatbot
    }
    setDragState((s) => ({ ...s, active: false }));
  };

  // Register global listeners only while dragging -------------------------
  useEffect(() => {
    if (!dragState.active) return;
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("touchmove", onDragMove);
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("touchend", endDrag);
    return () => {
      window.removeEventListener("mousemove", onDragMove);
      window.removeEventListener("touchmove", onDragMove);
      window.removeEventListener("mouseup", endDrag);
      window.removeEventListener("touchend", endDrag);
    };
  }, [dragState.active, onDragMove]);

  // --------------------------- MESSAGE LOGIC -----------------------------
  const sendMessage = async () => {
    if (!userText.trim() || loading || !isAuthenticated) return;

    const newUserMessage = { from: "user", text: userText.trim() };
    setMessages((prev) => [...prev, newUserMessage]);
    const textToSend = userText.trim();
    setUserText("");
    setLoading(true);
    console.log("→ Sending to chatbots:", textToSend, { sessionId, userId: user?.id });

    // Define multiple webhook endpoints
    const webhooks = [
      "https://rafaello.app.n8n.cloud/webhook/filter",
      "https://rafaello.app.n8n.cloud/webhook/decision",
    ];

    try {
      // Send to all webhooks simultaneously using Promise.allSettled
      const webhookPromises = webhooks.map(async (webhookUrl) => {
        try {
          const response = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              session_id: sessionId,
              chatInput: textToSend,
              user_id: user?.id
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const raw = await response.json();
          const item = Array.isArray(raw) ? raw[0] : raw;
          const { content, value, output } = item;
          const text = content ?? value ?? output ?? t("chatbot.messages.fetchError");

          return { success: true, text, source: webhookUrl };
        } catch (error) {
          console.error(`Error with webhook ${webhookUrl}:`, error);
          return {
            success: false,
            error: error.message,
            source: webhookUrl
          };
        }
      });

      // Fire-and-forget filter
      await fetch("https://rafaello.app.n8n.cloud/webhook/filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, chatInput: textToSend, user_id: user?.id })
      });

      // Now fetch the only reply you’ll display
      const res = await fetch("https://rafaello.app.n8n.cloud/webhook/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, chatInput: textToSend, user_id: user?.id })
      });
      const data = await res.json();
      const { content, value, output } = Array.isArray(data) ? data[0] : data;
      const text = content ?? value ?? output ?? t("chatbot.messages.fetchError");
      setMessages(prev => [...prev, { from: "bot", text }]);


    } catch (err) {
      console.error("ChatbotWindow.sendMessage error:", err);
      setMessages((prev) => [...prev, {
        from: "bot",
        text: t("chatbot.messages.connectionError")
      }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id && !hasFetchedWelcome.current) {
      fetchWelcome();            // includes both session_id and user_id
      hasFetchedWelcome.current = true;
    }
  }, [user?.id]); 

  async function fetchWelcome() {
    setLoading(true);
    try {
      const res = await fetch(WELCOME_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          user_id: user?.id           // matches what the workflow expects
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw = await res.json();
      const item = Array.isArray(raw) ? raw[0] : raw;   // <- n8n returns an array when “Last Node” is used :contentReference[oaicite:0]{index=0}
      const { content, value, output } = item;          // handle any of the 3 possible names
      const text = content ?? value ?? output ?? "👋";
      setMessages(prev => [...prev, { from: "bot", text }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { from: "bot", text: "Sorry, I couldn’t fetch the welcome message." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  // Reset panel height and clear input each time the window opens --------------------------------
  useEffect(() => {
    if (isOpen) {
      setUserText("");
      setPanelHeight(viewport.height); // Reset to full viewport height
    }
  }, [isOpen, viewport.height]);

  // ----------------------------- RENDER ----------------------------------
  const sheetBottomOffset = keyboardOpen ? 0 : navBarHeight; // core requirement

  return (
    <Transition.Root show={isOpen} as={Fragment} appear>
      <Dialog as="div" className="relative z-50" onClose={onClose} static>
        {/* Transparent backdrop so underlying content remains touchable except for the sheet area */}
        <div className="fixed inset-0 bg-transparent" />

        {/* Sheet container (fixed to bottom). Offset dynamically so NavBar peeks */}
        <div
          className="fixed inset-x-0 flex justify-center pointer-events-none"
          style={{ bottom: sheetBottomOffset }}
        >
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-out duration-300"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="transform transition ease-in duration-200"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <Dialog.Panel
              className="pointer-events-auto w-full max-w-md sm:max-w-lg md:max-w-xl bg-[#002147] border-t-2 border-[#bfa200] text-white rounded-t-2xl shadow-2xl flex flex-col"
              style={{ height: panelHeight, maxHeight: viewport.height }}
            >
              <DraggableHeader onClose={onClose} onDragStart={beginDrag} isDragging={dragState.active} />
              <ChatMessages messages={messages} loading={loading} scrollRef={chatListRef} />
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