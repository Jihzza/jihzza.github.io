// src/contexts/NotificationsContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react'; // Standard React hooks.
import { supabase } from '../lib/supabaseClient'; // Your configured Supabase client.
import { useAuth } from './AuthContext'; // We need the auth context to know who the current user is.

// 1. Create the context object. This is what components will consume.
const NotificationsContext = createContext();

// 2. Create the Provider component. This component will wrap your app and provide the notification data.
export const NotificationsProvider = ({ children }) => {
    const { user } = useAuth(); // Get the current user object from your AuthContext.
    const [notifications, setNotifications] = useState([]); // State to hold the array of notification objects.
    const [unreadCount, setUnreadCount] = useState(0); // State to hold just the count of unread notifications.
    const [loading, setLoading] = useState(true); // State to track if we are currently fetching notifications.

    // This `useEffect` hook runs whenever the `user` object changes.
    useEffect(() => {
        // If there is a logged-in user, fetch their initial data.
        if (user) {
            fetchNotifications();
        } else {
            // If there's no user, we're done loading.
            setLoading(false);
        }

        // 3. Set up the real-time subscription.
        const channel = supabase.channel('public:notifications') // Choose a unique name for the channel.
            .on( // Listen for specific database changes.
                'postgres_changes', // The type of change to listen for.
                { 
                    event: 'INSERT', // We only care about new rows being created.
                    schema: 'public', 
                    table: 'notifications', 
                    filter: `user_id=eq.${user?.id}` // CRITICAL: Only get events for the currently logged-in user.
                },
                (payload) => { // This is the callback function that runs when a new notification arrives.
                    // `payload.new` contains the new notification object.
                    // Add the new notification to the beginning of our existing list.
                    setNotifications(currentNotifications => [payload.new, ...currentNotifications]);
                    // Increment the unread counter.
                    setUnreadCount(currentCount => currentCount + 1);
                }
            )
            .subscribe(); // Actually connect to the channel.

        // Cleanup function: This runs when the component unmounts or the user changes.
        return () => {
            supabase.removeChannel(channel); // Disconnect from the channel to prevent memory leaks.
        };
    }, [user]); // The dependency array. The effect re-runs if `user` changes.

    // Function to fetch all notifications for the current user.
    const fetchNotifications = async () => {
        if (!user) return; // Don't run if there's no user.
        setLoading(true); // Set loading to true.
        // Fetch data from the 'notifications' table.
        const { data, error, count } = await supabase
            .from('notifications')
            .select('*', { count: 'exact' }) // Select all columns and request the total count of rows.
            .eq('user_id', user.id) // Filter to only get rows for the current user.
            .order('created_at', { ascending: false }); // Order them so the newest are first.

        if (error) { // If there was an error...
            console.error("Error fetching notifications:", error); // ...log it to the console.
        } else { // If the fetch was successful...
            setNotifications(data || []); // ...update our state with the fetched data.
            // Calculate how many of the fetched notifications are unread.
            const unread = data.filter(n => !n.is_read).length;
            setUnreadCount(unread); // Set the initial unread count.
        }
        setLoading(false); // Set loading to false.
    };

    // Function to mark a single notification as read.
    const markAsRead = async (notificationId) => {
        // Send an update request to Supabase.
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true }) // Set the `is_read` column to true.
            .eq('id', notificationId); // For the specific notification ID.
        
        if (!error) { // If the update was successful...
            // Update the state locally immediately for a snappy UI, without waiting for a refetch.
            setNotifications(current =>
                current.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
            );
            // Decrement the unread count.
            setUnreadCount(prev => (prev > 0 ? prev - 1 : 0));
        } else {
            console.error("Error marking notification as read:", error);
        }
    };
    
    // Function to mark ALL notifications as read for the user.
    const markAllAsRead = async () => {
        // Send an update request to Supabase.
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true }) // Set `is_read` to true...
            .eq('user_id', user.id)    // ...for the current user...
            .eq('is_read', false);     // ...but only for rows that are currently unread (an optimization).

        if (!error) { // If successful...
            // Update the local state to reflect the change everywhere.
            setNotifications(current => current.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0); // Reset the count to zero.
        } else {
            console.error("Error marking all as read:", error);
        }
    };

    // 4. Define the value that the provider will make available to its children.
    const value = {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
    };

    // Return the provider component, wrapping any children passed to it.
    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    );
};

// 5. Create a custom hook for easy consumption of the context.
// This saves components from having to import `useContext` and `NotificationsContext` every time.
export const useNotifications = () => {
    const context = useContext(NotificationsContext); // Get the context value.
    if (context === undefined) { // If a component tries to use this hook outside of the provider...
        throw new Error('useNotifications must be used within a NotificationsProvider'); // ...throw an error.
    }
    return context; // Otherwise, return the context value.
};