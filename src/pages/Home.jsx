import { useState, useEffect, useRef } from 'react';
import { Button, Modal, Collapse, Card, Form, Container } from 'react-bootstrap';
import { createRoom, joinRoom } from '../api/roomApi';
import { useNavigate } from 'react-router-dom';

function Home(){
    const [showCreate, setShowCreate]= useState(false);
    const [showJoin, setShowJoin]= useState(false);
    const collapseRef = useRef(null);

    const navigate = useNavigate();

    const toggleCreate = () => {
        setShowCreate(!showCreate);
        setShowJoin(false);
    }
    const toggleJoin = () => {
        setShowJoin(!showJoin);
        setShowCreate(false);
       
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if(
                collapseRef.current && !collapseRef.current.contains(event.target)
            ){
                setShowCreate(false);
                setShowJoin(false);
                
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return() => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);




    const handleCreateRoom = async (event) => {
        event.preventDefault();

        const dmName = document.getElementById("dmEntry").value;
        const initiative = document.getElementById("initiativeCreate").value;

        

        try {
            const response = await createRoom(dmName, initiative);
            console.log("Room Created:", response);

            navigate(`/room/${response.room_id}`);
        } catch (error) {
            console.error("Failed to create room:", error);
        }
    };

    const handleJoinRoom = async (event) => {
        event.preventDefault();

        const roomCode = document.getElementById("roomcodeJoin").value.toUpperCase();
        const playername = document.getElementById("nameEntryJoin").value;
        const initiative = document.getElementById("initiativeJoin").value;
        const hitpoints = document.getElementById("hitpointsJoin").value;
        const AC = document.getElementById("acJoin").value;

        try{
            const response = await joinRoom(roomCode, playername, initiative, hitpoints, AC);

            navigate(`/room/${roomCode}`);
        } catch (error){
            console.error("Join Error", error );
        }
    };

    return(
        <Container ref={collapseRef} className="text-center mt-5">
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>

                
                <h1>Welcome to Rollithic!</h1>
                <p className='lead'>Track turns and manage your battles!</p>
                <div className="d-flex justify-content-center gap-3 mt-4">
                    <Button variant='primary' className='me-3' onClick={toggleCreate}>Create Room</Button>
                    <Button variant='success'className='me-3' onClick={toggleJoin}>Join Room</Button>
                    
                </div>

                <Collapse in={showCreate}>
                    <div className="mt-4">
                        <Card className="bg-dark text-white border-light shadow">
                            <Card.Body>
                            <Form  onSubmit={handleCreateRoom}>
                                <Form.Group className="mb-3">

                                    <Form.Label style={{ userSelect: 'none' }} htmlFor="dmEntry">Enter Your Name </Form.Label>
                                    <Form.Control name="dmEntry" id="dmEntry" type="text" placeholder="Enter Your Name" />

                                    <Form.Label style={{ userSelect: 'none' }} htmlFor="initiativeCreate">Initiative </Form.Label>
                                    <Form.Control name="initiativeCreate" id="initiativeCreate" type="number" placeholder="Enter Your Initiative" />


                                </Form.Group>
                                <Button variant="light" className='me-3 mt-2  ' type="submit">Create</Button>
                                <Button variant='danger' className='me-3 mt-2 ' onClick={() => setShowCreate(false)}>Cancel</Button>
                            </Form>
                            </Card.Body>
                        </Card>
                    </div>
                </Collapse>

                <Collapse in={showJoin}>
                    <div className="mt-4">
                        <Card className="bg-dark text-white border-light shadow">
                            <Card.Body>
                            <Form onSubmit={handleJoinRoom}>
                                <Form.Group className="mb-3">

                                    <Form.Label style={{ userSelect: 'none' }} htmlFor="roomcodeJoin">Enter Room Code </Form.Label>
                                    <Form.Control name="roomcodeJoin" id="roomcodeJoin" type="text" placeholder="Room Code" />
                                    
                                    <Form.Label style={{ userSelect: 'none' }} htmlFor="nameEntryJoin">Enter Your Name </Form.Label>
                                    <Form.Control name="nameEntryJoin" id="nameEntryJoin" type="text" placeholder="Enter Your Name" />

                                    <Form.Label style={{ userSelect: 'none' }} htmlFor="initiativeJoin">Initiative </Form.Label>
                                    <Form.Control name="initiativeJoin" id="initiativeJoin" type="number" placeholder="Enter Your Initiative" />

                                    <Form.Label style={{ userSelect: 'none' }} htmlFor="hitpointsJoin">Hit Points </Form.Label>
                                    <Form.Control name="hitpointsJoin" id="hitpointsJoin" type="number" placeholder="Enter Your Hit Points" />

                                    <Form.Label style={{ userSelect: 'none' }} htmlFor="acJoin">Armor Class </Form.Label>
                                    <Form.Control name="acJoin" id="acJoin" type="number" placeholder="Enter Your Armor Class" />

                                </Form.Group>
                                <Button variant="light" className='me-3 mt-2 ' type="submit">Join</Button>
                                <Button variant='danger' className='me-3 mt-2 ' onClick={() => setShowJoin(false)}>Cancel</Button>
                            </Form>
                            </Card.Body>
                        </Card>
                    </div>
                </Collapse>


                {/* Modal for Creating the room */}
                {/* <Modal show={showCreate} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Your Room</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Fill out the details please</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='secondary' onClick={handleClose}>Cancel</Button>
                        <Button varient='primary'>Create</Button>
                    </Modal.Footer>
                </Modal> */}





                {/* Modal idea */}
                {/* <Modal show={showJoin} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Your Room</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Fill out the details please</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='secondary' onClick={handleClose}>Cancel</Button>
                        <Button varient='primary'>Join</Button>
                    </Modal.Footer>
                </Modal> */}
            </div>
        </Container>
    );
}

export default Home;