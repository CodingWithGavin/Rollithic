//Getting our API links
const BASE_URL = import.meta.env.VITE_DEV_HTTP_API_URL;

//Creating a new room as a DM
export async function createRoom(dmName, initiative) {
    const payload = {
        player_name: dmName.trim(), 
        initiative_count: parseInt(initiative) //make sure the names match up with whats being requested in the lambda back end
    };
    

        console.log("Sending payload:", payload); 
        console.log("To URL:", `${BASE_URL}/room`);

    const response = await fetch(`${BASE_URL}/room`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });


    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const player_response = data.player_response;

    console.log("Full API Response:", data);
    console.log("PLayer Response:", player_response);

    localStorage.setItem('roomData', JSON.stringify({
        roomcode: data.room_id,
        player: {
            id: player_response.player_id,
            name: player_response.player_name,
            initiative: player_response.initiative_count,
            type: player_response.player_type
        }
    }));

    console.log(JSON.parse(localStorage.getItem('roomData')));

    return data;
}

export async function joinRoom(roomID, playername, initiative, hitPointCount, ac) {


    const payload = {
        room_id: roomID,
        player_name: playername.trim(),
        initiative_count: parseInt(initiative),
        hit_point_count: parseInt(hitPointCount),
        AC: parseInt(ac),
        player_type: 'player'
    };
    
    const roomCheckResponse = await fetch(`${BASE_URL}/room/${roomID}`);

    if (!roomCheckResponse.ok){
        if(roomCheckResponse.status === 404) {
            console.log('Error: Room with code ',roomID , ' does not exist.');
            return;
        }else {
            const errordata = await roomCheckResponse.json();
            console.log('Error: ', errordata.message );
            return;
        }
    }

    console.log("Room exists, proceeding to create player...");

    const response = await fetch(`${BASE_URL}/room/${roomID}/players`, {
        method: 'POST',
        headers:{ 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    

    console.log("Player Created");
    const data = await response.json();
    console.log("Player Joined info: ", data)
    localStorage.setItem('roomData', JSON.stringify({
        roomcode: data.room_id,
        player: {
            id: data.player_id,
            name: data.player_name,
            initiative: data.initiative_count,
            type: data.player_type
        }
    }));

    return data;
}

