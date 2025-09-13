// src/components/video/FullScreenVideo.jsx

import React, { useRef, useState, useEffect } from 'react';

const FullScreenVideo = ({ src, className, ...props }) => {
    const videoRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [clickTimeout, setClickTimeout] = useState(null);

    // Handle fullscreen change events
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isCurrentlyFullscreen = !!(
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement
            );
            setIsFullscreen(isCurrentlyFullscreen);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
        };
    }, []);

    // Enter fullscreen
    const enterFullscreen = async () => {
        const video = videoRef.current;
        if (!video) return;

        try {
            if (video.requestFullscreen) {
                await video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) {
                await video.webkitRequestFullscreen();
            } else if (video.mozRequestFullScreen) {
                await video.mozRequestFullScreen();
            } else if (video.msRequestFullscreen) {
                await video.msRequestFullscreen();
            }
        } catch (error) {
            console.error('Error entering fullscreen:', error);
        }
    };

    // Exit fullscreen
    const exitFullscreen = async () => {
        try {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                await document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                await document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                await document.msExitFullscreen();
            }
        } catch (error) {
            console.error('Error exiting fullscreen:', error);
        }
    };

    // Handle video click
    const handleVideoClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isFullscreen) {
            // If not in fullscreen, enter fullscreen and autoplay
            enterFullscreen();
            return;
        }

        // If in fullscreen, handle single/double click
        if (clickTimeout) {
            // Double click - exit fullscreen
            clearTimeout(clickTimeout);
            setClickTimeout(null);
            exitFullscreen();
        } else {
            // Single click - toggle play/pause
            setClickTimeout(
                setTimeout(() => {
                    setClickTimeout(null);
                    togglePlayPause();
                }, 300)
            );
        }
    };

    // Toggle play/pause
    const togglePlayPause = () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    // Handle video events
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    // Autoplay when entering fullscreen
    useEffect(() => {
        if (isFullscreen && videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    }, [isFullscreen]);

    return (
        <video
            ref={videoRef}
            src={src}
            className={className}
            onClick={handleVideoClick}
            onPlay={handlePlay}
            onPause={handlePause}
            preload="metadata"
            autoPlay
            {...props}
        >
            Your browser does not support the video tag.
        </video>
    );
};

export default FullScreenVideo;