import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase'; // Firebase Authentication
import { signOut } from 'firebase/auth'; // Firebase signOut function
import '../css/Navbar.css'

function Navbar() {
    const handleLogout = async () => {
        try {
            await signOut(auth); // Log out the user
            window.location.href = '/login'; // Redirect to the login page
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-links">
                <Link to="/skills" className="navbar-item">Skills</Link>
                <Link to="/profile" className="navbar-item">Profile</Link>
                
            </div>

            {/* Logout button, only displayed if the user is logged in */}
            <button onClick={handleLogout} className="logout-btn">Logout</button>
        </nav>
    );
}

export default Navbar;
