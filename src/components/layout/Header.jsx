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
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogoClick = (e) => {
        if (location.pathname === '/') {
            e.preventDefault();
            const topElement = document.getElementById('page-top');
            if (topElement) {
                topElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <header ref={ref} className="sticky top-0 z-10 bg-black shadow-md h-14 flex items-center px-4 py-2 md:px-6 md:py-8 relative md:h-19 lg:h-14">
            <div className="flex items-center w-1/3">
                <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-white"
                    onClick={onMenuClick}
                >
                    <img src={HamburgerIcon} alt="Hamburger Icon" className="h-7 w-5 md:h-7 md:w-7" />
                </button>
            </div>

            <div className="flex justify-center w-2/3">
                <Link to="/" onClick={handleLogoClick}>
                    <img src={DaGalowLogo} alt="DaGalow Logo" className="w-[134px] md:w-[180px]" />
                </Link>
            </div>

            <div className="flex items-center justify-end gap-x-4 lg:gap-x-8 w-1/3">
                <LanguageSelector />
                {/* This component is now self-sufficient. The Header doesn't need to know how it works. */}
                {isAuthenticated && <NotificationsBell />}
            </div>
        </header>
    );
});

export default Header;