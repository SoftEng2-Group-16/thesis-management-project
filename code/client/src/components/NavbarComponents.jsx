/* eslint-disable react/prop-types */
import { Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import { LogoutButton } from './AuthComponents';
import User from '../assets/user.png';
import Clock from './Clock';


function NavHeader(props) {

  const handleDateChange = (newDate) => {
    // Handler? should pass it to app.jsx
    console.log('New date:', newDate);
  };

  return (
  <Navbar className="d-flex justify-content-around" bg="primary" variant="dark">
    <Container>
      <Navbar.Brand  className='navbar-brand'>
      Shitty Thesis Management
      </Navbar.Brand>
      <Nav className="me-auto">
        <Nav.Link href='#'>Thesis</Nav.Link>
      </Nav>
      {props.loggedIn ? <>
      <Navbar.Text>
      <Clock onDateChange={handleDateChange} />
      <img src={User} style={{ width: '45px', height: 'auto', fill: 'white' }} alt="User:" />
        <span className="text-light me-3 username">{props.user.role}</span>
      </Navbar.Text>
        <LogoutButton logout={props.handleLogout} />
        </> :
        <Link to='/login'className='btn btn-outline-light'>Login</Link>
         }
         </Container>
  </Navbar>
  );
}

export default NavHeader;