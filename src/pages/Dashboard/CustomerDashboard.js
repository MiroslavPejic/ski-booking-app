import React from 'react';
import DatePicker from 'react-datepicker';
import PaginatedBookings from '../../components/PaginatedBookings';
import 'react-datepicker/dist/react-datepicker.css';

function CustomerDashboard({ lessonDate, setLessonDate, lessonType, setLessonType, location, setLocation, handleBookingSubmit, bookings }) {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
}

export default CustomerDashboard;
