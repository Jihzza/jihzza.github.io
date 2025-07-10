import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * Draggable header component for the chatbot window
 * Provides visual feedback and handles drag interactions for resizing
 * * @param {Object} props - Component props
 * @param {string} props.title - Header title text
 * @param {Function} props.onClose - Function to close the window
 * @param {Function} props.onDragStart - Function to handle drag start
 * @param {boolean} props.isDragging - Whether the header is currently being dragged
 * @param {number} props.heightPercentage - Current height as percentage of original
 */
export default function DraggableHeader({ 
  title, 
  onClose, 
  onDragStart, 
  isDragging, 
}) {
  return (
    <div 
      className={`
        relative p-4 flex justify-between items-center flex-shrink-0
        ${isDragging ? '' : 'bg-transparent'}
      `}
    >
      {/* Drag Handle Area - This is the main draggable region */}
      <div
        className="absolute inset-0 cursor-ns-resize"
        onMouseDown={onDragStart}
        onTouchStart={onDragStart}
        title="Drag to resize"
      />
      
      {/* Visual Drag Indicator */}
      <div className="flex items-center gap-2 pointer-events-none">
        
        
        {/* Title */}
        <h3 className="font-semibold text-lg text-white">
          {title}
        </h3>
        
      </div>
      
      {/* Close Button - Positioned above drag area with pointer events */}
      <button 
        onClick={onClose} 
        className="relative z-10 p-1 rounded-full hover:bg-blue-900 transition-colors duration-200"
        title="Close chat"
      >
        <XMarkIcon className="h-6 w-6 text-white" />
      </button>
      
    </div>
  );
}