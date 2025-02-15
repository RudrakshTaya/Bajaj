import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs"; // Import TensorFlow.js
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl"; // Ensure WebGL is loaded
import "./PoseDetection.css";

const PoseDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeTF = async () => {
      await tf.setBackend("webgl"); // ✅ Set Backend to WebGL
      await tf.ready(); // ✅ Wait for TensorFlow to be Ready
      console.log("✅ TensorFlow.js is ready!");
      startPoseDetection();
    };

    const startPoseDetection = async () => {
      try {
        setLoading(true);

        // ✅ Setup Camera
        const video = videoRef.current;
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        await new Promise((resolve) => (video.onloadedmetadata = resolve));
        video.play();
        console.log("🎥 Camera Started");

        // ✅ Load MoveNet Model
        const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet);
        console.log("✅ MoveNet Model Loaded");

        setLoading(false);
        detect(detector);
      } catch (error) {
        console.error("🚨 Error Starting Pose Detection:", error);
      }
    };

    const detect = async (detector) => {
      if (!videoRef.current || !canvasRef.current) return;

      const poses = await detector.estimatePoses(videoRef.current);
      console.log("Detected Poses:", poses);

      drawResults(poses);
      requestAnimationFrame(() => detect(detector));
    };

    initializeTF();
  }, []);

  const drawResults = (poses) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    poses.forEach((pose) => {
      drawKeypoints(pose.keypoints, ctx);
      drawSkeleton(pose.keypoints, ctx);
    });
  };

  const drawKeypoints = (keypoints, ctx) => {
    keypoints.forEach(({ x, y, score }) => {
      if (score > 0.5) {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
  };

  const drawSkeleton = (keypoints, ctx) => {
    const adjacentPairs = poseDetection.util.getAdjacentPairs(poseDetection.SupportedModels.MoveNet);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 3;

    adjacentPairs.forEach(([i, j]) => {
      const kp1 = keypoints[i];
      const kp2 = keypoints[j];

      if (kp1?.score > 0.5 && kp2?.score > 0.5) {
        ctx.beginPath();
        ctx.moveTo(kp1.x, kp1.y);
        ctx.lineTo(kp2.x, kp2.y);
        ctx.stroke();
      }
    });
  };

  return (
    <div className="pose-container">
      <h1>Pose Detection</h1>

      {loading && <p>Loading AI Model...</p>}

      <div className="video-container">
        <video ref={videoRef} className="video" />
        <canvas ref={canvasRef} className="canvas" width="640" height="480" />
      </div>

      <p>AI is analyzing your movement...</p>
    </div>
  );
};

export default PoseDetection;