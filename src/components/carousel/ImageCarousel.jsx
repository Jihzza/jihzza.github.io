// src/components/carousel/ImageCarousel.jsx

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Navigation } from 'swiper/modules';

// Import Swiper's base and effect styles. This is crucial for functionality and appearance.
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';

// Image Import
// Twitter
import Twitter1 from '../../assets/Twitter/Twitter1.png';
import Twitter2 from '../../assets/Twitter/Twitter2.png';
import Twitter3 from '../../assets/Twitter/Twitter3.png';
import Twitter4 from '../../assets/Twitter/Twitter4.png';
import Twitter5 from '../../assets/Twitter/Twitter5.png';
import Twitter6 from '../../assets/Twitter/Twitter6.png';
import Twitter7 from '../../assets/Twitter/Twitter7.png';
import Twitter8 from '../../assets/Twitter/Twitter8.png';
import Twitter9 from '../../assets/Twitter/Twitter9.png';
import Twitter10 from '../../assets/Twitter/Twitter10.png';
import Twitter11 from '../../assets/Twitter/Twitter11.png';
import Twitter12 from '../../assets/Twitter/Twitter12.png';
import Twitter13 from '../../assets/Twitter/Twitter13.png';
import Twitter14 from '../../assets/Twitter/Twitter14.png';
import Twitter15 from '../../assets/Twitter/Twitter15.png';
import Twitter16 from '../../assets/Twitter/Twitter16.png';
import Twitter17 from '../../assets/Twitter/Twitter17.png';
import Twitter18 from '../../assets/Twitter/Twitter18.png';
import Twitter19 from '../../assets/Twitter/Twitter19.png';
import Twitter20 from '../../assets/Twitter/Twitter20.png';
import Twitter21 from '../../assets/Twitter/Twitter21.png';
import Twitter22 from '../../assets/Twitter/Twitter22.png';
import Twitter23 from '../../assets/Twitter/Twitter23.png';
import Twitter24 from '../../assets/Twitter/Twitter24.png';
import Twitter25 from '../../assets/Twitter/Twitter25.png';
import Twitter26 from '../../assets/Twitter/Twitter26.png';
import Twitter27 from '../../assets/Twitter/Twitter27.png';
import Twitter28 from '../../assets/Twitter/Twitter28.png';
import Twitter29 from '../../assets/Twitter/Twitter29.png';
import Twitter30 from '../../assets/Twitter/Twitter30.png';
import Twitter31 from '../../assets/Twitter/Twitter31.png';
import Twitter32 from '../../assets/Twitter/Twitter32.png';
import Twitter33 from '../../assets/Twitter/Twitter33.png';
import Twitter34 from '../../assets/Twitter/Twitter34.png';
import Twitter35 from '../../assets/Twitter/Twitter35.png';
import Twitter36 from '../../assets/Twitter/Twitter36.png';
import Twitter37 from '../../assets/Twitter/Twitter37.png';

// Tiktok
import Tiktok1 from '../../assets/Tiktok/Tiktok1.png';
import Tiktok2 from '../../assets/Tiktok/Tiktok2.png';
import Tiktok3 from '../../assets/Tiktok/Tiktok3.png';
import Tiktok4 from '../../assets/Tiktok/Tiktok4.png';
import Tiktok5 from '../../assets/Tiktok/Tiktok5.png';
import Tiktok6 from '../../assets/Tiktok/Tiktok6.png';
import Tiktok7 from '../../assets/Tiktok/Tiktok7.png';
import Tiktok8 from '../../assets/Tiktok/Tiktok8.png';
import Tiktok9 from '../../assets/Tiktok/Tiktok9.png';
import Tiktok10 from '../../assets/Tiktok/Tiktok10.png';
import Tiktok11 from '../../assets/Tiktok/Tiktok11.png';
import Tiktok12 from '../../assets/Tiktok/Tiktok12.png';
import Tiktok13 from '../../assets/Tiktok/Tiktok13.png';
import Tiktok14 from '../../assets/Tiktok/Tiktok14.png';
import Tiktok15 from '../../assets/Tiktok/Tiktok15.png';
import Tiktok16 from '../../assets/Tiktok/Tiktok16.png';
import Tiktok17 from '../../assets/Tiktok/Tiktok17.png';
import Tiktok18 from '../../assets/Tiktok/Tiktok18.png';
import Tiktok19 from '../../assets/Tiktok/Tiktok19.png';
import Tiktok20 from '../../assets/Tiktok/Tiktok20.png';

// --- COMPONENT DATA ---
// We define our image sources in an array. This makes it easy to add, remove, or change images later
// without touching the component's logic.
// For this example, I'm using placeholder images. You should replace these with your actual image paths.
const images = [
  Twitter1,
  Twitter2,
  Twitter3,
  Twitter4,
  Twitter5,
  Twitter6,
  Twitter7,
  Twitter8,
  Twitter9,
  Twitter10,
  Twitter11,
  Twitter12,
  Twitter13,
  Twitter14,
  Twitter15,
  Twitter16,
  Twitter17,
  Twitter18,
  Twitter19,
  Twitter20,
  Twitter21,
  Twitter22,
  Twitter23,
  Twitter24,
  Twitter25,
  Twitter26,
  Twitter27,
  Twitter28,
  Twitter29,
  Twitter30,
  Twitter31,
  Twitter32,
  Twitter33,
  Twitter34,
  Twitter35,
  Twitter36,
  Twitter37,
  Tiktok1,
  Tiktok2,
  Tiktok3,
  Tiktok4,
  Tiktok5,
  Tiktok6,
  Tiktok7,
  Tiktok8,
  Tiktok9,
  Tiktok10,
  Tiktok11,
  Tiktok12,
  Tiktok13,
  Tiktok14,
  Tiktok15,
  Tiktok16,
  Tiktok17,
  Tiktok18,
  Tiktok19,
  Tiktok20,
];

/**
 * A reusable image carousel component using Swiper.js.
 * It's configured for a 3D cover-flow effect, autoplay, and infinite looping.
 * @param {{images: string[]}} props - An array of image URLs to display.
 */
export default function ImageCarousel() {
    return (
        <div className="pt-8 relative"> {/* Set to relative to position navigation arrows */}
            <Swiper
                // --- SWIPER CONFIGURATION ---
                modules={[Autoplay, EffectCoverflow, Navigation]} // Enable required Swiper modules
                effect={'coverflow'}      // Use the 3D cover-flow effect
                grabCursor={true}         // Show a "grab" cursor on hover
                centeredSlides={true}     // Ensure the active slide is always in the center
                loop={true}               // Enable infinite looping through the slides
                slidesPerView={'auto'}    // Let Swiper determine the number of slides based on their width
                
                // Configuration specific to the Coverflow effect
                coverflowEffect={{
                    rotate: 50,           // Rotation angle of the side slides
                    stretch: 0,           // How much to stretch side slides
                    depth: 100,           // Z-axis depth of the side slides
                    modifier: 1,          // A multiplier for all coverflow effects
                    slideShadows: true,   // Display shadows on the sides of the slides for a 3D feel
                }}

                // Configuration for the autoplay feature
                autoplay={{
                    delay: 3000,                      // Time in ms between slide transitions
                    disableOnInteraction: false,      // Keep autoplaying even after user interaction
                }}

                className="w-full" // Apply full width to the Swiper container
            >
                {/* We map over the `images` array to create a SwiperSlide for each image. */}
                {images.map((src, index) => (
                    // The `key` is essential for React's rendering logic.
                    <SwiperSlide key={index} style={{ width: '40%', maxWidth: '500px' }}>
                        <img 
                            src={src} 
                            alt={`Other win ${index + 1}`} 
                            className="rounded-lg object-cover w-full"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}