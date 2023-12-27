const daoStudent = require('../../daoStudent');
const daoTeacher = require('../../daoTeacher');
const daoGeneral = require('../../daoGeneral');
const dayjs = require('dayjs');

const insertNewApplication = async (req, res) => {
    const studentId = req.body.studentId;
    const proposalId = req.body.proposalId;
    const teacherId = req.body.teacherId;
    const timestamp = dayjs().format("DD/MM/YYYY HH:mm:ss");
    const status = 'pending';

    if (req.user.id !== studentId) {
        return res.status(422).json({ error: "the student who is sending the application is not the logged in one" });
    }
    try {
        const acceptedThesis = await daoStudent.getMyThesisAccepted(studentId);
        if (acceptedThesis && acceptedThesis.length > 0) {
            return res.status(400).json({ error: "already exist an accepted application for this student" });
        }

        const changes = await daoStudent.addApplicationForThesis(proposalId, studentId, timestamp, status, teacherId, null);//pass a idCV null for compatibility 
        return res.status(201).json(changes);
    } catch (e) {
        if (e.message.includes("SQLITE_CONSTRAINT")) {
            e.message = "Application already submitted, wait for professor response";
        }
        return res.status(500).json({ error: e.message });
    }
}

const getApplicationsForStudent = async (req, res) => {
    // since I dont know how to log in in the testapi.http file using the new SAML strategy,
    // for the moment I'm passing as param the studentId (should be found in the session cookie)
    //const studentId = req.params.studentId

    // ideally, the API should be protected, and the studentId should be retrieved from the user object
    const studentId = req.user.id
    try {
        const applications = await daoStudent.getApplicationsForStudent(studentId);
        if (applications.error) {
            return res.status(404).json(applications);
        } else {
            const enhancedApplications = [];
            //add the 2 fields with details to the object
            for (const appl of applications) {
                const teacherInfo = await daoTeacher.getTeacherById(appl.teacherId);
                const thesisInfo = await daoGeneral.getThesisProposalById(appl.thesisId)
                    .then(t => {
                        if (t.error || t === undefined)
                            return daoGeneral.getProposalFromArchivedById(appl.thesisId)
                        else
                            return t;
                    });
                console.log(thesisInfo);
                const studentInfo = await daoStudent.getStudentById(appl.studentId); //Why? Should be in the session cookie

                enhancedApplications.push({
                    ...appl,
                    teacherInfo,
                    thesisInfo,
                    studentInfo,
                });
            }
            return res.status(200).json({
                enhancedApplications
            });
        }
    } catch (e) {
        return res.status(500).json(e.message);
    }
}

const getThesisProposals = async (req, res) => {
    //same principle for the getApplications: for manual testing purposes at the moment the degree
    //code is taken as param; ideally, it should be taken from the req.user object
    //const studentCourse = req.params.degreeCode
    const studentCourse = req.user.degree_code
    try {
        const proposals = await daoStudent.getThesisProposalsByDegree(studentCourse);
        if (proposals.error) {
            return res.status(404).json(proposals);
        } else {
            return res.status(200).json(proposals);
        }
    } catch (e) {
        return res.status(500).json(e.message);
    }
}

const getAllExams = async (req, res) => {
    //same principle for the getApplications: for manual testing purposes at the moment the degree
    //code is taken as param; ideally, it should be taken from the req.user object
    //const studentId= req.params.id
    const studentId = req.user.id

    if (!studentId) {
        return res.status(403).json({ error: "problem with login" });
    }

    try {
        const exams = await daoStudent.getExamsByStudentId(studentId);
        if (exams.error) {
            return res.status(404).json(exams);
        } else {
            return res.status(200).json(exams);
        }
    } catch (e) {
        return res.status(500).json(e.message);
    }
}

const insertApplicationWithCV = async (req, res) => {
    const studentId = req.body.studentId;
    const proposalId = req.body.proposalId;
    const teacherId = req.body.teacherId;
    const timestamp = dayjs().format("DD/MM/YYYY HH:mm:ss");
    const status = 'pending';
    const exams = req.body.exams;
    if (!req.body.exams || !req.body.studentId || !req.body.proposalId || !req.body.teacherId) {
        return res.status(400).json({ error: 'missing data ' });
    }
    if (req.user.id !== parseInt(studentId,10)){
        return res.status(422).json({ error: "the student who is sending the application is not the logged in one" });
    }

    //if file is not defined is not a problem will not be added to the table
    //thanks to Multipart we have the file saved in req.file
    const file = req.file;
    const fileName = file ? file.originalname : null;
    const fileContent = file ? file.buffer : null;

    try {
        //do the check to see if i can send the application
        const acceptedThesis = await daoStudent.getMyThesisAccepted(studentId);
        if (acceptedThesis && acceptedThesis.length > 0) {
            return res.status(400).json({ error: "already exist an accepted application for this student" });
        }
        //check if the student already sent an application for the thesis
        const myApplications = await daoStudent.getApplicationsForStudent(studentId);
        if (myApplications.length > 0 && myApplications.some(appl => appl.thesisId == proposalId)) {
            return res.status(400).json({ error: "Application already submitted, wait for professor response" });
        }
        console.log("whyyyyy");
        //if everything is ok uplaod the cv in the table
        const idCV = await daoStudent.insertApplicationData(fileName, fileContent, exams);//retruns the new id created
        //then store the application with the cv id
        const changes = await daoStudent.addApplicationForThesis(proposalId, studentId, timestamp, status, teacherId, idCV);
        return res.status(200).json(changes);

    } catch (e) {
        return res.status(500).json({ error: e.message });
    }

}

module.exports = {
    insertNewApplication,
    getApplicationsForStudent,
    getThesisProposals,
    insertApplicationWithCV,
    getAllExams
};
