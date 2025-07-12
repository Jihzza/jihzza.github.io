// src/components/chatbot/ChatbotWindow/DraggableHeader.jsx

import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next'; // 1. Import hook

export default function DraggableHeader({ 
  onClose, 
  onDragStart, 
  isDragging, 
}) {
  const { t } = useTranslation(); // 2. Initialize hook

  return (
    <div className={`relative p-4 flex justify-between items-center flex-shrink-0 ${isDragging ? '' : 'bg-transparent'}`}>
      <div
        className="absolute inset-0 cursor-ns-resize"
        onMouseDown={onDragStart}
        onTouchStart={onDragStart}
        title={t('chatbot.header.dragHandleAria')} // 3. Use translated title
      />
      <div className="flex items-center gap-2 pointer-events-none">
        <h3 className="font-semibold text-lg text-white">
          {t('chatbot.header.title')} {/* 4. Use translated title */}
        </h3>
      </div>
      <button 
        onClick={onClose} 
        className="relative z-10 p-1 rounded-full hover:bg-blue-900 transition-colors duration-200"
        title={t('chatbot.header.closeAria')} // 5. Use translated title
      >
        <XMarkIcon className="h-6 w-6 text-white" />
      </button>
    </div>
  );
}