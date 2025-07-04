// src/components/layout/NavigationBar.jsx

import { useNavigate, useLocation } from 'react-router-dom';
// Using placeholder icons from heroiicons for demo(from left to right: Home, Calendar, Chatbot, Messages, Profile)
import { HomeIcon, CalendarIcon, ChatBubbleLeftRightIcon, InboxIcon, UserIcon } from "@heroicons/react/24/outline";


/**
 * 
 * @param {function} onChatClick - Callback function executed when the center chat icon is clicked
 */
export default function NavigationBar({ onChatClick }) {
    const navigate = useNavigate();
    const location = useLocation();

    // An array to define the navigation items, making it easy to manage
    const navItems = [
        { icon: HomeIcon, label: 'Home', path: '/' },
        { icon: CalendarIcon, label: 'Calendar', path: '/calendar' },
        { icon: ChatBubbleLeftRightIcon, label: 'Chat', onClick: onChatClick },
        { icon: InboxIcon, label: 'Messages', path: '/messages' },
        { icon: UserIcon, label: 'Profile', path: '/profile' }
    ];
    /**
     * 
     * @param {object} item 
     */

    const handleItemClick = (item) => {
        if (item.onClick) {
            item.onClick();
        } else if (item.path) {
            navigate(item.path);
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
            {/* A simple flex container now handles the layout for all items uniformly. `justify-around` distributes them evenly. */}
            <div className="flex justify-around items-center w-full h-14 mx-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    // The active state is determined only for items that have a navigable path.
                    const isActiveItem = isActive(item.path);

                    return (
                        <button
                            key={item.label}
                            onClick={() => handleItemClick(item)}
                            // All buttons share the same styling for a consistent look and feel.
                            // The container is a flex column to stack the icon and the optional label vertically.
                            // A fixed width (`w-20`) ensures the items don't shift when a label appears.
                            className="flex flex-col items-center justify-center w-20 h-full transition-colors duration-300 ease-in-out"
                            aria-label={item.label}
                        >
                           {/*
                             ICON STYLING:
                             - All icons now have a fixed size (`h-7 w-7`) for visual consistency.
                             - The color changes based on the `isActiveItem` boolean.
                             - A smooth color transition is applied via Tailwind's utility classes.
                           */}
                            <Icon className={`h-7 w-7 transition-colors duration-300 ${isActiveItem ? 'text-yellow-400' : 'text-gray-400'}`} />

                            {/*
                              CONDITIONAL LABEL RENDERING:
                              - The label `<span>` is only rendered if its corresponding item is active.
                              - This keeps the UI clean, showing text only for the selected navigation option.
                              - Because the button has a fixed width, the appearance of the label will not cause other icons to shift position.
                            */}
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