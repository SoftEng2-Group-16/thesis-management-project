const SERVER_URL = 'http://localhost:3001';

const getPossibleCosupervisors = async () => {
    const response = await fetch(SERVER_URL + '/api/cosupervisors', {
        credentials: 'include',
    });
    const listOfCosupervisors = await response.json();
    if (response.ok) {
        return listOfCosupervisors;
    } else {
        throw listOfCosupervisors;  // an object with the error coming from the server
    }
};

const getDegreesInfo = async () => {
    const response = await fetch(SERVER_URL + '/api/degrees', {
        credentials: 'include',
    });
    const listOfDegrees = await response.json();  //list of degree_code degree_title
    if (response.ok) {
        return listOfDegrees;
    } else {
        throw listOfDegrees;  // an object with the error coming from the server
    }
};

const insertProposal = async (proposal) => {
    const response = await fetch(SERVER_URL + '/api/newproposal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(proposal),
    });
    if (response.ok) {
      const p = await response.json();
      return p;
    }
    else {
      const errDetails = await response.text();
      throw errDetails;
    }
  };

const getApplications = async () => {
  const response = await fetch(SERVER_URL + '/api/applications', {
      credentials: 'include',
  });
  const res = await response.json();
  if (response.ok) {
    return res; // list of applications related to the logged user
  }
  else{
    throw res;
  }
}

const professorAPI = {getPossibleCosupervisors,getDegreesInfo,insertProposal,getApplications}
export default professorAPI;