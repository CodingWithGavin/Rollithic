import { useEffect, useState } from "react";
import { Button} from 'react-bootstrap';
import { turnChange } from "../../api/roomControlsApi";
import { sendPing } from "../../api/websocketApi";

const Controls = ({roomcode, isDm, isMyTurn}) => {
    const [loading, setLoading] = useState(false);

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

        </div>
    );
};

export default Controls;