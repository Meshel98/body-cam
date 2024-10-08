import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import { drawRect } from "./utilities";
import "./App.css";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [detections, setDetections] = useState([]);
  const [bullets, setBullets] = useState(10); // State to hold remaining bullets
  const audioRef = useRef(null); // Create audio reference

  // Main function to run COCO-SSD
  const runCoco = async () => {
    const net = await cocossd.load();
    console.log("COCO-SSD model loaded.");
    detect(net);
  };

  // Detect objects function
  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;

      // Get video properties
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // Set video width and height
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas width and height to match video
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make detections
      const detectedObjects = await net.detect(video);

      // Filter for persons only
      const persons = detectedObjects.filter((detection) => detection.class === "person");

      // Update state only if detections have changed
      if (JSON.stringify(persons) !== JSON.stringify(detections)) {
        setDetections(persons);
      }

      // Draw detection results on canvas
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Clear previous drawings
      drawRect(persons, ctx, videoWidth, videoHeight); // Draw bounding boxes
    }
    requestAnimationFrame(() => detect(net)); // Run detect continuously
  };

  useEffect(() => {
    runCoco();
    // Initialize the audio reference with the shooting sound
    audioRef.current = new Audio(`/shoot.wav`); // Updated path for Vite
  }, []);

  // Function to handle shooting
  const handleShoot = () => {
    if (bullets > 0) {
      setBullets((prevBullets) => prevBullets - 1);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play(); // Play shooting sound
      }
    } else {
      alert("No bullets left! Click 'Reload' to reload.");
    }
  };

  // Function to reload bullets
  const reload = () => {
    setBullets(10);
  };

  return (
    <div
      className="App"
      style={{
        margin: 0,
        padding: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
      onClick={handleShoot} // Add click event for shooting
    >
      <header
        className="App-header"
        style={{ width: "100vw", height: "100vh", margin: 0, padding: 0 }}
      >
        {/* Webcam Feed */}
        <Webcam
          ref={webcamRef}
          muted={true}
          videoConstraints={{ facingMode: { exact: "environment" } }} // Use back camera
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 9,
          }}
        />

        {/* Canvas Overlay for Bounding Boxes */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 10,
            pointerEvents: "none",
          }}
        />

        {/* Central Crosshair */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 11,
            color: "red",
            fontSize: "24px",
          }}
        >
          +
        </div>

        {/* Bullet Counter */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 12,
            color: "white",
            fontSize: "24px",
          }}
        >
          Bullets: {bullets}
        </div>

        {/* Reload Button */}
        <button
          onClick={reload}
          style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            zIndex: 12,
            backgroundColor: "red",
            color: "white",
            fontSize: "18px",
            border: "none",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Reload
        </button>
      </header>
    </div>
  );
}

export default App;
