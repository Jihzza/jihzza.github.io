// src/pages/sections/FaqSection.jsx

import React from 'react';

// --- COMPONENT IMPORTS ---
import SectionTextBlack from '../../components/common/SectionTextBlack';
// We now import our new, self-contained FAQ component.
import FaqSelector from '../../components/faq/FaqSelector';

// --- DATA DEFINITION ---
// The data can still live here, or it could be passed down from an even higher-level component (like HomePage.jsx).
// For now, this is a clean and appropriate place for it.
const faqData = [
    {
        question: "What communication channels do you use for coaching?",
        answer: "All coaching communication takes place via WhatsApp for seamless, convenient interaction. This allows for easy sharing of text, images, voice messages, and documents while maintaining a single, organized thread of our conversations."
    },
    {
        question: "Who is this service for?",
        answer: "This service is designed for ambitious founders, entrepreneurs, and business leaders who are ready to scale their operations but need expert guidance to navigate the challenges of growth."
    },
    {
        question: "How are the sessions structured?",
        answer: "Our sessions are a mix of strategic planning, problem-solving, and accountability checks. Each session is tailored to your immediate priorities and long-term goals."
    },
    {
        question: "What if I need to reschedule a session?",
        answer: "We understand that schedules can be dynamic. You can reschedule any session with at least 24 hours' notice through our online scheduling portal."
    },
    {
        question: "What if I need to reschedule a session?",
        answer: "We understand that schedules can be dynamic. You can reschedule any session with at least 24 hours' notice through our online scheduling portal."
    },
    {
        question: "What if I need to reschedule a session?",
        answer: "We understand that schedules can be dynamic. You can reschedule any session with at least 24 hours' notice through our online scheduling portal."
    },
    {
        question: "What if I need to reschedule a session?",
        answer: "We understand that schedules can be dynamic. You can reschedule any session with at least 24 hours' notice through our online scheduling portal."
    },
];

/**
 * A "view" component responsible for the layout of the FAQ section.
 * It is now much simpler and delegates all complex logic to the FaqSelector component.
 */
export default function FaqSection() {
    // --- RENDER LOGIC ---
    // Notice how clean and readable this is. It clearly states its purpose:
    // to render a title and an FAQ selector.
    return (
        <section className="py-8">
            <div className="max-w-4xl mx-auto">
                {/* 1. SECTION HEADER */}
                <SectionTextBlack title="Service FAQs" />

                {/* 2. FAQ INTERACTIVE AREA */}
                {/* We simply render our smart component and pass it the data it needs. */}
                <div>
                    <FaqSelector items={faqData} />
                </div>
            </div>
        </section>
    );
}