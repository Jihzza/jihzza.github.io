// src/components/common/Input.jsx

// This is a reusable text input that can be reused everywhere.

import React from 'react';

// forwardRef -> allows parent libraries (like react-hook-form) to grab the real <input> DOM node
const Input = React.forwardRef(({ className = '', ...props }, ref) => {
    return (
        <input
            ref={ref}
            className={`w-full px-3 py-2 mt-2 rounded-xl text-white placeholder-gray-400 shadow-lg focus:outline-none bg-[#001B3A] backdrop-blur-md border border-white/20 ${className}`}
            {...props}
        />
    );
});

Input.displayName = 'Input'; // DevTolls friendliness
export default Input;