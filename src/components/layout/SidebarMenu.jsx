// src/components/layout/SidebarMenu.jsx

import React, { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { signOut } from '../../services/authService';

export default function SidebarMenu({ isOpen, onClose, isAuthenticated }) {
    const navigate = useNavigate();

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/profile', label: 'Profile', isHighlighted: true },
    ];

    const handleSignOut = async () => {
        await signOut();
        onClose();
        navigate('/login');
    };

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
                
                <div className="fixed top-16 bottom-20 left-0 flex">
                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-in-out duration-300 transform"
                        enterFrom="-translate-x-full"
                        enterTo="translate-x-0"
                        leave="transition ease-in-out duration-300 transform"
                        leaveFrom="translate-x-0"
                        leaveTo="-translate-x-full"
                    >
                        {/* --- STYLING UPDATE: Width changed to a precise 70%. --- */}
                        {/* We remove 'w-full', 'max-w-sm', and 'flex-1' and replace them with 'w-[70vw]'. */}
                        {/* 'vw' stands for "viewport width", so this is 70% of the total screen width. */}
                        <Dialog.Panel className="relative flex w-[70vw] h-full">
                            <div className="flex flex-grow flex-col gap-y-5 overflow-y-auto bg-black px-6 pb-4 text-white">
                                <nav className="flex flex-1 flex-col pt-6">
                                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                        <li>
                                            <ul role="list" className="-mx-2 space-y-2">
                                                {navLinks.map((item) => (
                                                    <li key={item.label}>
                                                        <Link
                                                            to={item.href}
                                                            onClick={onClose}
                                                            className={`block rounded-md p-2 text-base leading-6 font-semibold ${
                                                                item.isHighlighted ? 'text-yellow-400' : 'hover:bg-white/10'
                                                            }`}
                                                        >
                                                            {item.label}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                        
                                        <li className="mt-auto space-y-2">
                                            {isAuthenticated ? (
                                                <button onClick={handleSignOut} className="group -mx-2 flex w-full gap-x-3 rounded-md p-2 text-base font-semibold leading-6 hover:bg-white/10">
                                                    <ArrowLeftOnRectangleIcon className="h-6 w-6 shrink-0" />
                                                    Log Out
                                                </button>
                                            ) : (
                                                 <Link to="/login" onClick={onClose} className="group -mx-2 flex gap-x-3 rounded-md p-2 text-base font-semibold leading-6 hover:bg-white/10">
                                                    Log In
                                                </Link>
                                            )}
                                            
                                            <Link to="/settings" onClick={onClose} className="group -mx-2 flex gap-x-3 rounded-md p-2 text-base font-semibold leading-6 hover:bg-white/10">
                                                <Cog6ToothIcon className="h-6 w-6 shrink-0" />
                                                Settings
                                            </Link>
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