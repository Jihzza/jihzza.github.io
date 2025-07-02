// src/components/layout/SidebarMenu.jsx

import React, { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { Cog6ToothIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { signOut } from '../../services/authService';

// --- NEW DATA STRUCTURE ---
// The "Why": We define our links as data. This makes the component clean, readable, and easy to modify.
// We group them to easily create the "Explore" heading in the UI.

const mainPages = [
    { href: '/', label: 'Home' },
    { href: '/profile', label: 'Profile' },
    { href: '/messages', label: 'Messages' },
    { href: '/calendar', label: 'Calendar' },
];

const exploreLinks = [
    { href: '/#consultations-section', label: 'How I Can Help You' },
    { href: '/#coaching-section', label: 'Direct Coaching' },
    { href: '/#invest-section', label: 'Invest With Me' },
    { href: '/#testimonials-section', label: 'Success Stories' },
    { href: '/#media-appearances-section', label: 'Media Appearances' },
    { href: '/#other-wins-section', label: 'Other Wins' },
    // Note: These three link to the same parent section. Clicking them will scroll to the start
    // of the interactive tabs component on the homepage.
    { href: '/#interactive-sections', label: 'Social Media' },
    { href: '/#interactive-sections', label: 'FAQs' },
    { href: '/#interactive-sections', label: 'Bugs' },
];


export default function SidebarMenu({ isOpen, onClose, isAuthenticated, style }) {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        onClose();
        navigate('/login');
    };

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Overlay / Backdrop */}
                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity ease-linear duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-linear duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60" />
                </Transition.Child>

                {/* Sidebar Panel */}
                <div className="fixed left-0 flex" style={style}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-in-out duration-300 transform"
                        enterFrom="-translate-x-full"
                        enterTo="translate-x-0"
                        leave="transition ease-in-out duration-300 transform"
                        leaveFrom="translate-x-0"
                        leaveTo="-translate-x-full"
                    >
                        <Dialog.Panel className="relative flex w-[70vw] h-full">
                            <div className="flex flex-grow flex-col gap-y-5 overflow-y-auto bg-black px-6 py-4 text-white">
                                <nav className="flex flex-1 flex-col">
                                    <ul role="list" className="flex flex-1 flex-col gap-y-4">
                                        
                                        {/* --- NEW LINK RENDERING LOGIC --- */}
                                        
                                        {/* Main Pages List */}
                                        <li>
                                            <ul role="list" className="-mx-2 space-y-1">
                                                {mainPages.map((item) => (
                                                    <li key={item.label}>
                                                        <Link
                                                            to={item.href}
                                                            onClick={onClose}
                                                            className="block rounded-md px-2 py-2 text-base leading-6 text-white hover:bg-white/10 hover:text-yellow-400"
                                                        >
                                                            {item.label}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>

                                        {/* Explore Section List */}
                                        <li>
                                            <div className="text-sm font-semibold leading-6 text-yellow-400">Explore</div>
                                            <ul role="list" className="-mx-2 mt-2 space-y-1">
                                                {exploreLinks.map((item) => (
                                                    <li key={item.label}>
                                                        <Link
                                                            to={item.href}
                                                            onClick={onClose}
                                                            className="block rounded-md px-2 py-2 text-base leading-6 text-white hover:bg-white/10 hover:text-yellow-400"
                                                        >
                                                            {item.label}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                        
                                        {/* --- BOTTOM SECTION (Unchanged as requested) --- */}
                                        <li className="mt-auto">
                                            <Link
                                                to="/profile/account-settings"
                                                onClick={onClose}
                                                className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm leading-6 text-white hover:bg-white/10"
                                            >
                                                <Cog6ToothIcon className="h-6 w-6 shrink-0" />
                                                Settings
                                            </Link>
                                            <button 
                                                onClick={handleSignOut} 
                                                className="group -mx-2 flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-white hover:bg-white/10"
                                            >
                                                <ArrowLeftOnRectangleIcon className="h-6 w-6 shrink-0" />
                                                Log Out
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}