import { Navbar, Container, Nav } from 'react-bootstrap';

function AppNavbar(){
    return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="#">Initiative Tracker</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
           {/* <Nav.Link href="#">Home</Nav.Link> */}
            {/* <Nav.Link href="#">Rooms</Nav.Link> */}
            {/* <Nav.Link href="#">About</Nav.Link> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
//this is currently a baseline navbar not being utilised until later future implementation come up
export default AppNavbar