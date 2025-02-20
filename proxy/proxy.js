/*
const WebSocket = require("ws");
const net = require("net");

// Create a WebSocket server for the frontend
const frontendServer = new WebSocket.Server({ port: 8080 });

// Create a TCP client to connect to the Java backend
const backendSocket = new net.Socket();
backendSocket.connect(5000, "localhost", () => {
  console.log("Connected to Java backend");
});

// Store connected frontend clients
const frontendClients = new Set();

frontendServer.on("connection", (frontendSocket) => {
  console.log("Frontend connected to proxy");
  frontendClients.add(frontendSocket);

  frontendSocket.on("message", (message) => {
    const decodedMessage = message.toString();
    console.log("Received message from frontend:", decodedMessage);

    // Broadcast to all other frontends (including sender)
    frontendClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(decodedMessage);
      }
    });

    // Forward message to Java backend
    if (backendSocket.writable) {
      backendSocket.write(decodedMessage + "\n");
    }
  });

  frontendSocket.on("close", () => {
    console.log("Frontend disconnected");
    frontendClients.delete(frontendSocket);
  });
});

// Forward messages from backend to all connected frontends
backendSocket.on("data", (data) => {
  const message = data.toString().trim();
  console.log("Received data from Java backend:", message);

  frontendClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
});

backendSocket.on("error", (error) => {
  console.error("TCP socket error:", error);
});

backendSocket.on("close", () => {
  console.log("Disconnected from Java backend");
});

console.log("WebSocket proxy running on ws://localhost:8080");
*/


const WebSocket = require("ws");
const net = require("net");

// Create a WebSocket server for the frontend on port 8080.
const frontendServer = new WebSocket.Server({ port: 8080 });

// Create a TCP client to connect to the Java backend.
// If the Java backend runs on the same machine, "localhost" works fine.
const backendSocket = new net.Socket();
backendSocket.connect(5000, "localhost", () => {
  console.log("Connected to Java backend");
});

// Store connected frontend clients.
const frontendClients = new Set();

frontendServer.on("connection", (frontendSocket) => {
  console.log("Frontend connected to proxy");
  frontendClients.add(frontendSocket);

  frontendSocket.on("message", (message) => {
    const decodedMessage = message.toString();
    console.log("Received message from frontend:", decodedMessage);

    // Broadcast to all frontends (including sender)
    frontendClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(decodedMessage);
      }
    });

    // Forward message to Java backend.
    if (backendSocket.writable) {
      backendSocket.write(decodedMessage + "\n");
    }
  });

  frontendSocket.on("close", () => {
    console.log("Frontend disconnected");
    frontendClients.delete(frontendSocket);
  });
});

// Forward messages from backend to all connected frontends.
backendSocket.on("data", (data) => {
  const message = data.toString().trim();
  console.log("Received data from Java backend:", message);

  frontendClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
});

backendSocket.on("error", (error) => {
  console.error("TCP socket error:", error);
});

backendSocket.on("close", () => {
  console.log("Disconnected from Java backend");
});

console.log("WebSocket proxy running on ws://localhost:8080");
