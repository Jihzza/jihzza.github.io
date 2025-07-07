import React, { useRef } from 'react';
import SectionText from '../../components/common/SectionTextWhite';
import ServicesDetailBlock from '../../components/ServiceSections/ServicesDetailBlock';
import TierCards from '../../components/coaching/TierCards';
import ExpandableGrid from '../../components/common/ExpandableGrid'; // 1. Import the new component
import StickyButton from '../../components/common/StickyButton';

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


// Data remains the same
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


export default function CoachingSection({ onBookCoaching }) {

    const sectionRef = useRef(null);

    // 2. All state and animation logic is now gone.
    return (
        <section ref={sectionRef} className="max-w-4xl mx-auto py-4">
            <SectionText title="Direct Coaching">
                Personalized coaching to help you excel in specific areas of your life. Get direct access to expert guidance tailored to your unique situation and goals.
            </SectionText>

            {/* 3. Use the new component, passing the data as a prop. */}
            <ExpandableGrid items={coachingTypes} />

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
            <StickyButton containerRef={sectionRef} onClick={onBookCoaching}>
                Get My Number
            </StickyButton>
        </section>
    );
}