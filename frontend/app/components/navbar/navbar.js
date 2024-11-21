'use client';
import { Image, Nav, NavbarToggle } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';

function Navibar() {
    let currentPage = window.location.pathname;
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/">
                    <Image alt='' src='./favicon.ico' style={{ borderRadius: 7 }}></Image>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto" variant='underline' activeKey={currentPage}>
                        <Nav.Item>
                            <Nav.Link href="/">Home</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href='/score' eventKey="/score">Scorekeeper</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href='/matches' eventKey="/matches">Matches</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href='/players' eventKey="/players">Players</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navibar;
