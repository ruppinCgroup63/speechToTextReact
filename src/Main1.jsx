import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import SpeechRecognitionComponent from "./SpeechRecognitionComponent";

function Main1() {
  const [dictations, setDictations] = useState(
    {
      apple: "",
      message: "",
    },
    { banana: "", message: "" },
    {
      orange: "",
      message: "",
    }
  );

  const [activeComponent, setActiveComponent] = useState("");

  const commands = [
    {
      command: "stop",
      callback: () => {
        console.log("Stop command recognized.");
        setActiveComponent("");
      },
    },
    {
      command: ["apple", "banana", "orange"],
      callback: (command) => {
        console.log(`Command recognized: ${command}`);
        setActiveComponent(command);
      },
    },
  ];

  const { transcript, resetTranscript } = useSpeechRecognition({ commands });

  const handleStartListening = () => {
    console.log("Starting listening...");
    SpeechRecognition.startListening({ continuous: true, language: "en-US" });
  };

  useEffect(() => {
    console.log(`Transcript updated: ${transcript}`);
    if (activeComponent && transcript) {
      setDictations((prevDictations) => ({
        ...prevDictations,
        [activeComponent]:
          `${prevDictations[activeComponent]} ${transcript}`.trim(),
      }));
      resetTranscript();
    }
  }, [transcript, activeComponent]);

  return (
    <div>
      <h1>Main Component</h1>
      <button onClick={handleStartListening}>Start Listening</button>
      <button onClick={SpeechRecognition.stopListening}>Stop Listening</button>
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

export default Main1;
