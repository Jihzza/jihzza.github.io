// src/components/scheduling/ChatbotStep.jsx

import React from 'react';
import { useTranslation } from 'react-i18next'; // 1. Import the hook
import ChatInterface from '../chatbot/ChatInterface';

export default function ChatbotStep() {
    const { t } = useTranslation(); // 2. Initialize the hook

    return (
        <div className="h-full flex flex-col"> 
            {/* 4. Pass translated strings down to the ChatInterface component */}
            <ChatInterface
                initialMessage={t('scheduling.chatbotStep.initialMessage')}
                containerHeight="h-[400px]"
                inputPlaceholder={t('scheduling.chatbotStep.inputPlaceholder')}
            />
        </div>
    );
}