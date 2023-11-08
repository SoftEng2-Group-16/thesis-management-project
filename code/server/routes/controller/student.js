const dao = require('../../dao');
const dayjs = require('dayjs');

const insertNewApplication = async (req, res) => {
    const studentId = req.body.studentId;
    const proposalId = req.body.proposalId;
    const timestamp = dayjs().format("DD/MM/YYYY HH:mm:ss");
    const status = 'pending';

    try {
        const changes = await dao.addApplicationForThesis(proposalId, studentId, timestamp, status);
        return res.status(200).json(changes);
    } catch(e) {
        if(e.message.includes("SQLITE_CONSTRAINT")) {
            e.message = 'Application already submitted, wait for professor response'
;        }
        return res.status(500).json(e.message);
    }
}

module.exports = {
    insertNewApplication
};