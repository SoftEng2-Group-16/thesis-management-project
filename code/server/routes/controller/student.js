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

/*const getThesisProposals = async (req,res) => {
    const studentCourse = req.params.degreeCode
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
}*/
 module.exports = {
     insertNewApplication,
     //getThesisProposals
   
 };
