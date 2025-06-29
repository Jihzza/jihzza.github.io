// src/pages/sections/ConsultationsSection.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// COMPONENTS IMPORTS
import SectionText from '../../components/common/SectionTextWhite';
import ServicesTypeBox from '../../components/ServiceSections/ServicesTypeBox';
import ServicesDetailBlock from '../../components/ServiceSections/ServicesDetailBlock';
import TierCards from '../../components/coaching/TierCards';
import Button from '../../components/common/Button';

// ICONS IMPORT
import SocialMediaIcon from '../../assets/icons/Phone Branco.svg';
import BusinessIcon from '../../assets/icons/Business Branco.svg';
import OnlyFansIcon from '../../assets/icons/OnlyFans Branco.svg';
import DatingIcon from '../../assets/icons/Dating Branco.svg';
import HabitsIcon from '../../assets/icons/Habits Branco.svg';
import StocksIcon from '../../assets/icons/Stocks Branco.svg';
import PersonalTrainerIcon from '../../assets/icons/PersonalTrainer Branco.svg';
import StockResearcherIcon from '../../assets/icons/MoneyBag Branco.svg';
import AnytimeCommsIcon from '../../assets/icons/AnytimeComms Preto.svg';
import ResponseIcon from '../../assets/icons/Response Preto.svg';
import ClassesIcon from '../../assets/icons/Classes Preto.svg';

// DATA DEFINITIONS
// By defining data outside the component, we avoid recreating it on every render
// This is the best practice for large data sets
const coachingTypes = [
    { id: 1, icon: StocksIcon, title: 'Learn How to Invest', description: 'Master the markets with confidence. We break down core investment principles, asset allocation, and risk-management tactics so you can build a diversified portfolio that matches your goals and risk appetite.' },
    { id: 2, icon: PersonalTrainerIcon, title: 'Personal Trainer', description: 'Get a tailor-made fitness roadmap. From periodised workout plans to nutrition tweaks and habit tracking, you\'ll receive step-by-step guidance to hit strength, endurance, and aesthetic targets—safely and sustainably.' },
    { id: 3, icon: DatingIcon, title: 'Dating Coach', description: 'Upgrade your dating life. Hone social-skill fundamentals, craft a magnetic online profile, and learn real-world approach frameworks that boost confidence and attract high-quality partners.' },
    { id: 4, icon: OnlyFansIcon, title: 'OnlyFans Coaching', description: 'Turn OnlyFans into a thriving business. We cover niche positioning, content calendars, pricing psychology, fan-funnel design, and cross-platform promotion to scale subscribers and monthly earnings.' },
    { id: 5, icon: BusinessIcon, title: 'Business Advisor', description: 'Accelerate your venture\'s growth. From lean business-plan audits to marketing funnels, ops systems, and KPI dashboards, you\'ll get actionable strategies to increase revenue and profitability.' },
    { id: 6, icon: HabitsIcon, title: 'Habits & Personal Growth', description: 'Design habits that stick. Implement science-backed routines for productivity, health, and mindset, while removing self-sabotaging behaviours through accountability loops and progress reviews.' },
    { id: 7, icon: SocialMediaIcon, title: 'Social Media Manager', description: 'Grow an engaged audience. Receive content-pillar mapping, algorithm-proof posting schedules, analytic deep-dives, and monetisation tactics to turn followers into loyal customers.' },
    { id: 8, icon: StockResearcherIcon, title: 'Stock Researcher', description: 'Make data-driven trades. Learn fundamental and technical research workflows, valuation models, and watch-list curation so you can spot high-conviction stock opportunities before the crowd.' },
];

const coachingDetails = [
    { icon: AnytimeCommsIcon, title: 'Anytime Communication', description: 'Text or send audio messages anytime with questions, updates, or challenges. Get support when you need it most without waiting for scheduled appointments.' },
    { icon: ResponseIcon, title: 'Flexible Response Formats', description: 'Receive guidance through text, audio, or video responses based on your preference and the complexity of the topic. Visual demonstrations when needed, quick text answers when appropriate.' },
    { icon: ClassesIcon, title: 'Personalized Classes', description: 'Receive custom-tailored training sessions designed specifically for your skill level, learning style, and goals. Each class builds on your progress for maximum growth and development.' },
];

// MAIN COMPONENT DEFINITION
export default function CoachingSection() {
    // STATE MANAGEMENT: We use useState to manage the selected consultation type
    // null means no box is currently open. THis is the lifted state
    const [selectedId, setSelectedId] = useState(null);

    // HANDLER FUNCTION: this function is passed to the childe components
    const handleBoxClick = (id) => {
        // If the clicked box is already selected, close it, otherwise open it
        setSelectedId(prevId => (prevId === id ? null : id));
    };

    // We find the full object for the selcted item to pass its decsription to the detail view
    const selectedCoaching = selectedId ? coachingTypes.find(c => c.id === selectedId) : null;

    return (
        <section className="max-w-4xl mx-auto py-4">
            <SectionText title="Direct Coaching">
                Personalized coaching to help you excel in specific areas of your life. Get direct access to expert guidance tailored to your unique situation and goals.
            </SectionText>

            {/* INTERACTIVE GRID SECTION */}
            {/* Tje 'layout' prop on this grid container is crucial. It tells framer-motion to automatically animate any changes to this container's layout, such as when child element grows in size. This is what makes the other boxes "push down" smoothly */}
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 my-6">
                {coachingTypes.map(item => (
                    // We'll use a Fragment becuase we need ot render the box and its potential detail view together inside the map, and a key is required on the top-level element
                    <React.Fragment key={item.id}>
                        <ServicesTypeBox
                            icon={item.icon}
                            title={item.title}
                            isSelected={selectedId === item.id}
                            onClick={() => handleBoxClick(item.id)}
                        />
                        {/* The detail view is rendered across all columns of the grid */}
                        {/* it's wrapped in AnimatePrensence so we can animate its appearance and disappearance */}
                        <AnimatePresence>
                            {selectedId === item.id && (
                                <motion.div
                                    // This tells the element to span the full width of the grid
                                    className="col-span-2 md:col-span-3 lg:col-span-5 py-4 text-center"
                                    // The 'layout' prop animates the element's own size change layout
                                    // initial, animate, exit define the animation states
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto', transition: { duration: 0.3 } }}
                                    exit={{ opacity: 0, height: 0, transition: { duration: 0.3 } }}
                                >
                                    <h4 className="font-bold text-yellow-400 text-xl">{selectedCoaching?.title}</h4>
                                    <p className="text-white mt-2 max-w-2xl mx-auto">{selectedCoaching?.description}</p>

                                </motion.div>
                            )}
                        </AnimatePresence>
                    </React.Fragment>
                ))}
            </motion.div>
            {/* STATIC DETAILS SECTION */}
            <div className="mt-10 space-y-8">
                {coachingDetails.map((detail) => (
                    <ServicesDetailBlock
                        key={detail.title}
                        icon={detail.icon}
                        title={detail.title}
                        description={detail.description}
                    />
                ))}
            </div>
            <TierCards />
            <div className="w-full mt-auto pt-10 flex flex-col items-center justify-center">
                <Button>Get My Number</Button>
            </div>
        </section>
    );
}