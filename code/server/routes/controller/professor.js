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


const decideApplication = async (req, res) => {
    
    const id = req.params.id;
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
    if (isNaN(id) || !Number.isInteger(parseInt(id))) {
        return res.status(422).json({ error: "ID non valido" });
    }

    if (decision === "accepted") {
        try {
            
            const application = await dao.acceptApplication(id,teacherId,studentId); 
            return res.status(200).json(application);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }
    else if (decision === "rejected") {
        try {
            const application = await dao.rejectApplication(id,teacherId,studentId);
            return res.status(200).json(application);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }
    else {
        return res.status(400).json({ error: "Invalid decision field" });
    }

}



module.exports = {
    getPossibleCosupervisors,
    insertNewProposal,
    getDegreesInfo,
    decideApplication
}