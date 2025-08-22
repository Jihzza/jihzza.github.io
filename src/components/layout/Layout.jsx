import React, { useState, useRef, useLayoutEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

// --- CHILD COMPONENT IMPORTS ---
import Header from './Header';
import NavigationBar from './NavigationBar';
import SidebarMenu from './SidebarMenu';
import { useAuth } from '../../contexts/AuthContext';

// --- HOOKS ---
// For maintainability, this should be in its own file (e.g., /src/hooks/useVisualViewport.js)
// and imported here, but is included for completeness.
function useVisualViewport() {
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  React.useEffect(() => {
    if (!window.visualViewport) return;

    const handleResize = () => {
      setViewport({
        width: window.visualViewport.width,
        height: window.visualViewport.height,
      });
    };

    window.visualViewport.addEventListener('resize', handleResize);
    handleResize(); // Set initial size

    return () => window.visualViewport.removeEventListener('resize', handleResize);
  }, []);

  return viewport;
}


export default function Layout() {
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
  const { isAuthenticated } = useAuth();
  
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
      setNavigationHistory(prev => prev.slice(0, -1));
    } else {
      // Normal navigation - add current path to history and navigate to new path
      if (currentPath !== path) {
        setNavigationHistory(prev => [...prev, currentPath]);
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
  React.useEffect(() => {
    if (location.pathname !== currentPath) {
      setCurrentPath(location.pathname);
    }
  }, [location.pathname, currentPath]);

  // --- RENDER LOGIC ---
  return (
    // This is the main application container.
    // By setting its height to the `viewport.height`, we ensure that the entire
    // application resizes when the keyboard appears, preventing overlap.
    <div 
      className="h-full w-full flex flex-col bg-gradient-to-br from-[#001122] to-[#002147]" 
      style={{ height: viewport.height }}
    >
      <Header ref={headerRef} onMenuClick={handleMenuClick} />
      
      <SidebarMenu 
        isOpen={isMenuOpen} 
        onClose={handleCloseMenu} 
        onNavigate={handleNavigate} 
        topOffset={headerHeight}
        isAuthenticated={isAuthenticated}
        style={{ top: headerHeight }}
      />

      <main 
        ref={mainContentRef} 
        className="flex-grow overflow-y-auto w-full overflow-x-hidden"
        
      >
        <Outlet />
      </main>

      
      {/* The NavigationBar is now conditionally rendered.
        This prevents it from occupying space or being visible when the chat is open,
        which is the desired behavior for a clean mobile keyboard experience.
      */}
      {!isChatbotOpen && (
         <div ref={navBarRef}>
            <NavigationBar
                isChatbotOpen={isChatbotOpen}
                onChatClick={handleChatClick}
                onNavigate={handleNavigate}
            />
        </div>
      )}
    </div>
  );
}