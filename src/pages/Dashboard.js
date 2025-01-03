import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import DatePicker from 'react-datepicker';
import PaginatedBookings from '../components/PaginatedBookings';
import 'react-datepicker/dist/react-datepicker.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [lessonDate, setLessonDate] = useState(null);
  const [lessonType, setLessonType] = useState('beginner');
  const [location, setLocation] = useState('');
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ visible: false, message: '', isSuccess: true });

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

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user);
    };

    fetchSession();

    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user);
    });
  }, []);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!lessonDate || !lessonType) {
      setNotification({ visible: true, message: 'Please fill out all fields.', isSuccess: false });
      return;
    }

    try {
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

      if (error != null) {
        setNotification({ visible: true, message: error.message, isSuccess: false });
      } else {
        if(data != null) {
          setBookings([...bookings, data[0]]);
        }

        setLessonDate(null);
        setLessonType('beginner');
        setLocation('');
        setNotification({ visible: true, message: 'Booking created successfully!', isSuccess: true });
      }
    } catch (e) {
      setNotification({ visible: true, message: 'Error creating booking.', isSuccess: false });
    } finally {
      fetchBookings();
    }

    setTimeout(() => setNotification({ visible: false, message: '', isSuccess: true }), 5000);
  };

  return (
    <div className="container mx-auto p-6 pt-24">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      {notification.visible && (
        <div
          className={`w-full p-4 text-center mb-4 ${
            notification.isSuccess ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {notification.message}
        </div>
      )}

      {user ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Booking Form in the first column */}
          <div className="w-full lg:col-span-1">
            <h2 className="text-2xl font-semibold mb-4">Book a Ski Lesson</h2>
            <form onSubmit={handleBookingSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Lesson Date</label>
                <DatePicker
                  selected={lessonDate}
                  onChange={(date) => setLessonDate(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  minDate={new Date()}
                  timeIntervals={60}
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

          {/* Current Bookings in the second column */}
          <div className="w-full lg:col-span-1">
            {bookings.length > 0 ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Current Bookings</h3>
                  <PaginatedBookings
                    bookings={bookings.filter(booking => new Date(booking.lesson_date) >= new Date())}
                    itemsPerPage={3}
                    title="Current Bookings"
                  />
                </div>
              </div>
            ) : (
              <p>You have no bookings yet.</p>
            )}
          </div>

          {/* Past Bookings in the third column for large screens */}
          <div className="w-full lg:col-span-1">
            <h3 className="text-xl font-semibold mb-3">Past Bookings</h3>
            <PaginatedBookings
              bookings={bookings.filter(booking => new Date(booking.lesson_date) < new Date())}
              itemsPerPage={3}
              title="Past Bookings"
            />
          </div>
        </div>
      ) : (
        <p>Please log in to view and make bookings.</p>
      )}
    </div>
  );
}

export default Dashboard;
