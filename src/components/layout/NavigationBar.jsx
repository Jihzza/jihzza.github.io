// src/components/layout/NavigationBar.jsx

import { useLocation, useNavigate } from 'react-router-dom';
import { HomeIcon, CalendarIcon, ChatBubbleLeftRightIcon, InboxIcon, UserIcon } from "@heroicons/react/24/outline";

// The component now takes an `onNavigate` prop and no longer uses `Maps` directly for page changes.
export default function NavigationBar({ onChatClick, isChatbotOpen, onNavigate }) {
    const location = useLocation();
    const navigate = useNavigate(); // Still needed for the pure chatbot navigation case.

    const navItems = [
        { icon: HomeIcon, label: 'Home', path: '/' },
        { icon: CalendarIcon, label: 'Calendar', path: '/calendar' },
        { icon: ChatBubbleLeftRightIcon, label: 'Chat', onClick: onChatClick },
        { icon: InboxIcon, label: 'Messages', path: '/messages' },
        { icon: UserIcon, label: 'Profile', path: '/profile' }
    ];

    const isActive = (path) => {
        if (!path) return false;
        return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
    };

    const handleItemClick = (item) => {
        // Rule #1: The Chat icon is a simple toggle. No navigation involved.
        if (item.onClick) {
            item.onClick();
            return;
        }

        const targetPath = item.path;

        // Rule #2: If the chatbot is open, its state takes absolute priority.
        // The goal is to close the chatbot and navigate to the target page.
        if (isChatbotOpen) {
            onChatClick(); // Close the chatbot
            navigate(targetPath); // Directly navigate to the destination
            return; // Stop further execution.
        }
        
        // Rule #3: If the chatbot is closed, use the robust parent handler.
        // This handles both new navigation and the "go back" feature explicitly.
        onNavigate(targetPath);
    };

    return (
        <nav className="w-full sticky bottom-0 left-0 right-0 border-t border-gray-700 bg-black shadow-lg z-50">
            <div className="flex justify-around items-center w-full h-14 md:h-16 mx-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isChatItem = !!item.onClick;
                    
                    const isActiveItem = isChatItem
                        ? isChatbotOpen
                        : (isActive(item.path) && !isChatbotOpen);

                    return (
                        <button
                            key={item.label}
                            onClick={() => handleItemClick(item)}
                            className="flex flex-col items-center justify-center w-20 h-full"
                            aria-label={item.label}
                        >
                            <Icon className={`h-7 w-7 md:h-9 w-9 transition-colors duration-300 ${isActiveItem ? 'text-yellow-400' : 'text-gray-400'}`} />
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