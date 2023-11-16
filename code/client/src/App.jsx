import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Alert } from 'react-bootstrap';
import './App.css'
import NavHeader from './components/NavbarComponents';
import { NotFoundLayout } from './components/PageLayout';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import MessageContext from './messageCtx.jsx';
import API from './apis/generalAPI.js';
import { LoginForm } from './components/AuthComponents';
import ProposalForm from './components/ProposalForm.jsx';
import ThesisProposals from './components/ThesisProposalsBro.jsx';
import ThesisPage from './components/ThesisPage.jsx';
import dayjs from 'dayjs';

function App() {

  const [loggedIn, setLoggedIn] = useState(null);

  const [user, setUser] = useState([])
  const [update, setUpdate] = useState(false); // unused, can be used to trigger an update
  
  //the error message
  const [message, setMessage] = useState('');

  // If an error occurs, the error message will be shown in a toast.
  const handleErrors = (err) => {
    let msg = '';
    if (err.error) msg = err.error;
    else msg = "Unknown Error";
    setMessage({msg:msg, type: 'danger' });
  }

  //TODO the login method should not returns the row in the auth table but should query again against student or professor table to get all the info
  //! generalAPI exports a 'API' and not 'generalAPI' for the time being
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        setUser({
          id: user.id,
          role: user.role,
          name: user.name,
          surname: user.surname,
        });
        setLoggedIn(true);
      } catch (err) {
        setLoggedIn(false);
        handleErrors(err);
      }
    };
  
    checkAuth();
    if(loggedIn)
      handleDateChange(dayjs().format("DD-MM-YYYY"));
    setMessage('');
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${user.role}!`, type: 'success' });
    } catch (err) {
      console.log(err);
      setMessage({ msg: err, type: 'danger' });
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    // clean up everything

    setMessage('');
  };

  const handleDateChange = async (newDate) => {
    // Placeholder for calling the API with the new date
    try {
      const changed = await API.rearrangeProposals(newDate);
      if(changed===0 || changed >=0){
        setMessage({ msg: `Time updated, reloading... (overall ${changed} proposals changed)`, type: 'success' });
        setTimeout( () => {
          window.location.reload(true);  
        }, 1000); 
      }
    } catch (error) {
      setMessage({ msg: error, type: 'danger' });

    }
  };



  //the react container uses the outlet feature

  return (
    <BrowserRouter>
     <MessageContext.Provider value={{ handleErrors}}>
      <Routes>
        <Route
          element={
            <>
              <NavHeader loggedIn={loggedIn} user={user} handleLogout={handleLogout} onDateChange={handleDateChange} />
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
          <Route  path="/" element={loggedIn === true ? (<Navigate to="/thesis" />) : (<LoginForm login={handleLogin} />)}/>
          <Route path="/thesis" element={loggedIn ? <ThesisProposals loggedIn={loggedIn} user={user}/> : <ThesisProposals user={user}/>} ></Route>
          <Route path="/proposal" element={loggedIn ? <ProposalForm loggedIn={loggedIn} user={user}/> : <ProposalForm user={user}/>}></Route>
          
          <Route path="/thesis/:id" element={loggedIn? <ThesisPage user={user}/>: <ThesisPage/>}/>
         
          <Route path="*" element={<NotFoundLayout  />} />
          <Route path="/login" element={loggedIn ? <Navigate replace to="/thesis" /> : <LoginForm login={handleLogin} />}/>
        </Route>
      </Routes>
      </MessageContext.Provider>
    </BrowserRouter>
  );
}

export default App;