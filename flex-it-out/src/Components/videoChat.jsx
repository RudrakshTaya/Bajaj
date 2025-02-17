import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect, createLocalTracks } from 'twilio-video';
import axios from 'axios';
import './videoChat.css';

const VideoChat = () => {
    const [roomName, setRoomName] = useState('');
    const [videoRoom, setVideoRoom] = useState(null);
    const [localTracks, setLocalTracks] = useState([]);

    // ✅ Create Room & Get Access Token
    const handleCreateRoom = async () => {
        if (!roomName) return alert('Enter a room name first!');

        try {
            const response = await axios.post('http://localhost:5001/api/video/token', { room: roomName });
            const { token } = response.data;

            alert(`Room "${roomName}" created! Now users can join.`);
            console.log('Received Token:', token);
        } catch (error) {
            console.error('Error creating room:', error);
            alert('Failed to create room. Try again.');
        }
    };

    // ✅ Join Room with Access Token
    const handleJoinRoom = async () => {
        if (!roomName) return alert('Please enter a room name!');

        try {
            const response = await axios.post('http://localhost:5001/api/video/token', { room: roomName });
            const { token } = response.data;

            console.log("Token from backend:", token);

            const tracks = await createLocalTracks({ audio: true, video: { width: 640 } });

            console.log('Tracks created:', tracks);
            setLocalTracks(tracks);

            const room = await connect(token, { name: roomName, tracks });

            setVideoRoom(room);

            // ✅ Attach existing participants
            room.participants.forEach((participant) => {
                console.log(`Existing participant: ${participant.identity}`);
                participant.tracks.forEach(publication => {
                    if (publication.isSubscribed) {
                        attachTrack(publication.track, participant.identity);
                    }
                });

                participant.on('trackSubscribed', (track) => attachTrack(track, participant.identity));
            });

            // ✅ Listen for new participants
            room.on('participantConnected', (participant) => {
                console.log(`Participant ${participant.identity} joined`);
                participant.tracks.forEach(publication => {
                    if (publication.isSubscribed) {
                        attachTrack(publication.track, participant.identity);
                    }
                });

                participant.on('trackSubscribed', (track) => attachTrack(track, participant.identity));
            });

            // ✅ Listen for participant disconnection and remove their video
            room.on('participantDisconnected', (participant) => {
                console.log(`Participant ${participant.identity} left`);
                removeParticipantVideo(participant.identity);
            });

        } catch (error) {
            console.error('Error joining room:', error);
            alert('Error joining room, please try again.');
        }
    };

    // ✅ Leave Room
    const handleLeaveRoom = () => {
        if (videoRoom) {
            videoRoom.disconnect(); // ✅ Disconnect from the Twilio room
            localTracks.forEach(track => track.stop()); // ✅ Stop local tracks
            setLocalTracks([]);
            setVideoRoom(null);
            document.getElementById("remote-video-container").innerHTML = ""; // ✅ Clear remote videos
            console.log("You left the room.");
        }
    };

    // ✅ Attach video tracks to the DOM
    const attachTrack = (track, participantId) => {
        if (track.kind === 'video') {
            const videoElement = track.attach();
            videoElement.id = `video-${participantId}`;

            const container = document.getElementById('remote-video-container');
            if (container) container.appendChild(videoElement);
        }
    };

    // ✅ Remove participant's video when they leave
    const removeParticipantVideo = (participantId) => {
        const videoElement = document.getElementById(`video-${participantId}`);
        if (videoElement) {
            videoElement.remove();
            console.log(`Removed video of participant ${participantId}`);
        }
    };

    return (
        <div className="video-chat">
            <h2>Video Chat</h2>
            <div id="remote-video-container"></div> {/* ✅ Ensure this container exists */}

            {videoRoom ? (
                <div>
                    <h3>You are in room: {videoRoom.name}</h3>
                    <div>
                        {localTracks.map((track, index) => {
                            if (track.kind === 'video') {
                                const videoElement = track.attach();
                                return <div key={index} ref={(el) => el && el.appendChild(videoElement)} />;
                            }
                            return null;
                        })}
                    </div>
                    <button onClick={handleLeaveRoom} className="leave-button">Leave Room</button>
                    <Link to="/">Go Back</Link>
                </div>
            ) : (
                <div>
                    <input
                        type="text"
                        placeholder="Enter Room Name"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                    />
                    <button onClick={handleCreateRoom}>Create Room</button>
                    <button onClick={handleJoinRoom}>Join Room</button>
                </div>
            )}
        </div>
    );
};

export default VideoChat;

