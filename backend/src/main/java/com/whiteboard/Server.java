

package com.whiteboard;

import java.io.*;
import java.net.*;
import java.util.concurrent.*;

public class Server {
    // Updated port if needed; currently 5000.
    private static final int PORT = 5000;
    private static final CopyOnWriteArrayList<ClientHandler> clients = new CopyOnWriteArrayList<>();
    private static String canvasState = ""; // Store the current canvas state

    public static void main(String[] args) {
        try {
            // Bind the server to 0.0.0.0 so it accepts connections from any network interface.
            ServerSocket serverSocket = new ServerSocket(PORT, 50, InetAddress.getByName("0.0.0.0"));
            System.out.println("Whiteboard Server started on port " + PORT);

            while (true) {
                Socket clientSocket = serverSocket.accept();
                ClientHandler clientHandler = new ClientHandler(clientSocket);
                clients.add(clientHandler);
                new Thread(clientHandler).start();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Broadcast a message to all connected clients except the sender.
    static void broadcast(String message, ClientHandler sender) {
        for (ClientHandler client : clients) {
            if (client != sender) {
                client.sendMessage(message);
            }
        }
    }

    // Remove a client when they disconnect.
    static void removeClient(ClientHandler client) {
        clients.remove(client);
    }

    // Update the canvas state.
    static void updateCanvasState(String state) {
        canvasState = state;
    }

    // Get the current canvas state.
    static String getCanvasState() {
        return canvasState;
    }
}

