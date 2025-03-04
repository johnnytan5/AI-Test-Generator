import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from '../firebase'; // Firebase imports
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Firestore imports
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged function
import ReviewCard from "../components/ReviewCard"; // Import the reusable component
import Loading from "../components/Loading"

function Review() {
    const location = useLocation();
    const { questions, answers, skill } = location.state || {};
    const navigate = useNavigate();
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;



    const [gradedAnswers, setGradedAnswers] = useState([]);
    const [totalScore, setTotalScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null); // Store current user info

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser); // Set user if logged in
            } else {
                // Redirect if not logged in
                window.location.href = '/login';
            }
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        const gradeAnswers = async () => {
            if (!questions || !answers || questions.length === 0 || answers.length === 0) {
                console.error("No questions or answers provided.");
                setLoading(false);
                return;
            }

            const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
            let scoreSum = 0;

            try {
                // Create all API requests in parallel
                const requests = questions.map((question, i) => {
                    const prompt = `Grade the following answer and return only JSON, no extra text. Rate from 0 - 20 marks.
    
    Question: ${question}
    Student's Answer: ${answers[i]}
    
    Return only valid JSON in this format:
    \`\`\`json
    { "marks": X, "comment": "Feedback" }
    \`\`\``;

                    return fetch("https://api.openai.com/v1/chat/completions", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${apiKey}`,
                        },
                        body: JSON.stringify({
                            model: "gpt-4",
                            messages: [{ role: "user", content: prompt }],
                            temperature: 0.5,
                            max_tokens: 100,
                        }),
                    }).then(async (response) => {
                        if (!response.ok) {
                            throw new Error(`API error: ${response.status} ${response.statusText}`);
                        }
                        return response.json();
                    }).catch(error => {
                        console.error(`Error fetching response for question ${i + 1}:`, error);
                        return { error: true };  // Return an error object instead of failing all requests
                    });
                });

                // Wait for all responses
                const responses = await Promise.all(requests);

                // Process responses
                const gradedResults = responses.map((data, i) => {
                    if (data.error) {
                        return {
                            question: questions[i],
                            answer: answers[i],
                            comment: "Error grading this question.",
                            marks: 0,
                        };
                    }

                    console.log(`API Response for Q${i + 1}:`, data);

                    let rawContent = data.choices?.[0]?.message?.content?.trim() || "{}";

                    // Remove ```json and ``` if they exist
                    rawContent = rawContent.replace(/^```json/, "").replace(/```$/, "");

                    let feedback;
                    try {
                        feedback = JSON.parse(rawContent);
                    } catch (error) {
                        console.error(`JSON parse error for question ${i + 1}:`, error);
                        feedback = { marks: 0, comment: "Invalid response format." };
                    }

                    scoreSum += feedback.marks || 0;

                    return {
                        question: questions[i],
                        answer: answers[i],
                        comment: feedback.comment || "No feedback provided.",
                        marks: feedback.marks || 0,
                    };
                });

                console.log("Final Graded Answers:", gradedResults);

                // Update state
                setGradedAnswers(gradedResults);
                setTotalScore(scoreSum);
            } catch (error) {
                console.error("Unexpected error in grading:", error);
            } finally {
                setLoading(false);
            }
        };

        gradeAnswers();
    }, []); // Dependency array left empty to run once



    const handleSubmit = async (skillName, newScore) => {

        if (!user) {
            console.error("No user logged in.");
            return;
        }

        const userRef = doc(db, "users", user.uid); // Reference to Firestore document

        try {
            // 1️⃣ Fetch existing user data from Firestore
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                console.error("User document not found!");
                return;
            }

            const userData = userSnap.data();
            const currentSkills = userData.skills || {}; // Get existing skills or default to an empty object

            // 2️⃣ Check if the tested skill exists before updating
            if (!currentSkills.hasOwnProperty(skillName)) {
                console.error(`Skill '${skillName}' not found in Firestore.`);
                return;
            }

            // 3️⃣ Update Firestore with the new score for the tested skill
            await updateDoc(userRef, {
                [`skills.${skillName}`]: newScore // Updates only this specific skill
            });

            console.log(`Updated ${skillName} score to:`, newScore);
        } catch (error) {
            console.error("Error updating skills:", error);
        }

        navigate("/profile");

    };



    return (
        <div className="review-page">
            <h1>Review - {skill} Test</h1>
            {loading ? (
                <Loading text="Loading Results..." />
            ) : (
                <>
                    {gradedAnswers.map((item, index) => (
                        <ReviewCard
                            key={index}
                            index={index}
                            question={item.question.question}
                            answer={item.answer}
                            comment={item.comment}
                            marks={item.marks}
                        />
                    ))}
                    <h2>Total Score: {totalScore} / {questions.length * 20}</h2>
                    <button onClick={() => handleSubmit(skill, totalScore)}>Return Home</button>
                </>
            )}
        </div>
    );
}

export default Review;
