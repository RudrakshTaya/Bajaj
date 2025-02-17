import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { connect, createLocalTracks } from "twilio-video";
import axios from "axios";
import { Button, IconButton, Snackbar, Alert } from "@mui/material";
import { VideoCameraFront, VideocamOff, Mic, MicOff, CallEnd, ScreenShare, StopScreenShare } from "@mui/icons-material";

const VideoChat = () => {
  const [videoRoom, setVideoRoom] = useState(null);
  const [localTracks, setLocalTracks] = useState([]);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const localVideoRef = useRef(null);
  const screenShareRef = useRef(null);
  const [remoteParticipants, setRemoteParticipants] = useState([]);
  const { id } = useParams()

  useEffect(() => {
    if (videoRoom) {
      const participantConnected = (participant) => {
        setRemoteParticipants((prev) => [...prev, participant]);
        showSnackbar(`${participant.identity} joined the room`, "info");
        attachParticipantVideo(participant);
      };

      const participantDisconnected = (participant) => {
        setRemoteParticipants((prev) => prev.filter((p) => p.identity !== participant.identity));
        showSnackbar(`${participant.identity} left the room`, "info");
        removeParticipantVideo(participant.identity);
      };

      videoRoom.on("participantConnected", participantConnected);
      videoRoom.on("participantDisconnected", participantDisconnected);

      // Attach video tracks of existing participants
      videoRoom.participants.forEach(attachParticipantVideo);

      return () => {
        videoRoom.off("participantConnected", participantConnected);
        videoRoom.off("participantDisconnected", participantDisconnected);
      };
    }
  }, [videoRoom]);

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleJoinRoom = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/group/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const roomId = res.data.roomId;
      console.log(roomId)
      
  
      // Request a token from your backend
      const response = await axios.post("http://localhost:5001/api/video/token", { roomId });
  
      if (response.status !== 200) {
        console.error("Error fetching token:", response.statusText);
        showSnackbar("Error fetching token, please try again.", "error");
        return;
      }
  
      const { token } = response.data;
  
      // Create local tracks (audio and video)
      const tracks = await createLocalTracks({ audio: true, video: { width: 640 } });
      setLocalTracks(tracks);
  
      // Connect to the room
      const room = await connect(token, { name: roomId, tracks });
      setVideoRoom(room);
  
      // Attach local tracks to the local video element
      const localVideoTrack = tracks.find((track) => track.kind === "video");
      const localAudioTrack = tracks.find((track) => track.kind === "audio");
  
      if (localVideoTrack && localVideoRef.current) {
        localVideoTrack.attach(localVideoRef.current);
      }
  
      if (localAudioTrack && videoRoom) {
        videoRoom.localParticipant.publishTrack(localAudioTrack);
      }
  
      setIsVideoEnabled(true);
      showSnackbar(`Joined room "${roomId}" successfully!`, "success");
    } catch (error) {
      console.error("Error joining room:", error);
      showSnackbar("Error joining room, please try again.", "error");
    }
  }  
  

  const handleLeaveRoom = () => {
    if (videoRoom) {
      // Unpublish tracks before disconnecting
      videoRoom.localParticipant.tracks.forEach((trackPublication) => {
        videoRoom.localParticipant.unpublishTrack(trackPublication.track);
        if (trackPublication.track.kind === "video") {
          trackPublication.track.stop(); // Stop the video track when leaving
        }
      });

      videoRoom.disconnect();
      localTracks.forEach((track) => track.stop());
      setLocalTracks([]);
      setVideoRoom(null);
      document.getElementById("remote-video-container").innerHTML = "";
      showSnackbar("You left the room.", "info");
    }
  };

  const attachParticipantVideo = (participant) => {
    participant.tracks.forEach((track) => {
      // Check if the track is a video track before attaching it
      if (track.kind === "video") {
        const videoElement = track.attach();
        videoElement.id = `video-${participant.identity}`;
        const container = document.getElementById("remote-video-container");
        if (container) container.appendChild(videoElement);
      }
    });
  
    // Listen for new track subscriptions
    participant.on("trackSubscribed", (track) => {
      // Only attach video tracks
      if (track.kind === "video") {
        const videoElement = track.attach();
        videoElement.id = `video-${participant.identity}`;
        const container = document.getElementById("remote-video-container");
        if (container) container.appendChild(videoElement);
      }
    });
  };
  

  const removeParticipantVideo = (participantId) => {
    const videoElement = document.getElementById(`video-${participantId}`);
    if (videoElement) {
      videoElement.remove();
    }
  };

  const toggleVideo = () => {
    setIsVideoEnabled((prev) => {
      const newState = !prev;
      localTracks.forEach((track) => {
        if (track.kind === "video") {
          if (newState) track.enable();
          else track.disable();
        }
      });
      return newState;
    });
  };

  const toggleAudio = () => {
    setIsAudioEnabled((prev) => {
      const newState = !prev;
      localTracks.forEach((track) => {
        if (track.kind === "audio") {
          if (newState) track.enable();
          else track.disable();
        }
      });
      return newState;
    });
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop screen sharing
      localTracks.forEach((track) => {
        if (track.kind === "video" && track.name === "screen") {
          track.stop();
        }
      });
      setIsScreenSharing(false);
    } else {
      // Start screen sharing
      try {
        const screenTrack = await createLocalTracks({ video: { name: "screen", width: 1280, height: 720 }, audio: false });
        screenTrack[0].attach(screenShareRef.current);
        videoRoom.localParticipant.publishTrack(screenTrack[0]);
        setIsScreenSharing(true);
      } catch (error) {
        console.error("Error sharing screen:", error);
        showSnackbar("Failed to share screen.", "error");
      }
    }
  };

  return (
    <div className="video-chat">
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
        </div>
      ) : (
        <Button variant="contained" color="primary" onClick={handleJoinRoom}>
          Join Video Call
        </Button>
      )}

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