import React, { useRef, useState } from 'react';
import SectionText from '../../components/common/SectionTextWhite';
import ServicesDetailBlock from '../../components/ServiceSections/ServicesDetailBlock';
import ExpandableGrid from '../../components/common/ExpandableGrid';
import StickyButton from '../../components/common/StickyButton';
import { useTranslation } from 'react-i18next';

// ICONS (Imports remain the same)
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

export default function ConsultationsSection({ onBookConsultation }) {
    const { t } = useTranslation();
    const sectionRef = useRef(null);
    const [selectedConsultation, setSelectedConsultation] = useState(null);

    // --- DATA MAPPING ---
    // We map icons to the translated data since icons can't be in JSON.
    const consultationTypeIcons = [MindsetIcon, SocialMediaIcon, FinanceIcon, MarketingIcon, BusinessIcon, RelationshipsIcon, HealthIcon, OnlyFansIcon, AITechIcon, LifeAdviceIcon];
    const consultationDetailIcons = [Face2FaceIcon, DurationIcon, RecordingIcon, FollowUpEmailIcon, FollowUpConsultationIcon];

    // Load data from i18n and map icons/IDs
    const consultationTypes = t('consultations.types', { returnObjects: true }).map((type, index) => ({
        ...type,
        id: index + 1,
        icon: consultationTypeIcons[index]
    }));

    const consultationDetails = t('consultations.details', { returnObjects: true }).map((detail, index) => ({
        ...detail,
        icon: consultationDetailIcons[index]
    }));

    // --- BUTTON TEXT TRANSLATION ---
    // 1. Define the keys for the buttons in the order they appear.
    const buttonKeys = ["mindset", "social", "finance", "marketing", "business", "relationships", "health", "onlyfans", "ai", "life"];
    
    // 2. Create a map from the consultation ID (1, 2, 3...) to the translated button text.
    //    e.g., { 1: "Transforma Tu Mentalidad - 90€/h", 2: "Impulsa Tus Redes Sociales - 90€/h", ... }
    const buttonTextMap = buttonKeys.reduce((acc, key, index) => {
        acc[index + 1] = t(`consultations.buttons.${key}`);
        return acc;
    }, {});

    const handleConsultationSelect = (item) => {
        setSelectedConsultation(item);
    };

    // 3. Determine the button text. If a consultation is selected, use the map.
    //    Otherwise, use the default translated text.
    const buttonText = selectedConsultation
        ? buttonTextMap[selectedConsultation.id]
        : t('consultations.buttons.default');

    return (
        <section ref={sectionRef} id="consultations-section" className="max-w-4xl mx-auto py-4">
            <SectionText title={t('consultations.title')}>
                {t('consultations.subtitle')}
            </SectionText>

            <ExpandableGrid
                items={consultationTypes}
                onItemSelected={handleConsultationSelect}
            />

            <div className="mt-10 space-y-8">
                {consultationDetails.map((detail) => (
                    // Pass a unique key for React's rendering
                    <ServicesDetailBlock key={detail.title} {...detail} />
                ))}
            </div>

            {/* 4. The StickyButton now displays the fully translated, dynamic text. */}
            <StickyButton containerRef={sectionRef} onClick={() => onBookConsultation(selectedConsultation)}>
                {buttonText}
            </StickyButton>
        </section>
    );
}