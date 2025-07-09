// src/components/layout/NavigationBar.jsx

import { useNavigate, useLocation } from 'react-router-dom';
import { HomeIcon, CalendarIcon, ChatBubbleLeftRightIcon, InboxIcon, UserIcon } from "@heroicons/react/24/outline";

export default function NavigationBar({ onChatClick }) {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { icon: HomeIcon, label: 'Home', path: '/' },
        { icon: CalendarIcon, label: 'Calendar', path: '/calendar' },
        { icon: ChatBubbleLeftRightIcon, label: 'Chat', onClick: onChatClick },
        { icon: InboxIcon, label: 'Messages', path: '/messages' },
        { icon: UserIcon, label: 'Profile', path: '/profile' }
    ];

    // --- CHANGE IS HERE ---
    // The "Why": We are modifying the existing handler to include our new logic.
    const handleItemClick = (item) => {
        if (item.onClick) {
            item.onClick(); // Handles the special case for the Chat button.
        } else if (item.path) {
            // First, check if the clicked item is the "Home" button AND
            // if we are currently on the homepage.
            if (item.path === '/' && location.pathname === '/') {
                // If both are true, find the anchor element and scroll to it.
                const topElement = document.getElementById('page-top');
                if (topElement) {
                    topElement.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                // Otherwise, perform the standard navigation.
                navigate(item.path);
            }
        }
    };

    const isActive = (path) => {
        if (!path) return false;
        if (path !== '/') {
            return location.pathname.startsWith(path);
        }
        return location.pathname === path;
    };

    return (
        <nav className="w-full sticky bottom-0 left-0 right-0 border-t border-gray-700 bg-black shadow-lg z-50">
            <div className="flex justify-around items-center w-full h-14 mx-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActiveItem = isActive(item.path);

                    return (
                        <button
                            key={item.label}
                            onClick={() => handleItemClick(item)} // This now calls our upgraded function.
                            className="flex flex-col items-center justify-center w-20 h-full transition-colors duration-300 ease-in-out"
                            aria-label={item.label}
                        >
                            <Icon className={`h-7 w-7 transition-colors duration-300 ${isActiveItem ? 'text-yellow-400' : 'text-gray-400'}`} />
                            {isActiveItem && (
                                <span className="text-xs mt-1 font-semibold text-yellow-400">
                                    {item.label}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}