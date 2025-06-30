// src/pages/sections/ChatWithMeSection.jsx

import React from 'react';

// --- COMPONENT IMPORTS ---
// We import our reusable components to build the section.
import SectionTextBlack from '../../components/common/SectionTextBlack';
import Button from '../../components/common/Button';
import InfoBlock from '../../components/common/InfoBlock'; // Our new component.

// --- ASSET IMPORTS ---
// We import the icon needed for this section.
// IMPORTANT: You will need to replace 'ChatIconBlack.svg' with the actual filename
// of the icon you have in your 'src/assets/icons/' folder.
import ChatIcon from '../../assets/icons/Dagalow Preto.svg';

/**
 * A dedicated section that invites the user to chat.
 * This component structures the content using reusable child components.
 */
export default function ChatWithMeSection() {
  // RENDER LOGIC
  return (
    // The <section> tag is semantically correct for a content block.
    // - `max-w-4xl mx-auto`: Constrains width and centers the section.
    // - `py-8`: Provides vertical padding.
    // - `text-center`: Ensures all text elements default to center alignment.
    // - `space-y-8`: Adds consistent vertical spacing between all direct children.
    <section className="max-w-4xl mx-auto py-8 text-center space-y-6">

      {/* 1. SECTION TITLE */}
      {/* We use the existing component for a consistent look. */}
      <SectionTextBlack title="Smart Assistance: Our AI Chatbot">
        {/* Children of SectionTextBlack are used for the subtitle. */}
        Our AI assistant helps you find the right services and prepares us for your consultations, saving you time and money.

      </SectionTextBlack>

      {/* 2. CENTRAL INFO BLOCK */}
      {/* Here we use our new InfoBlock component. */}
      <InfoBlock
        iconSrc={ChatIcon}
        altText="Chat bubble icon"
      >
        Chatbot Icon
      </InfoBlock>

      {/* 3. CALL-TO-ACTION BUTTON */}
      {/* We reuse the primary Button component. */}
      <div className="w-full flex justify-center">
        <Button>Chatbot</Button>
      </div>

    </section>
  );
}