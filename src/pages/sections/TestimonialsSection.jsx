// src/pages/sections/TestimonialsSection.jsx

// This component is the main container for the testimonials section on the home page.
// It fetches testimonials and displays them in a Swiper carousel without navigation arrows.

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
// --- CHANGE: Removed 'Navigation' from the import ---
import { Autoplay, Pagination } from 'swiper/modules';
import SectionTextWhite from '../../components/common/SectionTextWhite';
import TestimonialCard from '../../components/testimonials/TestimonialCard';
import Button from '../../components/common/Button';
import { getTestimonials } from '../../services/testimonialService';

// Import Swiper styles.
import 'swiper/css';
import 'swiper/css/pagination';

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

    return (
        <section className="w-full mx-auto py-8 text-center">

            <SectionTextWhite title="Success Stories">
            Here are some reviews — and if I've helped you, please leave one so we can inspire even more people.
            </SectionTextWhite>

            {!loading && testimonials.length > 0 ? (
                <Swiper
                    // --- CHANGE: Removed 'Navigation' from the modules array ---
                    modules={[Autoplay]}
                    loop={true}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    slidesPerView={1}
                    spaceBetween={30}
                    breakpoints={{
                        768: { slidesPerView: 2, spaceBetween: 40 },
                        1024: { slidesPerView: 3, spaceBetween: 50 }
                    }}
                    className="my-8 py-4 px-10"
                >
                    {testimonials.map((testimonial) => (
                        <SwiperSlide key={testimonial.id} style={{ height: 'auto' }}>
                            <TestimonialCard testimonial={testimonial} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <p className="text-gray-400 mt-8">No testimonials yet. Be the first!</p>
            )}

            <div className="mt-10">
                <Button onClick={handleAddTestimonialClick}>Leave a Testimonial</Button>
            </div>
        </section>
    );
}