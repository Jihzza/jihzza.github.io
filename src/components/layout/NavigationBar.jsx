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

    /**
     * Handles all click events on the navigation items.
     * This function now includes logic to:
     * 1. Execute a custom onClick function (for the Chat button).
     * 2. Scroll to the top of the homepage if already there.
     * 3. Navigate back if the user clicks the icon for the page they are currently on.
     * 4. Navigate to a new page as the default action.
     */
    const handleItemClick = (item) => {
        // Case 1: The item has a custom onClick function (e.g., opening the chat).
        if (item.onClick) {
            item.onClick();
            return; // Prioritize the custom onClick and exit.
        }

        if (item.path) {
            const isAlreadyOnPage = location.pathname === item.path;

            // Case 2: Special handling for the Home button to scroll to top.
            if (item.path === '/' && isAlreadyOnPage) {
                const topElement = document.getElementById('page-top');
                if (topElement) {
                    topElement.scrollIntoView({ behavior: 'smooth' });
                }
            // --- NEW LOGIC IS HERE ---
            // Case 3: The user is already on the target page. Navigate back.
            // The "Why": Instead of reloading the page or doing nothing, this provides
            // an intuitive "go back" action, improving the user experience.
            } else if (isAlreadyOnPage) {
                navigate(-1); // This function from react-router-dom goes back one step in history.
            } else {
            // Case 4: Default navigation to a new page.
                navigate(item.path);
            }
        }
    };

    /**
     * Determines if a navigation item should appear "active".
     * For parent routes like '/profile', it checks if the current URL starts with the path.
     * For the root '/' path, it requires an exact match.
     */
    const isActive = (path) => {
        if (!path) return false;
        // This logic correctly highlights parent routes (e.g., /profile will be active for /profile/edit).
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