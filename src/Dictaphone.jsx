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
  const [keywords] = useState(["start", "end", "body", "stop"]);
  const [keywordMatched, setKeywordMatched] = useState("");
  const [fullTranscript, setFullTranscript] = useState("");

  // Monitor the transcript and toggle transcription accordingly
  useEffect(() => {
    if (transcript) {
      const foundKeyword = keywords.find((keyword) =>
        transcript.includes(keyword)
      );
      if (foundKeyword) {
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
          setFullTranscript(
            (prev) =>
              `${prev}\n--- ${foundKeyword.toUpperCase()} DETECTED ---\n`
          );
          console.log(
            `Keyword Detected: ${foundKeyword} - Starting transcription.`
          );
        }
      }

      // Stream new transcript additions only when actively transcribing
      if (transcribing) {
        setFullTranscript((prev) => `${prev}\n${transcript}`);
      }
    }
  }, [transcript, keywords, transcribing]);

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

  // UI for the Dictaphone
  return (
    <div>
      <p>Microphone: {listening ? "on" : "off"}</p>
      <button onClick={handleStartListening}>Start Listening</button>
      <button onClick={handleStopListening}>Stop Listening</button>
      <button onClick={() => setFullTranscript("")}>Reset Transcript</button>
      <p>Detected Keyword: {keywordMatched}</p>
      <p>Transcript (Streaming):</p>
      <pre>{fullTranscript}</pre>
    </div>
  );
};

export default Dictaphone;
