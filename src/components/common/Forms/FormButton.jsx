// src/components/common/Forms/FormButton.jsx

import React from 'react';

/**
 * A styled, intelligent button for use within forms.
 * It now handles its own loading state to provide user feedback and prevent multiple submissions.
 *
 * @param {boolean} isLoading - If true, the button will be disabled and show a loading indicator.
 * @param {boolean} fullWidth - If true, the button will take up the full width of its container.
 * @param {React.Node} children - The content of the button.
 * @param {object} rest - Any other props to be passed to the underlying button element (e.g., type, onClick, disabled).
 */
// 1. We destructure `isLoading` from props, just like `fullWidth` and `children`.
//    This removes it from the `rest` object, so it won't be passed to the DOM element.
export default function FormButton({ children, fullWidth, isLoading, ...rest }) {
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      // 2. We explicitly pass down `...rest` which no longer contains `isLoading`.
      {...rest}
      // 3. We use the `isLoading` boolean to control the button's `disabled` state.
      //    We also check `rest.disabled` so the button can still be disabled by its parent for other reasons.
      disabled={isLoading || rest.disabled}
      className={`
        ${widthClass}
        w-60 px-4 py-3 rounded-lg transition-colors duration-300
        bg-[#BFA200] hover:bg-yellow-600 
        text-black font-semibold       
        focus:outline-none focus:ring-2 focus:ring-offset-2 
        focus:ring-yellow-400 focus:ring-offset-gray-800
      `}
    >
      {/* 4. We provide better UX by changing the button's content when it's loading. */}
      {isLoading ? 'Processing...' : children}
    </button>
  );
}