import React, { useState } from 'react';

function PaginatedBookings({ bookings, itemsPerPage, title }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = bookings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = bookings.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      {currentItems.length > 0 ? (
        <ul className="space-y-4">
          {currentItems.map((booking) => (
            <li key={booking.id} className="p-4 border rounded shadow">
              <p><strong>Date:</strong> {new Date(booking.lesson_date).toLocaleString()}</p>
              <p><strong>Type:</strong> {booking.lesson_type}</p>
              <p><strong>Location:</strong> {booking.location || 'Not specified'}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No {title.toLowerCase()}.</p>
      )}

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`py-1 px-3 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white'}`}
        >
          Previous
        </button>
        <span className="text-sm font-medium">Page {currentPage} of {totalPages}</span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`py-1 px-3 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PaginatedBookings;
