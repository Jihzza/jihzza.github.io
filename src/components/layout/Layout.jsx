// src/components/layout/Layout.jsx

import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import NavigationBar from './NavigationBar';
import SidebarMenu from './SidebarMenu'; // Import SidebarMenu here
import ChatbotWindow from '../chatbot/ChatbotWindow';
import { useAuth } from '../../contexts/AuthContext';
import ScrollToTopButton from '../common/ScrollToTopButton'; // 1. Import the new component


const Layout = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    const [lastVisitedPage, setLastVisitedPage] = useState(null); // <-- NEW STATE
    const [sidebarStyle, setSidebarStyle] = useState({ top: 0, height: 0 });
    const headerRef = useRef(null);
    const navBarRef = useRef(null);
    const mainContentRef = useRef(null); // 2. Create a ref for the main content area
    const [navBarHeight, setNavBarHeight] = useState(0);

    // --- The "Why" behind useLayoutEffect ---
    // We use useLayoutEffect instead of useEffect because it fires synchronously
    // after all DOM mutations. This is preferred for DOM measurements to avoid a
    // "flicker" where the user might briefly see the component in a pre-styled state.
    useLayoutEffect(() => {
        const updateLayoutStyles = () => {
            const headerRect = headerRef.current?.getBoundingClientRect();
            const navBarRect = navBarRef.current?.getBoundingClientRect();

            if (headerRect && navBarRect) {
                // Sidebar style calculation (no change)
                const sidebarTop = headerRect.bottom;
                const sidebarHeight = navBarRect.top - headerRect.bottom;
                setSidebarStyle({ top: sidebarTop, height: sidebarHeight });

                // --- CHANGE 3: Set the nav bar height ---
                // The "Why": We store the measured height in our state.
                setNavBarHeight(navBarRect.height);
            }
        };

        updateLayoutStyles();
        window.addEventListener('resize', updateLayoutStyles);
        return () => window.removeEventListener('resize', updateLayoutStyles);
    }, [location]); // Re-run when the route changes

    // This function will now be passed to the NavigationBar
    const handleNavigate = (path) => {
        // If we are navigating to a new page, store the current one as the "last visited"
        if (location.pathname !== path) {
            setLastVisitedPage(location.pathname);
            navigate(path);
        } else {
            // If we are on the same page, execute the "go back" logic
            // Fallback to home ('/') if there's no history yet.
            navigate(lastVisitedPage || '/');
        }
    };
    
    const handleChatClick = () => {
        setIsChatbotOpen(prev => !prev);
    };

    const handleMenuClick = () => {
        setSidebarOpen(true);
    };

    useEffect(() => {
        // whenever the path changes, hide the chat window
        setIsChatbotOpen(false);
      }, [location.pathname]);

    const handleCloseSidebar = () => {
        setSidebarOpen(false);
    }

    return (
        <div className="h-full w-full flex flex-col bg-gradi z-inde ent">
            <Header ref={headerRef} onMenuClick={handleMenuClick} />
            <SidebarMenu
                isOpen={sidebarOpen}
                onClose={handleCloseSidebar}
                isAuthenticated={isAuthenticated}
                style={sidebarStyle}
            />

            {/* 3. Attach the ref to the main element */}
            <main ref={mainContentRef} className="flex-grow overflow-y-auto w-full">
                <Outlet />
            </main>

            {/* 4. Pass the ref to the ScrollToTopButton */}
            <ScrollToTopButton scrollContainerRef={mainContentRef} />

            <div ref={navBarRef}>
            <NavigationBar
                isChatbotOpen={isChatbotOpen}
                onChatClick={handleChatClick}
                onNavigate={handleNavigate} // <-- PASS THE NEW HANDLER
            />
            </div>

            <ChatbotWindow
                isOpen={isChatbotOpen}
                onClose={handleChatClick}
                navBarHeight={navBarHeight}
            />
        </div>
    );
};

export default Layout;