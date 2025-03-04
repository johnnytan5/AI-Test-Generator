import "../css/SkillCard.css"
import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar'; // Import CircularProgressBar component
import 'react-circular-progressbar/dist/styles.css'; // Import default styles for circular progress bar

function SkillCard({ skill, score }) {
    return (
        <div className="skill-card">
            <h4>{skill}</h4>
            <div className="progress-container">
                {score === null ? (
                    <p>Score: null</p>
                ) : (
                    <CircularProgressbar value={score} maxValue={100} text={`${score}%`} />
                )}
            </div>
        </div>
    );
}

export default SkillCard;
