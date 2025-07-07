// src/components/scheduling/ChatbotStep.jsx

import React from 'react';
import ChatInterface from '../chatbot/ChatInterface';

export default function ChatbotStep() {
    return (
        // Step 1: Simplify the main container
        <div className="h-full flex flex-col"> 
            {/* Step 2: Update the header text and styling */}
            <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-white mb-2">Final Step</h2>
            </div>

            {/* The Chat Interface now carries the desired styling */}
            <ChatInterface
                initialMessage="Hello! I'm here to gather some preliminary information for our upcoming consultation. To start, could you please tell more about yourself?"
                containerHeight="h-[400px]"
                inputPlaceholder="Type your message..."
            />
        </div>
    );
}