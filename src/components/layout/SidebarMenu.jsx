// src/components/layout/SidebarMenu.jsx

import React, { Fragment } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { Cog6ToothIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { signOut } from '../../services/authService';
import { useTranslation } from 'react-i18next'; // 1. Import the hook

// 2. Define static data for links. Only the hrefs remain, as labels will be translated.
const mainPagesHrefs = ['/', '/profile', '/messages', '/calendar'];
const exploreLinksHrefs = [
    '/#consultations-section', '/#coaching-section', '/#invest-section',
    '/#testimonials-section', '/#media-appearances-section', '/#other-wins-section',
    '/#interactive-sections', '/#interactive-sections', '/#interactive-sections'
];


export default function SidebarMenu({ isOpen, onClose, isAuthenticated = true, style }) {
    const { t } = useTranslation(); // 3. Initialize the hook
    const navigate = useNavigate();
    const location = useLocation();

    // 4. Dynamically create the link arrays by combining static hrefs with translated labels.
    const mainPages = (t('sidebar.mainPages', { returnObjects: true }) || []).map((item, index) => ({
        ...item,
        href: mainPagesHrefs[index]
    }));

    const exploreLinks = (t('sidebar.exploreLinks', { returnObjects: true }) || []).map((item, index) => ({
        ...item,
        href: exploreLinksHrefs[index]
    }));


    const handleSignOut = async () => {
        await signOut();
        onClose();
        navigate('/login');
    };

    const handleLinkClick = (href) => {
        onClose();
        if (href.includes('#')) {
            const [path, id] = href.split('#');
            if (path && location.pathname !== path) {
                navigate(path);
                setTimeout(() => {
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            } else {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate(href);
        }
    };

    // 5. Render component using translated text
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/60" 
                onClick={onClose}
            />
            
            {/* Sidebar */}
            <div 
                className="fixed left-0 top-0 h-full w-[70vw] md:w-[50vw] lg:[30vw] bg-black text-white"
                style={style}
            >
                <div className="flex flex-grow flex-col gap-y-5 overflow-y-auto px-6 py-2 md:py-6">
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col">
                            <li>
                                <ul role="list" className="-mx-2 space-y-1 md:space-y-6 lg:space-y-0">
                                    {mainPages.map((item) => (
                                        <li key={item.label}>
                                            <Link
                                                to={item.href}
                                                onClick={() => handleLinkClick(item.href)}
                                                className="block rounded-md px-2 py-2 text-base md:text-2xl lg:text-sm leading-4 text-white hover:bg-white/10 hover:text-yellow-400"
                                            >
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            <li>
                                <div className="text-sm md:text-2xl lg:text-base font-semibold leading-6 md:mt-6 lg:mt-2 text-yellow-400">{t('sidebar.explore')}</div>
                                <ul role="list" className="-mx-2 mt-2 md:mt-6 space-y-1 md:space-y-6 lg:space-y-0">
                                    {exploreLinks.map((item) => (
                                        <li key={item.label}>
                                            <Link
                                                to={item.href}
                                                onClick={() => handleLinkClick(item.href)}
                                                className="block rounded-md px-2 py-2 text-base md:text-2xl lg:text-sm leading-6 text-white hover:bg-white/10 hover:text-yellow-400"
                                            >
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            <li className="mt-auto md:mt-6 md:space-y-6">
                                <Link
                                    to="/settings"
                                    onClick={() => handleLinkClick('/settings')}
                                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm md:text-2xl lg:text-base leading-6 text-white hover:bg-white/10 items-center"
                                >
                                    {t('sidebar.settings')}
                                </Link>
                                <button 
                                    onClick={handleSignOut} 
                                    className="group -mx-2 flex w-full gap-x-3 rounded-md md:text-2xl lg:text-base p-2 text-sm font-semibold leading-6 text-white hover:bg-white/10 items-center"
                                >
                                    {t('sidebar.logout')}
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
}