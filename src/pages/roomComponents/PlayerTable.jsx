import { useEffect, useState } from "react";
import { Button, Table} from 'react-bootstrap';
import { listPlayers, getRoundInfo} from "../../api/tablecontrollerApi";

const PlayerTable = ({lastCommand, setLastCommand, roomcode, playerId }) => {
    const [players, setPlayers] = useState(null);
    const [roominfo, setRoomInfo] = useState(null);
    
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
                        </>
                    ) : (
                        <p>Loading room info...</p>
                    )}
            </div>
            <div>
                {players === null ? (
            // Loading state, could be a spinner or just blank
            <p>Loading players...</p>
            ) : players.length > 0 ? (
                <Table  striped bordered hover responsive="sm" >
                    <thead>
                        <tr>
                            <th>Initiative</th>
                            <th>Player Name</th>
                            <th>HP</th>
                            <th>AC</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.map((player, index) => {
                            const currentPlayersTurn = roominfo?.current_turn === index + 1;
                            return (
                                <tr className={currentPlayersTurn ? "table-success" : ""} key={player.id}>
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
            </div>
        
            
        </div>
    );
};

export default PlayerTable;