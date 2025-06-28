// src/pages/HomePage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import SchedulingPage from './SchedulingPage';
import HeroSection from './sections/HeroSection';

export default function HomePage() { 
    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#002147] to-[#ECEBE5] text-white px-4"
            >
                <HeroSection />

                <SchedulingPage />

        </div>
    );
}