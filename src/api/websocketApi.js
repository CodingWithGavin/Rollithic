const WEBSOCKET_URL = import.meta.env.VITE_DEV_WEBSOCKET_API_URL;
const BASE_URL = import.meta.env.VITE_DEV_HTTP_API_URL;

let socket = null;

export function connectSocket(roomCode, playerId, onMessageCallback) {

    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
    }

    if (!roomCode || !playerId) {
        console.error("roomCode and playerId are required to establish WebSocket connection.");
        return;
    }

    const url = `${WEBSOCKET_URL}?room_code=${roomCode}&player_id=${playerId}`;
    socket = new WebSocket(url);

    socket.onopen = () => {
        console.log("✅ WebSocket connection opened");

        setInterval(() => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ type: "ping" }));
                console.log("🔁 Sent ping to keep connection alive");
            }
        }, 30000); // every 30s
    };

    socket.onmessage = (event) => {
    try {
        const message = JSON.parse(event.data);
        console.log("📨 Parsed message:", message);

        if (onMessageCallback) {
            onMessageCallback(message);
        }
    } catch (e) {
        console.error("Failed to parse message:", event.data);
    }
    };

    socket.onclose = () => {
        console.log("❌ WebSocket connection closed");
    };

    socket.onerror = (error) => {
        console.error("⚠️ WebSocket error:", error);
    };
}

export function sendMessage(data) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(data));
        console.log("📤 Message sent:", data);
    } else {
        console.warn("WebSocket is not open. Cannot send message.");
    }
}

export function disconnectSocket() {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
        console.log("🔌 WebSocket connection manually closed.");
    } else {
        console.warn("WebSocket already closed or was never opened.");
    }
}

export function getSocket() {
    return socket;
}

export async function sendPing(sendingmessage, sendingaction, roomCode) {

    try {
        const response = await fetch(`${BASE_URL}/ping`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                roomCode: roomCode,
                message: sendingmessage,
                action: sendingaction
            })
        });

        const result = await response.json();
        console.log("✅ Ping sent:", result);
    } catch (error) {
        console.error("❌ Error sending ping:", error);
    }
}