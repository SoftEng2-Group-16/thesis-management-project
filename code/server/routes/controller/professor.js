const dao = require('../../dao');

const getPossibleCosupervisors = async (req, res) => {
    try {
        const internals = await dao.getProfessors();
        if(internals.error) {
            return res.status(404).json(internals);
        }
        const externals = await dao.getExternals();
        if(externals.error) {
            return res.status(404).json(externals);
        } else {
            return res.status(200).json({
                internals: internals.map( i => `${i.name} ${i.surname}, ${i.id}, ${i.department_code}` ),
                externals: externals.map( e => `${e.name} ${e.surname}, ${(e.company).toUpperCase()}`)
            });
        }
    } catch(err) {
        return res.status(500).json(err.message); 
    }
}

const getDegreesInfo = async (req,res) => {
    try {
        const degrees = await dao.getDegrees();
        if(degrees.error) {
            return res.status(404).json(degrees);
        } else {
            return res.status(200).json(degrees);
        }
    } catch(err) {
        return res.status(500).json(err.message);
    }
}

const insertNewProposal = async (req, res) => {
    const title =  req.body.title;
    const supervisor = req.body.supervisor;
    const cosupervisors = req.body.cosupervisors;
    const keywords = req.body.keywords;
    const type = req.body.type;
    const description = req.body.description;
    const requirements = req.body.requirements;
    const notes = req.body.notes;
    const expiration = req.body.expiration;
    const level = req.body.level;
    const cds = req.body.cds;


}




module.exports = {
    getPossibleCosupervisors,
    insertNewProposal,
    getDegreesInfo
}