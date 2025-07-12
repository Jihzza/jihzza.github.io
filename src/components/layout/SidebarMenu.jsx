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


export default function SidebarMenu({ isOpen, onClose, isAuthenticated, style }) {
    const { t } = useTranslation(); // 3. Initialize the hook
    const navigate = useNavigate();
    const location = useLocation();

    // 4. Dynamically create the link arrays by combining static hrefs with translated labels.
    const mainPages = t('sidebar.mainPages', { returnObjects: true }).map((item, index) => ({
        ...item,
        href: mainPagesHrefs[index]
    }));

    const exploreLinks = t('sidebar.exploreLinks', { returnObjects: true }).map((item, index) => ({
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
    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                                        <li>
                                            <ul role="list" className="-mx-2 space-y-1">
                                                {mainPages.map((item) => (
                                                    <li key={item.label}>
                                                        <Link
                                                            to={item.href}
                                                            onClick={() => handleLinkClick(item.href)}
                                                            className="block rounded-md px-2 py-2 text-base leading-6 text-white hover:bg-white/10 hover:text-yellow-400"
                                                        >
                                                            {item.label}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                        <li>
                                            <div className="text-sm font-semibold leading-6 text-yellow-400">{t('sidebar.explore')}</div>
                                            <ul role="list" className="-mx-2 mt-2 space-y-1">
                                                {exploreLinks.map((item) => (
                                                    <li key={item.label}>
                                                        <Link
                                                            to={item.href}
                                                            onClick={() => handleLinkClick(item.href)}
                                                            className="block rounded-md px-2 py-2 text-base leading-6 text-white hover:bg-white/10 hover:text-yellow-400"
                                                        >
                                                            {item.label}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                        <li className="mt-auto">
                                            <Link
                                                to="/profile/account-settings"
                                                onClick={() => handleLinkClick('/profile/account-settings')}
                                                className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm leading-6 text-white hover:bg-white/10"
                                            >
                                                <Cog6ToothIcon className="h-6 w-6 shrink-0" />
                                                {t('sidebar.settings')}
                                            </Link>
                                            <button 
                                                onClick={handleSignOut} 
                                                className="group -mx-2 flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-white hover:bg-white/10"
                                            >
                                                <ArrowLeftOnRectangleIcon className="h-6 w-6 shrink-0" />
                                                {t('sidebar.logout')}
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