// src/pages/sections/HeroSection.jsx

import React from 'react';
import LearnFromHeader from '../../components/hero/LearnFromHeader';
import WordCarousel from '../../components/hero/WordCarousel';
import ServicesPreview from '../../components/hero/ServicesPreview';
import CtaSection from '../../components/hero/CtaSection';

/**
 * The main Hero Section for the homepage.
 *
 * @param {function} onScheduleConsultation - Handler from HomePage.
 * @param {function} onScheduleCoaching - Handler from HomePage.
 * @param {function} onScheduleInvestment - Handler from HomePage.
 */
export default function HeroSection({
  onScheduleConsultation,
  onScheduleCoaching,
  onScheduleInvestment
}) {
  return (
    <section className="w-full max-w-7xl mx-auto py-12 px-4 md:px-8 text-center">
      <LearnFromHeader />
      <WordCarousel />

      {/*
        CRITICAL FIX: These three props must be passed from here
        down to the ServicesPreview component. This is the link that
        was missing and causing your TypeErrors.
      */}
      <ServicesPreview
        onScheduleConsultation={onScheduleConsultation}
        onScheduleCoaching={onScheduleCoaching}
        onScheduleInvestment={onScheduleInvestment}
      />

      <CtaSection />
    </section>
  );
}