// src/components/layout/Header.jsx

import React, { forwardRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';
import NotificationsBell from '../notifications/NotificationsBell';
import LanguageSelector from '../common/LanguageSelector';
import { useAuth } from '../../contexts/AuthContext';
import DaGalowLogo from '../../assets/images/DaGalow Logo.svg';
import HamburgerIcon from '../../assets/icons/Hamburger White.svg';

// 🎬 NEW: Motion
import { motion, useReducedMotion } from 'framer-motion';

const Header = forwardRef(({ onMenuClick }, ref) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const prefersReduced = useReducedMotion(); // respects OS “Reduce motion” setting. :contentReference[oaicite:1]{index=1}

    const handleLogoClick = (e) => {
        // If we’re already on home, smooth-scroll to the top; else navigate home.
        if (location.pathname === '/') {
            e.preventDefault();
            const topElement = document.getElementById('page-top');
            if (topElement) {
                topElement.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // Keep your existing behavior
            // (navigate back to home; the router will handle the rest)
            navigate('/');
        }
    };

    return (
        // Header: fade/slide in on mount. No style changes, just motion.
        <motion.header
            ref={ref}
            initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.22, ease: 'easeOut' }}
            // ⬇️ keep your original classes here (unchanged)
            className="sticky top-0 z-10 bg-black backdrop-blur-sm flex items-center px-4 py-2 md:px-6 md:py-8 relative md:h-19 lg:h-14"
        >
            {/* Left: Hamburger */}
            <div className="flex items-center w-1/3">
                <motion.button
                    type="button"
                    onClick={onMenuClick}
                    aria-label="Open menu"
                    whileTap={{ scale: 0.90 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.12 }}
                    className="p-2 text-gray-400 hover:text-white cursor-pointer"
                >
                    <img src={HamburgerIcon} alt="Hamburger Icon" className="h-7 w-5 md:h-7 md:w-7" />
                </motion.button>
            </div>

            {/* Center: Logo */}
            <div className="flex justify-center w-2/3">
                <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.12 }} whileHover={{ scale: 1.05 }}>
                    <Link to="/" onClick={handleLogoClick} aria-label="Go to homepage" className="cursor-pointer">
                        <img src={DaGalowLogo} alt="DaGalow Logo" className="w-[160px] md:w-[180px]" />
                    </Link>
                </motion.div>
            </div>

            {/* Right: Globe + Bell */}
            <div className="flex items-center justify-end gap-x-4 lg:gap-x-8 w-1/3 ">
                <LanguageSelector />

                {/* Notifications icon animates on press only; badge animation should be inside NotificationsBell */}
                {isAuthenticated && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.90 }} transition={{ duration: 0.12 }}>
                        <NotificationsBell />
                    </motion.div>
                )}
            </div>
        </motion.header>
    );
});

export default Header;
