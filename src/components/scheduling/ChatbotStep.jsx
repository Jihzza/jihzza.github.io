// src/components/scheduling/ChatbotStep.jsx

import React from 'react';
import ChatInterface from '../chatbot/ChatInterface';

export default function ChatbotStep() {
    return (
        <div className="h-full">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Final Step</h2>
            <p className="text-center text-gray-600 mb-6">
                To make our session as productive as possible, please answer a few questions about your project and goals.
            </p>

            {/** Chat Interface - Reusable Component */}
            <ChatInterface
            initialMessage="Hello! I'm here to gather some preliminary information for our upcoming consultation. To start, could you please tell more about yourself?"
            containerHeigth="h-[450px]"
            inputPlaceholder="Type your message..."
            />
            
            {/** This ID would point to the n8n workflow specifically for post-booking info gathering*/}
        </div>
    );
}