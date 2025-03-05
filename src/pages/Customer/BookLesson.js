import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import supabase from '../../supabaseClient';
import * as bookingService from '../../Services/bookingsService';

function BookLesson() {
  const [user, setUser] = useState(null);
  const [lessonDate, setLessonDate] = useState(null);
  const [lessonTime, setLessonTime] = useState(null);
  const [lessonDuration, setLessonDuration] = useState(1); // 1, 2, or 3 hours
  const [location, setLocation] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [locations, setLocations] = useState([]);
  const [lessonTypes, setLessonTypes] = useState([]);
  const [lessonType, setLessonType] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [instructorBookings, setInstructorBookings] = useState([]);
  const [notification, setNotification] = useState({ visible: false, message: '', isSuccess: true });

  useEffect(() => {
    fetchSession();
    fetchLocations();
    fetchLessonTypes();
    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user);
    });
  }, []);

  useEffect(() => {
    if (location) {
      fetchInstructors(location);
      setSelectedInstructor(null);
      setLessonDate(null);
      setLessonTime(null);
    }
  }, [location]);

  useEffect(() => {
    if (selectedInstructor && lessonDate) {
      console.log('fetching instructor bookings')
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
      console.error('Error fetching locations:', error.message);
    }
  };

  const fetchLessonTypes = async () => {
    try {
      const data = await bookingService.fetchLessonTypes();
      setLessonTypes(data);
    } catch (error) {
      console.error('Error fetching lesson types: ', error.message);
    }
  };

  const fetchInstructors = async (locationId) => {
    try {
      const data = await bookingService.fetchInstructors(locationId);
      setInstructors(data);
    } catch (error) {
      console.error('Error fetching instructors:', error.message);
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
      await bookingService.createBooking(user.id, lessonDate, lessonTime, lessonDuration, lessonType, location, selectedInstructor);
      setLessonDate(null);
      setLessonTime(null);
      setLessonDuration(1);
      setLessonType(null);
      setLocation('');
      setSelectedInstructor(null);
      setNotification({ visible: true, message: 'Booking created successfully!', isSuccess: true });
    } catch (error) {
      setNotification({ visible: true, message: 'Error creating booking.', isSuccess: false });
    }

    setTimeout(() => setNotification({ visible: false, message: '', isSuccess: true }), 5000);
  };

  const availableTimes = [
    '09:00:00', '10:00:00', '11:00:00', '12:00:00', '13:00:00',
    '14:00:00', '15:00:00', '16:00:00', '17:00:00'
  ];

  const isTimeSlotAvailable = (startTime, duration) => {
    const startIndex = availableTimes.indexOf(startTime);
    if (startIndex === -1) return false;

    const requestedEndIndex = startIndex + duration - 1; // Last time index of requested lesson

    for (const booking of instructorBookings) {
      
        const bookedStartIndex = availableTimes.indexOf(booking.lesson_time);
        const bookedDuration = booking.lesson_duration || 1;
        const bookedEndIndex = bookedStartIndex + bookedDuration - 1; // Last booked time index

        if (bookedStartIndex === -1) continue;

        // ✅ Explicitly check if any part of the requested range is inside the booked range
        if (startIndex >= bookedStartIndex && startIndex <= bookedEndIndex) {
            return false; // ❌ Block the slot if it starts inside an existing booking
        }

        if (requestedEndIndex >= bookedStartIndex && requestedEndIndex <= bookedEndIndex) {
            return false; // ❌ Block the slot if it ends inside an existing booking
        }

        if (startIndex < bookedStartIndex && requestedEndIndex > bookedEndIndex) {
            return false; // ❌ Block the slot if it completely surrounds an existing booking
        }
    }

    return true; // ✅ Available if no conflicts found
  };

  return (
    <div className="container mx-auto p-6 pt-24">
      {notification.visible && (
        <div className={`w-full p-4 text-center mb-4 ${notification.isSuccess ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {notification.message}
        </div>
      )}

      <div className="w-full max-w-lg mx-auto p-6 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Book a Ski Lesson</h2>
        <form onSubmit={handleBookingSubmit}>
          {/* Location */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-3 border border-gray-300 rounded" required>
              <option value="">Select Location</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>

          {/* lesson type */}
          {location && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Lesson Type</label>
              <select value={lessonType} onChange={(e) => setLessonType(e.target.value)} className="w-full p-3 border border-gray-300 rounded" required>
                <option value="">Select lesson type</option>
                {lessonTypes.map((loc) => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Instructor */}
          {lessonType && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Instructor</label>
              <select value={selectedInstructor} onChange={(e) => setSelectedInstructor(e.target.value)} className="w-full p-3 border border-gray-300 rounded" required>
                <option value="">Select Instructor</option>
                {instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>{instructor.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Lesson Date */}
          {selectedInstructor && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Lesson Date</label>
              <DatePicker selected={lessonDate} onChange={(date) => setLessonDate(date)} minDate={new Date()} maxDate={new Date().setDate(new Date().getDate() + 28)} className="w-full p-3 border border-gray-300 rounded" dateFormat="P" placeholderText="Select lesson date" required />
            </div>
          )}

          {/* Lesson Duration */}
          {lessonDate && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Lesson Duration</label>
              <select 
                value={lessonDuration} 
                onChange={(e) => {
                  setLessonDuration(parseInt(e.target.value)); 
                  setLessonTime(null); // Reset selected time when duration changes
                }} 
                className="w-full p-3 border border-gray-300 rounded"
              >
                <option value={1}>1 Hour</option>
                <option value={2}>2 Hours</option>
                <option value={3}>3 Hours</option>
              </select>
            </div>
          )}

          {/* Lesson Time */}
          {lessonDate && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Lesson Time</label>
              <div className="grid grid-cols-3 gap-2">
                {availableTimes.map((time) => {
                  const isAvailable = isTimeSlotAvailable(time, lessonDuration);
                  const isSelected = lessonTime === time;

                  return (
                    <button
                      key={time}
                      type="button"
                      className={`w-full p-3 border rounded text-white ${
                        isSelected
                          ? 'bg-blue-500'  // Selected slot -> Blue
                          : isAvailable
                          ? 'bg-green-500' // Available slot -> Green
                          : 'bg-gray-500 cursor-not-allowed' // Unavailable slot -> Gray
                      }`}
                      onClick={() => isAvailable && setLessonTime(time)}
                      disabled={!isAvailable}
                    >
                      {time} ({lessonDuration}h)
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <button
            type="submit"
            className={`py-2 px-6 rounded ${
              lessonDate && lessonTime && lessonDuration && lessonType && location && selectedInstructor
                ? 'bg-blue-600 text-white'
                : 'bg-gray-400 text-gray-700 cursor-not-allowed'
            }`}
            disabled={!(lessonDate && lessonTime && lessonDuration && lessonType && location && selectedInstructor)}
          >
            Book Lesson
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookLesson;
