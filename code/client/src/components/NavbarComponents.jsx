/* eslint-disable react/prop-types */
import { Navbar, Container, Button, NavbarText } from 'react-bootstrap';
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
    <Navbar collapseOnSelect expand="lg" className="d-flex navbar-expand-lg justify-content-between " bg="primary" variant="dark">
      <a></a>
        <Navbar.Brand
          className='app-title ms-4'
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
              { props.user.role == 'student' ?
                <Nav.Link className='link' id='thesis' onClick={() =>{props.setMessage('');navigate('/thesis')}}> All Thesis</Nav.Link>
              : null}
              {props.user.role === 'teacher' ? 
              <Nav.Link className='link' id='proposal' onClick={() => navigate('/proposal')}>New Proposal</Nav.Link> : null}
              <Nav.Link className='link' id='applications' onClick={() => {props.setMessage(''); navigate('/applications')}}>Applications</Nav.Link>
            </Nav> : null}
          <Nav className='me-4 d-flex align-items-center'>
            {props.loggedIn ?
            <NavbarText>
              {props.user.role === 'teacher' ? <Nav.Link className='link' onClick={() => navigate('/')}>My Proposals</Nav.Link> : null}
            </NavbarText>
            : null}
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
            {props.loggedIn ?
              <Button variant="outline-light h-75" onClick={onLogout}>
                Logout
              </Button>
              :
              <Link to='http://localhost:3001/login' className='btn btn-outline-light'>Login</Link>
            }
          </Nav>
        </Navbar.Collapse>
    </Navbar>
  );
}

export default NavHeader;