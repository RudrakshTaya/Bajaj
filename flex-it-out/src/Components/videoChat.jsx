"use client"

import { useState, useEffect, useRef } from "react"
import { connect, createLocalTracks } from "twilio-video"
import axios from "axios"
import { Button, IconButton, TextField, Card, CardContent, CardHeader, Typography, Divider, Snackbar, Alert } from "@mui/material"
import { VideoCameraFront, VideocamOff, Mic, MicOff, CallEnd, Group, Chat, ScreenShare, StopScreenShare } from "@mui/icons-material"

const VideoChat = () => {
  const [roomName, setRoomName] = useState("")
  const [videoRoom, setVideoRoom] = useState(null)
  const [localTracks, setLocalTracks] = useState([])
  const [participants, setParticipants] = useState([])
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("info")
  const localVideoRef = useRef(null)
  const screenShareRef = useRef(null)

  useEffect(() => {
    if (videoRoom) {
      const participantConnected = (participant) => {
        setParticipants((prevParticipants) => [...prevParticipants, participant])
        showSnackbar(`${participant.identity} joined the room`, "info")
      }

      const participantDisconnected = (participant) => {
        setParticipants((prevParticipants) => prevParticipants.filter((p) => p !== participant))
        removeParticipantVideo(participant.identity)
        showSnackbar(`${participant.identity} left the room`, "info")
      }

      videoRoom.on("participantConnected", participantConnected)
      videoRoom.on("participantDisconnected", participantDisconnected)

      return () => {
        videoRoom.off("participantConnected", participantConnected)
        videoRoom.off("participantDisconnected", participantDisconnected)
      }
    }
  }, [videoRoom])

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }

  const handleCreateRoom = async () => {
    if (!roomName) return showSnackbar("Enter a room name first!", "error")

    try {
      const response = await axios.post("http://localhost:5001/api/video/token", { room: roomName })
      const { token } = response.data

      showSnackbar(`Room "${roomName}" created! Now users can join.`, "success")
      console.log("Received Token:", token)
    } catch (error) {
      console.error("Error creating room:", error)
      showSnackbar("Failed to create room. Try again.", "error")
    }
  }

  const handleJoinRoom = async () => {
    if (!roomName) return showSnackbar("Please enter a room name!", "error");
  
    try {
      const response = await axios.post("http://localhost:5001/api/video/token", { room: roomName });
      const { token } = response.data;
  
      const tracks = await createLocalTracks({ audio: true, video: { width: 640 } });
      setLocalTracks(tracks);
  
      // Ensure that the videoRoom is being set correctly
      const room = await connect(token, { name: roomName, tracks });
      setVideoRoom(room); // Set videoRoom after connection
  
      room.participants.forEach(attachParticipantTracks);
      room.on("participantConnected", attachParticipantTracks);
      room.on("participantDisconnected", detachParticipantTracks);
  
      // Attach local video and audio once the room is successfully joined
      const localVideoTrack = tracks.find((track) => track.kind === "video");
      const localAudioTrack = tracks.find((track) => track.kind === "audio");
  
      if (localVideoTrack && localVideoRef.current) {
        localVideoTrack.attach(localVideoRef.current);
      }
  
      // Make sure local audio is published only if the room is correctly set
      if (localAudioTrack && videoRoom) {
        videoRoom.localParticipant.publishTrack(localAudioTrack); // Publish audio to the room
      }
  
    } catch (error) {
      console.error("Error joining room:", error);
      showSnackbar("Error joining room, please try again.", "error");
    }
  };
  

  const handleLeaveRoom = () => {
    if (videoRoom) {
      videoRoom.disconnect()
      localTracks.forEach((track) => track.stop())
      setLocalTracks([])
      setVideoRoom(null)
      setParticipants([])
      document.getElementById("remote-video-container").innerHTML = ""
      showSnackbar("You left the room.", "info")
    }
  }

  const attachParticipantTracks = (participant) => {
    participant.tracks.forEach((publication) => {
      if (publication.track) {
        attachTrack(publication.track, participant.identity)
      }
    })
    participant.on("trackSubscribed", (track) => attachTrack(track, participant.identity))
  }

  const detachParticipantTracks = (participant) => {
    removeParticipantVideo(participant.identity)
  }

  const attachTrack = (track, participantId) => {
    if (track.kind === "video") {
      const videoElement = track.attach()
      videoElement.id = `video-${participantId}`
      const container = document.getElementById("remote-video-container")
      if (container) container.appendChild(videoElement)
    }
    // For audio track, automatically play audio to the remote participants
    if (track.kind === "audio") {
      track.attach() // This ensures audio is played for remote participants
    }
  }

  const removeParticipantVideo = (participantId) => {
    const videoElement = document.getElementById(`video-${participantId}`)
    if (videoElement) {
      videoElement.remove()
    }
  }

  const toggleVideo = () => {
    localTracks.forEach((track) => {
      if (track.kind === "video") {

        if (track.isEnabled) {
          track.disable()
        } else {
          track.enable()
        }
  
        setIsVideoEnabled(!track.isEnabled);
      }
    })
  }  

  const toggleAudio = () => {
    localTracks.forEach((track) => {
      if (track.kind === "audio") {
        if (track.isEnabled) {
          track.disable();
        } else {
          track.enable(); 
        }
        setIsAudioEnabled(!track.isEnabled);
      }
    })
  }
  

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      localTracks.forEach((track) => {
        if (track.kind === "video" && track.name === "screen") {
          track.stop()
        }
      })
      setIsScreenSharing(false)
    } else {
      try {
        const screenTrack = await createLocalTracks({ video: { width: 1280, height: 720, name: "screen" }, audio: false })
        screenTrack[0].attach(screenShareRef.current)
        videoRoom.localParticipant.publishTrack(screenTrack[0])
        setIsScreenSharing(true)
      } catch (error) {
        console.error("Error sharing screen:", error)
        showSnackbar("Failed to share screen.", "error")
      }
    }
  }

  const sendMessage = () => {
    if (newMessage.trim() && videoRoom) {
      videoRoom.localParticipant.publishMessage(newMessage)
      setMessages((prevMessages) => [...prevMessages, { sender: "You", content: newMessage, timestamp: new Date().toLocaleTimeString() }])
      setNewMessage("")
    }
  }

  return (
    <div className="video-chat">
      <Card sx={{ maxWidth: "800px", margin: "auto", padding: "16px" }}>
        <CardHeader title="Classy Video Chat" />
        <CardContent>
          {videoRoom ? (
            <div>
              <div id="remote-video-container" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}></div>
              <div className="local-video-container" style={{ marginTop: "16px" }}>
                <video ref={localVideoRef} autoPlay muted style={{ width: "100%", borderRadius: "8px" }}></video>
                <video ref={screenShareRef} autoPlay muted style={{ width: "100%", borderRadius: "8px", display: isScreenSharing ? "block" : "none" }}></video>
              </div>
              <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
                <IconButton onClick={toggleVideo} color={isVideoEnabled ? "primary" : "error"}>
                  {isVideoEnabled ? <VideoCameraFront /> : <VideocamOff />}
                </IconButton>
                <IconButton onClick={toggleAudio} color={isAudioEnabled ? "primary" : "error"}>
                  {isAudioEnabled ? <Mic /> : <MicOff />}
                </IconButton>
                <IconButton onClick={toggleScreenShare} color={isScreenSharing ? "primary" : "default"}>
                  {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
                </IconButton>
                <IconButton onClick={handleLeaveRoom} color="error">
                  <CallEnd />
                </IconButton>
              </div>
              <Divider sx={{ marginY: "16px" }} />
              <Typography variant="h6">
                <Group sx={{ marginRight: "8px" }} /> Participants ({participants.length + 1})
              </Typography>
              {participants.map((participant, index) => (
                <Typography key={index}>{participant.identity}</Typography>
              ))}
              <Divider sx={{ marginY: "16px" }} />
              <Typography variant="h6">
                <Chat sx={{ marginRight: "8px" }} /> Messages
              </Typography>
              <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "16px" }}>
                {messages.map((msg, index) => (
                  <div key={index}>
                    <strong>{msg.sender}</strong>: {msg.content}
                  </div>
                ))}
              </div>
              <div>
                <TextField
                  label="Type a message"
                  fullWidth
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage()
                  }}
                />
                <Button onClick={sendMessage} color="primary">Send</Button>
              </div>
            </div>
          ) : (
            <div>
              <TextField
                label="Room Name"
                fullWidth
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
              <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
                <Button variant="contained" color="primary" onClick={handleJoinRoom}>
                  Join Room
                </Button>
                <Button variant="contained" color="secondary" onClick={handleCreateRoom} style={{ marginLeft: "8px" }}>
                  Create Room
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default VideoChat
