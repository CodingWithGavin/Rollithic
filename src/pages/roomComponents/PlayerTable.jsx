import { useEffect, useState, useRef } from "react";
import { Button, Table, Modal, Form} from 'react-bootstrap';
import { listPlayers, getRoundInfo, editPlayer, kickPlayer} from "../../api/tablecontrollerApi";
import { sendPing } from "../../api/websocketApi";

const PlayerTable = ({playerId, lastCommand, setLastCommand, roomcode, setCurrentPlayerID, isDM}) => {
    const [players, setPlayers] = useState(null);
    const [roominfo, setRoomInfo] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [showModal, setShowModal] = useState(false);
    
    const hasRedirected = useRef(false);

    //useeffect to manage room and player info
    useEffect(() =>
    {
        
        if(!roomcode)
            return;

        const fetchPlayers = async () => {


            try{
                const playerList = await listPlayers(roomcode);
                setPlayers(playerList);
                
            } catch(error){
                console.error("Failed to list out the players: ", error);
            }
        };
        const fetchRoomInfo = async () => {
            try {
                const roominfo = await getRoundInfo(roomcode);
                console.log("Room Check: " , roominfo)
                setRoomInfo(roominfo);

            } catch (error) {
                console.error("Failed to get room info: ", error)
            }
        }

        
        if(!lastCommand ){
            fetchPlayers();
            fetchRoomInfo();
            return;
        }

        const handleCommand = async () => {
            switch(lastCommand)
            {
                case "dataRefresh":
                    await fetchPlayers();
                    await fetchRoomInfo();
                    setLastCommand("idle");
                    break;
                case "turnEnded":
                    // increase the turn count and refresh the page
                    break;
                default:
                    break;
            }
        };


        handleCommand();
    }, [lastCommand, roomcode]);
    //useeffect to manage element after we have the player room info
    useEffect(() => {
                


                if (!playerId || !roominfo || !players || players.length === 0) return;

                //Check if you are in the room or were you kicked
                const stillInRoomCheck = players.some(p => p.id === playerId);

                if(!stillInRoomCheck) {
                    hasRedirected.current = true;
                    alert("You have been kicked");
                    window.location.href = "/"
                }

                const turnIndex = roominfo.current_turn -1; 
                const currentPlayerid = players[turnIndex]?.id;
                setCurrentPlayer(players[turnIndex]?.id);
                setCurrentPlayerID(players[turnIndex]?.id);
            

    }, [roominfo, players, setCurrentPlayerID]);

    // console.log("👀 PlayerTable loaded. Room:", roomcode, "Player ID" , playerId, "LastCommand:", lastCommand);
    return (
        <div>
            <div>
                {roominfo ? (
                        <>
                            <h2>Room: {roominfo.room_code} </h2>
                            <p>Status: {roominfo.room_status}</p>
                            <p>Round: {roominfo.round_count} Current Turn: {roominfo.current_turn}</p>
                            <p>Session Start: {roominfo.session_start_time}</p>
                            <p>currentPlayer: {currentPlayer}</p>
                        </>
                    ) : (
                        <p>Loading room info...</p>
                    )}
            </div>
            <div className="d-flex justify-content-center p-2 ">
                    {players === null ? (
                // Loading state, could be a spinner or just blank
                <p>Loading players...</p>
                ) : players.length > 0 ? (
                    <Table  striped bordered hover responsive="sm"  className="w-auto" >
                        <thead>
                            <tr className="text-center">
                                <th className="px-4" style={{ minWidth: "100px" }}>Initiative</th>
                                <th className="px-4" style={{ minWidth: "100px" }}>Player Name</th>
                                <th className="px-4" style={{ minWidth: "100px" }}>HP</th>
                                <th className="px-4" style={{ minWidth: "100px" }}> AC</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map((player, index) => {
                                const currentPlayersTurn = roominfo?.current_turn === index + 1;
                                return (
                                    <tr 
                                        key={player.id}
                                        className={currentPlayersTurn ? "table-success text-center" : "text-center"} 
                                        onClick={() => {
                                            setSelectedPlayer(player);
                                            setShowModal(true);
                                        }}
                                        style={{ cursor: "pointer"}}
                                        >
                                            <td>{player.initiative_count}</td>
                                            <td>{player.player_name}</td>
                                            <td>{player.hit_point_count}</td>
                                            <td>{player.AC}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>

                ) : (
                    <h2>Wait... how did you get here???</h2>
                )}
                {(isDM || playerId === selectedPlayer?.id) && (

                    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Player</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedPlayer && (
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Initiative</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={selectedPlayer.initiative_count}
                                        onChange={(e) =>
                                            setSelectedPlayer({ ...selectedPlayer, initiative_count: parseInt(e.target.value, 10)})
                                        }
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedPlayer.player_name}
                                        onChange={(e) =>
                                            setSelectedPlayer({ ...selectedPlayer, player_name: e.target.value})
                                        }
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Hit Points</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={selectedPlayer.hit_point_count}
                                        onChange={(e) =>
                                            setSelectedPlayer({ ...selectedPlayer, hit_point_count: parseInt(e.target.value, 10)})
                                        }
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Armour Class</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={selectedPlayer.AC}
                                        onChange={(e) =>
                                            setSelectedPlayer({ ...selectedPlayer, AC: parseInt(e.target.value, 10)})
                                        }
                                    />
                                </Form.Group>
                                
                            </Form>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            {isDM && (

                                <Button
                                variant="danger"
                                onClick={async () => {
                                    try {
                                        await kickPlayer(selectedPlayer.id);

                                        sendPing("A player has been kicked", "dataRefresh", roomcode);
                                        setShowModal(false);
                                        
                                    } catch (error) {
                                        console.error("Failed to save changes:", err);
                                    }
                                    
                                }}
                                >
                                Kick Player
                                </Button>
                            )}
                            <Button
                            variant="primary"
                            onClick={async () => {
                                try {
                                    await editPlayer(selectedPlayer.id, {
                                        player_name: selectedPlayer.player_name,
                                        initiative_count: selectedPlayer.initiative_count,
                                        AC: selectedPlayer.AC,
                                        hit_point_count: selectedPlayer.hit_point_count,
                                    });

                                    sendPing("A player has been updated", "dataRefresh", roomcode);
                                    setShowModal(false);
                                    
                                } catch (error) {
                                    console.error("Failed to save changes:", err);
                                }
                                
                            }}
                            >
                            Save Changes
                            </Button>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancel
                            </Button>
                        </Modal.Footer>
                        </Modal>
                )}

            </div>
        
            
        </div>
    );
};

export default PlayerTable;