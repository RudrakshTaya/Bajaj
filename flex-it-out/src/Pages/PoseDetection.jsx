import React, { useEffect, useRef } from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs";

const PoseDetection = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const setupCamera = async () => {
      const video = videoRef.current;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      video.srcObject = stream;
      video.play();
    };

    const runPoseDetection = async () => {
      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet
      );

      const detect = async () => {
        if (!videoRef.current) return;
        const poses = await detector.estimatePoses(videoRef.current);
        console.log(poses); // ✅ Logs pose data
        requestAnimationFrame(detect);
      };
      
      detect();
    };

    setupCamera().then(runPoseDetection);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Pose Detection</h1>
      <video ref={videoRef} className="border-2 border-blue-500 w-96 h-64" />
      <p className="text-xl font-bold mt-2">AI is analyzing your movement...</p>
    </div>
  );
};

export default PoseDetection;
