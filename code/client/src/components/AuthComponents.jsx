import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


function LoginForm(props) {

  const navigate = useNavigate();

  useEffect(() => {
    // Check if props.user exists, and if not, redirect to Auth0 login
    if (!props.user) {
      window.location.href = 'http://localhost:3001/login'; // Replace with your external login page URL
    }
  }, [props.user, navigate]);
}

function LogoutButton(props) {
  return (
    <Button variant="outline-light" onClick={props.logout}>
      Logout
    </Button>
  );
}

export { LoginForm, LogoutButton };
