import React from "react";
import "../css/ReviewCard.css"; // Optional CSS for styling

function ReviewCard({ index, question, answer, comment, marks }) {
    return (
        <div className="review-card">
            <h3>Question {index + 1}</h3>
            <p><strong>Q:</strong> {question}</p>
            <p><strong>Your Answer:</strong> {answer}</p>
            <p><strong>Comment:</strong> {comment}</p>
            <p><strong>Marks:</strong> {marks} / 20</p>
        </div>
    );
}

export default ReviewCard;
