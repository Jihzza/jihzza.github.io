// src/components/profile/AvatarUploader.jsx
import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { uploadAvatar } from '../../services/authService';
import { ArrowUpOnSquareIcon, PhotoIcon } from '@heroicons/react/24/outline';
import OctagonAvatar from '../common/OctagonAvatar'; // ← NEW

export default function AvatarUploader({ currentAvatarUrl, onUploadSuccess }) {
    const { user } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleFileSelect = async (event) => {
        const file = event.target.files?.[0];
        if (!file || !user) return;

        if (!file.type.startsWith('image/')) {
            setError('Please select an image file.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('File is too large (max 5MB).');
            return;
        }

        setError('');
        setUploading(true);

        try {
            const newUrl = await uploadAvatar(user.id, file);
            if (newUrl) {
                onUploadSuccess(newUrl);
            } else {
                throw new Error('Upload failed to return a URL.');
            }
        } catch (uploadError) {
            console.error('Avatar upload error:', uploadError);
            setError('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="relative">
                {/* Octagon preview */}
                <OctagonAvatar
                    src={currentAvatarUrl || 'https://via.placeholder.com/150'}
                    alt="User avatar"
                    size={112}
                    ringWidth={3}
                    gap={6}
                    ringColor="#FACC15" // yellow-400 vibe to match the brand highlights
                    className="shadow-lg"
                    key={currentAvatarUrl} // force re-render when URL changes
                />

                {/* Loading Spinner Overlay */}
                {uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                )}
            </div>

            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept="image/png, image/jpeg, image/gif"
                disabled={uploading}
            />

            {/* Upload Button */}
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-auto flex justify-center items-center text-base leading-[1.45] tracking-[0.01em] px-3 py-2 rounded-lg bg-[#BFA200] text-black font-bold md:text-l"
            >
                <ArrowUpOnSquareIcon className="h-5 w-5 mr-2 md:w-7 md:h-7" />
                {uploading ? 'Uploading...' : 'Change Photo'}
            </button>

            {/* Error Message */}
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}
