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


const uploadFile = async (data) => {
  const response = await fetch(SERVER_URL + '/api/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  const res = await response.json();
  if (response.ok) {
    console.log('File uploaded successfully:', data);
    return res;
  } else {
    throw res;
  }
}

const getExams = async () => {
  const response = await fetch(SERVER_URL + `/api/exams`, {
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

const studentAPI = { insertApplication, getThesisProposals, getApplications,uploadFile,getExams };
export default studentAPI;