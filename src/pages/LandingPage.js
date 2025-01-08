import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient'; // Ensure correct path for your supabase client
import backgroundImage1 from '../assets/ski_background_1.webp';
import backgroundImage2 from '../assets/ski_background_2.jpg';
import backgroundImage3 from '../assets/ski_background_3.webp';

function LandingPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    { id: 'section1', backgroundImage: backgroundImage1, title: 'Welcome to Ski Manager' },
    { id: 'section2', backgroundImage: backgroundImage2, title: 'Manage Your Ski Resort Seamlessly' },
    { id: 'section3', backgroundImage: backgroundImage3, title: 'Get Started Today!' },
  ];

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };

    fetchSession();

    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });
  }, [])

  useEffect(() => {
    const handleScroll = (event) => {
      event.preventDefault(); // Prevent default scroll behavior

      const delta = event.deltaY || event.detail || event.wheelDelta;
      if (delta > 0) {
        // Scroll down
        setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1));
      } else if (delta < 0) {
        // Scroll up
        setCurrentSection((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('wheel', handleScroll, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [sections.length]);

  useEffect(() => {
    const section = document.getElementById(sections[currentSection].id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentSection]);

  return (
    <div>
      {sections.map((section, index) => (
        <div
          key={index}
          id={section.id}
          className="flex items-center justify-center min-h-screen bg-cover bg-center text-white"
          style={{ backgroundImage: `url(${section.backgroundImage})` }}
        >
          <div className="bg-black bg-opacity-50 p-10 rounded-lg shadow-lg max-w-3xl text-center">
            <h1 className="text-4xl font-bold mb-4">{section.title}</h1>
            {index === 0 && (
              <>
                <p className="text-lg mb-6">
                  Streamline your ski resort operations with our platform. From managing reservations and 
                  tracking customer details to optimizing daily operations, our tools make it easier for 
                  you to focus on delivering an exceptional experience on the slopes.
                </p>
                {!user && (
                  <div className="flex justify-center gap-4">
                    <a
                      href="/login"
                      className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                      Login
                    </a>
                    <a
                      href="/create-account"
                      className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300"
                    >
                      Create Account
                    </a>
                  </div>
                )}
                {user && (
                  <div className="mt-4">
                    <a
                      href="/dashboard"
                      className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                      Go to Dashboard
                    </a>
                  </div>
                )}
              </>
            )}
            {index === 1 && (
              <p className="text-lg mb-6">
                Take control of your operations with ease. Our tools allow you to focus on what 
                matters most—providing the best experience for your guests.
              </p>
            )}
            {index === 2 && (
              <p className="text-lg mb-6">
                Sign up now and experience how Ski Manager can transform your operations. Whether 
                you're running a small resort or managing multiple locations, we've got you covered.
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default LandingPage;
