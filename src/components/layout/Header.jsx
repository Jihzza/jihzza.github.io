// src/components/layout/Header.jsx

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Bars3Icon } from '@heroicons/react/24/outline';
import NotificationsBell from '../notifications/NotificationsBell';
import LanguageSelector from '../common/LanguageSelector';
import SidebarMenu from './SidebarMenu';
import DaGalowLogo from '../../assets/images/DaGalow Logo.svg';

export default function Header() {
    const { user, isAuthenticated } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <>
            <SidebarMenu 
                isOpen={sidebarOpen} 
                onClose={() => setSidebarOpen(false)} 
                isAuthenticated={isAuthenticated} 
            />

            {/* STYLING UPDATE: Added a fixed height of h-16 (4rem) to the header. */}
            {/* This is critical for the sidebar to know where its top boundary should be. */}
            <header className="sticky top-0 z-40 bg-black shadow-md h-16">
                <div className="grid grid-cols-3 items-center h-full p-2 mx-auto max-w-7xl">

                    <div className="flex items-center justify-self-start">
                        <button
                            type="button"
                            className="p-2 text-white"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Open sidebar"
                        >
                            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>

                    <div className="flex items-center justify-self-center">
                        <img src={DaGalowLogo} alt="DaGalow Logo" className="h-6" />
                    </div>

                    <div className="flex items-center justify-self-end">
                        <LanguageSelector />
                        <NotificationsBell />
                    </div>
                </div>
            </header>
        </>
    );
}