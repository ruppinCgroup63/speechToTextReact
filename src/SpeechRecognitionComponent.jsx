// SpeechRecognitionComponent.jsx
import React from "react";

function SpeechRecognitionComponent({ active, keyword, dictation }) {
  return (
    <div
      style={{
        border: "1px solid black",
        width: "100%",
        height: "33vh",
        margin: "15px",
      }}
    >
      {active ? "is now Active" : ""}
      <h2>{keyword} Component</h2>
      <p>{dictation}</p>
    </div>
  );
}

export default SpeechRecognitionComponent;
