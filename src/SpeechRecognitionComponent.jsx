import React from "react";

function SpeechRecognitionComponent({ keyword, dictation, active }) {
  return (
    <div style={{ border: "1px solid black", width: "100%", height: "33vh" }}>
      <h2>{keyword} Component</h2>
      {active && <p>{dictation}</p>}
    </div>
  );
}

export default SpeechRecognitionComponent;
