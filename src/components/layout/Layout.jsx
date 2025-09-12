import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

// --- CHILD COMPONENT IMPORTS ---
import Header from './Header';
import NavigationBar from './NavigationBar';
import SidebarMenu from './SidebarMenu';
import { useAuth } from '../../contexts/AuthContext';
import { ScrollRootContext } from '../../contexts/ScrollRootContext';

// --- HOOKS ---
// For maintainability, this should be in its own file (e.g., /src/hooks/useVisualViewport.js)
// and imported here, but is included for completeness.
function useVisualViewport() {
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const handleResize = () => {
      setViewport({
        width: vv.width,
        height: vv.height,
      });
    };

    vv.addEventListener('resize', handleResize);
    vv.addEventListener('scroll', handleResize);
    handleResize(); // Set initial size

    return () => {
      vv.removeEventListener('resize', handleResize);
      vv.removeEventListener('scroll', handleResize);
    };
  }, []);

  return viewport;
}

export default function Layout() {
  // --- STATE ---
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isChatbotOpen, setChatbotOpen] = useState(false);

  const headerRef = useRef(null);
  const navBarRef = useRef(null);
  const mainContentRef = useRef(null);

  const [headerHeight, setHeaderHeight] = useState(0);
  const [navBarHeight, setNavBarHeight] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const viewport = useVisualViewport(); // Use the keyboard-aware viewport hook
  const { isAuthenticated, user } = useAuth();

  // Track navigation history for go back functionality
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [currentPath, setCurrentPath] = useState(location.pathname);

  // --- HANDLERS ---
  const handleMenuClick = () => setMenuOpen(!isMenuOpen);
  const handleChatClick = () => setChatbotOpen(!isChatbotOpen);
  const handleCloseMenu = () => setMenuOpen(false);

  const handleNavigate = (path) => {
    // If clicking on the current active page, go back to previous page
    if (path === currentPath && navigationHistory.length > 0) {
      const previousPath = navigationHistory[navigationHistory.length - 1];
      navigate(previousPath);
      // Remove the last item from history since we're going back
      setNavigationHistory((prev) => prev.slice(0, -1));
    } else {
      // Normal navigation - add current path to history and navigate to new path
      if (currentPath !== path) {
        setNavigationHistory((prev) => [...prev, currentPath]);
        setCurrentPath(path);
      }
      navigate(path);
    }
    handleCloseMenu();
  };

  // --- LIFECYCLE HOOKS ---
  useLayoutEffect(() => {
    setHeaderHeight(headerRef.current?.offsetHeight || 0);
    setNavBarHeight(navBarRef.current?.offsetHeight || 0);
  }, [location.pathname]); // Recalculate on route change

  // Update current path when location changes (for external navigation)
  useEffect(() => {
    if (location.pathname !== currentPath) {
      setCurrentPath(location.pathname);
    }
  }, [location.pathname, currentPath]);

  // --- WELCOME PREVIEW TOAST STATE ---
  const [toastOpen, setToastOpen] = useState(false);
  const [toastText, setToastText] = useState('');
  const toastTimerRef = useRef(null);

  const showWelcomeToast = (text) => {
    if (!text || location.pathname.startsWith('/chat')) return; // don't show on chat page
    const cleaned = (text || '').replace(/\s+/g, ' ').trim();
    const preview = cleaned.length > 120 ? `${cleaned.slice(0, 120)}…` : cleaned;
    setToastText(preview || '');
    setToastOpen(true);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastOpen(false), 6500);
  };

  useEffect(() => () => clearTimeout(toastTimerRef.current), []);

  // Listen for chat:welcome events & read cached preview (if any)
  useEffect(() => {
    const handler = (e) => {
      const txt = e?.detail?.text || '';
      try { sessionStorage.setItem('welcome_toast_shown', '1'); } catch {}
      showWelcomeToast(txt);
    };

    window.addEventListener('chat:welcome', handler);

    // Seed from cache if present and not yet shown in this tab
    try {
      const cached = sessionStorage.getItem('welcome_preview_text');
      const already = sessionStorage.getItem('welcome_toast_shown');
      if (cached && !already && !location.pathname.startsWith('/chat')) {
        showWelcomeToast(cached);
        sessionStorage.setItem('welcome_toast_shown', '1');
      }
    } catch {}

    return () => window.removeEventListener('chat:welcome', handler);
  }, [location.pathname]);

  // --- OPTIONAL: Trigger n8n welcome WF site-wide on first load (once per tab). ---
  // If this fails due to CORS in dev, the toast will still appear when ChatbotPage dispatches
  // the `chat:welcome` event.
  useEffect(() => {
    const WELCOME_ENDPOINT = import.meta.env.VITE_N8N_WELCOME_WEBHOOK_URL;
    if (!WELCOME_ENDPOINT) return; // no endpoint configured

    const SESSION_KEY = 'chatbot-session-id';
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = typeof crypto?.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(SESSION_KEY, sid);
    }

    const welcomedKey = `welcomed:${sid}`;
    if (sessionStorage.getItem(welcomedKey)) return; // already fired
    sessionStorage.setItem(welcomedKey, '1'); // guard against double-run

    const payload = {
      session_id: sid,
      user_id: isAuthenticated ? (user?.id ?? null) : null,
      path: location.pathname,
      referrer: document.referrer || null,
      ts: new Date().toISOString(),
    };

    fetch(WELCOME_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    })
      .then(async (res) => {
        // Try to extract a preview for the toast
        try {
          const raw = await res.json();
          const first = Array.isArray(raw) ? raw[0] : raw;
          const text = first?.content ?? first?.value ?? first?.output ?? '';
          if (text) {
            sessionStorage.setItem('welcome_preview_text', text);
            if (!location.pathname.startsWith('/chat')) showWelcomeToast(text);
          }
        } catch {}
      })
      .catch(() => {
        // Ignore (likely CORS in dev); the chat page will raise the event instead
      });
    // run only once
  }, []);

  // --- RENDER LOGIC ---
  return (
    // This is the main application container.
    // By setting its height to the `viewport.height`, we ensure that the entire
    // application resizes when the keyboard appears, preventing overlap.
    <div
      className="h-full w-full flex flex-col bg-[#002147]"
      style={{ height: viewport.height }}
    >
      <Header ref={headerRef} onMenuClick={handleMenuClick} />

      <SidebarMenu
        isOpen={isMenuOpen}
        onClose={handleCloseMenu}
        onNavigate={handleNavigate}
        topOffset={headerHeight}
        bottomOffset={navBarHeight}
        isAuthenticated={isAuthenticated}
      />

      <main ref={mainContentRef} className="flex-grow overflow-y-auto w-full overflow-x-hidden">
        <ScrollRootContext.Provider value={mainContentRef}>
          <Outlet />
        </ScrollRootContext.Provider>
      </main>

      {/* The NavigationBar is conditionally rendered. */}
      {!isChatbotOpen && (
        <div ref={navBarRef} className="relative">
          <NavigationBar
            isChatbotOpen={isChatbotOpen}
            onChatClick={handleChatClick}
            onNavigate={handleNavigate}
          />
        </div>
      )}

      {/* WELCOME PREVIEW TOAST — slides up from behind the bottom nav */}
      {!location.pathname.startsWith('/chat') && (
        <button
          type="button"
          onClick={() => navigate('/chat')}
          className={[
            'fixed left-1/2 -translate-x-1/2 w-[92%] md:w-[520px] text-left',
            'rounded-3xl border px-4 py-3 shadow-xl',
            'backdrop-blur bg-black/60 border-[#BFA200]',
            'transition-transform duration-300 ease-out',
            toastOpen ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none',
          ].join(' ')}
          style={{
            bottom: `calc(${(navBarRef.current?.offsetHeight || 0) + 8}px + env(safe-area-inset-bottom))`,
            zIndex: 60, // above nav (z-50)
          }}
          aria-live="polite"
        >
          <div className="text-[#BFA200] text-[11px] uppercase tracking-wide mb-0.5">
            New from Daniel
          </div>
          <div className="text-white text-sm md:text-base leading-snug">
            {toastText || 'Hello, my name is Daniel, how can I help you?'}
          </div>
        </button>
      )}
    </div>
  );
}
