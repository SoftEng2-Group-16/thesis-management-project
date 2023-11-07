/* eslint-disable react/prop-types */
import { Card, Button, Row, Col, Container, Modal } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import CardGroup from 'react-bootstrap/CardGroup';

import MessageContext from '../messageCtx.jsx';
import API from '../API.js';
import { LoadingLayout } from './PageLayout.jsx';

/*
here we can implement the home, the home shows the thesis;
if role:
 professor -> shows all active thesis, show edit botton for those related to it
 student -> show all the thesis COMPATIBLE with the student plus functionalities to apply - show more infos - collapse/expand row
*/


function ThesisProposals(props) {
  const [user, setUser] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const { handleErrors } = useContext(MessageContext);

  useEffect(() => {
    const checkAuth = async () => {
        try {
          const user = await API.getUserInfo();
            setUser({ 
              id: user.id,
              email: user.email,
              role: user.role,
            })

            setLoggedIn(true);
        } catch { (err) => { return null; } }
      
    }
    checkAuth();
  }, [loggedIn]);

  return (
    <>
    {loggedIn ? (
      {user.role == "student"}
      
    )}

    </>
  );
}


export default ThesisProposals;
