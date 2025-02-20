/*

import React, { useEffect, useRef, useState } from "react";
import "./Whiteboard.css";

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState("pen");
  const socket = useRef(null);
  const contextRef = useRef(null);
  const lastPosRef = useRef({ x: 0, y: 0 });

  const [messages, setMessages] = useState([]); // Chat messages
  const [message, setMessage] = useState(""); // Current message input
  const prevMessagesRef = useRef(new Set()); // Store message history to avoid duplicates

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    contextRef.current = context;
    context.lineCap = "round";
    context.lineJoin = "round";

    socket.current = new WebSocket("ws://192.168.47.1:8080");

    socket.current.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socket.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "draw") {
          context.strokeStyle = data.color;
          context.lineWidth = data.brushSize;
          context.beginPath();
          context.moveTo(data.x1, data.y1);
          context.lineTo(data.x2, data.y2);
          context.stroke();
        } else if (data.type === "clear") {
          context.clearRect(0, 0, canvas.width, canvas.height);
        } else if (data.type === "chat") {
          // Prevent duplicate messages using a Set
          if (!prevMessagesRef.current.has(data.message)) {
            setMessages((prev) => [
              ...prev,
              { text: data.message, isSent: data.sender === "me" },
            ]);
            prevMessagesRef.current.add(data.message); // Store message to avoid re-adding
          }
        }
      } catch (error) {
        console.error("Failed to process WebSocket message:", error);
      }
    };

    socket.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        socket.current.close();
      }
    };
  }, []);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    lastPosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const context = contextRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.beginPath();
    context.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    context.lineTo(x, y);
    context.strokeStyle = tool === "eraser" ? "#FFFFFF" : color;
    context.lineWidth = brushSize;
    context.stroke();

    const jsonData = {
      type: "draw",
      x1: lastPosRef.current.x,
      y1: lastPosRef.current.y,
      x2: x,
      y2: y,
      color: tool === "eraser" ? "#FFFFFF" : color,
      brushSize: brushSize,
    };

    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify(jsonData));
    }

    lastPosRef.current = { x, y };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify({ type: "clear" }));
    }
  };

  const sendMessage = () => {
    if (message.trim() === "") return;

    const chatMessage = {
      type: "chat",
      message,
      sender: "me", // Add sender information
    };

    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify(chatMessage));
    }

    // Clear the input field
    setMessage("");
  };

  // Function to save the canvas as an image
  const saveCanvasAsImage = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png"); // You can also use "image/jpeg" for JPEG format
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "whiteboard-drawing.png"; // Default file name
    link.click();
  };

  return (
    <div className="whiteboard-wrapper">
      <div className="whiteboard-container">
        <div className="toolbar">
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="color-picker" />
          <select value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="brush-size">
            <option value={2}>2px</option>
            <option value={5}>5px</option>
            <option value={10}>10px</option>
            <option value={20}>20px</option>
          </select>
          <button onClick={() => setTool("pen")} className={`tool-btn ${tool === "pen" ? "active" : ""}`}>
            ✏️ Pen
          </button>
          <button onClick={() => setTool("eraser")} className={`tool-btn ${tool === "eraser" ? "active" : ""}`}>
            🧽 Eraser
          </button>
          <button onClick={clearCanvas} className="clear-btn">🗑️ Clear</button>
          <button onClick={saveCanvasAsImage} className="save-btn">💾 Save</button>
        </div>
        <div className="canvas-wrapper">
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className="canvas"
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseMove={draw}
          />
        </div>
        <div className="chat-section">
          <div className="chat-box">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.isSent ? "sent" : "received"}`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;

*/

import React, { useEffect, useRef, useState } from "react";
import "./Whiteboard.css";

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState("pen");
  const socket = useRef(null);
  const contextRef = useRef(null);
  const lastPosRef = useRef({ x: 0, y: 0 });

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    if (!isJoined) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    contextRef.current = context;
    context.lineCap = "round";
    context.lineJoin = "round";

    socket.current = new WebSocket("ws://192.168.47.1:8080");

    socket.current.onopen = () => {
      console.log("Connected to WebSocket server");
      socket.current.send(JSON.stringify({ type: "join", username }));
    };

    socket.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "draw") {
          context.strokeStyle = data.color;
          context.lineWidth = data.brushSize;
          context.beginPath();
          context.moveTo(data.x1, data.y1);
          context.lineTo(data.x2, data.y2);
          context.stroke();
        } else if (data.type === "clear") {
          context.clearRect(0, 0, canvas.width, canvas.height);
        } else if (data.type === "chat") {
          setMessages((prev) => [
            ...prev,
            { text: data.message, sender: data.sender, isSent: data.sender === username },
          ]);
        }
      } catch (error) {
        console.error("Failed to process WebSocket message:", error);
      }
    };

    socket.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        socket.current.close();
      }
    };
  }, [isJoined, username]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    lastPosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const context = contextRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.beginPath();
    context.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    context.lineTo(x, y);
    context.strokeStyle = tool === "eraser" ? "#FFFFFF" : color;
    context.lineWidth = brushSize;
    context.stroke();

    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(
        JSON.stringify({
          type: "draw",
          x1: lastPosRef.current.x,
          y1: lastPosRef.current.y,
          x2: x,
          y2: y,
          color: tool === "eraser" ? "#FFFFFF" : color,
          brushSize: brushSize,
        })
      );
    }

    lastPosRef.current = { x, y };
  };

  const clearCanvas = () => {
    const context = contextRef.current;
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify({ type: "clear" }));
    }
  };

  const sendMessage = () => {
    if (message.trim() === "") return;

    // Send only the message text without appending username
    const chatMessage = {
      type: "chat",
      message: message,
      sender: username,
    };

    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify(chatMessage));
    }

    setMessage("");
  };

  const saveCanvasAsImage = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "whiteboard-drawing.png";
    link.click();
  };

  const joinChat = () => {
    if (username.trim() === "") return;
    setIsJoined(true);
  };

  return (
    <div className="whiteboard-wrapper">
      {!isJoined ? (
        <div className="join-chat-container">
          <div className="join-chat-card">
            <h2>Join the Whiteboard Chat</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="join-chat-input"
            />
            <button onClick={joinChat} className="join-chat-btn">
              Join Chat
            </button>
          </div>
        </div>
      ) : (
        <div className="whiteboard-container">
          <div className="toolbar">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="color-picker"
            />
            <select
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="brush-size"
            >
              <option value={2}>2px</option>
              <option value={5}>5px</option>
              <option value={10}>10px</option>
              <option value={20}>20px</option>
            </select>
            <button
              onClick={() => setTool("pen")}
              className={`tool-btn ${tool === "pen" ? "active" : ""}`}
            >
              ✏️ Pen
            </button>
            <button
              onClick={() => setTool("eraser")}
              className={`tool-btn ${tool === "eraser" ? "active" : ""}`}
            >
              🧽 Eraser
            </button>
            <button onClick={clearCanvas} className="clear-btn">
              🗑️ Clear
            </button>
            <button onClick={saveCanvasAsImage} className="save-btn">
              💾 Save
            </button>
          </div>
          <div className="canvas-wrapper">
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              className="canvas"
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseMove={draw}
            />
          </div>
          <div className="chat-section">
            <div className="chat-box">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-message ${msg.isSent ? "sent" : "received"}`}
                >
                  <strong>{msg.sender}:</strong> {msg.text}
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Whiteboard;
