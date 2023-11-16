const SERVER_URL = 'http://localhost:3001';

const insertApplication = async (studentId, proposalId) => {
    const data = {
        studentId: studentId,
        proposalId: proposalId
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

const studentAPI = { insertApplication };
export default studentAPI;