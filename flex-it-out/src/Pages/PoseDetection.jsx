import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs"; // TensorFlow.js
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl"; // WebGL Backend
import "./PoseDetection.css"; // Import Styles

const PoseDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [squatCount, setSquatCount] = useState(0);
  let isSquatting = false;

  useEffect(() => {
    const initializeTF = async () => {
      await tf.setBackend("webgl");
      await tf.ready();
      console.log("✅ TensorFlow.js is ready!");
      startPoseDetection();
    };

    const startPoseDetection = async () => {
      try {
        setLoading(true);
        const video = videoRef.current;
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        await new Promise((resolve) => (video.onloadedmetadata = resolve));
        video.play();
        console.log("🎥 Camera Started");

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
      drawResults(poses);

      if (poses.length > 0) {
        detectSquat(poses[0].keypoints);
      }

      requestAnimationFrame(() => detect(detector));
    };

    initializeTF();
  }, []);

  // ✅ Function to Calculate Knee Angle
  const calculateAngle = (A, B, C) => {
    const AB = Math.sqrt((B.x - A.x) * 2 + (B.y - A.y) * 2);
    const BC = Math.sqrt((B.x - C.x) * 2 + (B.y - C.y) * 2);
    const AC = Math.sqrt((C.x - A.x) * 2 + (C.y - A.y) * 2);

    const radians = Math.acos((AB * 2 + BC * 2 - AC ** 2) / (2 * AB * BC));
    return (radians * 180) / Math.PI; // Convert to degrees
  };

  // ✅ Function to Detect Squats
  const detectSquat = (keypoints) => {
    const hip = keypoints.find((kp) => kp.name === "left_hip") || {};
    const knee = keypoints.find((kp) => kp.name === "left_knee") || {};
    const ankle = keypoints.find((kp) => kp.name === "left_ankle") || {};

    if (hip.score > 0.5 && knee.score > 0.5 && ankle.score > 0.5) {
      const kneeAngle = calculateAngle(hip, knee, ankle);
      console.log("Knee Angle:", kneeAngle);

      if (kneeAngle < 90 && !isSquatting) {
        isSquatting = true;
      } else if (kneeAngle > 160 && isSquatting) {
        setSquatCount((prev) => prev + 1);
        isSquatting = false;
        console.log("🔥 Squat Count:", squatCount);
      }
    }
  };

  // ✅ Function to Draw Keypoints & Skeleton
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

      <h2>Squats: {squatCount}</h2>

      <div className="video-container">
        <video ref={videoRef} className="video" />
        <canvas ref={canvasRef} className="canvas" width="640" height="480" />
      </div>

      <p className="loading-text">AI is analyzing your movement...</p>
    </div>
  );
};

export default PoseDetection;