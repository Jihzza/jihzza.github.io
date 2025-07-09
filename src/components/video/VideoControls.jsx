// src/components/video/VideoControls.jsx

import React from 'react';
import { PlayIcon, PauseIcon, SpeakerWaveIcon, SpeakerXMarkIcon, XMarkIcon } from '@heroicons/react/24/solid';

/**
 * A dumb presentational component for displaying  video player controls
 * It receives all its data and behvaior via props from a parent component
 * This makes it highly reusable and easy to test
 * 
 * @param {object} props
 * @param {function} props.onPlayPause - Toggles between play and pause
 * @param {boolean} props.isPlaying - The current playing state of the video
 * @param {function} props.onMuteToggle - Toggles the video's audio
 * @param {boolean} props.isMuted - The current muted state of the video
 * @param {number} props.progress - The current playback progress as a percentage (0-100)
 * @param {function(React.ChangeEvent<HTMLInputElement)} props.onSeek - handles user seeking via the progress bar
 * @param {string} props.currentTime - Formatted current time string
 * @param {string} props.duration - Formatted total duration string
 * @param {function} props.onClose - Closes the fullscreen player
 */
export default function VideoControls({
    onPlayPause, isPlaying, onMuteToggle, isMuted, progress, onSeek, currentTime, duration, onClose
}) {
    // Helper function to format the time display
    const timeDisplay = `${currentTime} / ${duration}`;

    return (
        // The main container for the controls
        // It's positioned at the bottom of its parent, has a semi-transparent bg
        // and uses flexbox to arrange its children
        <div
            className="absolute bottom-0 left-0 right-0 z-10 p-2 flex items-center gap-4 bg-black/50 transition-opacity duration-300"
            // Stop click events on the bar from bubbling up to the video (which would play/pause it).
            onClick={(e) => e.stopPropagation()}
        >
            {/* Play/Pause Button */}
            <button onClick={onPlayPause} className="text-white hover:text-yellow-400">
                {isPlaying ? <PauseIcon className="h-5 w-6" /> : <PlayIcon className="h-5 w-5" />}
            </button>

            {/* Mute/Unmute Button */}
            <button onClick={onMuteToggle} className="text-white hover:text-yellow-400">
                {isMuted ? <SpeakerXMarkIcon className="h-5 w-5" /> : <SpeakerWaveIcon className="h-5 w-5" />}
            </button>
            
            {/* Time Display */}
            <span className="text-[10px] font-semibold text-white">{timeDisplay}</span>

            {/* Progress/Seek Bar */}
            <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={onSeek}
                className="flex-grow h-1 bg-white rounded-full appearance-none cursor-pointer"
                style={{
                    // Custom styling for the range thumb (the draggable circle).
                    '--thumb-color': '#BFA200',
                    '--thumb-shadow': '0 0 5px rgba(191, 162, 0, 0.8)',
                }}
            />

            {/* Close Fullscreen Button */}
            <button onClick={onClose} className="text-white hover:text-red-500">
                <XMarkIcon className="h-5 w-5" />
            </button>
        </div>
    );
}