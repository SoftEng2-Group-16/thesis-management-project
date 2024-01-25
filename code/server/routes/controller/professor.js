const daoStudent = require('../../daoStudent');
const daoTeacher = require('../../daoTeacher');
const daoGeneral = require('../../daoGeneral');
const models = require('../../model');
const emailSender = require('../controller/general.js');
const { CustomValidation } = require('express-validator/src/context-items');

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

    for (const c of cosupervisors) {
        const splitted = c.split(" ");
        if (splitted.length === 4) { //internal cosupervisor, find group and save it for proposal insertion
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

            // here, need to fetch all emails of pending application for this thesis to send notifications "rejected" or "canceled"
            // can make use of the first dao mdethod to get the emails
            // also need other data{ studentName, thesisTitle, decision = canceled } 


            const application = await daoTeacher.acceptApplication(thesisId, teacherId, studentId);
            const { changes, canceledEmails, canceledStudentNames, canceledThesisName } = await daoGeneral.cancellPendingApplicationsForAThesis(thesisId, teacherId);
            console.log(canceledEmails, canceledStudentNames,canceledThesisName)
            await daoGeneral.cancellPendingApplicationsOfAStudent(studentId);
            console.log("cancel for single student done")
            for (let i = 0; i < canceledEmails.length; i++) {
                
                const emailData = {
                    subject: `Application Canceled`,
                    type: 'application-decision',
                    studentName: canceledStudentNames[i],
                    thesisTitle: canceledThesisName,
                    decision: 'canceled',
                }
                 await emailSender.sendEmailInternal(emailData );
                
            }
           


            //archive the thesis proposal so other students cannot apply to it
            const proposal = await daoGeneral.getThesisProposalById(thesisId)
                .then(p => {
                    return new models.ThesisProposal(
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
                });
            await daoTeacher.archiveProposal(proposal)
            await daoTeacher.deleteProposal(proposal.id);
            return res.status(200).json(application);
        } catch (e) {
            console.log(e)
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

const getOwnArchivedProposals = async (req, res) => {
    const teacherId = req.user.id;
    try {
        const archivedProposals = await daoTeacher.getOwnArchivedProposals(teacherId);
        if (archivedProposals.error) {
            return res.status(404).json(archivedProposals);
        } else {
            return res.status(200).json(archivedProposals);
        }
    } catch (e) {
        return res.status(500).json(e.message);
    }
}

const checkErrorsforArchiveProposal = async (proposal, applications, userId) => {
    if(proposal.error) {
        return { errorStatus: 404, errorMessage: proposal.error };
    }

    if(applications.error) {
        return { errorStatus: 404, errorMessage: applications.error };
    }

    if (applications.filter(a => a.status === "accepted").length !== 0) {
        return { errorStatus: 422, errorMessage: `Something went wrong: an application was accepted for proposal ${proposal.id}, should be already archived` };
    }

    if (!proposal.supervisor.match(userId)) {
        return { errorStatus: 401, errorMessage: `User ${userId} cannot archive proposal ${proposal.id}: NOT OWNED` }
    }
    
    //if no errors
    return { errorStatus: 0, errorMessage: "none" };
}

const archiveProposal = async (req,res)  => {
    const proposalId = req.body.proposalId;
    const userId = req.user.id;

    try {
        const proposal = await daoGeneral.getThesisProposalById(proposalId);
        const applications = await daoTeacher.getApplicationsByThesisId(proposal.id);
        const { errorStatus, errorMessage } = await checkErrorsforArchiveProposal(proposal, applications, userId);
        
        if( errorMessage != "none" && errorStatus !== 0) {
            return res.status(errorStatus).json({error: errorMessage})
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
                    for (const a of applications) {
                        console.log(a);
                        if (a.status === "pending") {
                            await daoTeacher.rejectApplication(a.thesisId, a.teacherId, a.studentId);
                        }
                    }
                })
                .then(async () => {
                    return await daoTeacher.deleteProposal(proposal.id);
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


const checkInitialErrorsForUpdateProposal = async (bodyId, paramId, teacherId) => {
    if(!teacherId) {
        return { errorStatus: 401, errorMessage: "problem with the authentication" };
    }
    if(paramId !== bodyId) {
        return { errorStatus: 422, errorMessage: "URL and body id mismatch" };
    }

    //no error
    return { errorStatus: 0, errorMessage: "none" };
}

const updateThesisProposal = async (req, res) => {
    const teacherId = req.user.id;
    const paramId = Number(req.params.thesisid);
    const bodyId = req.body.id;

    const { errorStatus, errorMessage } = await checkInitialErrorsForUpdateProposal(bodyId, paramId, teacherId);
    if( errorMessage != "none" && errorStatus !== 0) {
        return res.status(errorStatus).json({error: errorMessage})
    }

    //same logic of the insert
    const cosupervisors = req.body.cosupervisors;
    const supervisor = req.body.supervisor;
    let groups = [];

    for (const c of cosupervisors) {
        const splitted = c.split(" ");
        if (splitted.length == 4) { //internal cosupervisor, find group and save it for proposal insertion
            let surname = splitted[1];
            let id = splitted[2];
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
        //**check if there is an already accepted or pending application for this proposal */
        const allApplications = await daoTeacher.getAllApplicationsByThesisId();
        if (allApplications.length > 0 && allApplications.some(appl=>appl.status==="pending" || appl.status==="accepted")) {
            return res.status(405).json({ error: "already accepted/pending application for the thesis" })
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

const getCVFile = async (req, res) => {
    const cvId = req.params.id;
    try {
        const cvData = await daoTeacher.getCVFileByCVId(cvId);
        if (cvData.error) {
            return res.status(404).json(cvData);
        } else {
            const filename = cvData.file_name;
            const fileContent = cvData.file_content;

            res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-disposition': 'attachment;filename=' + filename,
                'Content-Length': fileContent.length
            });
            res.end(Buffer.from(fileContent, 'binary'));
            return res;
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
    getOwnArchivedProposals,
    deleteProposal,
    archiveProposal,
    updateThesisProposal,
    getCVFile
}
