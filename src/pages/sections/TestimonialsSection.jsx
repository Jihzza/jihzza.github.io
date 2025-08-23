// src/pages/sections/TestimonialsSection.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Autoplay, Pagination } from 'swiper/modules';
import BaseCarousel from '../../components/carousel/BaseCarousel';
import SectionTextWhite from '../../components/common/SectionTextWhite';
import TestimonialCard from '../../components/testimonials/TestimonialCard';
import Button from '../../components/common/Button';
import { getTestimonials } from '../../services/testimonialService';
import { useTranslation } from 'react-i18next'; // 1. Import hook

export default function TestimonialsSection() {
    const { t } = useTranslation(); // 2. Initialize hook
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTestimonials = async () => {
            setLoading(true);
            const { data, error } = await getTestimonials();
            if (error) {
                console.error("Failed to fetch testimonials:", error);
            } else {
                setTestimonials(data || []);
            }
            setLoading(false);
        };
        fetchTestimonials();
    }, []);

    const handleAddTestimonialClick = () => {
        navigate('/add-testimonial');
    };

    const swiperConfig = {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        spaceBetween: 30,
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            modifier: 2.5,
            slideShadows: false,
        },
        modules: [Autoplay, Pagination],
    };

    const renderTestimonialSlide = (testimonial) => (
        <TestimonialCard testimonial={testimonial} />
    );

    return (
        <section id="testimonials-section" className="w-full mx-auto pt-8 pb-4 text-center md:px-6">
            {/* 3. Use translated text */}
            <SectionTextWhite title={t('testimonials.title')}>
                {t('testimonials.subtitle')}
            </SectionTextWhite>

            <div className="full-bleed py-8">
                {!loading && testimonials.length > 0 ? (
                    <BaseCarousel
                        items={testimonials}
                        renderItem={renderTestimonialSlide}
                        swiperConfig={swiperConfig}
                        containerClassName="testimonial-swiper"
                        slideClassName="swiper-slide-custom"
                    />
                ) : (
                    <p className="text-gray-400 mt-8">{t('testimonials.noTestimonials')}</p>
                )}
            </div>

            <div className="mt-10 md:mt-0">
                <Button onClick={handleAddTestimonialClick}>{t('testimonials.leaveButton')}</Button>
            </div>
        </section>
    );
}