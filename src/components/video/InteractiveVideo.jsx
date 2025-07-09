// src/components/video/InteractiveVideo.jsx

import React, { useState } from 'react';
import FullscreenVideoModal from './FullScreenVideoModal';

/**
 * A "smart" component that wraps a video to make it interactive.
 * It displays a muted, looping preview and handles opening a fullscreen
 * modal for a full-featured playback experience.
 *
 * @param {object} props
 * @param {string} props.videoSrc - The source URL for the video file.
 * @param {string} props.className - Additional CSS classes for the container.
 */
export default function InteractiveVideo({ videoSrc, className }) {
    // This state controls the visibility of the fullscreen modal.
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            {/* This is the inline preview video the user sees on the page.
              - It's muted, looping, and auto-playing to act like a GIF.
              - A single click on it will open the fullscreen modal.
              - The `playsInline` attribute is important for iOS to prevent it from auto-full-screening.
            */}
            <video
                src={videoSrc}
                autoPlay
                muted
                loop
                playsInline
                onClick={openModal}
                className={`cursor-pointer ${className}`} // Apply passed classes and make the cursor a pointer.
            />

            {/* The FullscreenVideoModal component is always rendered but is hidden by default.
              Its visibility is controlled by the `isModalOpen` state.
            */}
            <FullscreenVideoModal
                isOpen={isModalOpen}
                onClose={closeModal}
                videoSrc={videoSrc}
            />
        </>
    );
}