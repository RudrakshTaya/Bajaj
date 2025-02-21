// import React, { useEffect, useRef, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import * as tf from "@tensorflow/tfjs";
// import * as poseDetection from "@tensorflow-models/pose-detection";
// import "@tensorflow/tfjs-backend-webgl";
// import "./PoseDetection.css";

// const PoseDetection = () => {
//   const { exerciseId } = useParams();
//   const navigate = useNavigate();
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [loading, setLoading] = useState(true);
//   const [reps, setReps] = useState(0);
//   const [score, setScore] = useState(0);

//   let isSquatting = false;
//   let isPushingUp = false;
//   let isRaisingKnee = false;
//   let lastKneeRaiseTime = 0;
//   let detector;

//   useEffect(() => {
//     const initializeTF = async () => {
//       try {
//         await tf.setBackend("webgl");
//         await tf.ready();
//         console.log("✅ TensorFlow.js is ready!");
//         startPoseDetection();
//       } catch (error) {
//         console.error("🚨 Error initializing TensorFlow:", error);
//         setLoading(false);
//       }
//     };

//     const startPoseDetection = async () => {
//       try {
//         const video = videoRef.current;
//         if (!video) return;
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         video.srcObject = stream;
//         await new Promise((resolve) => (video.onloadedmetadata = resolve));
//         video.play();
//         console.log("🎥 Camera Started");

//         detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet);
//         console.log("✅ MoveNet Model Loaded");

//         setLoading(false);
//         detectPoses(detector);
//       } catch (error) {
//         console.error("🚨 Error starting pose detection:", error);
//         setLoading(false);
//       }
//     };

//     const detectPoses = async (detector) => {
//       if (!videoRef.current || !canvasRef.current) return;

//       const poses = await detector.estimatePoses(videoRef.current);
//       if (poses.length > 0) {
//         const keypoints = poses[0].keypoints;
//         if (exerciseId === "squat") {
//           detectSquat(keypoints);
//         } else if (exerciseId === "pushup") {
//           detectPushup(keypoints);
//         } else if (exerciseId === "highKnee") {
//           detectHighKnees(keypoints);
//         }
//         else if(exerciseId === "lunges") {
//           detectLunges(keypoints);
//         }
        
//         provideFeedback(keypoints);
//         drawKeypointsAndSkeleton(keypoints);
//       }

//       requestAnimationFrame(() => detectPoses(detector));
//     };

//     initializeTF();

//     return () => {
//       if (videoRef.current && videoRef.current.srcObject) {
//         videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
//       }
//       if (detector) {
//         detector.dispose();
//       }
//     };
//   }, [exerciseId]);

//   const calculateAngle = (A, B, C) => {
//     const AB = Math.sqrt((B.x - A.x) ** 2 + (B.y - A.y) ** 2);
//     const BC = Math.sqrt((B.x - C.x) ** 2 + (B.y - C.y) ** 2);
//     const AC = Math.sqrt((C.x - A.x) ** 2 + (C.y - A.y) ** 2);
//     const radians = Math.acos((AB ** 2 + BC ** 2 - AC ** 2) / (2 * AB * BC));
//     return (radians * 180) / Math.PI;
//   };

//   const updateScore = () => {
//     const points = { squat: 5, pushup: 8, highKnee: 3, lunges: 6 };
//     setScore((prev) => prev + points[exerciseId]);
//   };  

//   const detectSquat = (keypoints) => {
//     const hip = keypoints.find((kp) => kp.name === "left_hip" && kp.score > 0.5);
//     const knee = keypoints.find((kp) => kp.name === "left_knee" && kp.score > 0.5);
//     const ankle = keypoints.find((kp) => kp.name === "left_ankle" && kp.score > 0.5);

//     if (hip && knee && ankle) {
//       const kneeAngle = calculateAngle(hip, knee, ankle);
//       const hipHeight = hip.y;
//       const kneeHeight = knee.y;

//       // Squat detection logic
//       if (kneeAngle < 90 && hipHeight > kneeHeight && !isSquatting) {
//         isSquatting = true;
//       } else if (kneeAngle > 160 && hipHeight < kneeHeight && isSquatting) {
//         setReps((prev) => prev + 1);
//         updateScore();
//         isSquatting = false;
//       }
//     }
//   };

//   const detectPushup = (keypoints) => {
//     const shoulder = keypoints.find((kp) => kp.name === "left_shoulder" && kp.score > 0.5);
//     const elbow = keypoints.find((kp) => kp.name === "left_elbow" && kp.score > 0.5);
//     const wrist = keypoints.find((kp) => kp.name === "left_wrist" && kp.score > 0.5);

//     if (shoulder && elbow && wrist) {
//       const elbowAngle = calculateAngle(shoulder, elbow, wrist);
//       if (elbowAngle < 90 && !isPushingUp) {
//         isPushingUp = true;
//       } else if (elbowAngle > 160 && isPushingUp) {
//         setReps((prev) => prev + 1);
//         updateScore();
//         isPushingUp = false;
//       }
//     }
//   };

//   const detectHighKnees = (keypoints) => {
//     const hip = keypoints.find((kp) => kp.name === "left_hip" && kp.score > 0.5);
//     const knee = keypoints.find((kp) => kp.name === "left_knee" && kp.score > 0.5);

//     if (hip && knee) {
//       const kneeHeight = knee.y;
//       const hipHeight = hip.y;

//       // High knee detection logic
//       if (kneeHeight < hipHeight && !isRaisingKnee) {
//         isRaisingKnee = true;
//         lastKneeRaiseTime = Date.now();
//       } else if (kneeHeight > hipHeight && isRaisingKnee) {
//         if (Date.now() - lastKneeRaiseTime > 300) {
//           setReps((prev) => prev + 1);
//           updateScore();
//           isRaisingKnee = false;
//         }
//       }
//     }
//   };

//   const detectLunges = (keypoints) => {
//     const leftHip = keypoints.find((kp) => kp.name === "left_hip" && kp.score > 0.5);
//     const leftKnee = keypoints.find((kp) => kp.name === "left_knee" && kp.score > 0.5);
//     const leftAnkle = keypoints.find((kp) => kp.name === "left_ankle" && kp.score > 0.5);
//     const rightHip = keypoints.find((kp) => kp.name === "right_hip" && kp.score > 0.5);
//     const rightKnee = keypoints.find((kp) => kp.name === "right_knee" && kp.score > 0.5);
//     const rightAnkle = keypoints.find((kp) => kp.name === "right_ankle" && kp.score > 0.5);
  
//     if (leftHip && leftKnee && leftAnkle && rightHip && rightKnee && rightAnkle) {
//       const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
//       const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
  
//       if (leftKneeAngle < 100 && rightKneeAngle > 160 && !isLunging) {
//         isLunging = true;
//       } else if (leftKneeAngle > 160 && rightKneeAngle > 160 && isLunging) {
//         setReps((prev) => prev + 1);
//         updateScore();
//         isLunging = false;
//       }
//     }
//   };
  

//   const provideFeedback = (keypoints) => {
//     const leftShoulder = keypoints.find((kp) => kp.name === "left_shoulder" && kp.score > 0.5);
//     const rightShoulder = keypoints.find((kp) => kp.name === "right_shoulder" && kp.score > 0.5);
//     const leftKnee = keypoints.find((kp) => kp.name === "left_knee" && kp.score > 0.5);
//     const rightKnee = keypoints.find((kp) => kp.name === "right_knee" && kp.score > 0.5);

//     if (leftShoulder && rightShoulder && leftKnee && rightKnee) {
//       if (leftShoulder.y > leftKnee.y || rightShoulder.y > rightKnee.y) {
//         speakText("Keep your back straight!");
//       }
//     }
//   };

//   const speakText = (text) => {
//     const speech = new SpeechSynthesisUtterance(text);
//     speech.lang = "en-US";
//     window.speechSynthesis.speak(speech);
//   };

//   const drawKeypointsAndSkeleton = (keypoints) => {
//     const ctx = canvasRef.current.getContext("2d");
//     ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

//     ctx.fillStyle = "red";
//     ctx.strokeStyle = "green"; // Set line color
//     ctx.lineWidth = 2;

//     // Define keypoint pairs for drawing skeleton
//     const skeleton = [
//         [0, 1], [1, 2], [2, 3], [3, 4], // Right arm
//         [0, 5], [5, 6], [6, 7], // Left arm
//         [5, 11], [6, 12], [11, 12], // Torso
//         [11, 13], [13, 15], // Left leg
//         [12, 14], [14, 16] // Right leg
//     ];

//     // Draw keypoints
//     keypoints.forEach((kp) => {
//         if (kp.score > 0.5) {
//             ctx.beginPath();
//             ctx.arc(kp.x, kp.y, 5, 0, 2 * Math.PI);
//             ctx.fill();
//         }
//     });

//     // Draw skeleton
//     skeleton.forEach(([indexA, indexB]) => {
//         const pointA = keypoints[indexA];
//         const pointB = keypoints[indexB];

//         if (pointA?.score > 0.5 && pointB?.score > 0.5) {
//             ctx.beginPath();
//             ctx.moveTo(pointA.x, pointA.y);
//             ctx.lineTo(pointB.x, pointB.y);
//             ctx.stroke();
//         }
//     });
// };



//   const handleCompleteExercise = () => {
//     // Pass exercise data back to WorkoutPage
//     navigate("/workout", {
//       state: {
//         exerciseId,
//         reps,
//         score,
//       },
//     });
//   };

//   return (
//     <div className="pose-container">
//       <header className="pose-header">
//         <h1>Pose Detection 🏋️</h1>
//       </header>

//       <div className="stats-container">
//         <h2>🔥 Reps: {reps}</h2>
//         <h2>🎯 Score: {score}</h2>
//       </div>

//       <div className="video-container">
//         <video ref={videoRef} className="video" />
//         <canvas ref={canvasRef} className="canvas" width="640" height="480" />
//       </div>

//       {loading && <p className="loading-text">⏳ Loading AI Model...</p>}

//       <button className="complete-exercise-button" onClick={handleCompleteExercise}>
//         Complete Exercise
//       </button>
//     </div>
//   );
// };

// export default PoseDetection;






import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import "./PoseDetection.css";

const PoseDetection = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [reps, setReps] = useState(0);
  const [score, setScore] = useState(0);
    const location = useLocation()

  let isSquatting = false;
  let isPushingUp = false;
  let isRaisingKnee = false;
  let lastKneeRaiseTime = 0;
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
        if (!video) return;
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
        if (exerciseId === "squat") {
          detectSquat(keypoints);
        } else if (exerciseId === "pushup") {
          detectPushup(keypoints);
        } else if (exerciseId === "highKnee") {
          detectHighKnees(keypoints);
        }
        else if(exerciseId === "lunges") {
          detectLunges(keypoints);
        }
        
        provideFeedback(keypoints);
        drawKeypointsAndSkeleton(keypoints);
      }

      requestAnimationFrame(() => detectPoses(detector));
    };

    initializeTF();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (detector) {
        detector.dispose();
      }
    };
  }, [exerciseId]);

  const calculateAngle = (A, B, C) => {
    const AB = Math.sqrt((B.x - A.x) ** 2 + (B.y - A.y) ** 2);
    const BC = Math.sqrt((B.x - C.x) ** 2 + (B.y - C.y) ** 2);
    const AC = Math.sqrt((C.x - A.x) ** 2 + (C.y - A.y) ** 2);
    const radians = Math.acos((AB ** 2 + BC ** 2 - AC ** 2) / (2 * AB * BC));
    return (radians * 180) / Math.PI;
  };

  const updateScore = (isProper, isHalf) => {
    const points = { squat: 5, pushup: 8, highKnee: 3, lunges: 6 };
    let scoreIncrement = points[exerciseId];

    if (!isProper) {
      scoreIncrement /= 2; // Half score for improper form
    } else if (isHalf) {
        scoreIncrement /= 2; // Half score for half pose
    }

    setScore((prev) => prev + scoreIncrement);
  };

  const detectSquat = (keypoints) => {
    const leftHip = keypoints.find((kp) => kp.name === "left_hip" && kp.score > 0.5);
    const leftKnee = keypoints.find((kp) => kp.name === "left_knee" && kp.score > 0.5);
    const leftAnkle = keypoints.find((kp) => kp.name === "left_ankle" && kp.score > 0.5);
    const rightKnee = keypoints.find((kp) => kp.name === "right_knee" && kp.score > 0.5); // Add right knee

    if (leftHip && leftKnee && leftAnkle && rightKnee) {  // All keypoints needed
      const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
      const rightKneeAngle = calculateAngle(leftHip, rightKnee, leftAnkle); // Compare to left
      const hipHeight = leftHip.y;
      const kneeHeight = leftKnee.y;

      if (leftKneeAngle < 90 && hipHeight > kneeHeight && !isSquatting) {
        isSquatting = true;
      } else if (leftKneeAngle > 160 && hipHeight < kneeHeight && isSquatting) {
        const isProper = leftKneeAngle > 160 && rightKneeAngle > 160 && hipHeight < kneeHeight; // Both knees straight, hip below knees
        const isHalf = leftKneeAngle > 90 && leftKneeAngle < 135 && rightKneeAngle > 90 && rightKneeAngle < 135; // Deeper than 90, but not fully locked
        setReps((prev) => prev + 1);
        updateScore(isProper, isHalf);
        isSquatting = false;
      }
    }
  };


  const detectPushup = (keypoints) => {
    const leftShoulder = keypoints.find((kp) => kp.name === "left_shoulder" && kp.score > 0.5);
    const leftElbow = keypoints.find((kp) => kp.name === "left_elbow" && kp.score > 0.5);
    const leftWrist = keypoints.find((kp) => kp.name === "left_wrist" && kp.score > 0.5);
    const rightShoulder = keypoints.find((kp) => kp.name === "right_shoulder" && kp.score > 0.5);
    const rightElbow = keypoints.find((kp) => kp.name === "right_elbow" && kp.score > 0.5);
    const rightWrist = keypoints.find((kp) => kp.name === "right_wrist" && kp.score > 0.5);
    const nose = keypoints.find((kp) => kp.name === "nose" && kp.score > 0.5);

    if (leftShoulder && leftElbow && leftWrist && rightShoulder && rightElbow && rightWrist && nose) {
      const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
      const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
      const shoulderHeight = (leftShoulder.y + rightShoulder.y) / 2;
      const noseHeight = nose.y;

      if (leftElbowAngle < 90 && rightElbowAngle < 90 && noseHeight > shoulderHeight && !isPushingUp) { // Check nose height
        isPushingUp = true;
      } else if (leftElbowAngle > 160 && rightElbowAngle > 160 && isPushingUp) {
        const isProper = leftElbowAngle > 160 && rightElbowAngle > 160 && noseHeight > shoulderHeight; // Fully extended and nose above shoulders
        const isHalf = leftElbowAngle > 90 && leftElbowAngle < 135 && rightElbowAngle > 90 && rightElbowAngle < 135; // Between 90 and 135
        setReps((prev) => prev + 1);
        updateScore(isProper, isHalf);
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

      if (kneeHeight < hipHeight && !isRaisingKnee) {
        isRaisingKnee = true;
        lastKneeRaiseTime = Date.now();
      } else if (kneeHeight > hipHeight && isRaisingKnee) {
        if (Date.now() - lastKneeRaiseTime > 300) {
          const isProper = kneeHeight > hipHeight; // Basic check, refine as needed
          const isHalf = false; // Half high knees not really applicable
          setReps((prev) => prev + 1);
          updateScore(isProper, isHalf);
          isRaisingKnee = false;
        }
      }
    }
  };

  const detectLunges = (keypoints) => {
    const leftHip = keypoints.find((kp) => kp.name === "left_hip" && kp.score > 0.5);
    const leftKnee = keypoints.find((kp) => kp.name === "left_knee" && kp.score > 0.5);
    const leftAnkle = keypoints.find((kp) => kp.name === "left_ankle" && kp.score > 0.5);
    const rightHip = keypoints.find((kp) => kp.name === "right_hip" && kp.score > 0.5);
    const rightKnee = keypoints.find((kp) => kp.name === "right_knee" && kp.score > 0.5);
    const rightAnkle = keypoints.find((kp) => kp.name === "right_ankle" && kp.score > 0.5);

    if (leftHip && leftKnee && leftAnkle && rightHip && rightKnee && rightAnkle) {
      const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
      const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
      const leftHeel = keypoints.find((kp) => kp.name === "left_heel" && kp.score > 0.5);
      const rightHeel = keypoints.find((kp) => kp.name === "right_heel" && kp.score > 0.5);

      if (leftKneeAngle < 100 && rightKneeAngle > 160 && !isLunging) {
        isLunging = true;
      } else if (leftKneeAngle > 160 && rightKneeAngle > 160 && isLunging) {
        const isProper = leftKneeAngle > 160 && rightKneeAngle > 160 && leftHeel && rightHeel && leftHeel.y < leftKnee.y && rightHeel.y < rightKnee.y; // Both knees straight, heels on ground
        const isHalf = leftKneeAngle > 100 && leftKneeAngle < 135 && rightKneeAngle > 100 && rightKneeAngle < 135; // Between 100 and 135 for both
        setReps((prev) => prev + 1);
        updateScore(isProper, isHalf);
        isLunging = false;
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
        // Optionally, you could also visually highlight the incorrect posture
        // on the canvas here.
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

    ctx.fillStyle = "red";
    ctx.strokeStyle = "green"; // Set line color
    ctx.lineWidth = 2;

    // Define keypoint pairs for drawing skeleton
    const skeleton = [
        [0, 1], [1, 2], [2, 3], [3, 4], // Right arm
        [0, 5], [5, 6], [6, 7], // Left arm
        [5, 11], [6, 12], [11, 12], // Torso
        [11, 13], [13, 15], // Left leg
        [12, 14], [14, 16] // Right leg
    ];

    // Draw keypoints
    keypoints.forEach((kp) => {
        if (kp.score > 0.5) {
            ctx.beginPath();
            ctx.arc(kp.x, kp.y, 5, 0, 2 * Math.PI);
            ctx.fill();
        }
    });

    // Draw skeleton
    skeleton.forEach(([indexA, indexB]) => {
        const pointA = keypoints[indexA];
        const pointB = keypoints[indexB];

        if (pointA?.score > 0.5 && pointB?.score > 0.5) {
            ctx.beginPath();
            ctx.moveTo(pointA.x, pointA.y);
            ctx.lineTo(pointB.x, pointB.y);
            ctx.stroke();
        }
    });
};



const handleCompleteExercise = () => {
    const returnUrl = location.state?.returnUrl || "/workout";
    console.log("returnUrl:", returnUrl)
    navigate(returnUrl, {
      state: {
        exerciseId,
        reps,
        score,
      },
    });
  };
  

  return (
    <div className="pose-container">
      <header className="pose-header">
        <h1>Pose Detection 🏋️</h1>
      </header>

      <div className="stats-container">
        <h2>🔥 Reps: {reps}</h2>
        <h2>🎯 Score: {score}</h2>
      </div>

      <div className="video-container">
        <video ref={videoRef} className="video" />
        <canvas ref={canvasRef} className="canvas" width="640" height="480" />
      </div>

      {loading && <p className="loading-text">⏳ Loading AI Model...</p>}

      <button className="complete-exercise-button" onClick={handleCompleteExercise}>
        Complete Exercise
      </button>
    </div>
  );
};

export default PoseDetection;