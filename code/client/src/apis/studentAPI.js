const SERVER_URL = 'http://localhost:3001';

const insertApplication = async (studentId, proposalId, teacherid) => {
  const data = {
    studentId: studentId,
    proposalId: proposalId,
    teacherId: teacherid
  }
  const response = await fetch(SERVER_URL + '/api/newapplication', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  const res = await response.json();
  if (response.ok) {

    return res;
  } else {
    throw res;
  }
}

const getThesisProposals = async () => {
  const response = await fetch(SERVER_URL + '/api/thesis/student/', {
    credentials: 'include',
  });

  const proposals = await response.json();
  if (response.ok) {
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
  else {
    throw res;
  }
}

//the header content is put automatically 
const insertApplicationWithCV = async (formData) => {
  const response = await fetch(SERVER_URL + '/api/uploadCV', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  const res = await response.json();
  if (response.ok) {
    return res;
  } else {
    throw res;
  }
}

const getExams = async (studentId) => {
  const response = await fetch(SERVER_URL + `/api/student/${studentId}/exams`, {
    credentials: 'include',
  });
  const res = await response.json();
  if (response.ok) {
    return res; // list of exams of the student
  }
  else {
    throw res;
  }
}

const insertStartRequest = async (request) => {
  const response = await fetch(SERVER_URL + '/api/newstartrequest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(request),
  });

  const res = await response.json();
  if (response.ok) {
    return res;
  } else {
    throw res;
  }
}

const studentAPI = { insertApplication, getThesisProposals, getApplications, insertApplicationWithCV, getExams, insertStartRequest };
export default studentAPI;