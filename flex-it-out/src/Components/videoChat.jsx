import { useEffect, useRef, useState } from "react";
import Video from "twilio-video";

const VideoChat = ({ token, roomName }) => {
  const [room, setRoom] = useState(null);
  const [localTracks, setLocalTracks] = useState([]);
  const localVideoRef = useRef(null);

  useEffect(() => {
    const joinRoom = async () => {
      try {
        const tracks = await Video.createLocalTracks({ video: true, audio: true });
        setLocalTracks(tracks);

        const videoTrack = tracks.find(track => track.kind === "video");
        if (videoTrack && localVideoRef.current) {
          videoTrack.attach(localVideoRef.current);
        }

        const twilioRoom = await Video.connect(token, {
          name: roomName,
          tracks: tracks,
        });
        setRoom(twilioRoom);
      } catch (error) {
        console.error("Error joining the room:", error);
      }
    };

    if (token && roomName) {
      joinRoom();
    }

    return () => {
      if (room) {
        room.disconnect();
      }
      localTracks.forEach(track => track.stop());
    };
  }, [token, roomName]);

  return (
    <div>
      <h2>Video Chat</h2>
      <video ref={localVideoRef} autoPlay playsInline muted className="local-video" />
    </div>
  );
};

export default VideoChat;
