const dao = require('../../dao');

const rearrangeProposals = async (req,res) => {
    const selectedTimestamp = req.body.selectedTimestamp;
    try {
        const expiredProposals = await dao.getExpiredProposals(selectedTimestamp);
        console.log(expiredProposals);
    } catch(e) {
        return res.status(500).json(e.message);
    }
}

module.exports = {
    rearrangeProposals
}