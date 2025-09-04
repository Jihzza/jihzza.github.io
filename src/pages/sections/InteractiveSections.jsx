// src/pages/sections/InteractiveSections.jsx

import React, { useState, useMemo } from 'react';

import SocialMediaSection from './SocialMediaSection';
import FaqSection from './FaqSection';
import BugReportSection from './bugReportSection';
import SectionNavigator from '../../components/common/SectionNavigator';
import { useTranslation } from 'react-i18next';

// Use keys at module scope; resolve labels inside the component
const SECTION_DEFS = [
  { id: 'social-media', labelKey: 'interactive.sections.socialMedia' },
  { id: 'faq',         labelKey: 'interactive.sections.faq' },
  { id: 'bug-report',  labelKey: 'interactive.sections.bugReport' },
];

export default function InteractiveSections() {
  const { t, i18n } = useTranslation();

  // Default visible section remains 'social-media'
  const [activeSection, setActiveSection] = useState('social-media');

  // Resolve i18n labels whenever language changes
  const sections = useMemo(
    () => SECTION_DEFS.map(s => ({ id: s.id, label: t(s.labelKey) })),
    [t, i18n.language]
  );

  return (
    <section className="w-full max-w-6xl mx-auto py-8">
      <SectionNavigator
        sections={sections}
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        className="flex"
      />
      <div>
        {activeSection === 'social-media' && <SocialMediaSection />}
        {activeSection === 'faq' && <FaqSection />}
        {activeSection === 'bug-report' && <BugReportSection />}
      </div>
    </section>
  );
}
