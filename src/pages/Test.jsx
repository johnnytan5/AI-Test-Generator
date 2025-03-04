import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Question from '../components/Question'; // Import the Question component
import '../css/Test.css'
import Loading from '../components/Loading'

function Test() {

    const location = useLocation();
    const { skill, score } = location.state || {};
    const navigate = useNavigate();

    // State to track current question index and answers
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState(Array(questions.length).fill(''));
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
                const prompt = `Generate me 5 in-depth questions about ${skill} and return them in JSON array format, with no extra words.`;

                const response = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`, // OpenAI requires Bearer token
                    },
                    body: JSON.stringify({
                        model: "gpt-4", // Change model if needed (e.g., gpt-3.5-turbo)
                        messages: [{ role: "user", content: prompt }],
                        temperature: 0.7,
                        max_tokens: 400,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                console.log("OpenAI Response:", data); // Debugging

                // Extract generated text from OpenAI response
                const textResponse = data.choices[0].message.content.trim();

                // Convert text into an array
                const generatedQuestions = JSON.parse(textResponse);

                console.log("Fetched Questions:", generatedQuestions);
                setQuestions(generatedQuestions);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();
    }, []);

    useEffect(() => {
        if (questions.length > 0) {
            setAnswers(Array(questions.length).fill(''));
        }
    }, [questions]);

    const handleAnswerChange = (index, answer) => {
        const newAnswers = [...answers];
        newAnswers[index] = answer;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = () => {
        navigate("/review", {state: {questions, answers, skill}});
    }

    const isFirst = currentQuestionIndex === 0;
    const isLast = currentQuestionIndex === questions.length - 1;

    return (
        <div className="test-page">
            <h1>Test topic: {skill}</h1>
            {questions.length > 0 && currentQuestionIndex < questions.length ? (
                <div>
                <Question
                    question={questions[currentQuestionIndex]}
                    answer={answers[currentQuestionIndex]}
                    onAnswerChange={(answer) => handleAnswerChange(currentQuestionIndex, answer)}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    isFirst={isFirst}
                    isLast={isLast}
                />
                <button onClick={() => handleSubmit(questions, answers, skill)} disabled={!isLast}>Submit</button>
                </div>
            ) : (
                <Loading text = "Loading Questions..."/>
            )}
        </div>
    );
};


export default Test