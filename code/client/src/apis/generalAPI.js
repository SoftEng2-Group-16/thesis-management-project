const SERVER_URL = 'http://localhost:3001';

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
    headers: { 
      'Content-Type': 'application/json' 
    },
    credentials: 'include',
  });
  if (response.ok)
    return null;
}

const rearrangeProposals = async (newDate) => {
  const data = {
    selectedTimestamp: newDate
  }

  const response = await fetch(SERVER_URL + '/api/clockchanged', {
    method: 'PUT',
    credentials: 'include',
    body: JSON.stringify(data)
  });

  if(response.ok) {
    const rearrangedProposals = await response.json();
    return rearrangedProposals;
  }else {
    throw rearrangedProposals;
  }

 }
const API = { getUserInfo, logIn, logOut, rearrangeProposals };
export default API;