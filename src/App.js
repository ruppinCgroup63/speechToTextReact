import "./App.css";

//import Dictaphone from "./Dictaphone";
//import DictationToSection from "./DictationToSection";
//import Shay from "./Shay";
import Main from "./Main";
//import Main1 from "./Main1";
//import TestSpeechRecognition from "./TestSpeechRecognition";
import SpeechRecognition from "react-speech-recognition";
import { useSpeechRecognition } from "react-speech-recognition";

import React from "react";
import { DictationProvider, useDictation } from "./DictationContext";

const DictationComponent = () => {
  const { dictationData } = useDictation();

  return (
    <div>
      <h1>Dictation Data: {dictationData}</h1>
    </div>
  );
};

const App = () => {
  return (
    <DictationProvider>
      <DictationComponent />
    </DictationProvider>
  );
};

export default App;
