// src/components/layout/Header.jsx

import React, { forwardRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';
import NotificationsBell from '../notifications/NotificationsBell';
import LanguageSelector from '../common/LanguageSelector';
import { useAuth } from '../../contexts/AuthContext';
import DaGalowLogo from '../../assets/images/DaGalow Logo.svg';
import HamburgerIcon from '../../assets/icons/Hamburger White.svg';

const Header = forwardRef(({ onMenuClick }, ref) => {
    const { isAuthenticated } = useAuth();
    // --- CHANGE 2: INITIALIZE THE HOOKS ---
    const location = useLocation();
    const navigate = useNavigate();

    // --- CHANGE 3: CREATE THE SMART CLICK HANDLER ---
    // The "Why": This function contains the core logic. It checks the current
    // page and decides whether to scroll or navigate.
    const handleLogoClick = (e) => {
        // Is the current page the homepage ('/')?
        if (location.pathname === '/') {
            // If yes, prevent the default link behavior to stop a page refresh.
            e.preventDefault();
            // Find our anchor element from Step 1.
            const topElement = document.getElementById('page-top');
            // If the element exists, scroll to it smoothly.
            if (topElement) {
                topElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
        // If we are not on the homepage, the `onClick` handler does nothing,
        // and the <Link> component will navigate to "/" as it normally would.
    };

    return (
        <header ref={ref} className="sticky top-0 z-40 bg-black shadow-md h-14 flex items-center justify-between px-4 py-2 relative">
            <div className="flex items-center">
                <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-white"
                    onClick={onMenuClick}
                >
                    <img src={HamburgerIcon} alt="Hamburger Icon" className="h-5 w-5" />
                </button>
            </div>

            <div className="flex-1 flex justify-center px-2">
                {/* --- CHANGE 4: ATTACH THE CLICK HANDLER --- */}
                {/* The "Why": We attach our new `handleLogoClick` function to the `onClick`
                    event of the Link wrapping the logo. */}
                <Link to="/" onClick={handleLogoClick}>
                    <img src={DaGalowLogo} alt="DaGalow Logo" className="w-[134px]" />
                </Link>
            </div>

            <div className="flex items-center gap-x-4">
                <LanguageSelector />
                {isAuthenticated && <NotificationsBell />}
            </div>
        </header>
    );
});

export default Header;