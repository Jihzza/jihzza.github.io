// src/pages/sections/SocialMediaSection.jsx

import React from 'react';

// --- COMPONENT IMPORTS ---
// We import our reusable components to keep this file clean and focused on layout.
import SectionTextBlack from '../../components/common/SectionTextBlack';
import SocialMediaIcon from '../../components/social/SocialMediaIcon';

// --- ICON IMPORTS ---
// Import the SVG icons you downloaded in Step 1.
// Ensure these paths are correct based on where you saved the files.
import InstagramIcon from '../../assets/icons/Instagram.svg';
import TiktokIcon from '../../assets/icons/Tiktok.svg';
import XIcon from '../../assets/icons/X Twitter.svg';

// --- DATA DEFINITION ---
// By defining our social media links as an array of objects, we make the code cleaner (using .map)
// and exceptionally easy to modify or add to in the future.
const socialLinks = [
    {
        href: 'https://www.instagram.com/danieldagalow/', // Replace with your actual URL
        iconSrc: InstagramIcon,
        altText: 'Follow me on Instagram',
    },
    {
        href: 'https://www.tiktok.com/@galo_portugues?_t=ZG-8xcWPWjcJKS&_r=1', // Replace with your actual URL
        iconSrc: TiktokIcon,
        altText: 'Follow me on TikTok',
    },
    {
        href: 'https://www.x.com/galo_portugues?t=C0UzWJg6Vt7vUpDDMdQslw&s=08', // Replace with your actual URL
        iconSrc: XIcon,
        altText: 'Follow me on X',
    },
];

/**
 * A dedicated section to display social media links.
 * It uses a reusable title component and a reusable icon component.
 */
export default function SocialMediaSection() {
    // --- RENDER LOGIC ---
    return (
        // The <section> tag is semantically correct for a content block.
        // - `max-w-4xl mx-auto`: Constrains width and centers the section.
        // - `py-8`: Provides vertical padding.
        // - `text-center`: Centers all child text elements.
        <section className="max-w-4xl mx-auto py-8 text-center">

            {/* 1. SECTION TITLE */}
            {/* We reuse the `SectionTextBlack` component for a consistent look. */}
            {/* Note that we are only passing the `title` prop and no children, as requested. */}
            <SectionTextBlack title="Follow Me On" />

            {/* 2. ICONS CONTAINER */}
            {/* This div acts as a wrapper for our icons.
                - `flex`: Enables flexbox layout.
                - `justify-center`: Centers the icons horizontally within the container.
                - `items-center`: Aligns the icons vertically (in case they have different heights).
                - `gap-12`: Adds consistent spacing between each icon.
                - `mt-8`: Adds margin to the top to space it from the title.
            */}
            <div className="flex justify-center items-center gap-6">
                {/* We map over our `socialLinks` array to render an icon for each item. */}
                {/* This is a core React pattern that keeps our JSX clean and scalable. */}
                {socialLinks.map((social) => (
                    <SocialMediaIcon
                        key={social.altText} // A unique key is crucial for React's rendering performance.
                        href={social.href}
                        iconSrc={social.iconSrc}
                        altText={social.altText}
                    />
                ))}
            </div>

        </section>
    );
}