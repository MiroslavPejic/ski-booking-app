import React, { useState, useEffect } from 'react';
import supabase from '../../supabaseClient';

function InstructorBookings() {
  const [instructorId, setInstructorId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch current user ID
  const fetchCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error fetching user:', error.message);
    } else if (user) {
      setInstructorId(user.id); // Set the instructor ID from the user
    }
  };

  // Fetch bookings for the instructor
  const fetchInstructorBookings = async () => {
    if (!instructorId) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('ski_lessons')
      .select(
        `
          id, 
          lesson_date, 
          lesson_type, 
          profiles:instructor_id(name),
          locations(name)
        `
      )
      .eq('instructor_id', instructorId)
      .order('lesson_date', { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setBookings(data);
    }

    setLoading(false);
  };

  // Load the current user ID on component mount
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Fetch bookings when the instructor ID changes
  useEffect(() => {
    fetchInstructorBookings();
  }, [instructorId]);

  return (
    <div className="container mx-auto p-6 pt-24">
      <h1 className="text-3xl font-semibold mb-4 text-center">My Bookings</h1>

      {loading ? (
        <p>Loading bookings...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="px-4 py-2">Lesson Date</th>
                <th className="px-4 py-2">Lesson Type</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Customer Name</th>
                <th className="px-4 py-2">Customer Email</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b">
                  <td className="px-4 py-2">
                    {new Date(booking.lesson_date).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">{booking.lesson_type}</td>
                  <td className="px-4 py-2">{booking.location?.name}</td>
                  <td className="px-4 py-2">{booking.profiles?.full_name}</td>
                  <td className="px-4 py-2">{booking.profiles?.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default InstructorBookings;
