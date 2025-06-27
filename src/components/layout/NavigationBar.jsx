// src/components/layout/NavigationBar.jsx

import { useNavigate, useLocation } from 'react-router-dom';
// Using placeholder icons from heroiicons for demo(from left to right: Home, Calendar, Chatbot, Messages, Profile)
import { HomeIcon, CalendarIcon, ChatBubbleLeftRightIcon, InboxIcon, UserIcon } from "@heroicons/react/24/outline";

/**
 * @param {function} onChatClick - Callback function executed when the center chat icon is clicked
 */
export default function NavigationBar({ onChatClick }) {
    const navigate = useNavigate();
    const location = useLocation();

    // An array to define the navigation items, making it easy to manage
    const navItems = [
        { icon: HomeIcon, label: 'Home', path: '/' },
        { icon: CalendarIcon, label: 'Calendar', path: '/calendar' },
        { icon: ChatBubbleLeftRightIcon, label: 'Chat', onClick: onChatClick, isCentered: true },
        { icon: InboxIcon, label: 'Messages', path: '/messages' },
        { icon: UserIcon, label: 'Profile', path: '/profile' }
    ];

    const handleItemClick = (item) => {
        if (item.onClick) {
            item.onClick();
        } else if (item.path) {
            navigate(item.path);
        }
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className="w-full sticky top-0 left-0 right-0 border-t shadow-lg z-40">
            <div className="flex justify-around items-center w-full bg-black h-20 mx-auto">
                {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActiveItem = item.path ? isActive(item.path) : false;
                    
                    return (
                        <button
                            key={index}
                            onClick={() => handleItemClick(item)}
                            className={`flex flex-col items-center justify-center text-white${item.isCentered ? '-mt-16' : ''}`}
                        >
                            <div className={`flex items-center justify-center rounded-full ${item.isCentered ? 'bg-indigo-600 p-4 shadow-lg' : 'w-12 h-12'}`}>
                                <Icon className={`h-8 w-8 ${item.isCentered ? 'text-white' : ''}`} />
                            </div>
                            <span className={`text-xs mt-1 ${item.isCentered ? 'text-white font-bold' : ''}`}>
                                {item.label}
                            </span>
                        </button>
                    )
                })}
            </div>
        </nav>
    );
}