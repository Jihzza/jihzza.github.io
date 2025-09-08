// src/components/video/FullscreenVideoModal.jsx
import React, { useState, useRef, useEffect, Fragment, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import VideoControls from './VideoControls';

export default function FullscreenVideoModal({ isOpen, onClose, videoSrc }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState('00:00');
  const [currentTime, setCurrentTime] = useState('00:00');

  const formatTime = (timeInSeconds) => {
    if (!Number.isFinite(timeInSeconds)) return '00:00';
    const total = Math.max(0, Math.floor(timeInSeconds));
    const minutes = Math.floor(total / 60).toString().padStart(2, '0');
    const seconds = (total % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handlePlayPause = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleMuteToggle = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const handleSeek = (e) => {
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration) || v.duration <= 0) return;
    const pct = Number(e.target.value);
    v.currentTime = (v.duration * pct) / 100;
    setProgress(pct);
  };

  // Single vs double click (double closes)
  const clickTimeoutRef = useRef(null);
  const handleScreenClick = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      onClose?.();
    } else {
      clickTimeoutRef.current = setTimeout(() => {
        handlePlayPause();
        clickTimeoutRef.current = null;
      }, 250);
    }
  };

  // Attach listeners only when modal is open (video exists)
  useEffect(() => {
    const v = videoRef.current;
    if (!isOpen || !v) return;

    const onTimeUpdate = () => {
      if (Number.isFinite(v.duration) && v.duration > 0) {
        setProgress((v.currentTime / v.duration) * 100);
      }
      setCurrentTime(formatTime(v.currentTime));
    };
    const onLoadedMetadata = () => {
      setDuration(formatTime(v.duration));
      setCurrentTime(formatTime(v.currentTime || 0));
    };
    const onDurationChange = () => setDuration(formatTime(v.duration));
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onVolume = () => setIsMuted(v.muted);

    v.addEventListener('timeupdate', onTimeUpdate);
    v.addEventListener('loadedmetadata', onLoadedMetadata);
    v.addEventListener('durationchange', onDurationChange);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('volumechange', onVolume);

    // If metadata already ready, initialize immediately
    if (v.readyState >= 1) onLoadedMetadata();

    return () => {
      v.removeEventListener('timeupdate', onTimeUpdate);
      v.removeEventListener('loadedmetadata', onLoadedMetadata);
      v.removeEventListener('durationchange', onDurationChange);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('volumechange', onVolume);
    };
  }, [isOpen]);

  // Autoplay when opening; pause when closing
  useEffect(() => {
    const v = videoRef.current;
    if (isOpen && v) {
      v.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else if (v) {
      v.pause();
      setIsPlaying(false);
    }
  }, [isOpen]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/90" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center">
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
            <Dialog.Panel className="w-full h-screen bg-black rounded-lg relative">
              <video
                ref={videoRef}
                src={videoSrc}
                className="h-full w-full object-cover md:object-contain"
                onClick={handleScreenClick}
                autoPlay
                loop
                preload="metadata"
                playsInline
              />
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
