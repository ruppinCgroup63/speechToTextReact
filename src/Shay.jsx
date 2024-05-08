import { useEffect, useState } from "react";
import SpeechRecognition from "react-speech-recognition";
import { useSpeechRecognition } from "react-speech-recognition";

export default function Shay() {
  const {
    finalTranscript,
    resetTranscript,
    listening,
    transcript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [keywords] = useState({ start: "what", stop: "no" });

  // Function to start listening continuously
  const handleStartListening = () => {
    if (!listening) {
      SpeechRecognition.startListening({ continuous: true, language: "en" });
      //  setIsListening(true);
    }
  };

  // Function to stop listening completely
  // const handleStopListening = () => {

  //  setIsListening(false);
  //  setTranscribing(false);
  //  setKeywordMatched("");

  useEffect(() => {
    if (finalTranscript.endsWith(keywords.stop)) {
      console.log(finalTranscript);
      resetTranscript();

      //SpeechRecognition.getRecognition().continuous = false;
      return;
    }
    if (transcript.startsWith(keywords.start)) {
      console.log(transcript);
    }
  }, [transcript, finalTranscript]);
  // Return early if the browser does not support speech recognition
  if (!browserSupportsSpeechRecognition) {
    return <div>Browser doesn't support speech recognition.</div>;
  }
  return (
    <>
      <button onClick={handleStartListening}>Start Listening</button>

      <section></section>
    </>
  );
}
