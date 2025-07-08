// src/components/scheduling/consultations/ScrollableSelector.jsx

import React from 'react';

/**
 * A reusable, horizontal, scrollable selector for choosing an option from a list.
 * Designed to be a "dumb" component that is fully controlled by its parent.
 *
 * @param {string} title - The title to display above the selector (e.g., "Select Duration").
 * @param {Array<{value: string, label: string}>} options - The array of options to display as buttons.
 * @param {string | null} selectedValue - The value of the currently selected option.
 * @param {function(string): void} onSelect - The callback to execute when an option is selected.
 */
export default function ScrollableSelector({ title, options, selectedValue, onSelect }) {
    return (
      <div className="w-full">
        <h3 className="text-lg font-semibold text-white mb-3 text-center">{title}</h3>
        
        {/* --- GRADIENT WRAPPER ---
          - `relative`: This is the crucial part. It creates a positioning context for the
            pseudo-elements (`::before` and `::after`) that we'll use for the gradients.
          - The pseudo-elements are defined in your global CSS or via a utility class
            to create the fade effect on the left and right edges.
          - We apply these classes directly for clarity. The `group` class allows for
            more advanced styling if needed later.
        */}
        <div 
          className="relative group"
        >
          {/* These two divs create the gradient overlays.
            - `absolute`: Positions them relative to the wrapper above.
            - `w-8`: Sets the width of the gradient fade.
            - `bg-gradient-to-r` or `bg-gradient-to-l`: Creates the linear gradient.
            - `from-[#002147]`: The gradient starts with the page background color.
            - `pointer-events-none`: Ensures the gradient overlay doesn't block mouse clicks on the buttons underneath.
            - `z-10`: Makes sure the gradient is layered on top of the scrolling buttons.
          */}
          <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-[#002147] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-[#002147] to-transparent z-10 pointer-events-none" />
  
          <div className="flex space-x-3 overflow-x-auto pb-3 hide-scrollbar">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => onSelect(option.value)}
                className={`
                  flex-shrink-0 px-4 py-1 rounded-lg border-2 transition-all duration-200 ease-in-out
                  font-medium whitespace-nowrap
                  ${selectedValue === option.value
                    ? 'bg-[#BFA200] text-black border-[#BFA200] scale-105 shadow-lg'
                    : 'bg-transparent text-white border-gray-600 hover:border-[#BFA200] hover:bg-gray-800'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }