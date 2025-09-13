// src/components/layout/Header.jsx

import React, { forwardRef, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import NotificationsBell from '../notifications/NotificationsBell';
import LanguageButton from '../common/LanguageButton';
import { useAuth } from '../../contexts/AuthContext';
import DaGalowLogo from '../../assets/images/DaGalow Logo.svg';
import HamburgerIcon from '../../assets/icons/Hamburger White.svg';
import USFlag from '../../assets/icons/US Flag.svg';
import SpainFlag from '../../assets/icons/Spain Flag.svg';
import PortugalFlag from '../../assets/icons/Portugal Flag.svg';
import BrazilFlag from '../../assets/icons/Brazil Flag.svg';

// 🎬 NEW: Motion
import { motion, useReducedMotion } from 'framer-motion';

const Header = forwardRef(({ onMenuClick }, ref) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const prefersReduced = useReducedMotion(); // respects OS "Reduce motion" setting. :contentReference[oaicite:1]{index=1}
    
    // Language bar state
    const [isLanguageBarOpen, setIsLanguageBarOpen] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);
    const languageBarRef = useRef(null);
    
    // Language options
    const languages = [
        { key: 'en', label: 'English', flag: USFlag },
        { key: 'es', label: 'Español', flag: SpainFlag },
        { key: 'pt-PT', label: 'Português PT', flag: PortugalFlag },
        { key: 'pt-BR', label: 'Português BR', flag: BrazilFlag },
    ];

    // Measure header height for positioning the language bar
    useEffect(() => {
        const updateHeaderHeight = () => {
            if (ref?.current) {
                setHeaderHeight(ref.current.offsetHeight);
            }
        };
        
        updateHeaderHeight();
        window.addEventListener('resize', updateHeaderHeight);
        return () => window.removeEventListener('resize', updateHeaderHeight);
    }, [ref]);

    // Close language bar on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (languageBarRef.current && !languageBarRef.current.contains(event.target)) {
                setIsLanguageBarOpen(false);
            }
        };

        if (isLanguageBarOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isLanguageBarOpen]);

    // Close language bar on Escape key
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsLanguageBarOpen(false);
            }
        };

        if (isLanguageBarOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isLanguageBarOpen]);

    const handleLanguageToggle = () => {
        setIsLanguageBarOpen(!isLanguageBarOpen);
    };

    const handleLanguageSelect = (languageKey) => {
        i18n.changeLanguage(languageKey);
        setIsLanguageBarOpen(false);
    };

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
        <>
        {/* Header: fade/slide in on mount. No style changes, just motion. */}
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
                <div ref={languageBarRef} className="relative">
                    <LanguageButton onClick={handleLanguageToggle} ariaExpanded={isLanguageBarOpen} />
                </div>

                {/* Notifications icon animates on press only; badge animation should be inside NotificationsBell */}
                {isAuthenticated && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.90 }} transition={{ duration: 0.12 }}>
                        <NotificationsBell />
                    </motion.div>
                )}
            </div>
        </motion.header>

        {/* Language Selection Bar */}
        {isLanguageBarOpen && (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{ top: `${headerHeight}px` }}
                className="fixed inset-x-0 z-50 bg-gradient-to-b from-[#002147] to-transparent shadow-lg"
            >
                <div className="w-full py-3">
                    <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar px-4">
                        {languages.map((lang) => {
                            const isSelected = i18n.language === lang.key;
                            return (
                                <motion.button
                                    key={lang.key}
                                    onClick={() => handleLanguageSelect(lang.key)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`
                                        px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200
                                        border-[2px] border-[#bfa200] whitespace-nowrap flex-shrink-0
                                        flex items-center gap-2
                                        ${isSelected 
                                            ? 'bg-[#002147] text-[#bfa200] shadow-lg' 
                                            : 'bg-[#002147] text-white hover:text-[#bfa200]'
                                        }
                                    `}
                                >
                                    <img 
                                        src={lang.flag} 
                                        alt={`${lang.label} flag`} 
                                        className="w-4 h-3 object-contain"
                                    />
                                    {lang.label}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        )}
        </>
    );
});

export default Header;
