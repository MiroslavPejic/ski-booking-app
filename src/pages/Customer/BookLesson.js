import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import supabase from '../../supabaseClient';
import * as bookingService from '../../Services/bookingsService';

function BookLesson() {
  const [locationError, setLocationError] = useState('');
  const [instructorError, setInstructorError] = useState('');

  const [user, setUser] = useState(null);
  const [lessonDate, setLessonDate] = useState(null);
  const [lessonTime, setLessonTime] = useState(null);
  const [lessonType, setLessonType] = useState('beginner');
  const [location, setLocation] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [locations, setLocations] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [instructorBookings, setInstructorBookings] = useState([]);
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
      setSelectedInstructor(null);
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
    try {
      const data = await bookingService.fetchLocations();
      setLocations(data);
    } catch (error) {
      setLocationError(error.message);
    }
  };

  const fetchInstructors = async (locationId) => {
    try {
      const data = await bookingService.fetchInstructors(locationId);
      setInstructors(data);
    } catch (error) {
      setInstructorError(error.message);
    }
  };

  const fetchInstructorBookings = async (instructorId, date) => {
    try {
      const data = await bookingService.fetchInstructorBookings(instructorId, date);
      setInstructorBookings(data);
    } catch (error) {
      console.error('Error fetching instructor bookings:', error.message);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!lessonDate || !lessonTime || !lessonType || !location || !selectedInstructor) {
      setNotification({ visible: true, message: 'Please fill out all fields.', isSuccess: false });
      return;
    }

    try {
      await bookingService.createBooking(user.id, lessonDate, lessonTime, lessonType, location, selectedInstructor);
      setLessonDate(null);
      setLessonTime(null);
      setLessonType('beginner');
      setLocation('');
      setSelectedInstructor(null);
      setNotification({ visible: true, message: 'Booking created successfully!', isSuccess: true });
    } catch (error) {
      setNotification({ visible: true, message: 'Error creating booking.', isSuccess: false });
    }

    setTimeout(() => setNotification({ visible: false, message: '', isSuccess: true }), 5000);
  };

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
                {['09:00:00', '10:00:00', '11:00:00', '12:00:00', '13:00:00', '14:00:00', '15:00:00', '16:00:00', '17:00:00'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    className={`w-full p-3 border ${isTimeBooked(time) ? 'bg-gray-500 text-white cursor-not-allowed' : lessonTime === time ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'} border-gray-300 rounded`}
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
