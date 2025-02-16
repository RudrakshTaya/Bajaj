// import React, { useEffect, useRef, useState } from "react";
// import * as tf from "@tensorflow/tfjs"; // TensorFlow.js
// import * as poseDetection from "@tensorflow-models/pose-detection";
// import "@tensorflow/tfjs-backend-webgl"; // WebGL Backend
// import "./PoseDetection.css"; // Import Styles

// const PoseDetection = () => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [loading, setLoading] = useState(true);
//   const [squatCount, setSquatCount] = useState(0);
//   const [pushupCount, setPushupCount] = useState(0);
//   const [highKneeCount, setHighKneeCount] = useState(0);

//   let isSquatting = false;
//   let isPushingUp = false;
//   let isRaisingKnee = false;

//   useEffect(() => {
//     const initializeTF = async () => {
//       await tf.setBackend("webgl");
//       await tf.ready();
//       console.log("✅ TensorFlow.js is ready!");
//       startPoseDetection();
//     };

//     const startPoseDetection = async () => {
//       try {
//         setLoading(true);
//         const video = videoRef.current;
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         video.srcObject = stream;
//         await new Promise((resolve) => (video.onloadedmetadata = resolve));
//         video.play();
//         console.log("🎥 Camera Started");

//         const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet);
//         console.log("✅ MoveNet Model Loaded");

//         setLoading(false);
//         detect(detector);
//       } catch (error) {
//         console.error("🚨 Error Starting Pose Detection:", error);
//       }
//     };

//     const detect = async (detector) => {
//       if (!videoRef.current || !canvasRef.current) return;

//       const poses = await detector.estimatePoses(videoRef.current);
//       drawResults(poses);

//       if (poses.length > 0) {
//         detectSquat(poses[0].keypoints);
//         detectPushup(poses[0].keypoints);
//         detectHighKnees(poses[0].keypoints);
//       }

//       requestAnimationFrame(() => detect(detector));
//     };

//     initializeTF();
//   }, []);

//   const calculateAngle = (A, B, C) => {
//     const AB = Math.sqrt((B.x - A.x) ** 2 + (B.y - A.y) ** 2);
//     const BC = Math.sqrt((B.x - C.x) ** 2 + (B.y - C.y) ** 2);
//     const AC = Math.sqrt((C.x - A.x) ** 2 + (C.y - A.y) ** 2);

//     const radians = Math.acos((AB ** 2 + BC ** 2 - AC ** 2) / (2 * AB * BC));
//     return (radians * 180) / Math.PI; // Convert to degrees
//   };

//   const detectSquat = (keypoints) => {
//     const hip = keypoints.find((kp) => kp.name === "left_hip") || {};
//     const knee = keypoints.find((kp) => kp.name === "left_knee") || {};
//     const ankle = keypoints.find((kp) => kp.name === "left_ankle") || {};

//     if (hip.score > 0.5 && knee.score > 0.5 && ankle.score > 0.5) {
//       const kneeAngle = calculateAngle(hip, knee, ankle);
//       if (kneeAngle < 90 && !isSquatting) {
//         isSquatting = true;
//       } else if (kneeAngle > 160 && isSquatting) {
//         setSquatCount((prev) => prev + 1);
//         isSquatting = false;
//       }
//     }
//   };

//   const detectPushup = (keypoints) => {
//     const shoulder = keypoints.find((kp) => kp.name === "left_shoulder") || {};
//     const elbow = keypoints.find((kp) => kp.name === "left_elbow") || {};
//     const wrist = keypoints.find((kp) => kp.name === "left_wrist") || {};

//     if (shoulder.score > 0.5 && elbow.score > 0.5 && wrist.score > 0.5) {
//       const elbowAngle = calculateAngle(shoulder, elbow, wrist);
//       if (elbowAngle < 90 && !isPushingUp) {
//         isPushingUp = true;
//       } else if (elbowAngle > 160 && isPushingUp) {
//         setPushupCount((prev) => prev + 1);
//         isPushingUp = false;
//       }
//     }
//   };

//   const detectHighKnees = (keypoints) => {
//     const leftHip = keypoints.find((kp) => kp.name === "left_hip") || {};
//     const rightHip = keypoints.find((kp) => kp.name === "right_hip") || {};
//     const leftKnee = keypoints.find((kp) => kp.name === "left_knee") || {};
//     const rightKnee = keypoints.find((kp) => kp.name === "right_knee") || {};

//     if (
//       leftHip.score > 0.5 &&
//       rightHip.score > 0.5 &&
//       leftKnee.score > 0.5 &&
//       rightKnee.score > 0.5
//     ) {
//       if ((leftKnee.y < leftHip.y || rightKnee.y < rightHip.y) && !isRaisingKnee) {
//         setHighKneeCount((prev) => prev + 1);
//         isRaisingKnee = true;
//       } else if (leftKnee.y > leftHip.y && rightKnee.y > rightHip.y) {
//         isRaisingKnee = false;
//       }
//     }
//   };

//   const drawResults = (poses) => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     poses.forEach((pose) => {
//       drawKeypoints(pose.keypoints, ctx);
//       drawSkeleton(pose.keypoints, ctx);
//     });
//   };

//   const drawKeypoints = (keypoints, ctx) => {
//     keypoints.forEach(({ x, y, score }) => {
//       if (score > 0.5) {
//         ctx.fillStyle = "red";
//         ctx.beginPath();
//         ctx.arc(x, y, 6, 0, 2 * Math.PI);
//         ctx.fill();
//       }
//     });
//   };

//   const drawSkeleton = (keypoints, ctx) => {
//     const adjacentPairs = poseDetection.util.getAdjacentPairs(poseDetection.SupportedModels.MoveNet);
//     ctx.strokeStyle = "blue";
//     ctx.lineWidth = 3;

//     adjacentPairs.forEach(([i, j]) => {
//       const kp1 = keypoints[i];
//       const kp2 = keypoints[j];

//       if (kp1?.score > 0.5 && kp2?.score > 0.5) {
//         ctx.beginPath();
//         ctx.moveTo(kp1.x, kp1.y);
//         ctx.lineTo(kp2.x, kp2.y);
//         ctx.stroke();
//       }
//     });
//   };

//   return (
//     <div className="pose-container">
//       <header className="pose-header">
//         <h1>Pose Detection</h1>
//       </header>

//       <div className="main-content">
//         <div className="stats-container">
//           <h2>🔥 Squats: {squatCount}</h2>
//           <h2>💪 Push-ups: {pushupCount}</h2>
//           <h2>🏃 High Knees: {highKneeCount}</h2>
//         </div>

//         <div className="video-container">
//           <video ref={videoRef} className="video" />
//           <canvas ref={canvasRef} className="canvas" width="640" height="480" />
//         </div>
//       </div>

//       {loading && <p className="loading-text">Loading AI Model...</p>}
//     </div>
//   );
// };

// export default PoseDetection;

import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import "./PoseDetection.css";

const PoseDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [squatCount, setSquatCount] = useState(0);
  const [pushupCount, setPushupCount] = useState(0);
  const [highKneeCount, setHighKneeCount] = useState(0);
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);

  let isSquatting = false;
  let isPushingUp = false;
  let isRaisingKnee = false;
  let lastKneeRaiseTime = 0; // Track the last time a high knee was detected
  let detector;

  useEffect(() => {
    const initializeTF = async () => {
      try {
        await tf.setBackend("webgl");
        await tf.ready();
        console.log("✅ TensorFlow.js is ready!");
        startPoseDetection();
      } catch (error) {
        console.error("🚨 Error initializing TensorFlow:", error);
        setLoading(false);
      }
    };

    const startPoseDetection = async () => {
      try {
        const video = videoRef.current;
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        await new Promise((resolve) => (video.onloadedmetadata = resolve));
        video.play();
        console.log("🎥 Camera Started");

        detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet);
        console.log("✅ MoveNet Model Loaded");

        setLoading(false);
        detectPoses(detector);
      } catch (error) {
        console.error("🚨 Error starting pose detection:", error);
        setLoading(false);
      }
    };

    const detectPoses = async (detector) => {
      if (!videoRef.current || !canvasRef.current) return;

      const poses = await detector.estimatePoses(videoRef.current);
      if (poses.length > 0) {
        const keypoints = poses[0].keypoints;
        detectSquat(keypoints);
        detectPushup(keypoints);
        detectHighKnees(keypoints);
        provideFeedback(keypoints);
        drawKeypointsAndSkeleton(keypoints);
      }

      requestAnimationFrame(() => detectPoses(detector));
    };

    initializeTF();

    // Cleanup on unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (detector) {
        detector.dispose();
      }
    };
  }, []);

  const calculateAngle = (A, B, C) => {
    const AB = Math.sqrt((B.x - A.x) ** 2 + (B.y - A.y) ** 2);
    const BC = Math.sqrt((B.x - C.x) ** 2 + (B.y - C.y) ** 2);
    const AC = Math.sqrt((C.x - A.x) ** 2 + (C.y - A.y) ** 2);
    const radians = Math.acos((AB ** 2 + BC ** 2 - AC ** 2) / (2 * AB * BC));
    return (radians * 180) / Math.PI;
  };

  const updateScore = (exercise) => {
    const points = { squat: 5, pushup: 8, highKnee: 3 };
    setScore((prev) => prev + points[exercise]);
  };

  const detectSquat = (keypoints) => {
    const hip = keypoints.find((kp) => kp.name === "left_hip" && kp.score > 0.5);
    const knee = keypoints.find((kp) => kp.name === "left_knee" && kp.score > 0.5);
    const ankle = keypoints.find((kp) => kp.name === "left_ankle" && kp.score > 0.5);

    if (hip && knee && ankle) {
      const kneeAngle = calculateAngle(hip, knee, ankle);
      const hipHeight = hip.y;
      const kneeHeight = knee.y;

      // Squat detection logic
      if (kneeAngle < 90 && hipHeight > kneeHeight && !isSquatting) {
        isSquatting = true;
      } else if (kneeAngle > 160 && hipHeight < kneeHeight && isSquatting) {
        setSquatCount((prev) => prev + 1);
        updateScore("squat");
        isSquatting = false;
      }
    }
  };

  const detectPushup = (keypoints) => {
    const shoulder = keypoints.find((kp) => kp.name === "left_shoulder" && kp.score > 0.5);
    const elbow = keypoints.find((kp) => kp.name === "left_elbow" && kp.score > 0.5);
    const wrist = keypoints.find((kp) => kp.name === "left_wrist" && kp.score > 0.5);

    if (shoulder && elbow && wrist) {
      const elbowAngle = calculateAngle(shoulder, elbow, wrist);
      if (elbowAngle < 90 && !isPushingUp) {
        isPushingUp = true;
      } else if (elbowAngle > 160 && isPushingUp) {
        setPushupCount((prev) => prev + 1);
        updateScore("pushup");
        isPushingUp = false;
      }
    }
  };

  const detectHighKnees = (keypoints) => {
    const hip = keypoints.find((kp) => kp.name === "left_hip" && kp.score > 0.5);
    const knee = keypoints.find((kp) => kp.name === "left_knee" && kp.score > 0.5);

    if (hip && knee) {
      const kneeHeight = knee.y;
      const hipHeight = hip.y;

      // High knee detection logic
      if (kneeHeight < hipHeight && !isRaisingKnee) {
        isRaisingKnee = true;
        lastKneeRaiseTime = Date.now(); // Record the time when the knee is raised
      } else if (kneeHeight > hipHeight && isRaisingKnee) {
        // Check if the knee was raised for at least 300ms to avoid false positives
        if (Date.now() - lastKneeRaiseTime > 300) {
          setHighKneeCount((prev) => prev + 1);
          updateScore("highKnee");
          isRaisingKnee = false;
        }
      }
    }
  };

  const provideFeedback = (keypoints) => {
    const leftShoulder = keypoints.find((kp) => kp.name === "left_shoulder" && kp.score > 0.5);
    const rightShoulder = keypoints.find((kp) => kp.name === "right_shoulder" && kp.score > 0.5);
    const leftKnee = keypoints.find((kp) => kp.name === "left_knee" && kp.score > 0.5);
    const rightKnee = keypoints.find((kp) => kp.name === "right_knee" && kp.score > 0.5);

    if (leftShoulder && rightShoulder && leftKnee && rightKnee) {
      if (leftShoulder.y > leftKnee.y || rightShoulder.y > rightKnee.y) {
        speakText("Keep your back straight!");
      }
    }
  };

  const speakText = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };

  const drawKeypointsAndSkeleton = (keypoints) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw keypoints
    keypoints.forEach((kp) => {
      if (kp.score > 0.5) {
        ctx.beginPath();
        ctx.arc(kp.x, kp.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
      }
    });

    // Highlight keypoints for squats and high knees
    const hip = keypoints.find((kp) => kp.name === "left_hip" && kp.score > 0.5);
    const knee = keypoints.find((kp) => kp.name === "left_knee" && kp.score > 0.5);
    const ankle = keypoints.find((kp) => kp.name === "left_ankle" && kp.score > 0.5);

    if (hip && knee && ankle) {
      ctx.beginPath();
      ctx.moveTo(hip.x, hip.y);
      ctx.lineTo(knee.x, knee.y);
      ctx.lineTo(ankle.x, ankle.y);
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  return (
    <div className="pose-container">
      <header className="pose-header">
        <h1>Pose Detection 🏋️</h1>
      </header>

      <div className="stats-container">
        <h2>🔥 Squats: {squatCount}</h2>
        <h2>💪 Push-ups: {pushupCount}</h2>
        <h2>🏃 High Knees: {highKneeCount}</h2>
        <h2>🎯 Score: {score}</h2>
      </div>

      <div className="video-container">
        <video ref={videoRef} className="video" />
        <canvas ref={canvasRef} className="canvas" width="640" height="480" />
      </div>

      {loading && <p className="loading-text">⏳ Loading AI Model...</p>}

      <div className="leaderboard">
        <h2>🏆 Leaderboard</h2>
        {leaderboard.map((entry, index) => (
          <p key={index}>{entry.name}: {entry.score} pts</p>
        ))}
      </div>
    </div>
  );
};

export default PoseDetection;