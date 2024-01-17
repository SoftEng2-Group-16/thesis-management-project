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
    credentials: 'include',
  });
  if (response.ok)
    return null;
}

const getInitialDate = async () => {
  const response = await fetch(SERVER_URL + '/api/initialdate', {
    credentials: 'include',
  });
  
  const date = response.json();
  if(response.ok){
    return date;
  } else {
    throw date;
  }
}

const rearrangeProposals = async (newDate) => {
  const data = {
    selectedTimestamp: newDate
  }
  const response = await fetch(SERVER_URL + '/api/clockchanged', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data)
  });

  const rearrangedProposals = await response.json();

  if (response.ok) {
    return rearrangedProposals;
  } else {
    throw rearrangedProposals;
  }
}

const sendEmail = async (emailData) => {
  try {
    const response = await fetch(SERVER_URL + '/api/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(emailData),
    });

    const res = await response.json();

    if (response.ok) {
      return res;
    } else {
      throw res;
    }
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const API = { getUserInfo, logIn, logOut, rearrangeProposals, getInitialDate, sendEmail };
export default API;