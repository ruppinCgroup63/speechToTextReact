import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import SpeechRecognitionComponent from "./SpeechRecognitionComponent";
//import { unstable_batchedUpdates } from "react-dom";

function Main() {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [activeComponent, setActiveComponent] = useState("");
  const [dictations, setDictations] = useState({
    apple: "",
    banana: "",
    orange: "",
  });

  const handleStartListening = () => {
    if (!listening) {
      SpeechRecognition.startListening({ continuous: true, language: "en-US" });
    }
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    setActiveComponent("");
  };

  useEffect(() => {
    // Only process if a keyword directly leads to a change
    if (transcript.toLowerCase().includes("stop") && activeComponent) {
      console.log("Stop recognized, pausing dictation for", activeComponent);
      setActiveComponent(""); // This will keep the dictation recorded under the last active component
      resetTranscript();
    } else {
      const keywords = ["apple", "banana", "orange"];
      const foundKeyword = keywords.find((keyword) =>
        transcript.toLowerCase().includes(keyword)
      );

      // Append transcript to active component or activate a new one if not currently dictating
      if (foundKeyword && !activeComponent) {
        console.log(
          `Keyword '${foundKeyword}' detected and set as active component.`
        );
        setActiveComponent(foundKeyword); // Initiate new active component
      }

      // This block runs whatever is the currently set active component
      if (activeComponent && dictations[activeComponent] !== undefined) {
        console.log(`Appending text to active component: ${activeComponent}`);
        setDictations((prevDictations) => ({
          ...prevDictations,
          [activeComponent]: prevDictations[activeComponent] + " " + transcript,
        }));
        resetTranscript(); // Clears the transcript after updating the state
      }
    }
  }, [transcript]);

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
      {["apple", "banana", "orange"].map((keyword) => (
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
