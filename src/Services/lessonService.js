import supabase from '../supabaseClient';

/**
 * Fetches all bookings for a specific user.
 * @param {string} userId - The user's ID.
 * @returns {object} - The data and any errors that occurred.
 */
export const fetchBookings = async (userId) => {
  const { data, error } = await supabase
    .from('ski_lessons')
    .select('*')
    .eq('user_id', userId);
  return { data, error };
};

/**
 * Fetches the role of a specific user.
 * @param {string} userId - The user's ID.
 * @returns {object} - The data and any errors that occurred.
 */
export const fetchUserRole = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  return { data, error };
};

/**
 * Creates a new booking for a lesson.
 * @param {object} booking - The booking details.
 * @returns {object} - The data and any errors that occurred.
 */
export const createBooking = async (booking) => {
  const { data, error } = await supabase
    .from('ski_lessons')
    .insert([booking]);
  return { data, error };
};

export const fetchInstructorsByLocation = async (location) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'instructor')
    .eq('location', location);
  return { data, error };
};

export const isSlotAvailable = async (instructorId, lessonDate) => {
  const { data, error } = await supabase
    .from('ski_lessons')
    .select('*')
    .eq('instructor_id', instructorId)
    .eq('lesson_date', lessonDate);
  return { isAvailable: data?.length === 0, error };
};

