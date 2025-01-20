// services/bookingService.js

import supabase from '../supabaseClient';

export const fetchBookings = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('ski_lessons')
      .select(`
        id,
        lesson_date,
        lesson_time,
        lesson_type,
        location_id,
        instructor_id,
        profiles:instructor_id(name),
        locations(name)
      `)
      .eq('user_id', userId)
      .order('lesson_date', { ascending: true });

    if (error) throw error;

    return data;
  } catch (err) {
    throw new Error('Failed to fetch bookings');
  }
};

// Fetch locations
export const fetchLocations = async () => {
    const { data, error } = await supabase
      .from('locations')
      .select('*');
  
    if (error) {
      throw new Error(error.message);
    }
    
    return data || [];
};

// Fetch instructors for a specific location
export const fetchInstructors = async (locationId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name')
      .eq('location_id', locationId)
      .eq('role', 'instructor')
      .not('is_deleted', 'eq', true);
  
    if (error) {
      throw new Error(error.message);
    }
    
    return data || [];
};

// Fetch instructor bookings for a specific date
export const fetchInstructorBookings = async (instructorId, date) => {
    const formattedDate = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
  
    const { data, error } = await supabase
      .from('ski_lessons')
      .select('lesson_time')
      .eq('instructor_id', instructorId)
      .eq('lesson_date', formattedDate);
  
    if (error) {
      throw new Error(error.message);
    }
  
    return data || [];
};

// Create a new booking
export const createBooking = async (userId, lessonDate, lessonTime, lessonType, location, selectedInstructor) => {
    const { data, error } = await supabase
      .from('ski_lessons')
      .insert([
        {
          user_id: userId,
          lesson_date: lessonDate,
          lesson_time: lessonTime,
          lesson_type: lessonType,
          location_id: location,
          instructor_id: selectedInstructor,
        },
      ]);
  
    if (error) {
      throw new Error(error.message);
    }
  
    return data;
};
