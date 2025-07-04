// src/pages/sections/InteractiveSections.jsx

import React, { useState } from 'react';

import SocialMediaSection from './SocialMediaSection';
import FaqSection from './FaqSection';
import BugReportSection from './BugReportSection';
import SectionNavigator from '../../components/common/SectionNavigator';

const sections = [
    { id: 'social-media', label: 'Social Media' },
    { id: 'faq', label: 'FAQ' },
    { id: 'bug-report', label: 'Bug Report' },
];

export default function InteractiveSections() {
    // --- CHANGE IS HERE ---
    // We initialize the state with the correct ID 'social-media'
    // to ensure the social media section is visible by default.
    const [activeSection, setActiveSection] = useState('social-media');

    return (
        <section className="w-full max-w-4xl mx-auto py-8">
            <SectionNavigator
                sections={sections}
                activeSection={activeSection}
                onSelectSection={setActiveSection}
            />
            <div className="mt-8"> {/* Added margin-top for spacing */}
                {activeSection === 'social-media' && <SocialMediaSection />}
                {activeSection === 'faq' && <FaqSection />}
                {activeSection === 'bug-report' && <BugReportSection />}
            </div>
        </section>
    );
}