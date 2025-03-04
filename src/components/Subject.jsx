import { useState } from 'react';
import '../css/Subject.css'; // Import the CSS file

function Subject({ name, url }) {
    const [selected, setSelected] = useState(false); // State to track if the card is selected

    const handleSelect = () => {
        setSelected(!selected); // Toggle the selection state
    };

    return (
        <div 
            className={`subject-card ${selected ? 'selected' : ''}`} 
            onClick={handleSelect} // Toggle selection on card click
        >
            {/* Selectable icon */}
            <div className="icon-container">
                <div 
                    className={`icon ${selected ? 'selected-icon' : ''}`} // Toggle icon color based on selection
                />
            </div>
            
            {/* Skill image */}
            <div className="image-container">
                <img src={url} alt={name} className="image" />
            </div>

            {/* Skill name */}
            <p className="name">{name}</p>
        </div>
    );
}

export default Subject;
