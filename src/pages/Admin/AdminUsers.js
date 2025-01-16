import React, { useState, useEffect } from 'react';
import ConfirmationModal from '../../components/ConfirmationModal';
import * as userService from '../../Services/userService';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalPurpose, setModalPurpose] = useState(''); // 'delete' or 'roleChange'
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState(''); // For storing the selected role
  const [roles] = useState(['customer', 'admin', 'instructor']); // Available roles

  // Fetch users and locations
  const fetchData = async () => {
    try {
      setLoading(true);
      const usersData = await userService.fetchUsers();
      const locationsData = await userService.fetchLocations();
      setUsers(usersData);
      setLocations(locationsData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (selectedUser) {
      try {
        await userService.deleteUser(selectedUser.id);
        fetchData();
        setShowModal(false);
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleRoleChange = async () => {
    if (selectedUser && newRole) {
      try {
        await userService.updateUserRole(selectedUser.id, newRole);
        fetchData();
        setShowModal(false);
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const openModal = (user, purpose) => {
    setSelectedUser(user);
    setModalPurpose(purpose);
    setShowModal(true);
    setNewRole(user.role); // Initialize the role selection with the user's current role
  };

  // Split users by role
  const admins = users.filter(user => user.role === 'admin');
  const instructors = users.filter(user => user.role === 'instructor');
  const customers = users.filter(user => user.role === 'customer');

  return (
    <div className="container mx-auto p-6 pt-24">
      <h1 className="text-3xl font-semibold mb-4 text-center">Manage Users</h1>

      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          {/* Admin Section */}
          <section>
            <h2 className="text-xl font-semibold mt-6">Admins</h2>
            <div className="overflow-x-auto shadow-md rounded-lg">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Role</th>
                    <th className="px-4 py-2">Location</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="px-4 py-2">{user.name}</td>
                      <td className="px-4 py-2">{user.role}</td>
                      <td className="px-4 py-2">{user.locations?.name || 'N/A'}</td>
                      <td className="px-4 py-2 flex space-x-2">
                        <button
                          onClick={() => openModal(user, 'roleChange')}
                          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700"
                        >
                          Change Role
                        </button>
                        <button
                          onClick={() => openModal(user, 'delete')}
                          className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700"
                        >
                          Mark as Deleted
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Instructor Section */}
          <section>
            <h2 className="text-xl font-semibold mt-6">Instructors</h2>
            <div className="overflow-x-auto shadow-md rounded-lg">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Role</th>
                    <th className="px-4 py-2">Location</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {instructors.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="px-4 py-2">{user.name}</td>
                      <td className="px-4 py-2">{user.role}</td>
                      <td className="px-4 py-2">{user.locations?.name || 'N/A'}</td>
                      <td className="px-4 py-2 flex space-x-2">
                        <button
                          onClick={() => openModal(user, 'roleChange')}
                          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700"
                        >
                          Change Role
                        </button>
                        <button
                          onClick={() => openModal(user, 'delete')}
                          className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700"
                        >
                          Mark as Deleted
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Customer Section */}
          <section>
            <h2 className="text-xl font-semibold mt-6">Customers</h2>
            <div className="overflow-x-auto shadow-md rounded-lg">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Role</th>
                    <th className="px-4 py-2">Location</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="px-4 py-2">{user.name}</td>
                      <td className="px-4 py-2">{user.role}</td>
                      <td className="px-4 py-2">{user.locations?.name || 'N/A'}</td>
                      <td className="px-4 py-2 flex space-x-2">
                        <button
                          onClick={() => openModal(user, 'roleChange')}
                          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700"
                        >
                          Change Role
                        </button>
                        <button
                          onClick={() => openModal(user, 'delete')}
                          className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700"
                        >
                          Mark as Deleted
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* Use the reusable ConfirmationModal component */}
      <ConfirmationModal
        isOpen={showModal}
        title={
          modalPurpose === 'delete'
            ? 'Confirm Deletion'
            : 'Change Role'
        }
        message={
          modalPurpose === 'delete'
            ? `Are you sure you want to mark ${selectedUser?.name} as deleted? This action cannot be undone.`
            : `Select a new role for ${selectedUser?.name}.`
        }
        onConfirm={
          modalPurpose === 'delete'
            ? handleDelete
            : handleRoleChange
        }
        onCancel={() => setShowModal(false)}
        roleProps={
          modalPurpose === 'roleChange'
            ? { roles, newRole, setNewRole }
            : null
        }
      />
    </div>
  );
}

export default AdminUsers;
