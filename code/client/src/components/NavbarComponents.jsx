/* eslint-disable react/prop-types */
import { Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import { LogoutButton } from './AuthComponents';
import User from '../assets/user.png';
import Clock from './Clock';
import { useState } from 'react';


function NavHeader(props) {
  const [showClock, setShowClock] = useState(false);

  const handleDateChange = (newDate) => {
    // Handler? should pass it to app.jsx
    props.onDateChange(newDate);
  };

  return (
    <Navbar className="d-flex justify-content-around" bg="primary" variant="dark">
      <Container>
        <div className='navbar-brand'>
          <Navbar.Brand
            className='app-title'
            onClick={() => {
              if (props.loggedIn)
                setShowClock(!showClock)
            }
          }>
            Thesis Management
          </Navbar.Brand>
          {props.loggedIn ? (showClock ? <Clock onDateChange={handleDateChange} /> : null) : null}
        </div>

        <Nav className="me-auto">
          <Nav.Link className='link' href='#'>Thesis</Nav.Link>
        </Nav>
        {props.loggedIn ? <>
          <Navbar.Text>
            <img src={User} style={{ width: '45px', height: 'auto', fill: 'white' }} alt="User:" />
            <span className="text-light me-3 username">{props.user.role}</span>
          </Navbar.Text>
          <LogoutButton logout={props.handleLogout} />
        </> :
          <Link to='/login' className='btn btn-outline-light'>Login</Link>
        }
      </Container>
    </Navbar>
  );
}

export default NavHeader;