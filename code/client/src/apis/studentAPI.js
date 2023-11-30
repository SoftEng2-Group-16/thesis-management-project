const SERVER_URL = 'http://localhost:3001';

const insertApplication = async (studentId, proposalId,teacherid) => {
    const data = {
        studentId: studentId,
        proposalId: proposalId,
        teacherId:teacherid
    }
    const response = await fetch(SERVER_URL + '/api/newapplication', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(data),
    });
    if(response.ok) {
        const ok = response.json();
        return ok;
    } else {
        const errDetails = await response.text();
      throw errDetails;
    }
}

const getThesisProposals = async() => {
    const response = await fetch(SERVER_URL + '/api/thesis/student/', {
      credentials: 'include',
    });
  
    const proposals = await response.json();
    if(response.ok) {
      return proposals;
    } else {
      throw proposals;
    }
  }

  const getApplications = async () => {
    const response = await fetch(SERVER_URL + `/api/student/applications`, {
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

const studentAPI = { insertApplication, getThesisProposals,getApplications };
export default studentAPI;