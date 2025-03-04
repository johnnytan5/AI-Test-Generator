import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // Firebase imports
import { doc, getDoc } from 'firebase/firestore'; // Firestore imports
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged function
import { useNavigate } from 'react-router-dom';
import SkillCard from '../components/SkillCard'; // Import the SkillCard component
import '../css/Profile.css';


function Profile() {
    const [user, setUser] = useState(null); // Store current user info
    const [skills, setSkills] = useState({}); // Store selected skills with their scores (key-value pairs)
    const navigate = useNavigate();

    // Fetch user info and skills when user is logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser); // Set user if logged in
                fetchSkills(currentUser.uid); // Fetch user skills
            } else {
                // Redirect if not logged in
                window.location.href = '/login';
            }
        });

        return unsubscribe;
    }, []);

    // Fetch selected skills from Firestore
    const fetchSkills = async (userId) => {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setSkills(docSnap.data().skills || {}); // Store skills as key-value pairs
        }
    };

    const handleSkillClick = (skill, score) => {
        navigate("/test", {state: {skill, score}})
    }

    // Get the score for the skill (if it exists, otherwise return null)
    const getSkillScore = (skill) => {
        return skills[skill] !== null ? skills[skill] : null;
    };

    return (
        <div className="profile-container">
            {user ? (
                <>
                    <h2>Welcome, {user.email}</h2>
                    <div className="skills-container">
                        <h3>Your Skills</h3>
                        <div className="skills-list">
                            
                            {Object.keys(skills).map((skill) => (
                                <div key={skill} onClick={() => handleSkillClick(skill, getSkillScore(skill))}>
                                    <SkillCard skill={skill} score={getSkillScore(skill)}/>
                                </div>
                            ))}
                            
                        </div>
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Profile;
