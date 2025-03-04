import React from "react";
import "../css/Loading.css"; // Import the CSS file

function Loading({ text }) {
  return (
    <div className="loading-overlay">
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default Loading;

