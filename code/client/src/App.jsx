import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Alert } from 'react-bootstrap';
import './App.css'
import NavHeader from './components/NavbarComponents';
import { NotFoundLayout } from './components/PageLayout';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate, useNavigate } from 'react-router-dom';
import MessageContext from './messageCtx.jsx';
import API from './apis/generalAPI.js';
import { LoginForm } from './components/AuthComponents';
import ProposalForm from './components/ProposalForm.jsx';
import ThesisProposals from './components/ThesisProposalsBro.jsx';
import ThesisPage from './components/ThesisPage.jsx';
import ThesisApplications from './components/Applications.jsx';
import ApplicationDetails from './components/ApplicationDetails.jsx';
import dayjs from 'dayjs';

function App() {
  const [loggedIn, setLoggedIn] = useState(null);

  const [user, setUser] = useState({})
  const [update, setUpdate] = useState(false); // unused, can be used to trigger an update
  const [currentDate, setCurrentDate] = useState(new Date());
  const [newDate, setNewDate] = useState("");

  //the error message
  const [message, setMessage] = useState('');

  // If an error occurs, the error message will be shown in a toast.
  const handleErrors = (err) => {
    let msg = '';
    if (err.error) msg = err.error;
    else msg = "Unknown Error";
    setMessage({ msg: msg, type: 'danger' });
  }

  //TODO the login method should not returns the row in the auth table but should query again against student or professor table to get all the info
  //! generalAPI exports a 'API' and not 'generalAPI' for the time being
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const u = await API.getUserInfo();
        setUser({
          id: u.id,
          role: u.role,
          name: u.name,
          surname: u.surname,
        });
        setLoggedIn(true);
      } catch (err) {
        setLoggedIn(false);
        handleErrors(err);
      }
    };

    checkAuth();
    /* if (loggedIn) {
      setCurrentDate(Date());
      handleDateChange(currentDate);
    } */
    setMessage('');
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const u = await API.logIn(credentials);
      setUser(u);
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${u.role}!`, type: 'success' });
      handleDateChange(currentDate);
      console.log(currentDate);
    } catch (err) {
      console.log(err);
      setMessage({ msg: err, type: 'danger' });
    }
  };

  const handleLogout = async () => {
    console.log("false")
    await API.logOut();
    console.log("here")
    setLoggedIn(false);
    
    // clean up everything
    setMessage('');
    setUser(null);
    
  };

  const handleDateChange = async (newDate) => {
    // Placeholder for calling the API with the new date
    try {
      const changed = await API.rearrangeProposals(newDate);
      if (changed === 0 || changed >= 0) {
        setMessage({ msg: `Time updated, overall ${changed} proposals changed`, type: 'success' });
        setUpdate(true);
      }
    } catch (error) {
      setMessage({ msg: error, type: 'danger' });
    }
  };



  //the react container uses the outlet feature

  return (
    <BrowserRouter>
      <MessageContext.Provider value={{ handleErrors }}>
        <Routes>
          <Route
            element={
              <>
                <NavHeader loggedIn={loggedIn} user={user} handleLogout={handleLogout} onDateChange={handleDateChange} currentDate={currentDate} newDate={newDate} setNewDate={setNewDate} setCurrentDate={setCurrentDate} setMessage={setMessage} />
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
            <Route path="/" element={loggedIn === true ? (<Navigate to="/thesis" />) : (<LoginForm loggedIn={loggedIn} />)} />
            <Route path="/thesis" element={loggedIn ? <ThesisProposals loggedIn={loggedIn} user={user} update={update} setUpdate={setUpdate} setMessage={setMessage}/> : <ThesisProposals user={user} />} ></Route>
            <Route path="/proposal" element={loggedIn ? <ProposalForm loggedIn={loggedIn} user={user} /> : <LoginForm login={handleLogin} />}></Route>
            <Route path="/applications" element={loggedIn ? <ThesisApplications loggedIn={loggedIn} user={user} handleErrors={handleErrors} setMessage={setMessage}/> : <LoginForm login={handleLogin} />} />
            <Route path="/application/:id" element={loggedIn ? <ApplicationDetails setMessage={setMessage}/> : <LoginForm login={handleLogin} />} />
            <Route path="/thesis/:id" element={loggedIn ? <ThesisPage user={user} setMessage={setMessage}/> : <ThesisPage />} />

            <Route path="*" element={<NotFoundLayout />} />
            <Route path="/login" element={loggedIn ? <Navigate replace to="/thesis" /> : <LoginForm login={handleLogin} />} />
          </Route>
        </Routes>
      </MessageContext.Provider>
    </BrowserRouter>
  );
}

export default App;