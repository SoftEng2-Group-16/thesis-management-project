const SERVER_URL = 'http://localhost:3001';


// session apis

const logIn = async (credentials) => {
    const response = await fetch(SERVER_URL + '/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
    if (response.ok) {
      const user = await response.json();
      return user;
    }
    else {
      const errDetails = await response.text();
      throw errDetails;
    }
  };
  
  const getUserInfo = async () => {
    const response = await fetch(SERVER_URL + '/api/sessions/current', {
      credentials: 'include',
    });
    const user = await response.json();
    if (response.ok) {
      return user;
    } else {
      throw user;  // an object with the error coming from the server
    }
  };
  
  const logOut = async () => {
    const response = await fetch(SERVER_URL + '/api/sessions/current', {
      method: 'DELETE',
      credentials: 'include'
    });
    if (response.ok)
      return null;
  }



  // general purpose apis 


  const getThesisProposals = async () => {
    const response = await fetch(SERVER_URL + '/api/thesis', {
      credentials: 'include',
    });
    const proposals = await response.json();
    if (response.ok) {
      return proposals
    } else {
      throw proposals;  // an object with the error coming from the server
    }
  };



const API= {getUserInfo,logIn,logOut,getThesisProposals};
export default API;