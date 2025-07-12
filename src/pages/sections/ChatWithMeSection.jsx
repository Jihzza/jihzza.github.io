// src/pages/sections/ChatWithMeSection.jsx

import React from 'react';
import SectionTextBlack from '../../components/common/SectionTextBlack';
import Button from '../../components/common/Button';
import InfoBlock from '../../components/common/InfoBlock';
import ChatIcon from '../../assets/icons/Dagalow Preto.svg';
import { useTranslation } from 'react-i18next'; // 1. Import the hook

export default function ChatWithMeSection() {
  const { t } = useTranslation(); // 2. Initialize the hook

  return (
    <section className="max-w-4xl mx-auto py-8 text-center space-y-6" id="chat-section">
      
      {/* 3. Use translated text for the title and subtitle */}
      <SectionTextBlack title={t('chatWithMe.title')}>
        {t('chatWithMe.subtitle')}
      </SectionTextBlack>

      {/* 4. Use translated text for the InfoBlock props and content */}
      <InfoBlock
        iconSrc={ChatIcon}
        altText={t('chatWithMe.iconAltText')}
      >
        {t('chatWithMe.iconLabel')}
      </InfoBlock>
      
      {/* 5. Use translated text for the button */}
      <div className="w-full flex justify-center">
        <Button>{t('chatWithMe.buttonText')}</Button>
      </div>

    </section>
  );
}