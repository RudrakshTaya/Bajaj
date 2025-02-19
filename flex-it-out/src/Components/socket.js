import { io } from "socket.io-client";

const socket = io("https://flex-it-out-backend.vercel.app", {
  transports: ["websocket", "polling"], // WebSocket with fallback
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("✅ Connected to Socket.io:", socket.id);
});

export default socket;
