const dao = require('../../dao');

const getThesisProposals = async (req,res) => {
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
}
 module.exports = {
    getThesisProposals
 };