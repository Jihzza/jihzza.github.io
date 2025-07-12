// src/services/testimonialService.js´

// This service module encapsulates all interactions with the Supabase 'testimonials' table and storage.
// By centralizing data logic here, we  adhere to the Single Responsibility Principle., making our components cleaner and our data access layer easier to manage, test, and potentially replace

import { supabase } from '../lib/supabaseClient';

/**
 * Fetches all testimonials from the database
 * The data is ordered by creation date to show the newest testimonials first
 * @returns {{ data: object[], error: object|null}} - The fetched testimonials an error
 */
export const getTestimonials = async () => {
    // Select all columns from the 'testimonials' table
    // Supabase automatically converts snake_case (image_url) to camelCase (imageUrl) in the response.
    const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false }); // Show newest first

    if (error) {
        console.error('Error fetching testimonials:', error.message);
    }

    return { data, error };
};

/**
 * Creates a new testimonial, including uploading an image if provided
 * @param {object} testimonialData - Contains name, content, and the user ID.
 * @param {File} imageFile - The image file to upload (can be null)
 * @returns {{ data: object, error: object|null }} - The newly created testimonial data or an error
 */
export const createTestimonial = async (testimonialData, imageFile) => {
    // 1. Destructure all the data we now receive from the page.
    const { name, content, userId, existingAvatarUrl } = testimonialData;

    let finalImageUrl = existingAvatarUrl || null; // Default to the existing avatar.

    // 2. If a *new* image is provided, upload it and overwrite the URL.
    if (imageFile) {
        const filePath = `public/${userId}/${Date.now()}_${imageFile.name}`;

        const { error: uploadError } = await supabase.storage
            .from('testimonials')
            .upload(filePath, imageFile);

        if (uploadError) {
            console.error('Error uploading new image:', uploadError.message);
            return { data: null, error: uploadError };
        }

        const { data: urlData } = supabase.storage
            .from('testimonials')
            .getPublicUrl(filePath);

        finalImageUrl = urlData.publicUrl; // Use the newly uploaded image's URL.
    }

    // 3. Insert the record with the determined image URL.
    const { data, error } = await supabase
        .from('testimonials')
        .insert({
            name,
            content,
            image_url: finalImageUrl, // Use the final URL
            user_id: userId,
            is_approved: false,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating testimonial:', error.message);
    }

    return { data, error };
};