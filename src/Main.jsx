import { useSpeechRecognition } from "react-speech-recognition";
import SpeechRecognitionComponent from "./SpeechRecognitionComponent";
import SpeechRecognition from "react-speech-recognition";
import { useState, useEffect } from "react";

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
      console.log("Started listening...");
    }
  };

  const handleStopListening = () => {
    console.log("Stopped listening...");
    SpeechRecognition.stopListening();
    setActiveComponent("");
  };

  // Function to copy the transcript to clipboard
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(transcript)
      .then(() => {
        console.log("Transcript copied to clipboard!");
        // Optionally, you can show a success message or perform other actions.
      })
      .catch((err) => {
        console.error("Failed to copy transcript: ", err);
      });
  };

  useEffect(() => {
    console.log(`Current Transcript: ${transcript}`);

    if (transcript.toLowerCase().includes("stop")) {
      console.log("Stop command processed, clearing active component.");
      setActiveComponent("");
      resetTranscript();
    } else {
      const keywords = ["apple", "banana", "orange"];
      let foundKeyword = keywords.find((keyword) =>
        transcript.toLowerCase().includes(keyword)
      );

      if (foundKeyword) {
        console.log(`Detected keyword: ${foundKeyword}`);
        setActiveComponent(foundKeyword);
        if (!dictations[foundKeyword]) {
          console.log(
            "Keyword found, but no dictation exists for it, starting new..."
          );
          setDictations((prev) => ({
            ...prev,
            [foundKeyword]: transcript,
          }));
          resetTranscript();
        }
      }

      if (activeComponent) {
        console.log(
          `Adding transcript to active component '${activeComponent}'`
        );
        setDictations((prevDictations) => ({
          ...prevDictations,
          [activeComponent]: prevDictations[activeComponent] + " " + transcript,
        }));
        resetTranscript(); // Consider the effect of resetting here
      }
    }
  }, [transcript]); // Listen to transcript changes only

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
