import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, password };

    props.login(credentials);
  };

  return (
    <div className="login-form-container">
      <h2 className="login-form-label">LOGIN</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="form-padding" controlId="username">
          <Form.Control
            type="text"
            value={username}
            placeholder='username'
            onChange={(ev) => setUsername(ev.target.value.trim())}
            required
          />
        </Form.Group>

        <Form.Group className="form-padding" controlId="password">
          <Form.Control
            type="password"
            value={password}
            placeholder='password'
            onChange={(ev) => setPassword(ev.target.value)}
            required
            minLength={6}
          />
        </Form.Group>

        <Button className="form-element form-button" type="submit">Login with username and password</Button>
      </Form>
    </div>
  );
}

function LogoutButton(props) {
  return (
    <Button variant="outline-light" onClick={props.logout}>
      Logout
    </Button>
  );
}

export { LoginForm, LogoutButton };
