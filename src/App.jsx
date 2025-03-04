import './App.css'
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { auth } from './firebase'; // Import Firebase Authentication
import { onAuthStateChanged } from 'firebase/auth'; // To listen for auth state changes
import Login from './pages/Login'; // Import Login page
import Profile from './pages/Profile'; // Import Profile page
import Skill from './pages/Skill'; // Import Skill page
import Navbar from './components/Navbar'; // Import Navbar component
import Question from './components/Question';
import Review from './pages/Review';
import Test from './pages/Test';

function App() {
    const [user, setUser] = useState(null);

    // Listen to authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser); // Set the user if logged in
        });

        return unsubscribe;
    }, []);

    return (
        <div className='main-content'>
            <Router>
                {/* Navbar is only visible if user is logged in */}
                {user && <Navbar />}

                {/* Routes for different pages */}
                <Routes>
                    <Route
                        path="/login"
                        element={user ? <Navigate to="/profile" /> : <Login />}
                    />

                    <Route
                        path="/profile"
                        element={user ? <Profile /> : <Navigate to="/login" />}
                    />

                    <Route
                        path="/test"
                        element={user ? <Test /> : <Navigate to="/login" />}
                    />

                    <Route
                        path="/review"
                        element={user ? <Review /> : <Navigate to="/login" />}
                    />

                    <Route
                        path="/skills"
                        element={user ? <Skill /> : <Navigate to="/login" />}
                    />

                    {/* Default route to redirect to the login page */}
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
