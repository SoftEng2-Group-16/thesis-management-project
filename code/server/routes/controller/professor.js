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
        return res.status(500).json(e.message); 
    }


}




module.exports = {
    getPossibleCosupervisors
}