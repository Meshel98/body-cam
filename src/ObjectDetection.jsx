// ObjectDetection.js
import React, { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import { motion } from "framer-motion";

const ObjectDetection = ({ webcamRef, canvasRef }) => {
  const [detections, setDetections] = useState([]);

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
      const persons = detectedObjects.filter(
        (detection) => detection.class === "person"
      );

      // Update state only if detections have changed
      if (JSON.stringify(persons) !== JSON.stringify(detections)) {
        setDetections(persons);
      }
    }
    requestAnimationFrame(() => detect(net)); // Run detect continuously
  };

  useEffect(() => {
    runCoco();
  }, []);

  return (
    <div>
      {detections.map((person, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: person.bbox[0], y: person.bbox[1] }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          style={{
            position: "absolute",
            border: "2px solid #00FF00",
            width: `${person.bbox[2]}px`,
            height: `${person.bbox[3]}px`,
            top: 0,
            left: 0,
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          {/* Display the label and confidence */}
          <span
            style={{
              color: "white",
              backgroundColor: "#00FF00",
              fontSize: "12px",
              padding: "2px",
            }}
          >
            {person.class} - {(person.score * 100).toFixed(2)}%
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default ObjectDetection;
