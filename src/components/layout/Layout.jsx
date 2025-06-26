// src/components/layout/Layout.jsx

import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NavigationBar from './NavigationBar'; // Your project's NavigationBar
import ChatbotWindow from '../chatbot/ChatbotWindow'; // Your project's ChatbotWindow
import Header from './Header';

export default function Layout() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleChatbotToggle = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return; 
    }
    setIsChatbotOpen(!isChatbotOpen);
  };

  // --- FIX: Correct Layout Structure ---
  // 1. `h-full`: Because its parent (#root) is now 100% height, this div will also fill the screen.
  // 2. `flex flex-col`: This allows the <main> content to grow and fill the space above the navbar.
  return (
    <div className="h-full flex flex-col">
      <Header />
      {/* The <main> tag now correctly fills all available space and allows scrolling. */}
      {/* The bottom padding prevents content from being hidden by the fixed navbar. */}
      <main className="flex-grow overflow-y-auto">
        <Outlet />
      </main>

      {/* Persistent Navigation Bar - It will be correctly positioned at the bottom */}
      <NavigationBar onChatClick={handleChatbotToggle} />

      {/* The Chatbot Window is now conditionally rendered. 
        It will appear ON TOP of the main content.
      */}
      {isChatbotOpen && (
        <ChatbotWindow 
          isOpen={isChatbotOpen}
          onClose={() => setIsChatbotOpen(false)} 
        />
      )}
    </div>
  );
}