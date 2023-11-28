/* eslint-disable react/prop-types */
import { Navbar, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import { LogoutButton } from './AuthComponents';
import User from '../assets/user.png';
import Clock from './Clock';
import { useState } from 'react';


function NavHeader(props) {
  const [showClock, setShowClock] = useState(false);
  const navigate = useNavigate();

  const handleDateChange = (newDate) => {
    // Handler? should pass it to app.jsx
    props.onDateChange(newDate);
  };
  const onLogout = async () => {
    await props.handleLogout();
    // Go back to main screen
    //console.log(props.user);
    navigate("/login");
  }

  return (
    <Navbar collapseOnSelect expand="lg" className="d-flex navbar-expand-lg justify-content-around" bg="primary" variant="dark">
      <a></a>
      <Container>
        <Navbar.Brand
          className='app-title'
          onClick={() => {
            if (props.loggedIn)
              setShowClock(!showClock)
          }
          }>
          Thesis Management
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          {props.loggedIn ? (showClock ? <Clock onDateChange={handleDateChange} setShowClock={setShowClock} currentDate={props.currentDate} newDate={props.newDate} setNewDate={props.setNewDate} setCurrentDate={props.setCurrentDate} /> : null) : null}
          {props.loggedIn ?
            <Nav className="me-auto">
              <Nav.Link className='link'id='thesis' onClick={() => { props.setMessage(''); navigate('/thesis') }}>Thesis</Nav.Link>
              {props.user.role === 'teacher' ? <Nav.Link className='link' id='proposal' onClick={() => { navigate('/proposal'); props.setMessage('') }}>Proposal</Nav.Link> : null}
              <Nav.Link className='link' id='applications' onClick={() => { props.setMessage(''); navigate('/applications') }}>Applications</Nav.Link>
            </Nav> : null}
          <Nav>
            {props.loggedIn ?
              <Navbar.Text>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                  <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                </svg>
                <span className="text-light me-3 username">{props.user.role}</span>
                <span className="text-light me-3 username">{props.user.id}, {props.user.name} {props.user.surname}</span>
              </Navbar.Text>
              : null}
          </Nav>
          <Nav>
            {props.loggedIn ?
              <Button variant="outline-light" onClick={onLogout}>
                Logout
              </Button>
              :
              <Link to='http://localhost:3001/login' className='btn btn-outline-light'>Login</Link>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavHeader;