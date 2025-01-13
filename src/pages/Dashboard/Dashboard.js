import React, { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';
import AdminDashboard from './AdminDashboard';
import InstructorDashboard from './InstructorDashboard';
import CustomerDashboard from './CustomerDashboard';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('');
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

  const fetchUserRole = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      setError(error.message);
    } else {
      setRole(data?.role || 'customer');
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
      fetchUserRole(user.id);
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
        if (data != null) {
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
        <>
          {role === 'admin' && <AdminDashboard />}
          {role === 'instructor' && <InstructorDashboard />}
          {role === 'customer' && (
            <CustomerDashboard
              lessonDate={lessonDate}
              setLessonDate={setLessonDate}
              lessonType={lessonType}
              setLessonType={setLessonType}
              location={location}
              setLocation={setLocation}
              handleBookingSubmit={handleBookingSubmit}
              bookings={bookings}
              notification={notification}
            />
          )}
        </>
      ) : (
        <p>Please log in to view and make bookings.</p>
      )}
    </div>
  );
}

export default Dashboard;
