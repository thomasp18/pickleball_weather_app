'use client';
import { usePathname } from 'next/navigation';
import { Image, Nav, Navbar, NavbarToggle } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';

function Navibar() {
    let page = {
        '/': 'Home', '/schedule': 'Schedule', '/score': 'Scorekeeper', '/matches': 'Match History', '/players': 'Players'
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/">
                    <Image alt='' src='./favicon.ico' style={{ borderRadius: 7 }}></Image>
                </Navbar.Brand>
                <h1 className='d-lg-none display-3'>{page[usePathname()]}</h1>
                <NavbarToggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto" variant='underline' activeKey={usePathname()}>
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href='/schedule'>Schedule</Nav.Link>
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
