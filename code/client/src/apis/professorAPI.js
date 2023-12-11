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
  const response = await fetch(SERVER_URL + `/api/teacher/applications`, {
    credentials: 'include',
  });
  const res = await response.json();
  if (response.ok) {
    return res; // list of applications related to the logged user
  }
  else {
    throw res;
  }
}

const setDecision = async (decision) => {
  const response = await fetch(SERVER_URL + `/api/teacher/applications/${decision.thesisid}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(decision.body),
  });
  const res = await response.json();
  if (response.ok) {
    return res;
  }
  else {
    throw res;
  }
}


const getOwnThesisProposals = async () => {
  const response = await fetch(SERVER_URL + '/api/thesis/teacher/', {
    credentials: 'include',
  });

  const proposals = await response.json();
  if (response.ok) {
    return proposals;
  } else {
    throw proposals;
  }
}


const editProposal = async (proposal) => {
  const response = await fetch(SERVER_URL + `/api/teacher/proposal/${proposal.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(proposal),
  });
  const res = await response.json();
  if (response.ok) {
    return res;
  }
  else {
    throw res;
  }
}

const deleteProposal = async (proposalID) => {

  const response = await fetch(SERVER_URL + `/api/deleteproposal/${proposalID}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  const res = await response.json();
  if (response.ok) {
    return res;
  }
  else {
    throw res;
  }
}


const professorAPI = {
  getPossibleCosupervisors, getDegreesInfo, setDecision, insertProposal,
  getApplications, getOwnThesisProposals, editProposal, deleteProposal
}
export default professorAPI;