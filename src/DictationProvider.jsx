import React, { useEffect } from "react";
import {
  SpeechRecognitionProvider,
  useSpeechRecognitionContext,
} from "./SpeechRecognitionContext";
import SpeechRecognitionComponent from "./SpeechRecognitionComponent";

function Main() {
  const {
    startListening,
    stopListening,
    dictations,
    setDictations,
    activeComponent,
    setActiveComponent,
    transcript,
    resetTranscript,
  } = useSpeechRecognitionContext();

  useEffect(() => {
    if (activeComponent && transcript) {
      setDictations((prevDictations) => {
        const newDictation =
          `${prevDictations[activeComponent]} ${transcript}`.trim();
        return { ...prevDictations, [activeComponent]: newDictation };
      });
      resetTranscript();
    }
  }, [transcript]);

  return (
    <div>
      <h1>Main Component</h1>
      <button onClick={startListening}>Start Listening</button>
      <button onClick={stopListening}>Stop Listening</button>
      <div>
        {["apple", "banana", "orange"].map((keyword) => (
          <SpeechRecognitionComponent
            key={keyword}
            active={activeComponent === keyword}
            keyword={keyword}
            dictation={dictations[keyword]}
          />
        ))}
      </div>
    </div>
  );
}

// Wrap your component with SpeechRecognitionProvider to provide context
export default () => (
  <SpeechRecognitionProvider>
    <Main />
  </SpeechRecognitionProvider>
);
