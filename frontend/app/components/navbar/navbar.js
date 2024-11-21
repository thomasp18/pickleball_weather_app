'use client';
import { Image, Nav, NavbarToggle } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';

function Navibar() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/">
                    <Image alt='' src='./favicon.ico' style={{ borderRadius: 7 }}></Image>
                </Navbar.Brand>
                <NavbarToggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto" variant='underline' activeKey={window.location.pathname}>
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href='/score' eventKey="/score">Scorekeeper</Nav.Link>
                        <Nav.Link href='/matches' eventKey="/matches">Matches</Nav.Link>
                        <Nav.Link href='/players' eventKey="/players">Players</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navibar;
