import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import "./GroupPage.css";

const socket = io("http://localhost:5001");

const GroupPage = () => {
  const { id } = useParams(); // Group ID from URL
  const [group, setGroup] = useState(null);
  const [joined, setJoined] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // Fetch Group Data
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/group/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Group Data:", response.data);
        setGroup(response.data);
        setMessages(response.data.messages || []);
        setJoined(response.data.isMember);
      } catch (error) {
        console.error("Failed to fetch group data", error);
      }
    };

    fetchGroup();
  }, [id, token]);

  // 🔹 Connect to the group in Socket.io
  useEffect(() => {
    if (joined) {
      socket.emit("joinGroup", id);
    }

    return () => {
      socket.off("newMessage"); // Proper cleanup
    };
  }, [joined, id]);

  // 🔹 Listen for real-time messages
  useEffect(() => {
    const handleNewMessage = (message) => {
      console.log("New message received:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage); // Proper cleanup
    };
  }, []);

  // ✅ Join Group
  const handleJoin = async () => {
    try {
      await axios.post(
        `http://localhost:5001/api/group/${id}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJoined(true);
      socket.emit("joinGroup", id);
    } catch (error) {
      console.error("Failed to join group", error);
    }
  };

  // ✅ Leave Group
  const handleLeave = async () => {
    try {
      await axios.post(
        `http://localhost:5001/api/group/${id}/leave`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJoined(false);
    } catch (error) {
      console.error("Failed to leave group", error);
    }
  };

  // ✅ Send Message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:5001/api/group/${id}/message`,
        { text: newMessage, senderId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newMsg = response.data;
      socket.emit("sendMessage", newMsg);

      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (!group) return <p className="loading-message">Loading group...</p>;

  return (
    <div className="group-container">
      <h1 className="group-title">{group.name}</h1>

      <button className="join-button" onClick={joined ? handleLeave : handleJoin}>
        {joined ? "Leave Group" : "Join Group"}
      </button>

      <div className="members-list">
        <h2>Members</h2>
        <ul>
          {group.members.map((member) => (
            <li key={member._id}>{member.name}</li>
          ))}
        </ul>
      </div>

      {joined && (
        <div className="group-chat">
          <h2>Group Chat</h2>
          <div className="chat-box">
            {messages.map((msg, index) => (
              <div key={index} className="chat-message">
                <p>
                  <strong>{msg.sender?.name || "Unknown"}:</strong> {msg.text}
                </p>
                <small>{new Date(msg.createdAt).toLocaleTimeString()}</small>
              </div>
            ))}
          </div>

          <div className="message-form">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupPage;