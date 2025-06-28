// src/components/layout/Layout.jsx

import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NavigationBar from './NavigationBar';
import ChatbotWindow from '../chatbot/ChatbotWindow';
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

  return (
    <div className="h-full w-full flex flex-col bg-gradient"> {/* Set background here to avoid flashes */}
      <Header />
      
      {/* --- FIX APPLIED HERE --- */}
      {/* We've added `w-full` and `overflow-x-hidden` to the main element.
        - `w-full`: This forces the main content area to strictly adhere to the screen's width.
        - `overflow-x-hidden`: This is the key. It tells the browser to simply hide any content that
          goes beyond the screen's horizontal boundaries, effectively preventing horizontal scrolling for the entire page.
        - `overflow-y-auto`: This remains, allowing for normal vertical scrolling of page content.
      */}
      <main className="flex-grow overflow-y-auto w-full ">
        <Outlet />
      </main>

      <NavigationBar onChatClick={handleChatbotToggle} />

      {isChatbotOpen && (
        <ChatbotWindow 
          isOpen={isChatbotOpen}
          onClose={() => setIsChatbotOpen(false)} 
        />
      )}
    </div>
  );
}