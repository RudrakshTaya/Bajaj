import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { connect, createLocalTracks } from "twilio-video";
import axios from "axios";
import { Button, IconButton, Snackbar, Alert } from "@mui/material";
import { VideoCameraFront, VideocamOff, Mic, MicOff, CallEnd, ScreenShare, StopScreenShare } from "@mui/icons-material";
import "./VideoChat.css"; // Importing the CSS file

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
  const { id } = useParams();

  useEffect(() => {
    return () => {
      handleLeaveRoom();
    };
  }, []);

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleJoinRoom = async () => {
    try {
      setLocalTracks([]);
      setRemoteParticipants([]);
      setIsVideoEnabled(true);
      setIsAudioEnabled(true);
      setIsScreenSharing(false);
      setVideoRoom(null);

      const res = await axios.get(`http://localhost:5001/api/group/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const roomId = res.data.roomId;

      const response = await axios.post("http://localhost:5001/api/video/token", { roomId });
      if (response.status !== 200) {
        showSnackbar("Error fetching token, please try again.", "error");
        return;
      }
      const { token } = response.data;

      const tracks = await createLocalTracks({ audio: true, video: { width: 640 } });
      setLocalTracks(tracks);

      const room = await connect(token, { name: roomId, tracks });
      setVideoRoom(room);

      const localVideoTrack = tracks.find((track) => track.kind === "video");
      if (localVideoTrack && localVideoRef.current) {
        localVideoTrack.attach(localVideoRef.current);
      }

      showSnackbar(`Joined room "${roomId}" successfully!`, "success");

      room.on("participantConnected", (participant) => {
        setRemoteParticipants((prev) => [...prev, participant]);
        showSnackbar(`${participant.identity} joined the room`, "info");
        attachParticipantVideo(participant);
      });

      room.on("participantDisconnected", (participant) => {
        setRemoteParticipants((prev) => prev.filter((p) => p.identity !== participant.identity));
        showSnackbar(`${participant.identity} left the room`, "info");
        removeParticipantVideo(participant.identity);
      });

      room.participants.forEach(attachParticipantVideo);
    } catch (error) {
      console.error("Error joining room:", error);
      showSnackbar("Error joining room, please try again.", "error");
    }
  };

  const handleLeaveRoom = () => {
    if (videoRoom) {
      videoRoom.localParticipant.tracks.forEach((trackPublication) => {
        videoRoom.localParticipant.unpublishTrack(trackPublication.track);
        if (trackPublication.track.kind === "video") {
          trackPublication.track.stop();
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
      if (track.kind === "video") {
        if (track.isSubscribed && track.track) {
          const videoElement = track.attach();
          videoElement.id = `video-${participant.identity}`;
          const container = document.getElementById("remote-video-container");
          if (container) container.appendChild(videoElement);
        }
      }
    });

    participant.on("trackSubscribed", (track) => {
      if (track.kind === "video") {
        if (track.isSubscribed && track.track) {
          const videoElement = track.attach();
          videoElement.id = `video-${participant.identity}`;
          const container = document.getElementById("remote-video-container");
          if (container) container.appendChild(videoElement);
        }
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
      localTracks.forEach((track) => {
        if (track.kind === "video" && track.name === "screen") {
          track.stop();
        }
      });
      setIsScreenSharing(false);
    } else {
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
          <div id="remote-video-container" className="remote-video-container"></div>
          <div className="local-video-container">
            <video ref={localVideoRef} autoPlay muted className="local-video" />
            <video ref={screenShareRef} autoPlay muted className={`screen-share-video ${isScreenSharing ? "active" : ""}`} />
          </div>
          <div className="controls">
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
        <Button variant="contained" onClick={handleJoinRoom}>
          Join Room
        </Button>
      )}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default VideoChat;
