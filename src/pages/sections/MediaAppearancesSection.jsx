// src/pages/sections/MediaAppearancesSection.jsx

import React from 'react';
import SectionTextBlack from '../../components/common/SectionTextBlack';
import MediaAppearances from '../../assets/images/MediaAppearances.png';
import Media1 from '../../assets/images/CM Logo.png';
import Media2 from '../../assets/images/JN Logo.png';
import Media3 from '../../assets/images/Coutinho.png';

const mediaLinks = [
    {
        imageSrc: Media1,
        articleUrl: 'https://www.cmjornal.pt/cmtv/programas/especiais/investigacao-cm/detalhe/conteudos-sexuais-na-internet-rendem-milhares-de-euros-e-dao-vida-de-luxo-a-utilizadores-veja-agora-na-cmtv-cmtv',
        altText: 'A snapshot from the Forbes feature article.',
    },
    {
        imageSrc: Media2,
        articleUrl: 'https://x.com/JornalNoticias/status/1642802512435777536',
        altText: 'An image from the TechCrunch interview.',
    },
    {
        imageSrc: Media3,
        articleUrl: 'https://www.youtube.com/watch?v=yr68LJvYDWc',
        altText: 'Promotional graphic for a podcast guest appearance.',
    },
];

export default function MediaAppearancesSection() {
    return (
        <section className="w-full mx-auto py-8 text-center">
            
            <SectionTextBlack title="Media Appearances">
                I've had the privilege of sharing my insights and stories with various media outlets. Explore some of these features below.
            </SectionTextBlack>

            <div className="my-8 px-4">
                <img 
                    src={MediaAppearances}
                    alt="Main media feature" 
                    className="w-full max-w-3xl mx-auto"
                />
            </div>

            <div className="flex justify-center items-center gap-14 mt-12 px-6">
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
                            alt={media.altText}
                            className="rounded-lg shadow-md w-full h-auto"
                        />
                    </a>
                ))}
            </div>

        </section>
    );
}