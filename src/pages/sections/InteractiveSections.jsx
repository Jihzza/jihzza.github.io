// src/pages/sections/InteractiveSections.jsx

import React, { useState } from 'react';

import SocialMediaSection from './SocialMediaSection';
import FaqSection from './FaqSection';
import BugReportSection from './BugReportSection';
import SectionNavigator from '../../components/common/SectionNavigator';

// DATA DEFINITION
const sections = [
    { id: 'social-media', label: 'Social Media' },
    { id: 'faq', label: 'FAQ' },
    { id: 'bug-report', label: 'Bug Report' },
];

export default function InteractiveSections() {
    const [activeSection, setActiveSection] = useState('social');

    return (
        <section className="w-full max-w-4xl mx-auto py-8">
            <SectionNavigator
                sections={sections}
                activeSection={activeSection}
                onSelectSection={setActiveSection}
            />
            <div>
                {activeSection === 'social-media' && <SocialMediaSection />}
                {activeSection === 'faq' && <FaqSection />}
                {activeSection === 'bug-report' && <BugReportSection />}
            </div>
        </section>
    );
}