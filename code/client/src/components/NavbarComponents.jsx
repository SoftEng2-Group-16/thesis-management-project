/* eslint-disable react/prop-types */
import { Navbar, Container} from 'react-bootstrap';
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
          {props.loggedIn ? (showClock ? <Clock onDateChange={handleDateChange} setShowClock={setShowClock} currentDate={props.currentDate} newDate={props.newDate} setNewDate={props.setNewDate} setCurrentDate = {props.setCurrentDate}/> : null) : null}
          {props.loggedIn ? 
          <Nav className="me-auto">
            <Nav.Link className='link' href='thesis' onClick={() => navigate('/thesis')}>Thesis</Nav.Link>
            { props.user.role==='teacher' ? <Nav.Link className='link' href='proposal' onClick={() => navigate('/proposal')}>Proposal</Nav.Link> : null }
          </Nav> : null}
          <Nav>
              {props.loggedIn ?
              <Navbar.Text>
                <img src={User} style={{ width: '45px', height: 'auto', fill: 'white' }} alt="User:" />
                <span className="text-light me-3 username">{props.user.role}</span>
              </Navbar.Text>
              : null}
            </Nav>
          <Nav>
            {props.loggedIn ?
              <LogoutButton logout={props.handleLogout} />
             :
              <Link to='/login' className='btn btn-outline-light'>Login</Link>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavHeader;