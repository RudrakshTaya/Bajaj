import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import { FaSearch, FaUserPlus } from "react-icons/fa";
import "./MultiplayerBattle.css";

const API_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_URL_PRODUCTION
    : import.meta.env.VITE_API_URL_TESTING || "http://localhost:5001";

const socket = io(API_URL, { transports: ["websocket", "polling"] });

const MultiplayerBattle = () => {
    const { roomId } = useParams();
    const [searchParams] = useSearchParams();
    const exercise = searchParams.get("exercise");
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [participants, setParticipants] = useState([]); // Store joined users

    useEffect(() => {
        console.log("Joined room:", roomId, "Exercise:", exercise);

        // ✅ Emit joinBattle event
        socket.emit("joinBattle", { roomId, userId });

        // ✅ Listen for participant updates
        socket.on("updateParticipants", (updatedParticipants) => {
            setParticipants(updatedParticipants);
        });

        socket.on("playerJoined", ({ userId }) => {
            console.log(`User ${userId} joined`);
        });

        socket.on("playerLeft", ({ userId }) => {
            console.log(`User ${userId} left`);
        });

        return () => {
            socket.emit("leaveBattle", { roomId, userId });
            socket.off("updateParticipants");
            socket.off("playerJoined");
            socket.off("playerLeft");
        };
    }, [roomId, exercise]);

    const handleStartChallenge = () => {
        const returnUrl = `/multiplayer-battle/${roomId}?exercise=${exercise}`;
        navigate(`/pose-detection/${exercise}`, { 
            state: { exercise, userId, returnUrl }
        });
    };

    // Debounced Search Effect
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchTerm.length >= 3) {
                fetchUsers();
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/users/search`, {
                params: { query: searchTerm },
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (inviteeId) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/users/invite`,
                { inviterId: userId, inviteeId, exerciseId: exercise },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const { roomId, challengeType } = response.data;
            alert("Invitation sent!");
            navigate(`/multiplayer-battle/${roomId}?exercise=${challengeType}`);
        } catch (error) {
            console.error("Error sending invite:", error);
            alert("Failed to send invite. Please try again.");
        }
    };

    return (
        <div className="battle-container">
            {/* Search Bar on Top */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search users to invite..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button onClick={fetchUsers} className="search-button">
                    <FaSearch />
                </button>
            </div>

            {/* Search Results */}
            <div className="user-list">
                {loading ? (
                    <p>Loading users...</p>
                ) : (
                    users.map((user) => (
                        <div key={user._id} className="user-card">
                            <span className="username">{user.name}</span>
                            <button className="invite-button" onClick={() => handleInvite(user._id)}>
                                <FaUserPlus /> Invite
                            </button>
                        </div>
                    ))
                )}
            </div>

            <p className="battle-exercise">Exercise: <strong>{exercise}</strong></p>

            {/* Participant List with Scroll */}
            <div className="participants-list">
                <h3>Participants:</h3>
                <div className="participants-container">
                    {participants.length === 0 ? (
                        <p>No participants yet</p>
                    ) : (
                        participants.map((id, index) => (
                            <div key={index} className="participant-item">
                                🏋️ {id === userId ? "You" : id}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <button className="start-button" onClick={handleStartChallenge}>
                🚀 Start {exercise} Challenge
            </button>
        </div>
    );
};

export default MultiplayerBattle;
