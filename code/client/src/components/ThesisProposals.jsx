/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from 'react';

import MessageContext from '../messageCtx.jsx';
import API from '../apis/generalAPI.js';
import { LoadingLayout } from './PageLayout.jsx';

/*
here we can implement the home, the home shows the thesis;
if role:
 professor -> shows all active thesis, show edit botton for those related to it
 student -> show all the thesis COMPATIBLE with the student plus functionalities to apply - show more infos - collapse/expand row
*/


function ThesisProposals(props) {

  const [loggedIn, setLoggedIn] = useState(false);
  const { handleErrors } = useContext(MessageContext);

 

  return (
    <>
    {props.loggedIn && props.user.role === "student" ? (
      <div> Logged in as a student!</div> //TODO: Insert here code to the user page
      ) : props.loggedIn && props.user.role === "professor" ?(
        <div>Logged in as a professor!</div> //TODO: Insert here code to the professor page
      ):(
        <div>You need to LOGIN!</div> 

      )
    }

    </>
  );
}


export default ThesisProposals;
