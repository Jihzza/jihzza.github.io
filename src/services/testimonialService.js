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
    const { name, content, userId } = testimonialData;

    let imageUrl = null;

    // Image Upload Logic
    // If an image file is provided, upload it to Supabase Storage first
    if (imageFile) {
        // Create a unique file path to prevent name collisions
        // The path includes the user's ID and a timestamp
        const filePath = `public/${userId}/${Date.now()}_${imageFile.name}`;

        const { error: uploadError } = await supabase.storage
            .from('testimonials')
            .upload(filePath, imageFile);

        if (uploadError) {
            console.error('Error uploading image:', uploadError.message);
            return { data: null, error: uploadError };
        }

        // If upload is successful, get the public URL for the image
        // This URL will be stored in our testimonials table
        const { data: urlData } = supabase.storage
            .from('testimonials')
            .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
    }

    // DATABASE INSERT LOGIC
    const { data, error } = await supabase
        .from('testimonials')
        .insert({
            name,
            content,
            image_url: imageUrl,
            user_id: userId,
        })
        .select() 
        .single();

    if (error) {
        console.error('Error creating testimonial:', error.message);
    }

    return { data, error};
};