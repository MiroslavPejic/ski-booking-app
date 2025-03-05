import React from "react";
import { useNavigate } from "react-router-dom";

const ForbiddenPage = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  const goHome = () => {
    navigate("/"); // Redirect to the home page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
      <p className="text-lg text-gray-700 mb-6">
        Oops! You don’t have permission to access this page.
      </p>
      <div className="flex gap-4">
        <button
          onClick={goBack}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Go Back
        </button>
        <button
          onClick={goHome}
          className="px-4 py-2 bg-primary text-white rounded bg-hover"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default ForbiddenPage;
