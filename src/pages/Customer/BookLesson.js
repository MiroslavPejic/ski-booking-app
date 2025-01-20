import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import supabase from '../../supabaseClient';

function BookLesson() {
  const [locationError, setLocationError] = useState('');
  const [instructorError, setInstructorError] = useState('');

  const [user, setUser] = useState(null);
  const [lessonDate, setLessonDate] = useState(null);
  const [lessonTime, setLessonTime] = useState(null); // New state for lesson time
  const [lessonType, setLessonType] = useState('beginner');
  const [location, setLocation] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [locations, setLocations] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [instructorBookings, setInstructorBookings] = useState([]); // To store instructor bookings
  const [notification, setNotification] = useState({ visible: false, message: '', isSuccess: true });

  useEffect(() => {
    fetchSession();
    fetchLocations();

    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user);
    });
  }, []);

  useEffect(() => {
    if (location) {
      fetchInstructors(location);
      setSelectedInstructor(null); // Reset instructor when location changes
    }
  }, [location]);

  useEffect(() => {
    if (selectedInstructor && lessonDate) {
      fetchInstructorBookings(selectedInstructor, lessonDate);
    }
  }, [selectedInstructor, lessonDate]);

  const fetchSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user);
  };

  const fetchLocations = async () => {
    const { data, error } = await supabase
      .from('locations')
      .select('*');

    if (error) {
      setLocationError(error.message);
    } else {
      setLocations(data || []);
    }
  };

  const fetchInstructors = async (locationId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name')
      .eq('location_id', locationId)
      .eq('role', 'instructor')
      .not('is_deleted', 'eq', true);

    if (error) {
      setInstructorError(error.message);
    } else {
      setInstructors(data || []);
    }
  };

  const fetchInstructorBookings = async (instructorId, date) => {
    // Convert JavaScript Date to a PostgreSQL-friendly format (YYYY-MM-DD)
    const formattedDate = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
  
    const { data, error } = await supabase
      .from('ski_lessons')
      .select('lesson_time')
      .eq('instructor_id', instructorId)
      .eq('lesson_date', formattedDate);  // Use formatted date without time component
  
    console.log('selected instructor: ', selectedInstructor);
    console.log('data:' ,data);
    if (error) {
      console.error('Error fetching instructor bookings:', error.message);
    } else {
      setInstructorBookings(data || []);
    }
  };  

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!lessonDate || !lessonTime || !lessonType || !location || !selectedInstructor) {
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
            lesson_time: lessonTime,  // Saving the selected time
            lesson_type: lessonType,
            location_id: location,
            instructor_id: selectedInstructor,
          },
        ]);

      if (error != null) {
        setNotification({ visible: true, message: error.message, isSuccess: false });
      } else {
        setLessonDate(null);
        setLessonTime(null);
        setLessonType('beginner');
        setLocation('');
        setSelectedInstructor(null);
        setNotification({ visible: true, message: 'Booking created successfully!', isSuccess: true });
      }
    } catch (e) {
      setNotification({ visible: true, message: 'Error creating booking.', isSuccess: false });
    } finally {
    }

    setTimeout(() => setNotification({ visible: false, message: '', isSuccess: true }), 5000);
  };

  // Function to check if a time is already booked by the selected instructor
  const isTimeBooked = (time) => {
    return instructorBookings.some((booking) => booking.lesson_time === time);
  };

  return (
    <div className="container mx-auto p-6 pt-24">
      {notification.visible && (
        <div
          className={`w-full p-4 text-center mb-4 ${
            notification.isSuccess ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="w-full max-w-lg mx-auto p-6 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Book a Ski Lesson</h2>
        <form onSubmit={handleBookingSubmit}>
          {/* Location */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded"
              required
            >
              <option value="">Select Location</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
            {locationError && <p className="text-red-500 text-sm">{locationError}</p>}
          </div>

          {/* Instructor Selection */}
          {location && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Instructor</label>
              <select
                value={selectedInstructor}
                onChange={(e) => setSelectedInstructor(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded"
                required
              >
                <option value="">Select Instructor</option>
                {instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.name}
                  </option>
                ))}
              </select>
              {instructorError && <p className="text-red-500 text-sm">{instructorError}</p>}
            </div>
          )}

          {/* Lesson Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Lesson Date</label>
            <DatePicker
              selected={lessonDate}
              onChange={(date) => setLessonDate(date)}
              minDate={new Date()} // Minimum date is today
              maxDate={new Date().setDate(new Date().getDate() + 28)} // Maximum date is 4 weeks from today
              className="w-full p-3 border border-gray-300 rounded"
              dateFormat="P"
              placeholderText="Select lesson date"
              required
            />
          </div>

          {/* Lesson Time (buttons shown only after selecting date) */}
          {lessonDate && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Lesson Time</label>
              <div className="grid grid-cols-3 gap-2">
                {['9:00:00', '10:00:00', '11:00:00', '12:00:00', '13:00:00', '14:00:00', '15:00:00', '16:00:00', '17:00:00'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    className={`w-full p-3 border ${lessonTime === time ? 'bg-blue-500 text-white' : ''} ${isTimeBooked(time) ? 'bg-gray-500 text-white cursor-not-allowed' : 'bg-green-500 text-white'} border-gray-300 rounded`}
                    onClick={() => !isTimeBooked(time) && setLessonTime(time)}
                    disabled={isTimeBooked(time)} // Disable button if time is already booked
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Lesson Type */}
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

          <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded">
            Book Lesson
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookLesson;
