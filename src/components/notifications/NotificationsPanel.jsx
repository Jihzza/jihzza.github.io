import React from 'react';
import { useNotifications } from '../../contexts/NotificationsContext';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

// A helper function to render the notification text based on its type and data
const NotificationMessage = ({ notification }) => {
    switch (notification.type) {
        case 'new_message':
            return (
                <>
                    <span className="font-bold">{notification.data.sender_username}</span> sent you a new message.
                </>
            );
        case 'consultation_reminder':
            return (
                <>
                    Reminder: Your consultation is tomorrow at <span className="font-bold">{notification.data.consultation_time}</span>.
                </>
            );
        case 'new_consultation_booking':
            return (
                 <>
                    New Booking: A user purchased a <span className="font-bold">Consultation</span>.
                </>
            );
        // Add cases for 'new_coaching_booking' and 'new_pitchdeck_booking' here
        default:
            return 'You have a new notification.';
    }
};


export default function NotificationsPanel({ isOpen, onClose }) {
    const { notifications, loading, markAsRead, markAllAsRead, unreadCount } = useNotifications();
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleNotificationClick = (notification) => {
        // Mark as read even if we don't navigate
        if (!notification.is_read) {
            markAsRead(notification.id);
        }

        // Navigate to the relevant page
        if (notification.type === 'new_message' && notification.data.conversation_id) {
            navigate(`/messages/${notification.data.conversation_id}`);
        }
        // Add other navigation logic here, e.g., to an admin dashboard
        // if (notification.type.includes('booking')) { navigate('/admin/bookings'); }
        
        onClose(); // Close the panel after clicking
    };

    return (
        <div className="absolute right-0 mt-2 w-80 max-w-sm bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                {unreadCount > 0 && (
                     <button onClick={markAllAsRead} className="text-sm text-indigo-600 hover:underline">Mark all as read</button>
                )}
            </div>
            <div className="max-h-96 overflow-y-auto">
                {loading && <p className="p-4 text-center text-gray-500">Loading...</p>}
                {!loading && notifications.length === 0 && (
                    <p className="p-4 text-center text-gray-500">No notifications yet.</p>
                )}
                <ul>
                    {notifications.map((n) => (
                        <li
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${!n.is_read ? 'bg-indigo-50' : 'bg-white'}`}
                        >
                            <p className="text-sm text-gray-700">
                               <NotificationMessage notification={n} />
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}