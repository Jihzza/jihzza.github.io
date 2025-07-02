// src/components/layout/Header.jsx

import React, { useState, forwardRef } from 'react'; // Import forwardRef
import { Link } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';
import NotificationsBell from '../notifications/NotificationsBell';
import LanguageSelector from '../common/LanguageSelector';
import { useAuth } from '../../contexts/AuthContext';
import DaGalowLogo from '../../assets/images/DaGalow Logo.svg';
import HamburgerIcon from '../../assets/icons/Hamburger White.svg';

const Header = forwardRef(({ onMenuClick }, ref) => {
    const { isAuthenticated } = useAuth();

    return (
        <header ref={ref} className="sticky top-0 z-40 bg-black shadow-md h-14 flex items-center justify-between px-4 py-2 relative">
            <div className="flex items-center">
                <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-white"
                    onClick={onMenuClick} // Fire the event handler from props.
                >
                    <img src={HamburgerIcon} alt="Hamburger Icon" className="h-5 w-5" />
                </button>
            </div>

            <div className="flex-1 flex justify-center px-2">
                <Link to="/">
                    <img src={DaGalowLogo} alt="DaGalow Logo" className="w-[134px]" />
                </Link>
            </div>

            <div className="flex items-center gap-x-4">
                <LanguageSelector />
                {isAuthenticated && <NotificationsBell />}
            </div>
            
            {/* The SidebarMenu component is no longer rendered here. */}
        </header>
    );
});

export default Header;