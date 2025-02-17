import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { connect, createLocalTracks } from "twilio-video";
import axios from "axios";
import { Button, IconButton } from "@mui/material";
import { VideoCameraFront, VideocamOff, Mic, MicOff, CallEnd, ScreenShare, StopScreenShare } from "@mui/icons-material";
import './videoChat.css';

const VideoChat = () => {
  const [videoRoom, setVideoRoom] = useState(null);
  const [localTracks, setLocalTracks] = useState([]);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const localVideoRef = useRef(null);
  const screenShareRef = useRef(null);
  const remoteVideoContainerRef = useRef(null);
  const { id } = useParams();

  useEffect(() => {
    return () => {
      if (videoRoom) {
        handleLeaveRoom();
      }
    };
  }, [videoRoom]);

  const handleJoinRoom = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/group/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const roomId = res.data.roomId;

      const response = await axios.post("http://localhost:5001/api/video/token", { roomId });
      const { token } = response.data;

      const tracks = await createLocalTracks({ audio: true, video: { width: 640 } });
      setLocalTracks(tracks);

      const room = await connect(token, { name: roomId, tracks });
      setVideoRoom(room);

      const localVideoTrack = tracks.find((track) => track.kind === "video");
      if (localVideoTrack && localVideoRef.current) {
        localVideoTrack.attach(localVideoRef.current);
      }

      room.on("participantConnected", (participant) => {
        const videoElement = document.createElement("video");
        videoElement.id = `video-${participant.identity}`;
        videoElement.autoplay = true;
        videoElement.muted = true;
        remoteVideoContainerRef.current.appendChild(videoElement);
        participant.tracks.forEach((trackPublication) => {
          if (trackPublication.track.kind === "video") {
            trackPublication.track.attach(videoElement);
          }
        });
      });

      room.on("participantDisconnected", (participant) => {
        const videoElement = document.getElementById(`video-${participant.identity}`);
        if (videoElement) {
          videoElement.remove();
        }
      });

      room.participants.forEach((participant) => {
        const videoElement = document.createElement("video");
        videoElement.id = `video-${participant.identity}`;
        videoElement.autoplay = true;
        videoElement.muted = true;
        remoteVideoContainerRef.current.appendChild(videoElement);
        participant.tracks.forEach((trackPublication) => {
          if (trackPublication.track.kind === "video") {
            trackPublication.track.attach(videoElement);
          }
        });
      });

    } catch (error) {
      console.error("Error joining room:", error);
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
      }
    }
  };

  return (
    <div className="video-chat">
      {videoRoom ? (
        <div>
          <div
            ref={remoteVideoContainerRef}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "10px",
            }}
          ></div>
          <div className="local-video-container" style={{ marginTop: "16px" }}>
            <video ref={localVideoRef} autoPlay muted style={{ width: "100%", borderRadius: "8px" }}></video>
            <video
              ref={screenShareRef}
              autoPlay
              muted
              style={{ width: "100%", borderRadius: "8px", display: isScreenSharing ? "block" : "none" }}
            ></video>
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
        <Button variant="contained" onClick={handleJoinRoom}>
          Join Room
        </Button>
      )}
    </div>
  );
};

export default VideoChat;
