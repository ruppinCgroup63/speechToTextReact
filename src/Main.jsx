import React, { cloneElement, useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import SpeechRecognitionComponent from "./SpeechRecognitionComponent";
import { isLabelWithInternallyDisabledControl } from "@testing-library/user-event/dist/utils";

function Main() {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [activeComponent, setActiveComponent] = useState("");
  const [isOn, setIsOn] = useState(false);
  const [dictations, setDictations] = useState({
    apple: "",
    banana: "",
    orange: "",
  });
  const keywords = Object.keys(dictations);

  const handleStartListening = () => {
    if (!listening) {
      SpeechRecognition.startListening({ continuous: true, language: "en-US" });
      console.log("Started listening...");
    }
  };

  const handleStopListening = () => {
    console.log("Stopped listening...");
    SpeechRecognition.stopListening();
    setActiveComponent("");
  };

  // const handleDictationToActiveSection = (keyword) => {
  //   resetTranscript();
  //   console.log(`Detected keyword: ${foundKeyword}`);
  //   setActiveComponent(foundKeyword);
  // };
  useEffect(() => {
    console.log(`Current Transcript: ${transcript}`);

    if (transcript.toLowerCase().trim().endsWith("stop")) {
      handleStopCommand();
    } else {
      handleTranscriptKeywords();
    }
  }, [transcript]);

  // Handles stop command logic
  const handleStopCommand = () => {
    console.log(
      "Stop command processed.\nLast active component was: ",
      activeComponent,
      "\nResetting transcription."
    );
    setIsOn(false);
    setActiveComponent("");
    resetTranscript();
  };

  // Handles keyword recognition and dictation assignment
  const handleTranscriptKeywords = () => {
    let foundKeyword = keywords.find((keyword) =>
      transcript.toLowerCase().includes(keyword)
    );

    if (foundKeyword && !isOn) {
      console.log(`Detected keyword: ${foundKeyword}`);
      setIsOn(true);
      setActiveComponent(foundKeyword);
    }

    if (activeComponent && isOn) {
      console.log(`Adding transcript to active component '${activeComponent}'`);
      setDictations((prevDictations) => ({
        ...prevDictations,
        [activeComponent]: prevDictations[activeComponent] + " " + transcript,
      }));
      resetTranscript();
    }
  };

  // Use useEffect to monitor isOn changes
  useEffect(() => {
    console.log("isOn has changed to: ", isOn);
    if (!isOn) {
      // Potentially handle logic only applicable when isOn toggles to false
    }
  }, [isOn]);

  return (
    <div>
      <h1>Main Component</h1>
      <button onClick={handleStartListening}>Start Listening</button>
      <button onClick={handleStopListening}>Stop Listening</button>
      <div>
        <p>Active Component: {activeComponent || "None"}</p>
        {listening && <p>Dictation is ON</p>}
      </div>
      <hr />
      {keywords.map((keyword) => (
        <SpeechRecognitionComponent
          key={keyword}
          active={activeComponent === keyword}
          keyword={keyword}
          dictation={dictations[keyword]}
        />
      ))}
    </div>
  );
}

export default Main;
