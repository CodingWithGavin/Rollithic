const BASE_URL = import.meta.env.VITE_DEV_HTTP_API_URL;

export async function turnChange(roomCode, turnChangeAmount) {
    
    if(!roomCode)
    {
        console.error("No roomcode given");
        return[];
    }
    if(!turnChangeAmount)
    {
        console.error("No amount given to change the current turn");
        return[];
    }

    try {
        const response = await fetch (`${BASE_URL}/room/${roomCode}/turn?increment=${turnChangeAmount}`, {
            method: "POST"
        });
        if(!response.ok)
        {
            throw new Error(`Error status: ${response.status}`);
        }
        //const data = await response.json(); 
        console.log("turn changed");
        
        //return data;
    } catch (error) {
        console.error("Error changing the turn: ", error);
        return [];
    }
}

export async function editRoom(room_code, updateData) {
    try {
        const response = await fetch(`${BASE_URL}/room/${room_code}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(updateData)
        });

        if (!response.ok) {
            throw new Error(`Failed to update room: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error with update to room: ', error);
    }
    
}