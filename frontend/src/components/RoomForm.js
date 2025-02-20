import { Button, Card, CardContent, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './RoomForm.css'; // Import the CSS file

const RoomForm = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  // Handle Joining a Room
  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (roomId.trim() && username.trim()) {
      navigate(`/whiteboard/${roomId}?username=${encodeURIComponent(username)}`);
    }
  };

  // Handle Creating a Room
  const handleCreateRoom = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/rooms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to create room");

      const data = await response.json();
      navigate(`/whiteboard/${data.roomId}`); // Redirect to the new room
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  return (
    <div className="room-form-container">
      <Card className="room-form-card">
        <CardContent className="room-form-content">
          <Typography variant="h5" align="center" className="room-form-title">
            Join or Create a Room
          </Typography>

          <TextField
            label="Enter Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="room-form-input"
          />

          <TextField
            label="Enter Room ID"
            variant="outlined"
            fullWidth
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="room-form-input"
          />

          <Button
            onClick={handleJoinRoom}
            variant="contained"
            fullWidth
            className="room-form-button"
          >
            Join Room
          </Button>

          <Button
            onClick={handleCreateRoom}
            variant="outlined"
            fullWidth
            className="room-form-button"
          >
            Create Room
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomForm;
