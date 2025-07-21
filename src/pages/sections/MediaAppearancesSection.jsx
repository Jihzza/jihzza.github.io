// src/pages/sections/MediaAppearancesSection.jsx

import React from 'react';
import SectionTextBlack from '../../components/common/SectionTextBlack';
import MediaAppearances from '../../assets/images/MediaAppearances.png';
import Media1 from '../../assets/images/CM Logo.png';
import Media2 from '../../assets/images/JN Logo.png';
import Media3 from '../../assets/images/Coutinho.png';
import { useTranslation } from 'react-i18next'; // 1. Import hook

// This static data will be merged with the translated text
const staticMediaData = [
    {
        imageSrc: Media1,
        articleUrl: 'https://www.cmjornal.pt/cmtv/programas/especiais/investigacao-cm/detalhe/conteudos-sexuais-na-internet-rendem-milhares-de-euros-e-dao-vida-de-luxo-a-utilizadores-veja-agora-na-cmtv-cmtv',
    },
    {
        imageSrc: Media2,
        articleUrl: 'https://x.com/JornalNoticias/status/1642802512435777536',
    },
    {
        imageSrc: Media3,
        articleUrl: 'https://www.youtube.com/watch?v=0_jkl7e7p5o', // Corrected URL
    },
];

export default function MediaAppearancesSection() {
    const { t } = useTranslation(); // 2. Initialize hook

    // 3. Load the translated alt text and merge it with the static data
    const translatedLinks = t('mediaAppearances.links', { returnObjects: true });
    const mediaLinks = staticMediaData.map((media, index) => ({
        ...media,
        altText: translatedLinks[index]?.altText || '' // Safely access translated text
    }));

    return (
        <section className="w-full mx-auto py-8 text-center md:px-6">
            
            {/* 4. Use translated text for title and subtitle */}
            <SectionTextBlack title={t('mediaAppearances.title')}>
                {t('mediaAppearances.subtitle')}
            </SectionTextBlack>

            <div className="my-8 px-4">
                <img 
                    src={MediaAppearances}
                    alt={t('mediaAppearances.mainImageAlt')} // 5. Use translated alt text
                    className="w-full max-w-3xl mx-auto md:w-80"
                />
            </div>

            <div className="flex justify-center items-center gap-14 mt-12 px-6  md:px-30 md:gap-24">
                {mediaLinks.map((media, index) => (
                    <a 
                        key={index}
                        href={media.articleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full transform hover:scale-105 transition-transform duration-300"
                    >
                        <img 
                            src={media.imageSrc}
                            alt={media.altText} // This now comes from the merged array
                            className="rounded-lg shadow-md w-full h-auto"
                        />
                    </a>
                ))}
            </div>

        </section>
    );
}