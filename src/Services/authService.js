import supabase from '../supabaseClient';

/**
 * Sign up a user with email and password.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {object} - An object containing user data or an error message.
 */
export async function signUpUser(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { user: null, error: error.message };
  }

  return {
    user: data.user,
    message: data.user
      ? 'User created successfully!'
      : 'Check your email to confirm your account.',
  };
}

/**
 * Inserts a new user profile into the profiles table.
 * @param {string} userId - The ID of the user from Supabase Auth.
 * @param {string} role - The role of the user (e.g., 'admin', 'instructor', 'customer').
 * @param {string} name - The full name of the user.
 * @returns {object} - The data and any errors that occurred.
 */
export const insertUserProfile = async (userId, role, name) => {
  console.log(userId, role, name)
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      { 
        id: userId, 
        role: role, 
        name: name 
      }]);

  console.log('data: ', data);
  console.log('Error: ', error);
  return { data, error };
};
