/* eslint-disable react/prop-types */
import { Navbar, Container, Button, NavbarText } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import { LogoutButton } from './AuthComponents';
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
    // Go back to the main screen
    navigate("/login");
  }

  return (
    <Navbar collapseOnSelect expand="lg" className="d-flex navbar-expand-lg justify-content-center flex-column">
      {/* Upper Row for Clock and Navbar.Brand */}
      <div className="d-flex align-items-center w-100 mb-3">
        <div className="d-flex align-items-left">
          <span className="me-2 text-light" onClick={() => {
            if (props.loggedIn)
              setShowClock(!showClock);
          }}>
            <div className='clock-icon'>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ffffff" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
              </svg>
            </div>
          </span>
          {props.loggedIn && showClock && (
            <Clock
              onDateChange={handleDateChange}
              setShowClock={setShowClock}
              currentDate={props.currentDate}
              newDate={props.newDate}
              setNewDate={props.setNewDate}
              setCurrentDate={props.setCurrentDate}
            />
          )}
        </div>
      </div>
      {/* Navbar.Brand */}
      <div className="mb-4">
        <Navbar.Brand className='app-title ms-4'>
          <img src="/poli_logo.svg" alt="image" />
        </Navbar.Brand>
      </div>

      {/* Rest of the Navbar below the brand */}
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav" className="lower-navbar w-100">
        <Nav className="me-auto" variant="pills" defaultActiveKey="/thesis">
          {props.loggedIn && props.user.role === 'student' && (
            <>
              <Nav.Item>
                <Nav.Link as={Link} to="/thesis" id="all-thesis" className="nav-link" eventKey="/thesis" onClick={() => { props.setMessage(''); navigate('/thesis'); }}>
                  All Thesis
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/applications" className='nav-link' eventKey="/applications" onClick={() => { props.setMessage(''); navigate('/applications'); }}>
                  Applications
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/thesisRequest" className='nav-link' eventKey="/thesisRequest" onClick={() => { props.setMessage(''); navigate('/thesisRequest'); }}>
                  Thesis request
                </Nav.Link>
              </Nav.Item>
            </>
          )}

          {props.loggedIn && props.user.role === 'teacher' && (
            <>
              <Nav.Item>
                <Nav.Link as={Link} to="/thesis" id="my-proposals" className="nav-link" eventKey="/thesis" onClick={() => { props.setMessage(''); navigate('/thesis'); }}>
                  My Proposals
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/proposal" id="new-proposal" className="nav-link" eventKey="/proposal" onClick={() => { props.setMessage(''); navigate('/proposal') }}>
                  New Proposal
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/applications" id='applications' className="nav-link" eventKey="/applications" onClick={() => { props.setMessage(''); navigate('/applications') }}>
                  Applications
                </Nav.Link>
              </Nav.Item>
            </>
          )}
        </Nav>
        <Nav className='me-4 d-flex align-items-center'>
          {props.loggedIn ?
            <Navbar.Text>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ffffff" className="bi bi-person-circle" viewBox="0 0 16 16">
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