// src/components/common/Input.jsx

// This is a reusable text input that can be reused everywhere.

import React from 'react';

// forwardRef -> allows parent libraries (like react-hook-form) to grab the real <input> DOM node
const Input = React.forwardRef(({ className = '', ...props }, ref) => {
    return (
        <input
            ref={ref}
            className={`w-full px-3 py-2 mt-2 border border-[#BFA200] rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#BFA200] focus:border-[#BFA200] ${className}`}
            {...props}
        />
    );
});

Input.displayName = 'Input'; // DevTolls friendliness
export default Input;