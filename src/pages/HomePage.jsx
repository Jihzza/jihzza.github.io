// src/pages/HomePage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import SchedulingPage from './SchedulingPage';

export default function HomePage() { 
    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4"
            >
                {/* Title Text */}
                <h1 className="text-4xl font-bolld mb-10">Hello World!</h1>

                {/* Link to login page */}
                <Link
                    to="/login"
                    className="px-8 py-3 rounded-md text-lg font-medium
                   bg-indigo-600 hover:bg-indigo-700
                   focus:outline-none focus:ring-2 focus:ring-offset-2
                   focus:ring-indigo-500 transition-colors"
                   >
                    Get&nbsp;Started
                   </Link>

                <SchedulingPage />

        </div>
    );
}