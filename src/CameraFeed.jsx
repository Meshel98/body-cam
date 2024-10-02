// CameraFeed.js
import React from "react";
import Webcam from "react-webcam";

const CameraFeed = ({ webcamRef, canvasRef }) => {
  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
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
    </div>
  );
};

export default CameraFeed;
