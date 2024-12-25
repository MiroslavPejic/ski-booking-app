import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [lessonDate, setLessonDate] = useState(null); // Store the date picked
  const [lessonType, setLessonType] = useState('beginner');
  const [location, setLocation] = useState('');
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  // Fetch the logged-in user
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user);
    };

    fetchSession();

    // Listen for session changes
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user);
    });
  }, []);

  // Fetch the user's bookings when logged in
  useEffect(() => {
    if (user) {
      const fetchBookings = async () => {
        const { data, error } = await supabase
          .from('ski_lessons')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) {
          setError(error.message);
        } else {
          setBookings(data);
        }
      };

      fetchBookings();
    }
  }, [user]); // Fetch bookings whenever user changes

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!lessonDate || !lessonType) {
      setError('Please fill out all fields.');
      return;
    }

    try {
      // Insert new booking
      const { data, error } = await supabase
        .from('ski_lessons')
        .insert([
          {
            user_id: user.id,
            lesson_date: lessonDate,
            lesson_type: lessonType,
            location: location,
          },
        ]);

        console.log('data here is: ', data);

      if (error) {
        setError(error.message);
      } else {
        // Successfully created booking, refresh the list
        setBookings([...bookings, data[0]]);
        setLessonDate(null);
        setLessonType('');
        setLocation('');
      }
    } catch (e) {
      setError('Error creating booking');
      console.log(e);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      {user ? (
        <>
          {/* Booking Form */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Book a Ski Lesson</h2>
            <form onSubmit={handleBookingSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Lesson Date</label>
                <DatePicker
                  selected={lessonDate}
                  onChange={(date) => setLessonDate(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  minDate={new Date()} // Disable past dates
                  timeIntervals={60} // Time slots at 1-hour intervals
                  className="w-full p-3 border border-gray-300 rounded"
                  placeholderText="Select lesson date"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Lesson Type</label>
                <select
                  value={lessonType}
                  onChange={(e) => setLessonType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded"
                  required
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Location (optional)</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded"
                />
              </div>
              <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded">
                Book Lesson
              </button>
            </form>
          </div>

          {/* Display Bookings */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Your Bookings</h2>
            {bookings.length > 0 ? (
              <ul className="space-y-4">
                {bookings.map((booking) => (
                  <li key={booking.id} className="p-4 border rounded shadow">
                    <p><strong>Date:</strong> {new Date(booking.lesson_date).toLocaleString()}</p>
                    <p><strong>Type:</strong> {booking.lesson_type}</p>
                    <p><strong>Location:</strong> {booking.location || 'Not specified'}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>You have no bookings yet.</p>
            )}
          </div>
        </>
      ) : (
        <p>Please log in to view and make bookings.</p>
      )}
    </div>
  );
}

export default Dashboard;
