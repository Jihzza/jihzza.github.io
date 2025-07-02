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
    
    // --- The "Why" behind useLayoutEffect ---
    // We use useLayoutEffect instead of useEffect because it fires synchronously
    // after all DOM mutations. This is preferred for DOM measurements to avoid a
    // "flicker" where the user might briefly see the component in a pre-styled state.
    useLayoutEffect(() => {
        const updateSidebarStyle = () => {
            if (headerRef.current && navBarRef.current) {
                const headerRect = headerRef.current.getBoundingClientRect();
                const navBarRect = navBarRef.current.getBoundingClientRect();

                // Calculate the top position (bottom of header) and the exact height
                // between the header and the navigation bar.
                const top = headerRect.bottom;
                const height = navBarRect.top - headerRect.bottom;

                setSidebarStyle({ top, height });
            }
        };

        // Run the calculation immediately
        updateSidebarStyle();

        // Add an event listener to re-calculate on window resize for a responsive layout
        window.addEventListener('resize', updateSidebarStyle);

        // Cleanup: remove the event listener when the component unmounts
        return () => window.removeEventListener('resize', updateSidebarStyle);
    }, [location]); // Re-run if the location changes, as page content might affect layout.

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
        <div className="h-full w-full flex flex-col bg-gradient">
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

            {/* The ref is passed to the NavigationBar */}
            <NavigationBar ref={navBarRef} onChatClick={handleChatbotToggle} />

            {chatbotOpen && <ChatbotWindow onClose={handleChatbotToggle} />}
        </div>
    );
};

export default Layout;