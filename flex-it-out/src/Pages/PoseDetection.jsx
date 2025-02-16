

// "use client"

// import { useEffect, useRef, useState } from "react"
// import * as tf from "@tensorflow/tfjs"
// import * as poseDetection from "@tensorflow-models/pose-detection"
// import "@tensorflow/tfjs-backend-webgl"
// import "./PoseDetection.css"

// const PoseDetection = () => {
//   const videoRef = useRef(null)
//   const canvasRef = useRef(null)
//   const [loading, setLoading] = useState(true)
//   const [squatCount, setSquatCount] = useState(0)
//   const [pushupCount, setPushupCount] = useState(0)
//   const [highKneeCount, setHighKneeCount] = useState(0)
//   const [score, setScore] = useState(0)
//   const [leaderboard, setLeaderboard] = useState([
//     { name: "Alice", score: 150 },
//     { name: "Bob", score: 120 },
//     { name: "Charlie", score: 100 },
//   ])
//   const [challenges, setChallenges] = useState([
//     { name: "10 Squats", completed: false },
//     { name: "5 Push-ups", completed: false },
//     { name: "20 High Knees", completed: false },
//   ])

//   let isSquatting = false
//   let isPushingUp = false
//   let isRaisingKnee = false
//   let lastKneeRaiseTime = 0
//   let detector;

//   useEffect(() => {
//     const initializeTF = async () => {
//       try {
//         await tf.setBackend("webgl")
//         await tf.ready()
//         console.log("✅ TensorFlow.js is ready!")
//         startPoseDetection()
//       } catch (error) {
//         console.error("🚨 Error initializing TensorFlow:", error)
//         setLoading(false)
//       }
//     }

//     const startPoseDetection = async () => {
//       try {
//         const video = videoRef.current
//         if (!video) return
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true })
//         video.srcObject = stream
//         await new Promise((resolve) => (video.onloadedmetadata = resolve))
//         video.play()
//         console.log("🎥 Camera Started")

//         detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet)
//         console.log("✅ MoveNet Model Loaded")

//         setLoading(false)
//         detectPoses(detector)
//       } catch (error) {
//         console.error("🚨 Error starting pose detection:", error)
//         setLoading(false)
//       }
//     }

//     const detectPoses = async (detector) => {
//       if (!videoRef.current || !canvasRef.current) return

//       const poses = await detector.estimatePoses(videoRef.current)
//       if (poses.length > 0) {
//         const keypoints = poses[0].keypoints
//         detectSquat(keypoints)
//         detectPushup(keypoints)
//         detectHighKnees(keypoints)
//         provideFeedback(keypoints)
//         drawKeypointsAndSkeleton(keypoints)
//       }

//       requestAnimationFrame(() => detectPoses(detector))
//     }

//     initializeTF()

//     return () => {
//       if (videoRef.current && videoRef.current.srcObject) {
//        videoRef.current.srcObject.getTracks().forEach((track)=>track.stop());
        
//       }
//       if (detector) {
//         detector.dispose()
//       }
//     }
//   }, []) // Added detector to the dependency array

//   const calculateAngle = (A, B, C) => {
//     const AB = Math.sqrt((B.x - A.x) ** 2 + (B.y - A.y) ** 2)
//     const BC = Math.sqrt((B.x - C.x) ** 2 + (B.y - C.y) ** 2)
//     const AC = Math.sqrt((C.x - A.x) ** 2 + (C.y - A.y) ** 2)
//     const radians = Math.acos((AB ** 2 + BC ** 2 - AC ** 2) / (2 * AB * BC))
//     return (radians * 180) / Math.PI
//   }

//   const updateScore = (exercise) => {
//     const points = { squat: 5, pushup: 8, highKnee: 3 }
//     setScore((prev) => prev + points[exercise])
//   }

//   const detectSquat = (keypoints) => {
//     const hip = keypoints.find((kp) => kp.name === "left_hip" && kp.score > 0.5)
//     const knee = keypoints.find((kp) => kp.name === "left_knee" && kp.score > 0.5)
//     const ankle = keypoints.find((kp) => kp.name === "left_ankle" && kp.score > 0.5)

//     if (hip && knee && ankle) {
//       const kneeAngle = calculateAngle(hip, knee, ankle)
//       const hipHeight = hip.y
//       const kneeHeight = knee.y

//       // Squat detection logic
//       if (kneeAngle < 90 && hipHeight > kneeHeight && !isSquatting) {
//         isSquatting = true
//       } else if (kneeAngle > 160 && hipHeight < kneeHeight && isSquatting) {
//         setSquatCount((prev) => prev + 1)
//         updateScore("squat")
//         isSquatting = false
//       }
//     }
//   }

//   const detectPushup = (keypoints) => {
//     const shoulder = keypoints.find((kp) => kp.name === "left_shoulder" && kp.score > 0.5)
//     const elbow = keypoints.find((kp) => kp.name === "left_elbow" && kp.score > 0.5)
//     const wrist = keypoints.find((kp) => kp.name === "left_wrist" && kp.score > 0.5)

//     if (shoulder && elbow && wrist) {
//       const elbowAngle = calculateAngle(shoulder, elbow, wrist)
//       if (elbowAngle < 90 && !isPushingUp) {
//         isPushingUp = true
//       } else if (elbowAngle > 160 && isPushingUp) {
//         setPushupCount((prev) => prev + 1)
//         updateScore("pushup")
//         isPushingUp = false
//       }
//     }
//   }

//   const detectHighKnees = (keypoints) => {
//     const hip = keypoints.find((kp) => kp.name === "left_hip" && kp.score > 0.5)
//     const knee = keypoints.find((kp) => kp.name === "left_knee" && kp.score > 0.5)

//     if (hip && knee) {
//       const kneeHeight = knee.y
//       const hipHeight = hip.y

//       // High knee detection logic
//       if (kneeHeight < hipHeight && !isRaisingKnee) {
//         isRaisingKnee = true
//         lastKneeRaiseTime = Date.now() // Record the time when the knee is raised
//       } else if (kneeHeight > hipHeight && isRaisingKnee) {
//         // Check if the knee was raised for at least 300ms to avoid false positives
//         if (Date.now() - lastKneeRaiseTime > 300) {
//           setHighKneeCount((prev) => prev + 1)
//           updateScore("highKnee")
//           isRaisingKnee = false
//         }
//       }
//     }
//   }

//   const provideFeedback = (keypoints) => {
//     const leftShoulder = keypoints.find((kp) => kp.name === "left_shoulder" && kp.score > 0.5)
//     const rightShoulder = keypoints.find((kp) => kp.name === "right_shoulder" && kp.score > 0.5)
//     const leftKnee = keypoints.find((kp) => kp.name === "left_knee" && kp.score > 0.5)
//     const rightKnee = keypoints.find((kp) => kp.name === "right_knee" && kp.score > 0.5)

//     if (leftShoulder && rightShoulder && leftKnee && rightKnee) {
//       if (leftShoulder.y > leftKnee.y || rightShoulder.y > rightKnee.y) {
//         speakText("Keep your back straight!")
//       }
//     }
//   }

//   const speakText = (text) => {
//     const speech = new SpeechSynthesisUtterance(text)
//     speech.lang = "en-US"
//     window.speechSynthesis.speak(speech)
//   }

//   const drawKeypointsAndSkeleton = (keypoints) => {
//     const ctx = canvasRef.current.getContext("2d")
//     ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

//     // Draw keypoints
//     keypoints.forEach((kp) => {
//       if (kp.score > 0.5) {
//         ctx.beginPath()
//         ctx.arc(kp.x, kp.y, 5, 0, 2 * Math.PI)
//         ctx.fillStyle = "red"
//         ctx.fill()
//       }
//     })

//     // Highlight keypoints for squats and high knees
//     const hip = keypoints.find((kp) => kp.name === "left_hip" && kp.score > 0.5)
//     const knee = keypoints.find((kp) => kp.name === "left_knee" && kp.score > 0.5)
//     const ankle = keypoints.find((kp) => kp.name === "left_ankle" && kp.score > 0.5)

//     if (hip && knee && ankle) {
//       ctx.beginPath()
//       ctx.moveTo(hip.x, hip.y)
//       ctx.lineTo(knee.x, knee.y)
//       ctx.lineTo(ankle.x, ankle.y)
//       ctx.strokeStyle = "blue"
//       ctx.lineWidth = 2
//       ctx.stroke()
//     }
//   }

//   const completeChallenge = (index) => {
//     setChallenges((prevChallenges) => {
//       const newChallenges = [...prevChallenges]
//       newChallenges[index].completed = true
//       return newChallenges
//     })
//     setScore((prevScore) => prevScore + 50)
//   }

//   return (
//     <div className="pose-container">
//       <header className="pose-header">
//         <h1>Pose Detection 🏋️</h1>
//       </header>

//       <div className="stats-container">
//         <h2>🔥 Squats: {squatCount}</h2>
//         <h2>💪 Push-ups: {pushupCount}</h2>
//         <h2>🏃 High Knees: {highKneeCount}</h2>
//         <h2>🎯 Score: {score}</h2>
//       </div>

//       <div className="video-container">
//         <video ref={videoRef} className="video" />
//         <canvas ref={canvasRef} className="canvas" width="640" height="480" />
//       </div>

//       {loading && <p className="loading-text">⏳ Loading AI Model...</p>}

//       <div className="leaderboard">
//         <h2>🏆 Leaderboard</h2>
//         {leaderboard.map((entry, index) => (
//           <div key={index} className="leaderboard-entry">
//             <span>{entry.name}</span>
//             <span>{entry.score} pts</span>
//           </div>
//         ))}
//       </div>

//       <div className="challenges">
//         <h2>🎯 Challenges</h2>
//         {challenges.map((challenge, index) => (
//           <div key={index} className="challenge">
//             <span>{challenge.name}</span>
//             {challenge.completed ? (
//               <span>✅ Completed</span>
//             ) : (
//               <button className="challenge-button" onClick={() => completeChallenge(index)}>
//                 Complete
//               </button>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default PoseDetection



import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import * as tf from "@tensorflow/tfjs"
import * as poseDetection from "@tensorflow-models/pose-detection"
import "@tensorflow/tfjs-backend-webgl"
import "./PoseDetection.css"

const PoseDetection = () => {
  const { exerciseId } = useParams()
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [squatCount, setSquatCount] = useState(0)
  const [pushupCount, setPushupCount] = useState(0)
  const [highKneeCount, setHighKneeCount] = useState(0)
  const [score, setScore] = useState(0)

  let isSquatting = false
  let isPushingUp = false
  let isRaisingKnee = false
  let lastKneeRaiseTime = 0
  let detector

  useEffect(() => {
    const initializeTF = async () => {
      try {
        await tf.setBackend("webgl")
        await tf.ready()
        console.log("✅ TensorFlow.js is ready!")
        startPoseDetection()
      } catch (error) {
        console.error("🚨 Error initializing TensorFlow:", error)
        setLoading(false)
      }
    }

    const startPoseDetection = async () => {
      try {
        const video = videoRef.current
        if (!video) return
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        video.srcObject = stream
        await new Promise((resolve) => (video.onloadedmetadata = resolve))
        video.play()
        console.log("🎥 Camera Started")

        detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet)
        console.log("✅ MoveNet Model Loaded")

        setLoading(false)
        detectPoses(detector)
      } catch (error) {
        console.error("🚨 Error starting pose detection:", error)
        setLoading(false)
      }
    }

    const detectPoses = async (detector) => {
      if (!videoRef.current || !canvasRef.current) return

      const poses = await detector.estimatePoses(videoRef.current)
      if (poses.length > 0) {
        const keypoints = poses[0].keypoints
        if (exerciseId === "squat") {
          detectSquat(keypoints)
        } else if (exerciseId === "pushup") {
          detectPushup(keypoints)
        } else if (exerciseId === "highKnee") {
          detectHighKnees(keypoints)
        }
        provideFeedback(keypoints)
        drawKeypointsAndSkeleton(keypoints)
      }

      requestAnimationFrame(() => detectPoses(detector))
    }

    initializeTF()

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop())
      }
      if (detector) {
        detector.dispose()
      }
    }
  }, [exerciseId])

  const calculateAngle = (A, B, C) => {
    const AB = Math.sqrt((B.x - A.x) ** 2 + (B.y - A.y) ** 2)
    const BC = Math.sqrt((B.x - C.x) ** 2 + (B.y - C.y) ** 2)
    const AC = Math.sqrt((C.x - A.x) ** 2 + (C.y - A.y) ** 2)
    const radians = Math.acos((AB ** 2 + BC ** 2 - AC ** 2) / (2 * AB * BC))
    return (radians * 180) / Math.PI
  }

  const updateScore = (exercise) => {
    const points = { squat: 5, pushup: 8, highKnee: 3 }
    setScore((prev) => prev + points[exercise])
  }

  const detectSquat = (keypoints) => {
    const hip = keypoints.find((kp) => kp.name === "left_hip" && kp.score > 0.5)
    const knee = keypoints.find((kp) => kp.name === "left_knee" && kp.score > 0.5)
    const ankle = keypoints.find((kp) => kp.name === "left_ankle" && kp.score > 0.5)

    if (hip && knee && ankle) {
      const kneeAngle = calculateAngle(hip, knee, ankle)
      const hipHeight = hip.y
      const kneeHeight = knee.y

      // Squat detection logic
      if (kneeAngle < 90 && hipHeight > kneeHeight && !isSquatting) {
        isSquatting = true
      } else if (kneeAngle > 160 && hipHeight < kneeHeight && isSquatting) {
        setSquatCount((prev) => prev + 1)
        updateScore("squat")
        isSquatting = false
      }
    }
  }

  const detectPushup = (keypoints) => {
    const shoulder = keypoints.find((kp) => kp.name === "left_shoulder" && kp.score > 0.5)
    const elbow = keypoints.find((kp) => kp.name === "left_elbow" && kp.score > 0.5)
    const wrist = keypoints.find((kp) => kp.name === "left_wrist" && kp.score > 0.5)

    if (shoulder && elbow && wrist) {
      const elbowAngle = calculateAngle(shoulder, elbow, wrist)
      if (elbowAngle < 90 && !isPushingUp) {
        isPushingUp = true
      } else if (elbowAngle > 160 && isPushingUp) {
        setPushupCount((prev) => prev + 1)
        updateScore("pushup")
        isPushingUp = false
      }
    }
  }

  const detectHighKnees = (keypoints) => {
    const hip = keypoints.find((kp) => kp.name === "left_hip" && kp.score > 0.5)
    const knee = keypoints.find((kp) => kp.name === "left_knee" && kp.score > 0.5)

    if (hip && knee) {
      const kneeHeight = knee.y
      const hipHeight = hip.y

      // High knee detection logic
      if (kneeHeight < hipHeight && !isRaisingKnee) {
        isRaisingKnee = true
        lastKneeRaiseTime = Date.now() // Record the time when the knee is raised
      } else if (kneeHeight > hipHeight && isRaisingKnee) {
        // Check if the knee was raised for at least 300ms to avoid false positives
        if (Date.now() - lastKneeRaiseTime > 300) {
          setHighKneeCount((prev) => prev + 1)
          updateScore("highKnee")
          isRaisingKnee = false
        }
      }
    }
  }

  const provideFeedback = (keypoints) => {
    const leftShoulder = keypoints.find((kp) => kp.name === "left_shoulder" && kp.score > 0.5)
    const rightShoulder = keypoints.find((kp) => kp.name === "right_shoulder" && kp.score > 0.5)
    const leftKnee = keypoints.find((kp) => kp.name === "left_knee" && kp.score > 0.5)
    const rightKnee = keypoints.find((kp) => kp.name === "right_knee" && kp.score > 0.5)

    if (leftShoulder && rightShoulder && leftKnee && rightKnee) {
      if (leftShoulder.y > leftKnee.y || rightShoulder.y > rightKnee.y) {
        speakText("Keep your back straight!")
      }
    }
  }

  const speakText = (text) => {
    const speech = new SpeechSynthesisUtterance(text)
    speech.lang = "en-US"
    window.speechSynthesis.speak(speech)
  }

  const drawKeypointsAndSkeleton = (keypoints) => {
    const ctx = canvasRef.current.getContext("2d")
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Draw keypoints
    keypoints.forEach((kp) => {
      if (kp.score > 0.5) {
        ctx.beginPath()
        ctx.arc(kp.x, kp.y, 5, 0, 2 * Math.PI)
        ctx.fillStyle = "red"
        ctx.fill()
      }
    })

    // Highlight keypoints for squats and high knees
    const hip = keypoints.find((kp) => kp.name === "left_hip" && kp.score > 0.5)
    const knee = keypoints.find((kp) => kp.name === "left_knee" && kp.score > 0.5)
    const ankle = keypoints.find((kp) => kp.name === "left_ankle" && kp.score > 0.5)

    if (hip && knee && ankle) {
      ctx.beginPath()
      ctx.moveTo(hip.x, hip.y)
      ctx.lineTo(knee.x, knee.y)
      ctx.lineTo(ankle.x, ankle.y)
      ctx.strokeStyle = "blue"
      ctx.lineWidth = 2
      ctx.stroke()
    }
  }

  const handleCompleteExercise = () => {
    const reps = exerciseId === "squat" ? squatCount : exerciseId === "pushup" ? pushupCount : highKneeCount
    navigate("/workout", { state: { exerciseId, reps } })
  }

  return (
    <div className="pose-container">
      <header className="pose-header">
        <h1>Pose Detection 🏋️</h1>
      </header>

      <div className="stats-container">
        {exerciseId === "squat" && <h2>🔥 Squats: {squatCount}</h2>}
        {exerciseId === "pushup" && <h2>💪 Push-ups: {pushupCount}</h2>}
        {exerciseId === "highKnee" && <h2>🏃 High Knees: {highKneeCount}</h2>}
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
  )
}

export default PoseDetection