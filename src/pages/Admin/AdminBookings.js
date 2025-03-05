import React, { useState, useEffect, useContext } from "react";
import supabase from "../../supabaseClient";
import { AppContext } from "../AppContext";
import ForbiddenPage from "../ForbiddenPage";
import Modal from "../../components/Modal";
import { format, addDays, subDays, startOfWeek, endOfWeek, parseISO } from "date-fns";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { userRole } = useContext(AppContext);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newInstructorId, setNewInstructorId] = useState("");

  // Track selected week
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const fetchBookings = async () => {
    setLoading(true);
    const weekStart = currentWeekStart;
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

    const { data, error } = await supabase
      .from("ski_lessons")
      .select(
        "id, user_id, lesson_date, lesson_time, lesson_type, location_id, instructor_id, profiles:instructor_id(name), locations(name), deleted"
      )
      .eq("deleted", false)
      .gte("lesson_date", weekStart.toISOString())
      .lte("lesson_date", weekEnd.toISOString())
      .order("lesson_date", { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setBookings(data);
    }
    setLoading(false);
  };

  const fetchInstructors = async () => {
    const { data, error } = await supabase.from("profiles").select("id, name");
    if (!error) {
      setInstructors(data);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchInstructors();
  }, [currentWeekStart]); // Reload on week change

  // Group bookings by date
  const groupBookingsByDate = () => {
    return bookings.reduce((grouped, booking) => {
      const dateKey = format(parseISO(booking.lesson_date), "yyyy-MM-dd");
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(booking);
      return grouped;
    }, {});
  };

  const openEditModal = (booking) => {
    setSelectedBooking(booking);
    setNewInstructorId(booking.instructor_id);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (booking) => {
    setSelectedBooking(booking);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateInstructor = async () => {
    if (!selectedBooking) return;

    const { error } = await supabase
      .from("ski_lessons")
      .update({ instructor_id: newInstructorId })
      .match({ id: selectedBooking.id });

    if (!error) {
      fetchBookings();
      setIsEditModalOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedBooking) return;

    const { error } = await supabase
      .from("ski_lessons")
      .update({ deleted: true }) // Soft delete
      .match({ id: selectedBooking.id });

    if (!error) {
      fetchBookings();
      setIsDeleteModalOpen(false);
    }
  };

  // Navigation functions
  const goToNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const goToPreviousWeek = () => {
    setCurrentWeekStart(subDays(currentWeekStart, 7));
  };

  return (
    <div className="container mx-auto p-6 pt-24">
      <h1 className="text-3xl font-semibold mb-4 text-center">Manage Bookings</h1>
      {userRole !== "admin" ? (
        <ForbiddenPage />
      ) : loading ? (
        <p>Loading bookings...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {/* Week Navigation */}
          <div className="flex justify-between items-center mb-6">
            <button onClick={goToPreviousWeek} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600">
              ⬅ Previous Week
            </button>
            <h2 className="text-xl font-semibold">
              {format(currentWeekStart, "MMMM d")} - {format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), "MMMM d")}
            </h2>
            <button onClick={goToNextWeek} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600">
              Next Week ➡
            </button>
          </div>

          {/* Bookings grouped by date */}
          {Object.entries(groupBookingsByDate()).map(([date, dayBookings]) => (
            <div key={date} className="mb-8">
              <h2 className="text-2xl font-bold mb-2">{format(parseISO(date), "EEEE, MMMM d")}</h2>
              <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-200 text-left">
                      <th className="px-4 py-2">Time</th>
                      <th className="px-4 py-2">Lesson Type</th>
                      <th className="px-4 py-2">Location</th>
                      <th className="px-4 py-2">Instructor</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dayBookings.map((booking) => (
                      <tr key={booking.id} className="border-b">
                        <td className="px-4 py-2">{booking.lesson_time}</td>
                        <td className="px-4 py-2">{booking.lesson_type}</td>
                        <td className="px-4 py-2">{booking.locations?.name}</td>
                        <td className="px-4 py-2">{booking.profiles?.name}</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => openEditModal(booking)}
                            className="bg-blue-500 text-white py-1 px-3 rounded bg-hover mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openDeleteModal(booking)}
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
            </div>
          ))}
        </>
      )}

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Booking">
        {selectedBooking && (
          <div>
            <label className="block mb-2">
              Select Instructor:
              <select
                value={newInstructorId}
                onChange={(e) => setNewInstructorId(e.target.value)}
                className="w-full px-3 py-2 border rounded mt-1"
              >
                {instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              onClick={handleUpdateInstructor}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion" onConfirm={handleDelete}>
        <p>Are you sure you want to delete this booking?</p>
      </Modal>
    </div>
  );
}

export default AdminBookings;
