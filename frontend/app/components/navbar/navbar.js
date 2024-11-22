'use client';
import { usePathname } from 'next/navigation';
import { Nav, Navbar, NavbarToggle } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Image from 'next/image';

function Navibar() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/">
                    <Image alt='' src='/logo.png' style={{ borderRadius: 7 }} width='48' height='48'></Image>
                </Navbar.Brand>
                <NavbarToggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto" variant='underline' activeKey={usePathname()}>
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
