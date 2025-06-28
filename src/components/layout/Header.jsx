// src/components/layout/Header.jsx

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import NotificationsBell from '../notifications/NotificationsBell';
import LanguageSelector from '../common/LanguageSelector';
import SidebarMenu from './SidebarMenu';
import DaGalowLogo from '../../assets/images/DaGalow Logo.svg';
import HamburgerIcon from '../../assets/icons/Hamburger White.svg';

export default function Header() {
    const { user, isAuthenticated } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <>
            {/* Sidebar remains unchanged */}
            <SidebarMenu 
                isOpen={sidebarOpen} 
                onClose={() => setSidebarOpen(false)} 
                isAuthenticated={isAuthenticated} 
            />

            {/* --- LAYOUT MODIFICATION --- */}
            {/* Switched from 'grid' to 'flex justify-between' to push side elements to the edges. */}
            {/* Added padding 'px-4' and ensured it's a 'relative' container for the absolute logo. */}
            <header className="sticky top-0 z-40 bg-black shadow-md h-16 flex items-center justify-between px-4 py-2 relative">
                
                {/* Left Side: Hamburger Menu */}
                {/* This is now a direct child of the flex container. */}
                <div className="flex items-center">
                    <button
                        type="button"
                        className="text-white py-2"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Open sidebar"
                    >
                        <img src={HamburgerIcon} alt="Hamburger" className="h-5 w-5" />
                    </button>
                </div>

                {/* Center: Logo (Absolutely Positioned) */}
                {/* This div is taken from the inspiration file to achieve perfect centering. */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer">
                    <img
                        src={DaGalowLogo}
                        alt="DaGalow Logo"
                        className="w-[130px]" // Increased size, similar to inspiration file
                    />
                </div>

                {/* Right Side: Actions */}
                {/* This is now a direct child of the flex container, pushed to the right. */}
                <div className="flex items-center gap-x-3">
                    <LanguageSelector />
                    <NotificationsBell />
                </div>

            </header>
        </>
    );
}