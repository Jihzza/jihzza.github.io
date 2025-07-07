import React, { useRef } from 'react';
import SectionText from '../../components/common/SectionTextWhite';
import ServicesDetailBlock from '../../components/ServiceSections/ServicesDetailBlock';
import Button from '../../components/common/Button';
import ExpandableGrid from '../../components/common/ExpandableGrid'; // 1. Import the new component
import StickyButton from '../../components/common/StickyButton';

// ICONS IMPORT
import MindsetIcon from '../../assets/icons/Brain Branco.svg';
import SocialMediaIcon from '../../assets/icons/Phone Branco.svg';
import FinanceIcon from '../../assets/icons/MoneyBag Branco.svg';
import MarketingIcon from '../../assets/icons/Target Branco.svg';
import BusinessIcon from '../../assets/icons/Bag Branco.svg';
import RelationshipsIcon from '../../assets/icons/Heart Branco.svg';
import HealthIcon from '../../assets/icons/Fitness Branco.svg';
import OnlyFansIcon from '../../assets/icons/OnlyFans Branco.svg';
import AITechIcon from '../../assets/icons/Robot Branco.svg';
import LifeAdviceIcon from '../../assets/icons/More Branco.svg';

import Face2FaceIcon from '../../assets/icons/Face2Face Preto.svg';
import DurationIcon from '../../assets/icons/Clock Preto.svg';
import RecordingIcon from '../../assets/icons/Microphone Preto.svg';
import FollowUpEmailIcon from '../../assets/icons/Email Preto.svg';
import FollowUpConsultationIcon from '../../assets/icons/FollowUp Preto.svg';

// Data remains the same
const consultationTypes = [
    { id: 1, icon: MindsetIcon, title: 'Mindset & Psychology', description: 'Unlock the power of your mind. Our Mindset & Psychology service provides you with tools and strategies to overcome limiting beliefs, enhance mental resilience, and cultivate a growth mindset. Achieve clarity, focus, and emotional balance to excel in all areas of your life..' },
    { id: 2, icon: SocialMediaIcon, title: 'Social Media Growth', description: 'Amplify your online presence. We\'ll help you craft a winning social media strategy, create engaging content, and grow your audience effectively. This description is a bit longer to test how the animation handles varying text lengths and ensure smoothness.' },
    { id: 3, icon: FinanceIcon, title: 'Finance & Wealth', description: 'Take control of your financial future. Learn sound investment principles, budgeting techniques, and wealth-building strategies tailored to your goals.' },
    { id: 4, icon: MarketingIcon, title: 'Marketing & Sales', description: 'Boost your brand and sales. We offer expert marketing strategies, from digital campaigns to traditional outreach, to help you reach your target audience.' },
    { id: 5, icon: BusinessIcon, title: 'Business Building', description: 'Turn your vision into reality. Get guidance on business planning, operational efficiency, and scaling your venture for sustainable success. Another longer description to check the animation smoothness when content varies significantly. This should push the items below down further, and the animation should remain fluid throughout the entire expansion and contraction process without any jerks or hard breaks, especially near the end of the animation sequence.' },
    { id: 6, icon: RelationshipsIcon, title: 'Relationships', description: 'Fster deeper connections. Improve communication, build stronger bonds, and navigate relationship challenges with expert advice..' },
    { id: 7, icon: HealthIcon, title: 'Health & Fitness', description: 'Achieve your peak physical condition. Personalized fitness plans, nutritional guidance, and motivational support to help you reach your health goals.' },
    { id: 8, icon: OnlyFansIcon, title: 'OnlyFans', description: 'Maximize your OnlyFans success. Strategies for content creation, promotion, and subscriber engagement to boost your earnings.' },
    { id: 9, icon: AITechIcon, title: 'AI & Tech', description: 'Leverage cutting-edge technology. Explore how AI and other tech solutions can optimize your business and personal productivity.' },
    { id: 10, icon: LifeAdviceIcon, title: 'Life Advice', description: 'Have other needs? Let\'s discuss! We offer a wide range of consulting services and can tailor solutions to your unique challenges. This is a final test case with a medium length description.' },
];

const consultationDetails = [
    { icon: Face2FaceIcon, title: 'Face-to-Face Video Call', description: 'Our consultations take place via video call, allowing us to connect personally. You\'ll be able to see me throughout the session, creating a more engaging and personal experience.' },
    { icon: DurationIcon, title: 'Minimum 45-Minute Sessions', description: 'Each consultation lasts a minimum of 45 minutes, ensuring we have adequate time to explore your concerns in depth and develop meaningful insights and action plans.' },
    { icon: RecordingIcon, title: 'Session Recordings', description: 'Join a one-on-one video call to discuss your challenges and opportunities.' },
    { icon: FollowUpEmailIcon, title: 'Follow-up Email', description: 'After your session, you\'ll receive a personalized follow-up email summarizing key points and next steps, ensuring you stay on track.' },
    { icon: FollowUpConsultationIcon, title: 'Follow-up Consultation', description: 'Book a follow-up consultation to review your progress, address new challenges, and receive continued support on your journey.' },
];


export default function ConsultationsSection({ onBookConsultation }) {
    
    
    const sectionRef = useRef(null);
    return (
        <section ref={sectionRef} className="max-w-4xl mx-auto py-4">
            <SectionText title="How I Can Help You">
                Whether you need guidance on mindset, social media growth, finance, marketing, business building, or relationships – I cover it all.
            </SectionText>

            {/* 3. Use the new component, passing the data as a prop. It's clean and declarative. */}
            <ExpandableGrid items={consultationTypes} />

            <div className="mt-10 space-y-8">
                {consultationDetails.map((detail) => (
                    <ServicesDetailBlock
                        key={detail.title}
                        icon={detail.icon}
                        title={detail.title}
                        description={detail.description}
                    />
                ))}
            </div>
            {/* 5. ADD THE STICKY BUTTON */}
            {/*
              - We place the StickyButton component here. It will appear to be at the
                bottom of the container when docked.
              - `containerRef`: We pass the ref of the section.
              - `onClick`: We pass the `onBookConsultation` handler so the button is functional.
            */}
            <StickyButton containerRef={sectionRef} onClick={onBookConsultation}>
                Book a Consultation
            </StickyButton>
        </section>
    );
}