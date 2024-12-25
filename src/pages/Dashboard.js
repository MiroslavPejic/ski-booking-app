import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient'; // Ensure this path is correct

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser(); // Correct method to get user

      if (error) {
        console.error('Error fetching user:', error.message);
        navigate('/login'); // Redirect to login if no user is found
      } else {
        setUser(user);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut(); // Sign out the user
    navigate('/login'); // Redirect to login page
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('/assets/ski_background.png')` }} // Ensure the path to your image is correct
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-md opacity-90">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back to the slopes!</p>
        </div>
        {user ? (
          <div className="text-center">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-blue-600">User Info</h2>
              <p className="text-lg text-gray-700">Logged in as: <span className="font-bold">{user.email}</span></p>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout} // Call handleLogout function on click
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Logout
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                View Profile
              </button>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
