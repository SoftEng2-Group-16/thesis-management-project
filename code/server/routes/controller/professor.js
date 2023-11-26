const dao = require('../../dao');
const models = require('../../model');

const getPossibleCosupervisors = async (req, res) => {
    try {
        const internals = await dao.getProfessors();
        if (internals.error) {
            return res.status(404).json(internals);
        }
        const externals = await dao.getExternals();
        if (externals.error) {
            return res.status(404).json(externals);
        } else {
            return res.status(200).json({
                internals: internals.map(i => `${i.name} ${i.surname}, ${i.id}, ${i.department_code}`),
                externals: externals.map(e => `${e.name} ${e.surname}, ${(e.company).toUpperCase()}`)
            });
        }
    } catch (err) {
        return res.status(500).json(err.message);
    }
}

const getDegreesInfo = async (req, res) => {
    try {
        const degrees = await dao.getDegrees();
        if (degrees.error) {
            return res.status(404).json(degrees);
        } else {
            return res.status(200).json(degrees);
        }
    } catch (e) {
        return res.status(500).json(e.message);
    }
}

const insertNewProposal = async (req, res) => {
    const cosupervisors = req.body.cosupervisors;
    const supervisor = req.body.supervisor;
    let groups = [];

    for (c of cosupervisors) {
        const splitted = c.split(" ");
        if (splitted.length == 4) { //internal cosupervisor, find group and save it for proposal insertion
            let [name, surname, id, departmentCode] = [...splitted];
            surname = surname.replace(',', '');
            id = id.replace(',', '');
            const group = await dao.getGroupForTeacherById(id);
            if (!groups.includes(group)) {
                groups.push(group);
            }
        }
    }
    const group = await dao.getGroupForTeacherById(supervisor.split(",")[0]) //search group of supervisor: id, name surname
    if (!groups.includes(group)) {
        groups.push(group);
    }
    let proposal = new models.ThesisProposal(
        -1, //can be whatever, DB handles autoincrement id
        req.body.title,
        req.body.supervisor,
        cosupervisors.join('-'),
        req.body.keywords,
        req.body.type,
        groups.join(','),
        req.body.description,
        req.body.requirements,
        req.body.notes,
        req.body.expiration,
        req.body.level,
        req.body.cds.join(',')
    );

    try {
        const lastId = await dao.saveNewProposal(proposal);
        return res.status(201).json(lastId);
    } catch (e) {
        return res.status(500).json(e.message);

    }
}
const getAllApplicationsByProf = async (req, res) => {
    try {
        const applications = await dao.getAllApplicationsByProf(req.user.id);
        if (applications.error) {
            return res.status(404).json(applications);
        }
        else {
            const enhancedApplications = [];
            //add the 2 fields with details to the object
            for (const appl of applications) {
                const studentInfo = await dao.getStudentById(appl.studentId);
                const thesisInfo = await dao.getThesisProposalById(appl.thesisId);

                enhancedApplications.push({
                    ...appl,
                    studentInfo,
                    thesisInfo,
                });
            }
            return res.status(200).json({
                enhancedApplications
            });
                 }
    } catch (err) {
        return res.status(500).json(err.message);
    }
}

const decideApplication = async (req, res) => {
    
    const thesisId = req.params.thesisid;
    const decision = req.body.decision;
    const studentId=req.body.studentId;
    const teacherId=req.user.id; //sent to the query to double check the logged in professor is the one referred in the application
    
    if(!teacherId){
        return res.status(503).json({ error: "problem with the authentication" });
    }

    if (!decision) {
        return res.status(422).json({ error: "decision is missing in body" });
    }
    if (!studentId) {
        return res.status(422).json({ error: "studentId is missing in body" });
    }
    if (isNaN(thesisId) || !Number.isInteger(parseInt(thesisId))) {
        return res.status(422).json({ error: "thesisId non valido" });
    }

    if (decision === "accepted") {
        try {
            const application = await dao.acceptApplication(thesisId,teacherId,studentId); 
            await dao.cancellPendingApplicationsForAThesis(thesisId,teacherId); 
            await dao.cancellPendingApplicationsOfAStudent(studentId,teacherId);
            return res.status(200).json(application);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }
    else if (decision === "rejected") {
        try {
            const application = await dao.rejectApplication(thesisId,teacherId,studentId);
            return res.status(200).json(application);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }
    else {
        return res.status(400).json({ error: "Invalid decision field" });
    }

}

const getOwnProposals = async (req,res) => {
    // for testing purposes, at the moment the id of the teacher is taken from params
    //const teacherId = req.params.teacherId;
    // decomment this when calling it from FE
    const teacherId = req.user.id;
    try {
        const proposals = await dao.getOwnProposals(teacherId);
        if(proposals.error){
            return res.status(404).json(proposals);
        } else {
            return res.status(200).json(proposals);
        } 
    } catch(e) {
        return res.status(500).json(e.message);

    }
}


module.exports = {
    getPossibleCosupervisors,
    insertNewProposal,
    getDegreesInfo,
    getAllApplicationsByProf,
    decideApplication,
    getOwnProposals,
}
