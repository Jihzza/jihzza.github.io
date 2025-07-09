// src/pages/sections/OtherWinsSection.jsx

import React from 'react';
import SectionTextBlack from '../../components/common/SectionTextBlack';
import ImageCarousel from '../../components/carousel/ImageCarousel';
import InteractiveVideo from '../../components/video/InteractiveVideo'; // 1. Import the new component
import TransformationVideo from '../../assets/vids/BodyTransformation.mp4';

export default function OtherWinsSection() {
    return (
        <section className="w-full mx-auto py-8 text-center flex flex-col">
            <SectionTextBlack title="Other Wins">
                69 Days Body Transformation
            </SectionTextBlack>

            {/*
              2. Replace the old <video> tag with our new InteractiveVideo component.
              The "Why": We've encapsulated all the complex fullscreen and control logic
              within our new components. This section is now clean and declarative again.
              It simply states "I want an interactive video here" and provides the source.
            */}
            <InteractiveVideo
                videoSrc={TransformationVideo}
                className="w-45 self-center rounded-xl"
            />
            
            <SectionTextBlack>
                I also have a successful track record on social media, especially on Twitter, where I've grown an audience of over 200,000 followers.
            </SectionTextBlack>

            <div className="full-bleed py-8">
                <ImageCarousel />
            </div>

        </section>
    );
}