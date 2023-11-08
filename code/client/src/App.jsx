import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Alert } from 'react-bootstrap';
import './App.css'
import NavHeader from './components/NavbarComponents';
import { NotFoundLayout, LoadingLayout } from './components/PageLayout';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import MessageContext from './messageCtx.jsx';
import API from './apis/generalAPI.js';
import { LoginForm } from './components/AuthComponents';
import ThesisProposals from './components/ThesisProposals.jsx';

function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState([])
  const [update, setUpdate] = useState(false); // unused, can be used to trigger an update

  //the error message
  const [message, setMessage] = useState('');
  // If an error occurs, the error message will be shown in a toast.
  const handleErrors = (err) => {
    let msg = '';
    if (err.error) msg = err.error;
    else msg = "Unknown Error";
    setMessage(msg);
  }

  //TODO the login method should not returns the row in the auth table but should query again against student or professor table to get all the info
  //! generalAPI exports a 'API' and not 'generalAPI' for the time being
  useEffect(() => {
    const checkAuth = async () => {
      if (loggedIn) {
        try {
          const user = await API.getUserInfo(); // we have the user info here 
          if (user) {
            setUser({ //TODO this needs to be changed to set the new info
              id: user.id,
              username: user.role, //for now role?
            })

            setLoggedIn(true);
          }
        } catch { (err) => { return null; } }

      }
    }
    checkAuth();
  }, [loggedIn]);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${user.username}!`, type: 'success' });
    } catch (err) {
      setMessage({ msg: err, type: 'danger' });
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    // clean up everything
    setMessage('');
  };

  //the react container uses the outlet feature

  return (
    <BrowserRouter>
     <MessageContext.Provider value={{ handleErrors}}>
      <Routes>
        <Route
          element={
            <>
              <NavHeader loggedIn={loggedIn} user={user} handleLogout={handleLogout} />
              <Container fluid className="mt-3 text-center">
                {message && (
                  <Row>
                    <Alert variant={message.type} onClose={() => setMessage('')} dismissible>
                      {message.msg}
                    </Alert>
                  </Row>
                )}
                <Outlet />
              </Container>
              
            </>
          }
        > 
          <Route path="/" element={<Navigate to="/thesis" />} ></Route>
          <Route path="/thesis" element={loggedIn ? <ThesisProposals loggedIn={loggedIn} role={user.role}/> : <Navigate replace to="/login" />} ></Route>
          <Route path="*" element={<NotFoundLayout  />} />
          <Route path="/login" element={loggedIn ? <Navigate replace to="/employee" /> : <LoginForm login={handleLogin} />}/>
        </Route>
      </Routes>
      </MessageContext.Provider>
    </BrowserRouter>
  );
}

export default App;