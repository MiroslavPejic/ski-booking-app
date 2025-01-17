import supabase from '../supabaseClient';

/**
 * Signs up a new user using Supabase Auth.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {object} - The user and any errors that occurred.
 */
export const signUpUser = async (email, password) => {
  const { user, error } = await supabase.auth.signUp({ email, password });
  return { user, error };
};

/**
 * Inserts a new user profile into the profiles table.
 * @param {string} userId - The ID of the user from Supabase Auth.
 * @param {string} role - The role of the user (e.g., 'admin', 'instructor', 'customer').
 * @param {string} name - The full name of the user.
 * @returns {object} - The data and any errors that occurred.
 */
export const insertUserProfile = async (userId, role, name) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([{ id: userId, role, name }]);
  return { data, error };
};
