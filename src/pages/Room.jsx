import { useEffect, useState } from "react";
import { connectSocket, sendMessage, disconnectSocket, sendPing } from "../api/websocketApi";
import { listPlayers } from "../api/tablecontrollerApi";
import PlayerTable from "./roomComponents/playerTable";
import Controls from "./roomComponents/Controls";

const Room = () => {

    const storedData = JSON.parse(localStorage.getItem("roomData"));
    const roomcode = storedData?.roomcode;
    const playerId = storedData?.player?.id;
    const playertype = storedData?.player?.type;

    const [messageInput, setMessageInput] = useState(""); // input state
    const [messages, setMessages] = useState([]); // to store received messages

    const [players, setPlayers] = useState([]); //using to test our api call

    const [lastCommand, setLastCommand] = useState(null);
    const [currentPlayerid, setCurrentPlayerID] = useState(null);

    useEffect(() => {


        connectSocket(roomcode, playerId, handleCommands);
        // This is where the ping system begins from, once this component loads itself a ping is sent to all in the same roomcode connection to datarefresh
        sendPing("Someone has joined", "dataRefresh", roomcode);

        return () => disconnectSocket();
    }, [roomcode, playerId]);

    // WebSocket message handler
    function handleCommands(data) {
        console.log("Websocket ping:", data);
        console.log("Last Command:", data.action);
        setLastCommand(data.action);
    }

    const handleSend = () => {
        if (messageInput.trim()) {
            // Option A: Send via WebSocket
            // sendMessage({ action: "sendMessage", data: messageInput });

            // ✅ Option B: Send via API Gateway (Lambda)
            sendPing(messageInput, "testAction", roomcode);

            setMessageInput("");
        }
    };

    //using to test our listing of players
    const handleListPlayers = async () => {
        if (!roomcode) {
            console.warn("No room code available.");
            return;
        }
        sendPing("Testing ping", "dataRefresh", roomcode);
        //const playerList = await listPlayers(roomcode);
        //console.log("✅ Players fetched:", playerList);
        //setPlayers(playerList); // optional: to show in UI
    };


    return (
        <div>
            <h2>Room: {roomcode}</h2>

            <div>
                <input
                    type="text"
                    placeholder="Enter message"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                />
                <button onClick={handleSend}>Send Message</button>

            </div>

            <div style={{ marginTop: "1em" }}>
                <h3>Received Messages:</h3>
                <ul>
                {messages.map((msg, idx) => (
                    <li key={idx}>{typeof msg === 'string' ? msg : JSON.stringify(msg)}</li>
                ))}
                </ul>
            </div>

            <button onClick={handleListPlayers}>🔍 Test datarefresh ping </button>

            <div>
                <h3>Debug Info</h3>
                <p>Roomcode: {roomcode}</p>
                <p>Player ID: {playerId}</p>
                <p>Player Type: {playertype}</p>
                <p>Last Command: {lastCommand}</p>
                </div>

            <div >
                <PlayerTable 
                playerId={playerId}
                lastCommand={lastCommand} 
                setLastCommand={setLastCommand} 
                roomcode={roomcode} 
                setCurrentPlayerID={setCurrentPlayerID}
                isDM={playertype==="DM"} />
            </div>
            <div>
                <Controls 
                roomcode={roomcode} 
                playerId={playerId}
                currentPlayerid={currentPlayerid}
                isDM={playertype==="DM"}  />
            </div>

        </div>
    );
};

export default Room;
