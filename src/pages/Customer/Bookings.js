import { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPageFuture, setCurrentPageFuture] = useState(1);
  const [currentPagePast, setCurrentPagePast] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get current user's ID
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError('User not logged in.');
          setLoading(false);
          return;
        }

        // Fetch bookings for the logged-in user with associated instructor, location, and time
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
        .eq('user_id', user.id)
        .order('lesson_date', { ascending: true });

        if (error) throw error;

        console.log('data: ', data);
        setBookings(data);
      } catch (err) {
        setError('Failed to fetch bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Handle page change
  const handlePageChange = (page, section) => {
    if (section === 'future') {
      setCurrentPageFuture(page);
    } else {
      setCurrentPagePast(page);
    }
  };

  // Split bookings into future and past bookings
  const now = new Date();
  const futureBookings = bookings.filter((booking) => new Date(booking.lesson_date) >= now);
  const pastBookings = bookings.filter((booking) => new Date(booking.lesson_date) < now);

  // Paginate bookings
  const totalPagesFuture = Math.ceil(futureBookings.length / itemsPerPage);
  const totalPagesPast = Math.ceil(pastBookings.length / itemsPerPage);

  const paginatedFutureBookings = futureBookings.slice(
    (currentPageFuture - 1) * itemsPerPage,
    currentPageFuture * itemsPerPage
  );

  const paginatedPastBookings = pastBookings.slice(
    (currentPagePast - 1) * itemsPerPage,
    currentPagePast * itemsPerPage
  );

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg mt-16 p-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Your Ski Lesson Bookings</h2>

      {/* Layout: Side by side on large screens, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Future Bookings Section */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Future Bookings</h3>
          {futureBookings.length === 0 ? (
            <p className="text-center text-gray-500">No future bookings found.</p>
          ) : (
            <div>
              <ul className="space-y-6">
                {paginatedFutureBookings.map((booking) => (
                  <li
                    key={booking.id}
                    className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
                  >
                    <div className="text-gray-700">
                      <p>
                        <strong className="font-semibold">Date:</strong>{' '}
                        {new Date(booking.lesson_date).toLocaleDateString()} 
                        <strong className="font-semibold"> Time:</strong> 
                        {new Date(`1970-01-01T${booking.lesson_time}`).toLocaleTimeString()}
                      </p>
                      <p>
                        <strong className="font-semibold">Type:</strong> {booking.lesson_type}
                      </p>
                      <p>
                        <strong className="font-semibold">Instructor:</strong> {booking.profiles.name}
                      </p>
                      <p>
                        <strong className="font-semibold">Location:</strong> {booking.locations.name}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Pagination Controls for Future Bookings */}
              <div className="flex justify-center mt-6 space-x-2">
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
                  onClick={() => handlePageChange(currentPageFuture - 1, 'future')}
                  disabled={currentPageFuture === 1}
                >
                  Previous
                </button>
                {Array.from({ length: totalPagesFuture }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`px-4 py-2 rounded-lg ${
                      currentPageFuture === i + 1
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                    }`}
                    onClick={() => handlePageChange(i + 1, 'future')}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
                  onClick={() => handlePageChange(currentPageFuture + 1, 'future')}
                  disabled={currentPageFuture === totalPagesFuture}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Past Bookings Section */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Past Bookings</h3>
          {pastBookings.length === 0 ? (
            <p className="text-center text-gray-500">No past bookings found.</p>
          ) : (
            <div>
              <ul className="space-y-6">
                {paginatedPastBookings.map((booking) => (
                  <li
                    key={booking.id}
                    className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
                  >
                    <div className="text-gray-700">
                      <p>
                        <strong className="font-semibold">Date:</strong>{' '}
                        {new Date(booking.lesson_date).toLocaleDateString()} 
                        <strong className="font-semibold"> Time:</strong> 
                        {new Date(`1970-01-01T${booking.lesson_time}`).toLocaleTimeString()}
                      </p>
                      <p>
                        <strong className="font-semibold">Type:</strong> {booking.lesson_type}
                      </p>
                      <p>
                        <strong className="font-semibold">Instructor:</strong> {booking.profiles.name}
                      </p>
                      <p>
                        <strong className="font-semibold">Location:</strong> {booking.locations.name}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Pagination Controls for Past Bookings */}
              <div className="flex justify-center mt-6 space-x-2">
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
                  onClick={() => handlePageChange(currentPagePast - 1, 'past')}
                  disabled={currentPagePast === 1}
                >
                  Previous
                </button>
                {Array.from({ length: totalPagesPast }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`px-4 py-2 rounded-lg ${
                      currentPagePast === i + 1
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                    }`}
                    onClick={() => handlePageChange(i + 1, 'past')}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
                  onClick={() => handlePageChange(currentPagePast + 1, 'past')}
                  disabled={currentPagePast === totalPagesPast}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserBookings;
