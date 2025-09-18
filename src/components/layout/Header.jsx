// src/components/layout/Header.jsx

import React, { forwardRef, useRef } from 'react';
import NotificationsBell from '../notifications/NotificationsBell';
import { useAuth } from '../../contexts/AuthContext';
import HamburgerButton from './HamburgerButton';
import HeaderLogo from './HeaderLogo';
import LanguageSwitcher from './LanguageSwitcher';

// 🎬 NEW: Motion
import { motion, useReducedMotion } from 'framer-motion';

const Header = forwardRef(({ onMenuClick }, ref) => {
    const { isAuthenticated } = useAuth();
    const prefersReduced = useReducedMotion();
    const languageBarContainerRef = useRef(null);

    return (
        <>
        {/* Header: fade/slide in on mount. No style changes, just motion. */}
        <motion.header
            ref={ref}
            layout
            initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.22, ease: 'easeOut' }}
            // ⬇️ keep your original classes here (unchanged)
            className="sticky top-0 z-10 bg-black backdrop-blur-sm flex flex-col px-4 py-2 md:px-6 md:py-3 relative"
        >
            {/* Top row: nav controls */}
            <div className="flex items-center">
                {/* Left: Hamburger */}
                <div className="flex items-center w-1/3">
                    <HamburgerButton onClick={onMenuClick} />
                </div>

                {/* Center: Logo */}
                <div className="flex justify-center w-2/3">
                    <HeaderLogo />
                </div>

                {/* Right: Globe + Bell */}
                <div className="flex items-center justify-end gap-x-4 lg:gap-x-8 w-1/3 ">
                    <LanguageSwitcher headerRef={ref} inlineContainerRef={languageBarContainerRef} />
                    {isAuthenticated && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.90 }} transition={{ duration: 0.12 }}>
                            <NotificationsBell />
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Inline language bar slot (filled via portal when open) */}
            <div ref={languageBarContainerRef} className="w-full" />
        </motion.header>
        {/* Language menu is handled by LanguageSwitcher */}
        </>
    );
});

export default Header;
