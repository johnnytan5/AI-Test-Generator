import { useState, useEffect } from 'react';
import { getFirestore, collection, setDoc, getDoc, getDocs, doc, updateDoc } from "firebase/firestore"; // Firestore imports
import { getStorage, ref, getDownloadURL } from "firebase/storage"; // Firebase Storage imports
import { auth, db } from "../firebase"; // Assuming you have firebase initialized in this file
import Subject from '../components/Subject';  // Import the Subject component
import '../css/Skill.css'
import { useNavigate } from 'react-router-dom';
import {getAuth} from "firebase/auth"
import Loading from "../components/Loading"



function skill() {
    const [subjects, setSubjects] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                // Fetch all subjects from Firestore
                const subjectSnapshot = await getDocs(collection(db, 'Subjects'));
                const subjectData = [];

                // Loop through all subjects and fetch the image URL
                for (const doc of subjectSnapshot.docs) {
                    const subject = doc.data();
                    const storageRef = ref(getStorage(), subject.url); // Get the Firebase Storage reference using the gs:// URL
                    const tempurl = await getDownloadURL(storageRef); // Get the downloadable URL from Firebase Storage

                    // Add subject with the downloadable URL to subjectData array
                    subjectData.push({ name: subject.name, url: tempurl });
                }

                console.log("Fetched Subjects:", subjectData);

                setSubjects(subjectData); // Set the fetched subjects to state
            } catch (error) {
                console.error("Error fetching subjects:", error);
            }
        };
        fetchSubjects();
    }, []);

    const handleSelectSkill = (skillName) => {
        if (!selectedSkills.includes(skillName)) {
            setSelectedSkills(prev => {
                // Log previous selected skills to debug
                console.log("Previous selected skills:", prev);
                const updatedSkills = [...prev, skillName];
                return updatedSkills;
            });
        }
    };

    useEffect(() => {
        console.log("Number of skills selected: ", selectedSkills.length);
    }, [selectedSkills]); // This will run whenever selectedSkills changes
    

    const handleDeselectSkill = (skillName) => {
        setSelectedSkills(prev => prev.filter((skill) => skill !== skillName));

    };

    const handleSaveSkill = async () => {
        console.log("Saving selected skills:", selectedSkills);
    
        try {
            const user = auth.currentUser;
            if (!user) {
                console.log('No user is currently logged in');
                alert('Please log in to save your skills');
                return;
            }
    
            const userRef = doc(db, 'users', user.uid); // Reference to the user's document
    
            // Check if the document exists
            const userDocSnapshot = await getDoc(userRef);
            
            // Prepare the skills object (key-value pairs)
            const skillsObject = {};
            selectedSkills.forEach(skill => {
                skillsObject[skill] = null; // Set each selected skill to `null`
            });
    
            if (!userDocSnapshot.exists()) {
                console.log("User document does not exist. Creating a new one...");
                // If the document does not exist, create it using setDoc
                await setDoc(userRef, {
                    skills: skillsObject // Save selected skills as key-value pairs
                });
                console.log("Document created successfully.");
            } else {
                console.log('User document exists. Updating skills...');
                // If the document exists, update only the skills field
                await updateDoc(userRef, {
                    skills: skillsObject // Update skills as key-value pairs
                });
                console.log("Skills saved successfully.");
            }
    
            // Redirect to profile page
            navigate('/profile');
        } catch (error) {
            console.error('Error saving skills to Firestore:', error);
        }
    };
    

    if (subjects.length === 0) {

        return (
            <div>
                <Loading text = "Loading Skills..."/>

            </div>

        );
    }


    return (
        <div>
            <h1>Select your skills</h1>
            <div className="subject-container">

                {subjects.map((subject) => (
                    <div
                    key={subject.name} onClick={() => {selectedSkills.includes(subject.name)? handleDeselectSkill(subject.name) : handleSelectSkill(subject.name)}}
                    >
                    <Subject 
                    key={subject.name} 
                    name={subject.name} 
                    url={subject.url} />
                    
                    </div>
                ))}
            </div>
            {selectedSkills.length > 3 && <p>You can only select up to 3 skills!</p>}   
            {selectedSkills.length === 0 && <p>You must select at least 1 skill(s)!</p>}   
            <button 
            className="submit-skill" 
            onClick={()=> handleSaveSkill()} 
            disabled={(selectedSkills.length === 0) || (selectedSkills.length > 3)}>
                Save
                </button>
        </div>
    );
}

export default skill