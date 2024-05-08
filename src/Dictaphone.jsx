import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import React, { useState, useEffect } from "react";

const Dictaphone = () => {
  const { transcript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  // Listening state and keywords to control transcription
  const [isListening, setIsListening] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [keywordMatched, setKeywordMatched] = useState("");
  const [fullTranscript, setFullTranscript] = useState("");
  const [activeSection, setActiveSection] = useState("");

  const [keywords] = useState(["start", "end", "body", "stop"]);
  // Monitor the transcript and toggle transcription accordingly
  useEffect(() => {
    if (transcript) {
      const foundKeyword = keywords.find((keyword) =>
        transcript.includes(keyword)
      );
      if (foundKeyword) {
        setActiveSection(foundKeyword);
        if (foundKeyword === "stop" && transcribing) {
          // Stop transcription on the "stop" keyword
          setTranscribing(false);
          console.log(
            `Keyword Detected: ${foundKeyword} - Stopping transcription.`
          );
        } else if (!transcribing && foundKeyword !== "stop") {
          // Start transcription on other keywords (e.g., "start", "end", etc.)
          setKeywordMatched(foundKeyword);
          setTranscribing(true);
          /* setFullTranscript(
            (prev) =>
              `${prev}\n--- ${foundKeyword.toUpperCase()} DETECTED ---\n`
          );*/
          console.log(
            `Keyword Detected: ${foundKeyword} - Starting transcription.`
          );
        }
      }
      // Stream new transcript additions only when actively transcribing and to the active section
      if (transcribing && activeSection) {
        setFullTranscript((prev) => `${prev}\n${transcript}`);
      }

      // Stream new transcript additions only when actively transcribing
      /* if (transcribing) {
        setFullTranscript((prev) => `${prev}\n${transcript}`);
      }*/
    }
  }, [transcript, keywords, transcribing, activeSection]);

  // Function to start listening continuously
  const handleStartListening = () => {
    if (!listening) {
      SpeechRecognition.startListening({ continuous: true, language: "en" });
      setIsListening(true);
    }
  };

  // Function to stop listening completely
  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);
    setTranscribing(false);
    setKeywordMatched("");
  };

  // Return early if the browser does not support speech recognition
  if (!browserSupportsSpeechRecognition) {
    return <div>Browser doesn't support speech recognition.</div>;
  }
  // <pre>{fullTranscript}</pre>;

  // UI for the Dictaphone
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
          <button
            style={{ color: "red" }}
            onClick={() => setFullTranscript("")}
          >
            Reset Transcript
          </button>
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
          <pre>{activeSection === "start" && fullTranscript}</pre>
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
          <pre>{activeSection === "body" && fullTranscript}</pre>
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
          <pre>{activeSection === "end" && fullTranscript}</pre>
        </section>
      </div>
    </div>
  );
};

export default Dictaphone;
