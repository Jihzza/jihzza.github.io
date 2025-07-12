// src/components/scheduling/ChatbotStep.jsx

import React from 'react';
import { useTranslation } from 'react-i18next'; // 1. Import the hook
import ChatInterface from '../chatbot/ChatInterface';

export default function ChatbotStep() {
    const { t } = useTranslation(); // 2. Initialize the hook

    return (
        <div className="h-full flex flex-col"> 
            <div className="text-center mb-4">
                {/* 3. Use the translated title */}
                <h2 className="text-2xl font-bold text-white mb-2">{t('scheduling.chatbotStep.title')}</h2>
            </div>

            {/* 4. Pass translated strings down to the ChatInterface component */}
            <ChatInterface
                initialMessage={t('scheduling.chatbotStep.initialMessage')}
                containerHeight="h-[400px]"
                inputPlaceholder={t('scheduling.chatbotStep.inputPlaceholder')}
            />
        </div>
    );
}