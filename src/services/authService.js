// src/services/authService.js
// -----------------------------------------------------------
// This file wraps every Supabase authentication call in a
// tiny helper function. If you ever switch providers you
// only edit this file, not every place that uses auth.
// -----------------------------------------------------------

// 1️⃣  Pull in the already-configured Supabase client object.
import { supabase } from '../lib/supabaseClient';

/**
 * Create a brand-new account with email + password.
 *
 * @param {string} email    – The user’s email address.
 * @param {string} password – The password they chose.
 * @param {Object} [options] – Optional extra data (e.g. redirect URL).
 * @param {string} userId - The user's ID.
 * @param {object} profileData - An object with username, full_name, etc. * @returns {{data: object, error: object|null}}
 *            data  → Info about the new user & session.
 *            error → If something went wrong.
 */
export const signUpNewUser = async (email, password, options = {}) => {
  // ↪️  Await pauses until Supabase finishes the network request.
  const { data, error } = await supabase.auth.signUp({
    email,       // object-shorthand: same as email: email
    password,    // same for password
    options,     // extra, totally optional settings
  });
  return { data, error }; // Always hand both back to the caller.
};

/**
 * Log in an existing user.
 */
export const signInWithPassword = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

// Starts the Google OAuth flow. SUpabase will redirect the user to Google's consent screen, then back to the website

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/profile', // after success
    },
  });
  return { data, error };
};

// Send a reset-password email. Supabse will include a link that returns to /reset-password.

export const sendPasswordResetEmail = async (email) => {
  return await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password`,
  }); 
};

// After the user clicks the "change" button on /reset-password, we ask Supabase to set the *new* password.
export const updatePassword = async (newPassword) => {
  return await supabase.auth.updateUser({
    password: newPassword,
  });
};

/**
 * Log *out* the current user.
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error }; // no data on success, only “did an error happen?”
};

/**
 * Ask Supabase whether a saved session already exists
 * (for example after the page reloads).
 */
export const getUserSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { data, error };
};

export const getProfile = async (userId) => {
  if (!userId) return { data: null, error: 'User ID is required' };

  const { data, error } = await supabase
    .from('profiles')
    .select('username, full_name, avatar_url')
    .eq('id', userId)
    .single(); // .single() returns one object instead of an array

  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is ok
    console.error('Error fetching profile:', error);
  }
  
  return { data, error };
}

export const updateProfile = async (userId, profileData) => {
  if (!userId) return { data: null, error: 'User ID is required' };

  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', userId)
    .select() // .select() returns the updated data
    .single();

  if (error) {
    console.error('Error updating profile:', error);
  }

  return { data, error };
}