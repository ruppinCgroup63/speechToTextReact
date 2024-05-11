import React from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

function TestSpeechRecognition() {
  const { transcript, listening } = useSpeechRecognition();

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <div>Your browser does not support speech recognition.</div>;
  }

  return (
    <div>
      <h1>Speech Recognition Test</h1>
      <p>Listening: {listening ? "Yes" : "No"}</p>
      <p>Transcript: {transcript}</p>
      <button onClick={SpeechRecognition.startListening}>Start</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
    </div>
  );
}

export default TestSpeechRecognition;
