import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import React, { useState, useEffect } from "react";

const DictationToSection = () => {
  const { transcript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
  // Listening state and keywords to control transcription
  const [isListening, setIsListening] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [keywordMatched, setKeywordMatched] = useState("");
  const [activeSection, setActiveSection] = useState("");

  const [keywords] = useState(["start", "end", "body", "stop"]);

  useEffect(() => {
    if (transcript) {
      const foundKeyword = keywords.find((keyword) =>
        transcript.includes(keyword)
      );
      if (foundKeyword) {
        setActiveSection(foundKeyword);
        setKeywordMatched(foundKeyword);
        if (foundKeyword === "stop" && transcribing) {
          // Stop transcription on the "stop" keyword
          setTranscribing(false);
          console.log(
            `Keyword Detected: ${foundKeyword} - Stopping transcription.`
          );
        } else if (foundKeyword !== "stop" && !transcribing) {
          setKeywordMatched(foundKeyword);
          setTranscribing(true);
          setIsListening(true);
        }
      }
    }
  }, [transcript, keywords, transcribing, activeSection]);

  //Function to handle start listening click
  const handleStartListening = () => {
    if (!isListening) {
      SpeechRecognition.startListening({ continuous: true, language: "en-US" });
      setTranscribing(true);
    }
  };
  // Function to stop listening completely
  const handleStopListening = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
      setTranscribing(false);
      setKeywordMatched("");
    }
  };

  // Return early if the browser does not support speech recognition
  if (!browserSupportsSpeechRecognition) {
    return <div>Browser doesn't support speech recognition.</div>;
  }

  return (
    <div>
      <div
        id="container"
        style={{
          margin: "10px",
          justifyContent: "center",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <p>Microphone: {listening ? "on" : "off"}</p>
        <div
          id="header"
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "15px",
            justifyContent: "center",
          }}
        >
          <button onClick={handleStartListening}>Start Listening</button>
          <button onClick={handleStopListening}>Stop Listening</button>
        </div>
        <p>Detected Keyword: {keywordMatched}</p>
        <p>Transcript (Streaming):</p>

        <section
          id="start"
          style={{
            height: "33vh",
            width: "100%",
            maxWidth: "100%",
            border: "1px solid black",
          }}
        >
          {" "}
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {activeSection === "start" && transcribing}
          </pre>
        </section>
        <section
          id="body"
          style={{
            width: "100%",
            maxWidth: "100%",
            height: "33vh",
            border: "1px solid black",
          }}
        >
          {" "}
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {activeSection === "body" && transcribing}
          </pre>
        </section>
        <section
          id="end"
          style={{
            height: "33vh",
            width: "100%",
            maxWidth: "100%",
            border: "1px solid black",
          }}
        >
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {activeSection === "end" && transcribing}
          </pre>
        </section>
      </div>
    </div>
  );
};
export default DictationToSection;
