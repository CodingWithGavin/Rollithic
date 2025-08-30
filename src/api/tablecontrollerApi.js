const BASE_URL = import.meta.env.VITE_DEV_HTTP_API_URL;

export async function listPlayers(roomCode){
    //check if there is an input
    if(!roomCode)
    {
        console.error("No roomcode given");
        return[];
    }

    try {
        const response = await fetch(`${BASE_URL}/room/${roomCode}/players`);
        if(!response.ok){
            throw new Error("Failed to list out our player:  ${response.statusText}");
        }
        //we parse the data from json so its easier to handle
        const parsedBody = await response.json();
        console.log("Parsed players: ", parsedBody);

        //Here we use the parsed data and sort it by the initiative_count to ensure that the output is always ordered correctly
        const sortedPlayers = parsedBody.sort(
            (a, b) => b.initiative_count  - a.initiative_count
        );
        return sortedPlayers 
    } catch (error) {
        console.error("Error fetching the data: ", error);
        return [];
    }

}

export async function getRoundInfo(roomCode) {
        if(!roomCode)
    {
        console.error("No roomcode given");
        return[];
    }

    try {
        const response = await fetch(`${BASE_URL}/room/${roomCode}`);
        if(!response.ok){
            throw new Error("Failed to list our roominfo:  ${response.statusText}");
        }
        const parsedBody = await response.json();
        console.log("Room Info: ", parsedBody);

        return parsedBody
    } catch (error) {
        console.error("GetRoundInfo Error:" , error)
        return[];
    }
}

export async function editPlayer(playerId, updatedData) {
    
    try {
        const response = await fetch(`${BASE_URL}/players/${playerId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            throw new Error(`Failed to update player: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error with update to player: ', error);
    }
}

export async function kickPlayer(playerId) {
    try {
        const response = await fetch(`${BASE_URL}/players/${playerId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json'},
        });

        if (!response.ok) {
            throw new Error(`Failed to update player: ${response.status} ${response.statusText}`);
        }

    } catch (error) {
        console.error('Error with deleting player: ', error);
    }
}