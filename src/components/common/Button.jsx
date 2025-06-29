// src/components/common/CtaButton.jsx

import React from 'react';

/**
 * A reusable Call-to-Action (CTA) button with a distinct style.
 * This is designed for primary actions, like booking or requesting information.
 *
 * @param {React.ReactNode} children - The text or elements to display inside the button.
 * @param {string} [className=''] - Optional additional CSS classes to apply.
 * @param {object} props - Any other props to pass to the button element (e.g., onClick).
 */
export default function Button({ children, className = '', ...props }) {
  return (
    <button
      // We combine a base set of styles with any additional classes passed via props.
      className={`
        w-60 px-4 py-3 rounded-lg transition-colors duration-300
        bg-[#BFA200] hover:bg-yellow-600 
        text-black font-semibold       
        focus:outline-none focus:ring-2 focus:ring-offset-2 
        focus:ring-yellow-400 focus:ring-offset-gray-800 
        ${className} 
      `}
      {...props}
    >
      {children}
    </button>
  );
}