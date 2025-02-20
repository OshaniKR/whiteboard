
/*
import React, { useEffect, useRef, useState } from "react";

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const socket = useRef(null);
  const contextRef = useRef(null); // For storing canvas drawing context
  const lastPosRef = useRef({ x: 0, y: 0 }); // For storing the last drawing position

  // Handle mouse events to draw on the canvas
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
    context.stroke();

    // Send drawing data to server
    const jsonData = {
      type: "draw",
      x1: lastPosRef.current.x,
      y1: lastPosRef.current.y,
      x2: x,
      y2: y,
    };

    // Check if WebSocket is open before sending data
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify(jsonData));
    } else {
      console.warn("WebSocket is not open. Data not sent.");
    }

    lastPosRef.current = { x, y };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    contextRef.current = context;
    context.lineWidth = 2;
    context.strokeStyle = "black";

    // Create a WebSocket connection to the server
    socket.current = new WebSocket("ws://localhost:8080");

    socket.current.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socket.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "draw") {
          // Replay the drawing action on the canvas
          context.beginPath();
          context.moveTo(data.x1, data.y1);
          context.lineTo(data.x2, data.y2);
          context.stroke();
        }
      } catch (error) {
        console.error("Failed to process WebSocket message:", error);
        console.error("Received data:", event.data);
      }
    };

    socket.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Clean up WebSocket connection on unmount
    return () => {
      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        socket.current.close();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={500}
      style={{ border: "1px solid black" }}
      onMouseDown={startDrawing}
      onMouseUp={stopDrawing}
      onMouseMove={draw}
    />
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
    } else {
      console.warn("WebSocket is not open. Data not sent.");
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
        }
      } catch (error) {
        console.error("Failed to process WebSocket message:", error);
        console.error("Received data:", event.data);
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

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
      <div style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ cursor: "pointer" }}
        />
        <select
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          style={{ cursor: "pointer" }}
        >
          <option value={2}>2px</option>
          <option value={5}>5px</option>
          <option value={10}>10px</option>
          <option value={20}>20px</option>
        </select>
        <button
          onClick={() => setTool("pen")}
          style={{ backgroundColor: tool === "pen" ? "#ddd" : "#fff", padding: "5px 10px", border: "1px solid #000" }}
        >
          Pen
        </button>
        <button
          onClick={() => setTool("eraser")}
          style={{ backgroundColor: tool === "eraser" ? "#ddd" : "#fff", padding: "5px 10px", border: "1px solid #000" }}
        >
          Eraser
        </button>
        <button
          onClick={clearCanvas}
          style={{ padding: "5px 10px", border: "1px solid #000" }}
        >
          Clear
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        style={{ border: "1px solid black", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" }}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
      />
    </div>
  );
};

export default Whiteboard;