const daoStudent = require('../../daoStudent');
const daoTeacher = require('../../daoTeacher');
const daoGeneral = require('../../daoGeneral');
const models = require('../../model');

const getPossibleCosupervisors = async (req, res) => {
    try {
        const internals = await daoTeacher.getProfessors();
        if (internals.error) {
            return res.status(404).json(internals);
        }
        const externals = await daoTeacher.getExternals();
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
        const degrees = await daoTeacher.getDegrees();
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
            let surname = splitted[1];
            let id = splitted[2];
            surname = surname.replace(',', '');
            id = id.replace(',', '');
            const group = await daoTeacher.getGroupForTeacherById(id);
            if (!groups.includes(group)) {
                groups.push(group);
            }
        }
    }
    const group = await daoTeacher.getGroupForTeacherById(supervisor.split(",")[0]) //search group of supervisor: id, name surname
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
        const lastId = await daoTeacher.saveNewProposal(proposal);
        return res.status(201).json(lastId);
    } catch (e) {
        return res.status(500).json(e.message);

    }
}
const getAllApplicationsByProf = async (req, res) => {
    try {
        const applications = await daoTeacher.getAllApplicationsByProf(req.user.id);
        if (applications.error) {
            return res.status(404).json(applications);
        }
        else {
            const enhancedApplications = [];
            //add the 2 fields with details to the object
            for (const appl of applications) {
                const studentInfo = await daoStudent.getStudentById(appl.studentId);
                const thesisInfo = await daoGeneral.getThesisProposalById(appl.thesisId)
                    .then(t => {
                        if (t.error || t === undefined)
                            return daoGeneral.getProposalFromArchivedById(appl.thesisId)
                        else
                            return t;
                    });

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
    const studentId = req.body.studentId;
    const teacherId = req.user.id; //sent to the query to double check the logged in professor is the one referred in the application

    if (!teacherId) {
        return res.status(503).json({ error: "problem with the authentication" });
    }

    if (!decision) {
        return res.status(422).json({ error: "decision is missing in body" });
    }
    if (!studentId) {
        return res.status(422).json({ error: "studentId is missing in body" });
    }
    if (isNaN(thesisId) || !Number.isInteger(parseInt(thesisId))) {
        return res.status(422).json({ error: "not valid thesisId" });
    }

    if (decision === "accepted") {
        try {
            const application = await daoTeacher.acceptApplication(thesisId, teacherId, studentId);
            await daoGeneral.cancellPendingApplicationsForAThesis(thesisId, teacherId);
            await daoGeneral.cancellPendingApplicationsOfAStudent(studentId);
            //archive the thesis proposal so other students cannot apply to it
            const proposal = await daoGeneral.getThesisProposalById(thesisId)
                .then(p => {
                    const p2 = new models.ThesisProposal(
                        p.id, //can be whatever, DB handles autoincrement id
                        p.title,
                        p.supervisor,
                        p.cosupervisors.join('-'),
                        p.keywords.join(','),
                        p.type,
                        p.groups.join(','),
                        p.description,
                        p.requirements,
                        p.notes,
                        p.expiration,
                        p.level,
                        p.cds.join(',')
                    );
                    return p2;
                });
            await daoTeacher.archiveProposal(proposal)
            await daoTeacher.deleteProposal(proposal.id);
            return res.status(200).json(application);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }
    else if (decision === "rejected") {
        try {
            const application = await daoTeacher.rejectApplication(thesisId, teacherId, studentId);
            return res.status(200).json(application);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }
    else {
        return res.status(400).json({ error: "Invalid decision field" });
    }

}

const getOwnProposals = async (req, res) => {
    // for testing purposes, at the moment the id of the teacher is taken from params
    //const teacherId = req.params.teacherId;
    // decomment this when calling it from FE
    const teacherId = req.user.id;
    try {
        const proposals = await daoTeacher.getOwnProposals(teacherId);
        if (proposals.error) {
            return res.status(404).json(proposals);
        } else {
            return res.status(200).json(proposals);
        }
    } catch (e) {
        return res.status(500).json(e.message);
    }
}

const archiveProposal = async (req, res) => {
    const proposalId = req.body.proposalId;
    const userId = req.user.id;

    try {
        const proposal = await daoGeneral.getThesisProposalById(proposalId);
        const applications = await daoTeacher.getApplicationsByThesisId(proposal.id);

        if (proposal.error || applications.error) {
            return res.status(404).json(proposal);
        }

        if (applications.filter(a => a.status === "accepted").length != 0) {
            return res.status(422).json({ error: `Something went wrong: an application was accepted for proposal ${proposal.id}, should be already archived` });
        }

        if (!proposal.supervisor.match(userId)) {
            return res.status(401).json({ "error": `User ${userId} cannot archive proposal ${proposal.id}: NOT OWNED` })
        } else {
            const changes = await daoTeacher.archiveProposal(new models.ThesisProposal(
                proposal.id, //can be whatever, DB handles autoincrement id
                proposal.title,
                proposal.supervisor,
                proposal.cosupervisors.join('-'),
                proposal.keywords.join(','),
                proposal.type,
                proposal.groups.join('-'),
                proposal.description,
                proposal.requirements,
                proposal.notes,
                proposal.expiration,
                proposal.level,
                proposal.cds.join(',')
            )) //STILL NEED TO MANAGE APPLICATIONS
                .then(async () => {
                    for (a of applications) {
                        console.log(a);
                        if (a.status === "pending") {
                            await daoTeacher.rejectApplication(a.thesisId, a.teacherId, a.studentId);
                        }
                    }
                })
                .then(async () => {
                    const c = await daoTeacher.deleteProposal(proposal.id);
                    return c;
                });
            if (changes == 1) {
                return res.status(200).json(changes);
            } else {
                return res.status(500).json({ error: "Problem encountered while archiving proposal" });
            }
        }
    } catch (e) {
        return res.status(500).json(e.message);
    }
}


const updateThesisProposal = async (req, res) => {



    const teacherId = req.user.id;
    if (!teacherId) {
        return res.status(503).json({ error: "problem with the authentication" });
    }


    // Is the id in the body equal to the id in the url?
    if (req.body.id !== Number(req.params.thesisid)) {
        return res.status(422).json({ error: 'URL and body id mismatch' });
    }
    //same logic of the insert
    const cosupervisors = req.body.cosupervisors;
    const supervisor = req.body.supervisor;
    let groups = [];

    for (c of cosupervisors) {
        const splitted = c.split(" ");
        if (splitted.length == 4) { //internal cosupervisor, find group and save it for proposal insertion
            let [name, surname, id, departmentCode] = [...splitted];
            surname = surname.replace(',', '');
            id = id.replace(',', '');
            const group = await daoTeacher.getGroupForTeacherById(id);
            if (group.error) {
                return res.status(404).json(group);
            }
            else if (!groups.includes(group)) {
                groups.push(group);
            }
        }
    }
    const group = await daoTeacher.getGroupForTeacherById(supervisor.split(",")[0]) //search group of supervisor: id, name surname
    if (group.error) {
        return res.status(404).json(group);
    }
    else if (!groups.includes(group)) {
        groups.push(group);
    }
    let proposal = new models.ThesisProposal(
        req.body.id,
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
        //**check if there is an already accepted application for this proposal */
        const acceptedThesis = await daoTeacher.getThesisAccepted();
        if (acceptedThesis.length > 0 && acceptedThesis.includes(proposal.id)) {
            return res.status(400).json({ error: "already accepted thesis" })
        }
        const result = await daoTeacher.updateThesisProposal(proposal.id, proposal);
        if (result.error)
            return res.status(404).json(result);
        else
            return res.status(201).json(result);
    } catch (err) {
        return res.status(503).json({ error: `Database error during the update of thesis ${req.params.thesisid}: ${err}` });
    }
}
const deleteProposal = async (req, res) => {
    const teacherId = req.user.id;
    const proposalId = req.params.proposalid;

    if (!teacherId) {
        return res.status(503).json({ error: "problem with the authentication" });
    }

    if (isNaN(proposalId) || !Number.isInteger(parseInt(proposalId))) {
        return res.status(422).json({ error: "not valid proposalId" });
    }

    try {
        // check user is authorized
        const thesis_proposal = await daoGeneral.getThesisProposalById(proposalId);

        if (thesis_proposal.error) {
            return res.status(404).json(thesis_proposal);
        } else {
            let id = thesis_proposal.supervisor.split(',');
            if (id[0] !== teacherId) {
                return res.status(401).json("Unauthorized");
            }
            // delete all PENDING applications
            await daoGeneral.cancellPendingApplicationsForAThesis(proposalId, teacherId);
            // delete proposal
            const changes = await daoTeacher.deleteProposal(proposalId);

            return res.status(200).json(changes);
        }
    } catch (e) {
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
    deleteProposal,
    archiveProposal,
    updateThesisProposal
}
