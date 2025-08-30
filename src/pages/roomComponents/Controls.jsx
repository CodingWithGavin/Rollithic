import { useEffect, useState } from "react";
import { Button} from 'react-bootstrap';
import { turnChange } from "../../api/roomControlsApi";
import { sendPing } from "../../api/websocketApi";

const Controls = ({roomcode, playerId, currentPlayerid, isDM }) => {
    const [loading, setLoading] = useState(false);
    const isMyTurn = currentPlayerid === playerId;


    const handleTurnChange = async (amount) => {
        if(!roomcode){
            console.error("No roomcode given");
            return[];
        }

        setLoading(true);
        try {
            await turnChange(roomcode, amount);
            sendPing("The Turn Has Changed", "dataRefresh", roomcode);
            
        } catch (error) {
            console.error("Failed to change turn", err);
        } finally {
        setLoading(false);
        }
    };

    return(
        <div className="flex gap-2 p-4">
            <div>
                <p>My ID: {playerId} </p>
                <p>Current players ID: {currentPlayerid}</p>
                {isDM? (
                    <>
                        <Button
                            varient="primary"
                            disabled={loading}
                            onClick={() => handleTurnChange(1)}
                            >
                            {loading ? "Changing..." : "End Turn"}
                        </Button>

                        <Button
                            varient="secondary"
                            disabled={loading}
                            onClick={() => handleTurnChange(-1)}
                            >
                            {loading ? "Changing..." : "Reverse Turn"}
                        </Button>
                    </>
                ) : (
                    <>
                        {isMyTurn? (
                        <>
                            <Button
                                varient="primary"
                                disabled={loading}
                                onClick={() => handleTurnChange(1)}
                                >
                                {loading ? "Changing..." : "End Turn"}
                            </Button>
                        </>
                    ) : (
                        <p>its not my turn yet</p>
                    )}
                    </>

                )}

                
            </div>
            

        </div>
    );
};

export default Controls;