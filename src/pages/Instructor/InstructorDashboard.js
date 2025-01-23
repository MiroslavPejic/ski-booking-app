import { Link } from 'react-router-dom';

function InstructorDashboard({})
{
    return (
        <div className="container mx-auto p-6 pt-24">
            <h2 className="text-3xl font-semibold mb-8 text-center">Instructor Dashboard</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                {/* Admin-specific buttons */}
                <Link to="/instructor/bookings" className="flex justify-center items-center w-full h-48 bg-blue-600 text-white rounded-lg shadow-lg text-xl font-semibold hover:bg-blue-700 transition duration-300">
                View Bookings
                </Link>
                
                {/* Add more buttons here if needed */}
            </div>
        </div>
    );
};

export default InstructorDashboard;