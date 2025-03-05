import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient'; // Ensure correct path for your supabase client
import backgroundImage1 from '../assets/ski_background_1.jpg';
import backgroundImage2 from '../assets/ski_background_2.jpg';
import backgroundImage3 from '../assets/ski_background_3.jpg';

function LandingPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const sections = [
    { id: 'section1', backgroundImage: backgroundImage1, title: 'Welcome to Ski Manager', subtitle: 'Streamline your ski resort operations' },
    { id: 'section2', backgroundImage: backgroundImage2, title: 'What we do', subtitle: 'Learn to ski with ease at top resorts' },
    { id: 'section3', backgroundImage: backgroundImage3, title: 'Get Started Today!', subtitle: 'Sign up and transform your operations' },
  ];

  const sectionTwoText = `
    Ski with Ease ski school Morzine/Avoriaz & Les Gets in the PDS (Portes du Soleil) 
    and now Meribel in the 3 Vallées offers easy-learning private Ski lessons.

    Our 4 selected resorts in the heart of the Portes du Soleil and 3 Vallées Meribel 
    are perfect for learning and improving skills for all ages and abilities.

    The ski school name is our mission statement. Our English-speaking ski instructors 
    use fun and effective easy-learning techniques. You’ll learn how to “get the most without using the most”.
  `;

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
  }, []);

  return (
    <div>
      {sections.map((section, index) => (
        <div
          key={index}
          id={section.id}
          className="relative flex items-center justify-center min-h-screen bg-cover bg-center text-white"
          style={{ backgroundImage: `url(${section.backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          <div className="relative z-10 p-10 text-center max-w-2xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">{section.title}</h1>
            <p className="text-lg mb-6">{section.subtitle}</p>
            {index === 1 && (
              <p className="text-lg text-white mt-4">{sectionTwoText}</p>
            )}
            {!user && index === 0 && (
              <div className="flex justify-center gap-6 mt-6">
                <a
                  href="/login"
                  className="bg-primary text-white py-3 px-6 rounded-lg hover:bg-hover transition duration-300"
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
                  className="bg-primary text-white py-3 px-6 rounded-lg hover:bg-hover transition duration-300"
                >
                  Go to Dashboard
                </a>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default LandingPage;
