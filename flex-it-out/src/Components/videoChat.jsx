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
            const response = await axios.post('http://localhost:5001/api/video/token', { room: roomName }); // ✅ Fix API request body
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
    
            console.log("Token from backend:", token); // Log the token
    
            // Create local tracks with error handling
            const tracks = await createLocalTracks({ audio: true, video: { width: 640 } })
                .catch(error => {
                    console.error("Error creating local tracks:", error);
                    throw error;
                });
    
            console.log('Tracks created:', tracks); // Log the tracks
            setLocalTracks(tracks);
    
            const room = await connect(token, { name: roomName, tracks: tracks });
            setVideoRoom(room);
    
            console.log(`Joined the room: ${room.name}`);
        } catch (error) {
            console.error('Error joining room:', error);
            alert('Error joining room, please try again.');
        }
    };

    return (
        <div className="video-chat">
            <h2>Video Chat</h2>
            {videoRoom ? (
                <div>
                    <h3>You are in room: {videoRoom.name}</h3>
                    <div>
                    <div>
                    {localTracks.map((track) => {
                        if (track.kind === 'video') {
                            const videoElement = track.attach();
                            return <div key={track.sid} ref={(el) => el && el.appendChild(videoElement)} />;
                        }
                        return null; 
                    })}
                </div>

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