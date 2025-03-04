import React from "react";
import "../css/Question.css"; // Import the CSS file

function Question({ question, answer, onAnswerChange, onPrevious, onNext, isFirst, isLast }) {
    if (!question) return <p>Loading question...</p>; 

    return (
        <div className="question-container">
            <h3>{question.question}</h3>
            <textarea
                value={answer || ""}
                onChange={(e) => onAnswerChange(e.target.value)}
                placeholder="Type your answer here..."
                rows={5} // Default to 5 lines
            />
            <div className="question-nav">
                <button onClick={onPrevious} disabled={isFirst}>
                    Previous
                </button>
                <button onClick={onNext} disabled={isLast}>
                    Next
                </button>
            </div>
        </div>
    );
}

export default Question;
