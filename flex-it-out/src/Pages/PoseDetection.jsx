import React, { useEffect, useRef, useState } from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs";
import "./PoseDetection.css";

const PoseDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true); // ✅ Loading State

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const video = videoRef.current;
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.play();
      } catch (error) {
        console.error("Camera access denied:", error);
      }
    };

    const runPoseDetection = async () => {
      setLoading(true); // Show loading
      const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet);
      setLoading(false); // Hide loading when model is ready

      const detect = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const poses = await detector.estimatePoses(videoRef.current);
        drawResults(poses); // Draw Keypoints

        requestAnimationFrame(detect);
      };

      detect();
    };

    setupCamera().then(runPoseDetection);
  }, []);

  // 🎨 Draw Keypoints & Skeleton
  const drawResults = (poses) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    poses.forEach(pose => {
      drawKeypoints(pose.keypoints, ctx);
      drawSkeleton(pose.keypoints, ctx);
    });
  };

  // ✅ Draw Keypoints
  const drawKeypoints = (keypoints, ctx) => {
    keypoints.forEach(point => {
      if (point.score > 0.5) {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
  };

  // ✅ Draw Skeleton
  const drawSkeleton = (keypoints, ctx) => {
    const adjacentPairs = poseDetection.util.getAdjacentPairs(poseDetection.SupportedModels.MoveNet);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 3;

    adjacentPairs.forEach(([i, j]) => {
      const kp1 = keypoints[i];
      const kp2 = keypoints[j];

      if (kp1.score > 0.5 && kp2.score > 0.5) {
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
      
      {loading && <p>Loading AI Model...</p>} {/* ✅ Show loading */}

      <div className="video-container">
        <video ref={videoRef} className="video" />
        <canvas ref={canvasRef} className="canvas" />
      </div>

      <p>AI is analyzing your movement...</p>
    </div>
  );
};

export default PoseDetection;