// src/components/video/FullscreenVideoModal.jsx

import React, { useState, useRef, useEffect, Fragment, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import VideoControls from './VideoControls';

/**
 * A smart component that displays a video in fullscreen, accessible modal.
 * It manages all video playback state and handles user interactions like single-clicks for play/pause and double-clicks to close
 * 
 * @param {object} props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {function} props.onClose - Function to call to close the modal.
 * @param {string} props.videoSrc - The source URL for the video file
 */
export default function FullscreenVideoModal({ isOpen, onClose, videoSrc }) {
    // REFS AND STATES
    const videoRef = useRef(null); // Ref to access the <video> DOM element directly
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0); // Playback progress percentage
    const [duration, setDuration] = useState('00:00');
    const [currentTime, setCurrentTime] = useState('00:00');

    // UTILITY FUNCTIONS
    /**
     * Formats seconds into a "mm:ss" string
     * @param {number} timeInSeconds - The time to format
     * @returns {string} The formatted time string
     */
    const formatTime = (timeInSeconds) => {
        // Ensure we don't try to format NaN, which can happen if the duration isn't loaded yet.
        if (isNaN(timeInSeconds)) {
            return '00:00';
        }
        const seconds = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
        const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');

        // --- FIX: Corrected a 'returns' typo to 'return' ---
        // The "Why": "returns" is not a valid JavaScript keyword. The correct keyword
        // to send a value back from a function is "return". This typo was causing
        // this function to fail silently, preventing the time and progress from updating.
        return `${minutes}:${seconds}`;
    };

    // EVENT HANDLERS
    const handlePlayPause = useCallback(() => {
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    }, []);

    const handleMuteToggle = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !videoRef.current.muted;
        setIsMuted(videoRef.current.muted);
    };

    const handleSeek = (e) => {
        if (!videoRef.current) return;
        const seekTime = (videoRef.current.duration / 100) * e.target.value;
        videoRef.current.currentTime = seekTime;
        setProgress(e.target.value);
    };

    // --- SINGLE & DOUBLE CLICK LOGIC ---
    // This handler uses a timer to differentiate between single and double clicks.
    const clickTimeoutRef = useRef(null);
    const handleScreenClick = () => {
        if (clickTimeoutRef.current) {
            // If a timeout is already set, it means this is a double-click.
            clearTimeout(clickTimeoutRef.current);
            clickTimeoutRef.current = null;
            onClose(); // Double-click closes the modal.
        } else {
            // On the first click, set a timeout.
            clickTimeoutRef.current = setTimeout(() => {
                handlePlayPause(); // If no second click occurs, it's a single-click.
                clickTimeoutRef.current = null;
            }, 250); // A 250ms window for a double-click.
        }
    };

    // --- HOOKS ---
    // Effect to bind event listeners to the video element.
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            const progressPercent = (video.currentTime / video.duration) * 100;
            setProgress(progressPercent);
            setCurrentTime(formatTime(video.currentTime));
        };

        const handleDurationChange = () => {
            setDuration(formatTime(video.duration));
        };

        // Add event listeners.
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('durationchange', handleDurationChange);
        video.addEventListener('play', () => setIsPlaying(true));
        video.addEventListener('pause', () => setIsPlaying(false));
        video.addEventListener('volumechange', () => setIsMuted(video.muted));

        // Cleanup function to remove listeners when the component unmounts.
        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('durationchange', handleDurationChange);
            video.removeEventListener('play', () => setIsPlaying(true));
            video.removeEventListener('pause', () => setIsPlaying(false));
            video.removeEventListener('volumechange', () => setIsMuted(video.muted));
        };
    }, []);

    // Effect to play the video when the modal opens.
    useEffect(() => {
        if (isOpen && videoRef.current) {
            videoRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch(e => console.error("Video autoplay failed:", e));
        } else if (!isOpen && videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    }, [isOpen]);

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Backdrop */}
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/90" />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                        <Dialog.Panel className="w-full h-screen bg-black rounded-lg relative">
                            {/* The video element itself */}
                            <video
                                ref={videoRef}
                                src={videoSrc}
                                className="h-full w-full object-cover md:object-contain"
                                onClick={handleScreenClick}
                                autoPlay
                                loop
                            />
                            {/* The controls component receives all state and handlers as props */}
                            <VideoControls
                                onPlayPause={handlePlayPause}
                                isPlaying={isPlaying}
                                onMuteToggle={handleMuteToggle}
                                isMuted={isMuted}
                                progress={progress}
                                onSeek={handleSeek}
                                currentTime={currentTime}
                                duration={duration}
                                onClose={onClose}
                            />
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}