// src/components/layout/Layout.jsx

import React, { useState, useRef, useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import NavigationBar from './NavigationBar';
import SidebarMenu from './SidebarMenu'; // Import SidebarMenu here
import ChatbotWindow from '../chatbot/ChatbotWindow';
import { useAuth } from '../../contexts/AuthContext';

const Layout = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    // --- State lifted from Header to Layout ---
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [chatbotOpen, setChatbotOpen] = useState(false);

    // --- State for dynamic sidebar style ---
    const [sidebarStyle, setSidebarStyle] = useState({ top: 0, height: 0 });

    // --- Refs to measure DOM elements ---
    const headerRef = useRef(null);
    const navBarRef = useRef(null);

    // This tells the exact height of the navigation bar
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

    const handleChatbotToggle = () => {
        setChatbotOpen(!chatbotOpen);
    };

    const handleMenuClick = () => {
        setSidebarOpen(true);
    };

    const handleCloseSidebar = () => {
        setSidebarOpen(false);
    }

    return (
        <div className="h-full w-full flex flex-col bg-gradi z-inde ent">
            {/* The ref and onMenuClick prop are passed to the Header */}
            <Header ref={headerRef} onMenuClick={handleMenuClick} />

            {/* SidebarMenu is now rendered here, receiving all necessary props from Layout */}
            <SidebarMenu
                isOpen={sidebarOpen}
                onClose={handleCloseSidebar}
                isAuthenticated={isAuthenticated}
                style={sidebarStyle}
            />

            <main className="flex-grow overflow-y-auto w-full">
                <Outlet />
            </main>

            <div ref={navBarRef}>
                <NavigationBar onChatClick={handleChatbotToggle} />
            </div>

            <ChatbotWindow
                isOpen={chatbotOpen}
                onClose={handleChatbotToggle}
                navBarHeight={navBarHeight}
            />
        </div>
    );
};

export default Layout;