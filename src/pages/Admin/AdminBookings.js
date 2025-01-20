import React, { useState, useEffect } from 'react';
import supabase from '../../supabaseClient';

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch bookings from the ski_lessons table
  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ski_lessons')
      .select('id, user_id, lesson_date, lesson_time, lesson_type, location_id, instructor_id, profiles:instructor_id(name), locations(name)')
      .order('lesson_date', { ascending: true });
    if (error) {
      setError(error.message);
    } else {
      setBookings(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      const { error } = await supabase
        .from('ski_lessons')
        .delete()
        .match({ id: bookingId });

      if (error) {
        setError(error.message);
      } else {
        fetchBookings();
      }
    }
  };

  const handleUpdate = async (bookingId, newLocationId) => {
    const { error } = await supabase
      .from('ski_lessons')
      .update({ location_id: newLocationId })
      .match({ id: bookingId });

    if (error) {
      setError(error.message);
    } else {
      fetchBookings();
    }
  };

  const handleUpdateInstructor = async (bookingId, newInstructorId) => {
    const { error } = await supabase
      .from('ski_lessons')
      .update({ instructor_id: newInstructorId })
      .match({ id: bookingId });

    if (error) {
      setError(error.message);
    } else {
      fetchBookings();
    }
  };

  return (
    <div className="container mx-auto p-6 pt-24">
      <h1 className="text-3xl font-semibold mb-4 text-center">Manage Bookings</h1>

      {loading ? (
        <p>Loading bookings...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="px-4 py-2">Lesson Date</th>
                <th className="px-4 py-2">Lesson Time</th>
                <th className="px-4 py-2">Lesson Type</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Instructor</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b">
                  <td className="px-4 py-2">{new Date(booking.lesson_date).toLocaleString()}</td>
                  <td className="px-4 py-2">{booking.lesson_time}</td>
                  <td className="px-4 py-2">{booking.lesson_type}</td>
                  <td className="px-4 py-2">{booking.locations.name}</td>
                  <td className="px-4 py-2">{booking.profiles.name}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminBookings;
