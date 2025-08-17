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