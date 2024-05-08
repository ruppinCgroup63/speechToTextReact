import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import React, { useState, useEffect } from "react";

const DictationToSection = () => {
  const {
    resetTranscript,
    listening,
    transcript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [keywords] = useState(["start", "end", "body", "stop"]);
  const [activeSection, setActiveSection] = useState("");
  const [transcribing, setTranscribing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [dictationFromTranscript, setDictationFromTranscript] = useState(""); // New state for the concatenated transcript
  //const [fullTranscript, setFullTranscript] = useState("");

  const startListening = () => {
    if (!listening) {
      SpeechRecognition.startListening({ continuous: true, language: "en" });
      setIsListening(true);
      //   setTranscribing(true);
    }
  };

  const stopListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
      //   setTranscribing(false);
      resetTranscript(); // Reset the transcript to an empty string
    }
  };
  // const handleTranscription = () => {
  // Concatenate the new transcript to the existing string

  // };

  useEffect(() => {
    if (transcript) {
      console.log(transcript);

      const foundKeyword = keywords.find((keyword) =>
        transcript.includes(keyword)
      );

      console.log(foundKeyword);

      if (foundKeyword) {
        setActiveSection(foundKeyword);
        if (foundKeyword === "stop" && transcribing) {
          setTranscribing(false);
          console.log(
            `Keyword Detected: ${foundKeyword} - Stopping transcription.`
          );
          //setIsListening(false);
        } else if (!transcribing && foundKeyword !== "stop") {
          setTranscribing(true);
          console.log(
            `Keyword Detected: ${foundKeyword} - Starting transcription.`
          );

          /* setFullTranscript(
            (prev) => `${prev} ${foundKeyword.toUpperCase()} \n`
          );
          //setIsListening(true);*/
        } else if (foundKeyword !== "stop" && transcribing) {
          console.log(
            `foundKeyword !== "stop" && transcribing - ${foundKeyword}`
          );
          setActiveSection(foundKeyword);
          setDictationFromTranscript((prev) => `${prev} ${transcript}`);
        }
      }
      // Call the function to handle the transcription
      //  handleTranscription(transcript);
    }
  }, [transcript, keywords, transcribing, activeSection, isListening]);

  if (!browserSupportsSpeechRecognition) {
    return <div>Browser doesn't support speech recognition.</div>;
  }

  return (
    <div>
      <div
        style={{
          margin: "10px",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <p>Microphone: {isListening ? "on" : "off"}</p>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "15px",
            justifyContent: "center",
          }}
        >
          <button onClick={startListening} disabled={isListening}>
            Start Listening
          </button>
          <button onClick={stopListening} disabled={!isListening}>
            Stop Listening
          </button>
        </div>
        <p>Transcript (Streaming):</p>

        <section
          id="start"
          style={{
            height: "33vh",
            width: "100%",
            maxWidth: "100%",
            border: "1px solid black",
          }}
        >
          {activeSection === "start" && transcribing && (
            <p>{dictationFromTranscript}</p>
          )}
        </section>

        <section
          id="body"
          style={{
            height: "33vh",
            width: "100%",
            maxWidth: "100%",
            border: "1px solid black",
          }}
        >
          {activeSection === "body" && transcribing && (
            <p>{dictationFromTranscript}</p>
          )}
        </section>

        <section
          id="end"
          style={{
            height: "33vh",
            width: "100%",
            maxWidth: "100%",
            border: "1px solid black",
          }}
        >
          {activeSection === "end" && transcribing && (
            <p>{dictationFromTranscript}</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default DictationToSection;
