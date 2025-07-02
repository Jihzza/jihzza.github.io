// src/components/layout/NavigationBar.jsx

import React, { forwardRef } from 'react'; // Import forwardRef
import { NavLink } from 'react-router-dom';
import { HomeIcon, UserGroupIcon, ChatBubbleLeftRightIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

// The navigation items configuration
const navItems = [
    { href: '/', icon: HomeIcon, label: 'Home' },
    { href: '/profile', icon: UserGroupIcon, label: 'Profile' },
    { href: '/messages', icon: ChatBubbleLeftRightIcon, label: 'Messages' },
    { href: '/appointments', icon: BriefcaseIcon, label: 'Appointments' },
];

// Wrap the component definition in forwardRef
const NavigationBar = forwardRef(({ onChatClick }, ref) => {
    return (
        // The 'ref' is passed from the component's props to the actual DOM element.
        // This allows the parent component (Layout.jsx) to measure this element.
        <nav ref={ref} className="w-full sticky bottom-0 left-0 right-0 border-t border-gray-700 bg-black shadow-lg z-40">
            <div className="flex justify-around items-center w-full h-14 mx-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.href}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center w-full text-xs font-medium transition-colors duration-200 ${
                                isActive ? 'text-yellow-400' : 'text-gray-400 hover:text-white'
                            }`
                        }
                    >
                        <item.icon className="h-6 w-6 mb-1" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
});

export default NavigationBar;