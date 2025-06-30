// src/services/bugReportService.js

/**
 * A service module for handling bug report submissions.
 * This encapsulates all logic for sending bug data to the Supabase 'bug_reports' table.
 *
 * @module services/bugReportService
 */

// Import the configured Supabase client, just like in your other services.
import { supabase } from '../lib/supabaseClient';

/**
 * Inserts a new bug report into the Supabase database.
 *
 * @param {object} reportData - The bug report data from the form.
 * @param {string} reportData.name - The name of the person submitting the report.
 * @param {string} reportData.email - The email of the person submitting the report.
 * @param {string} reportData.description - The detailed description of the bug.
 * @param {string} [userId] - The UUID of the authenticated user submitting the report (optional).
 * @returns {Promise<{data: object|null, error: object|null}>} - An object containing either the newly created data or an error.
 */
export const submitBugReport = async (reportData, userId = null) => {
  // Destructure the form data for clarity.
  // FIX: Correct the spelling from 'desciption' to 'description'.
  const { name, email, description } = reportData;

  // We are using the same { data, error } pattern as Supabase for consistency.
  // This interacts with the 'bug_reports' table you will create.
  const { data, error } = await supabase
    .from('bug_reports')
    .insert({
      name,
      email,
      description, // Now this variable will correctly hold the form's description text.
      user_id: userId,
    })
    .select()
    .single();

  // Error handling: If the insert fails, log the error for debugging.
  if (error) {
    // This console.error is what gave us the helpful clue.
    console.error('Error creating bug report:', error.message);
  }

  // Return the result to the component so it can update the UI.
  return { data, error };
};