// src/pages/sections/TestimonialsSection.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// --- CHANGE: Import the module references you need to use in the config object ---
import { Autoplay, Pagination } from 'swiper/modules';
import BaseCarousel from '../../components/carousel/BaseCarousel';
import SectionTextWhite from '../../components/common/SectionTextWhite';
import TestimonialCard from '../../components/testimonials/TestimonialCard';
import Button from '../../components/common/Button';
import { getTestimonials } from '../../services/testimonialService';

export default function TestimonialsSection() {
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
        // Now that Autoplay and Pagination are imported, this line will work correctly.
        modules: [Autoplay, Pagination], 
    };

    const renderTestimonialSlide = (testimonial) => (
        <TestimonialCard testimonial={testimonial} />
    );

    return (
        <section className="w-full mx-auto py-8 text-center">
        <SectionTextWhite title="Success Stories">
            Here are some reviews — and if I've helped you, please leave one so we can inspire even more people.
        </SectionTextWhite>

        {/* --- CHANGE: WRAP THE CAROUSEL IN THE .full-bleed DIV --- */}
        {/* The "Why": By wrapping our carousel in a div with the `full-bleed` class,
            we are applying the exact same CSS technique used by the FeatureCarousel.
            This will make the carousel background span the full width of the screen,
            ignoring the section's padding. We can also add vertical padding (`py-8`) here. */}
        <div className="full-bleed py-8">
            {!loading && testimonials.length > 0 ? (
                <BaseCarousel
                    items={testimonials}
                    renderItem={renderTestimonialSlide}
                    swiperConfig={swiperConfig}
                    // We can remove margin/padding from here as it's now on the wrapper
                    containerClassName="testimonial-swiper"
                    slideClassName="swiper-slide-custom"
                />
            ) : (
                <p className="text-gray-400 mt-8">No testimonials yet. Be the first!</p>
            )}
        </div>

        <div className="mt-10">
            <Button onClick={handleAddTestimonialClick}>Leave a Testimonial</Button>
        </div>
    </section>
    );
}