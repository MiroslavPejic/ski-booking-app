import React from 'react';

function ConfirmationModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  roleProps, // New prop for handling role dropdown
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>

        {/* Role selection dropdown, rendered if roleProps exists */}
        {roleProps && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Select a new role:</label>
            <select
              value={roleProps.newRole}
              onChange={(e) => roleProps.setNewRole(e.target.value)}
              className="p-2 border border-gray-300 rounded w-full"
            >
              {roleProps.roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
