'use client';
import { Image, Nav, NavbarToggle } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { NavDropdown } from 'react-bootstrap';

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
                    <Nav className="me-auto" variant='underline'>
                        <Nav.Item>
                            <Nav.Link href="/" className={`${currentPage === '/' ? 'active' : ''}`}>Home</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href='/score' eventKey="score" className={`${currentPage === '/score' ? 'active' : ''}`}>Scorekeeper</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href='/matches' eventKey="matches" className={`${currentPage === '/matches' ? 'active' : ''}`} >Matches</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href='/players' eventKey="players" className={`${currentPage === '/players' ? 'active' : ''}`}>Players</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navibar;
