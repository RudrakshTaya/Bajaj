import React, { useState, useEffect } from 'react';
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
    
            // ✅ Attach already existing participants (fix for A not seeing B)
            room.participants.forEach((participant) => {
                console.log(`Existing participant: ${participant.identity}`);
                participant.tracks.forEach(publication => {
                    if (publication.isSubscribed) {
                        attachTrack(publication.track);
                    }
                });
    
                participant.on('trackSubscribed', attachTrack);
            });
    
            // ✅ Listen for new participants
            room.on('participantConnected', (participant) => {
                console.log(`Participant ${participant.identity} joined`);
                participant.tracks.forEach(publication => {
                    if (publication.isSubscribed) {
                        attachTrack(publication.track);
                    }
                });
    
                participant.on('trackSubscribed', attachTrack);
            });
    
        } catch (error) {
            console.error('Error joining room:', error);
            alert('Error joining room, please try again.');
        }
    };
    

    // ✅ Helper function to attach tracks to the DOM safely
    const attachTrack = (track) => {
        if (track.kind === 'video') {
            const videoElement = track.attach();
            const container = document.getElementById('remote-video-container');
            if (container) container.appendChild(videoElement);
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

