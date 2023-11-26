const dao = require('../../dao');
const dayjs = require('dayjs');

const insertNewApplication = async (req, res) => {
    const studentId = req.body.studentId;
    const proposalId = req.body.proposalId;
    const teacherId = req.body.teacherId;
    const timestamp = dayjs().format("DD/MM/YYYY HH:mm:ss");
    const status = 'pending';

    if(req.user.id !== studentId){
        return res.status(422).json({error:"the student who is sending the application is not the logged in one"});
    }
    try {
        const changes = await dao.addApplicationForThesis(proposalId, studentId, timestamp, status,teacherId);
        return res.status(201).json(changes);
    } catch(e) {
        if(e.message.includes("SQLITE_CONSTRAINT")) {
            e.message = "Application already submitted, wait for professor response";       
        }
        return res.status(500).json(e.message);
    }
}

const getApplicationsForStudent = async (req,res) => {
    // since I dont know how to log in in the testapi.http file using the new SAML strategy,
    // for the moment I'm passing as param the studentId (should be found in the session cookie)
    const studentId = req.params.studentId

    // ideally, the API should be protected, and the studentId should be retrieved from the user object
    // const studentId = req.user.id
    try {
        const applications = await dao.getApplicationsForStudent(studentId);
        if(applications.error) {
            return res.status(404).json(applications);
        } else {
            // as of now, just the row of the db is returned
            //will be modified (for example inserting student or thesis info if ne)
            return res.status(200).json(applications);
        }
    } catch(e) {
        return res.status(500).json(e.message);
    }
}

const getThesisProposals = async (req,res) => {
    //same principle for the getApplications: for manual testing purposes at the moment the degree
    //code is taken as param; ideally, it should be taken from the req.user object
    //const studentCourse = req.params.degreeCode
    const studentCourse = req.user.degree_code
    try {
        const proposals = await dao.getThesisProposals(studentCourse);
        if(proposals.error){
            return res.status(404).json(proposals);
        } else {
            return res.status(200).json(proposals);
        }
    } catch (e) {
        return res.status(500).json(e.message);
    }
}
 module.exports = {
     insertNewApplication,
     getApplicationsForStudent,
     getThesisProposals
 };
