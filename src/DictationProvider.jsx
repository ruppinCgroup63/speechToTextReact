import React, { useEffect, createContext, useState, useContext } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

// Create a context for dictation state
const DictationContext = createContext();

// Create a provider component to wrap your component hierarchy
export const DictationProvider = ({ children }) => {
  // Initialize state to store dictation data
  const [dictationData, setDictationData] = useState("");

  // Function to update dictation data
  const updateDictationData = (data) => {
    setDictationData(data);
  };

  // Initialize speech recognition
  const { transcript, resetTranscript } = useSpeechRecognition();

  // Handle speech recognition
  const handleSpeechRecognition = () => {
    if (transcript !== "") {
      updateDictationData(transcript);
      resetTranscript();
    }
  };
  const srartListening = () => {
    SpeechRecognition.startListening();
  };

  // Start speech recognition when component mounts
  useEffect(() => {
    SpeechRecognition.startListening();
    handleSpeechRecognition();
  }, []);

  return (
    <DictationContext.Provider value={{ dictationData, updateDictationData }}>
      {children}
    </DictationContext.Provider>
  );
};

// Export the context and a custom hook to access the dictation state
export const useDictation = () => {
  const context = useContext(DictationContext);
  if (!context) {
    throw new Error("useDictation must be used within a DictationProvider");
  }
  return context;
};
